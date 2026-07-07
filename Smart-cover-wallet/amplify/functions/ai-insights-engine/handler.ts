/**
 * AI Insights Engine Lambda
 * Analyzes payment patterns, calculates risk scores, triggers auto-cover.
 */

interface PolicyData {
  policyId: string;
  policyType: string;
  monthlyPremium: number;
  nextDueDate: string;
  consecutiveMissed: number;
}

interface AnalysisEvent {
  customerId: string;
  walletBalance: number;
  monthlyIncome: number;
  averageMonthlySpend: number;
  latePaymentCount: number;
  totalPayments: number;
  policies: PolicyData[];
}

interface InsightOutput {
  customerId: string;
  insights: Array<{
    type: string;
    severity: string;
    title: string;
    message: string;
    policyId?: string;
  }>;
  actions: Array<{
    type: string;
    policyId: string;
    amount: number;
    description: string;
  }>;
  overallRiskScore: number;
}

const RISK_HIGH = parseFloat(process.env.RISK_THRESHOLD_HIGH || "0.75");
const RISK_MEDIUM = parseFloat(process.env.RISK_THRESHOLD_MEDIUM || "0.50");
const AUTO_COVER = process.env.AUTO_COVER_ENABLED === "true";
const DAYS_CHECK = parseInt(process.env.DAYS_BEFORE_DUE_CHECK || "5");

function calculateRisk(event: AnalysisEvent, policy: PolicyData): number {
  let score = 0;
  
  // Spending ratio (25%)
  const spendRatio = event.averageMonthlySpend / Math.max(event.monthlyIncome, 1);
  score += Math.min(spendRatio, 1.0) * 0.25;

  // Late payment history (30%)
  const lateRatio = event.latePaymentCount / Math.max(event.totalPayments, 1);
  score += lateRatio * 0.30;

  // Days until due (20%)
  const daysUntilDue = Math.max(0, Math.ceil(
    (new Date(policy.nextDueDate).getTime() - Date.now()) / 86400000
  ));
  if (daysUntilDue <= DAYS_CHECK) {
    score += (1 - daysUntilDue / DAYS_CHECK) * 0.20;
  }

  // Balance coverage (15%)
  if (event.walletBalance < policy.monthlyPremium) {
    score += (1 - event.walletBalance / policy.monthlyPremium) * 0.15;
  }

  // Consecutive missed (10%)
  score += Math.min(policy.consecutiveMissed / 3, 1.0) * 0.10;

  return Math.min(Math.round(score * 100) / 100, 1.0);
}

export const handler = async (event: AnalysisEvent): Promise<InsightOutput> => {
  console.log("AI analysis for:", event.customerId);

  const insights: InsightOutput["insights"] = [];
  const actions: InsightOutput["actions"] = [];
  let maxRisk = 0;

  for (const policy of event.policies) {
    const risk = calculateRisk(event, policy);
    maxRisk = Math.max(maxRisk, risk);

    if (risk >= RISK_HIGH) {
      insights.push({
        type: "PREMIUM_AT_RISK",
        severity: "HIGH",
        title: "Premium Payment at Risk",
        message: `Your ${policy.policyType} premium of R${policy.monthlyPremium} may not be covered. Risk: ${Math.round(risk * 100)}%`,
        policyId: policy.policyId,
      });

      // Auto-cover logic
      if (AUTO_COVER && event.walletBalance >= policy.monthlyPremium) {
        const daysUntilDue = Math.ceil(
          (new Date(policy.nextDueDate).getTime() - Date.now()) / 86400000
        );
        if (daysUntilDue <= 2 && daysUntilDue >= 0) {
          actions.push({
            type: "AUTO_COVER_PREMIUM",
            policyId: policy.policyId,
            amount: policy.monthlyPremium,
            description: `Auto-covered ${policy.policyType} premium of R${policy.monthlyPremium}`,
          });
        }
      }
    } else if (risk >= RISK_MEDIUM) {
      insights.push({
        type: "PREMIUM_AT_RISK",
        severity: "MEDIUM",
        title: "Premium Payment - Heads Up",
        message: `Your ${policy.policyType} premium of R${policy.monthlyPremium} is due soon. Wallet: R${event.walletBalance}`,
        policyId: policy.policyId,
      });
    }
  }

  return { customerId: event.customerId, insights, actions, overallRiskScore: maxRisk };
};
