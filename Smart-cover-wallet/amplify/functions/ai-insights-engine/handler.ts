/**
 * AI Insights Engine Lambda
 * 
 * Monitors payment patterns and identifies customers at risk of missing
 * insurance premiums. When sufficient funds are available in the Smart Cover Wallet,
 * it can automatically cover missed premiums.
 * 
 * Key Features:
 * - Pattern analysis on spending behavior
 * - Risk scoring for premium payment likelihood
 * - Automatic premium coverage from wallet funds
 * - Proactive alerts and recommendations
 */

interface CustomerData {
  customerId: string;
  walletBalance: number;
  monthlyIncome: number;
  averageMonthlySpend: number;
  recentTransactions: TransactionSummary[];
  policies: PolicySummary[];
  paymentHistory: PaymentHistoryEntry[];
}

interface TransactionSummary {
  date: string;
  amount: number;
  category: string;
}

interface PolicySummary {
  policyId: string;
  policyType: string;
  monthlyPremium: number;
  nextDueDate: string;
  premiumDueDay: number;
  status: string;
  consecutiveMissed: number;
}

interface PaymentHistoryEntry {
  date: string;
  amount: number;
  type: "SALARY" | "DEBIT_ORDER" | "PAYMENT";
  wasLate: boolean;
}

interface InsightResult {
  customerId: string;
  insights: Insight[];
  actionsTriggered: AutoAction[];
  overallRiskScore: number;
}

interface Insight {
  type: "PREMIUM_AT_RISK" | "LOW_BALANCE_WARNING" | "CASHBACK_MILESTONE" | "WALLET_COVER_APPLIED" | "SPENDING_PATTERN_CHANGE";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  title: string;
  message: string;
  policyId?: string;
  recommendedAction?: string;
}

interface AutoAction {
  type: "AUTO_COVER_PREMIUM" | "ALERT_SENT" | "RISK_ESCALATION";
  policyId?: string;
  amount?: number;
  description: string;
  timestamp: string;
}

const RISK_THRESHOLD_HIGH = parseFloat(process.env.RISK_THRESHOLD_HIGH || "0.75");
const RISK_THRESHOLD_MEDIUM = parseFloat(process.env.RISK_THRESHOLD_MEDIUM || "0.50");
const AUTO_COVER_ENABLED = process.env.AUTO_COVER_ENABLED === "true";
const DAYS_BEFORE_DUE_CHECK = parseInt(process.env.DAYS_BEFORE_DUE_CHECK || "5");

/**
 * Calculate risk score based on multiple signals
 */
function calculateRiskScore(customer: CustomerData, policy: PolicySummary): number {
  let riskScore = 0;
  const weights = {
    spendingRatio: 0.25,
    paymentHistory: 0.30,
    daysUntilDue: 0.20,
    balanceCoverage: 0.15,
    consecutiveMissed: 0.10,
  };

  // Factor 1: Spending ratio (higher spending vs income = higher risk)
  const spendingRatio = customer.averageMonthlySpend / customer.monthlyIncome;
  riskScore += Math.min(spendingRatio, 1.0) * weights.spendingRatio;

  // Factor 2: Payment history (late payments indicate risk)
  const latePayments = customer.paymentHistory.filter((p) => p.wasLate).length;
  const lateRatio = latePayments / Math.max(customer.paymentHistory.length, 1);
  riskScore += lateRatio * weights.paymentHistory;

  // Factor 3: Days until due date (closer = higher urgency)
  const today = new Date();
  const dueDate = new Date(policy.nextDueDate);
  const daysUntilDue = Math.max(0, Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  if (daysUntilDue <= DAYS_BEFORE_DUE_CHECK) {
    riskScore += (1 - daysUntilDue / DAYS_BEFORE_DUE_CHECK) * weights.daysUntilDue;
  }

  // Factor 4: Can current balance cover the premium?
  const balanceCoverage = customer.walletBalance / policy.monthlyPremium;
  if (balanceCoverage < 1) {
    riskScore += (1 - balanceCoverage) * weights.balanceCoverage;
  }

  // Factor 5: Consecutive missed payments
  const missedFactor = Math.min(policy.consecutiveMissed / 3, 1.0);
  riskScore += missedFactor * weights.consecutiveMissed;

  return Math.min(Math.round(riskScore * 100) / 100, 1.0);
}

/**
 * Detect spending pattern changes
 */
function detectSpendingChanges(transactions: TransactionSummary[]): {
  hasChange: boolean;
  direction: "INCREASE" | "DECREASE" | "STABLE";
  percentage: number;
} {
  if (transactions.length < 10) {
    return { hasChange: false, direction: "STABLE", percentage: 0 };
  }

  const midpoint = Math.floor(transactions.length / 2);
  const recentAvg =
    transactions.slice(0, midpoint).reduce((sum, t) => sum + t.amount, 0) / midpoint;
  const olderAvg =
    transactions.slice(midpoint).reduce((sum, t) => sum + t.amount, 0) / (transactions.length - midpoint);

  const changePercent = ((recentAvg - olderAvg) / olderAvg) * 100;
  const hasSignificantChange = Math.abs(changePercent) > 20;

  return {
    hasChange: hasSignificantChange,
    direction: changePercent > 0 ? "INCREASE" : changePercent < 0 ? "DECREASE" : "STABLE",
    percentage: Math.round(changePercent),
  };
}

export const handler = async (event: CustomerData): Promise<InsightResult> => {
  console.log("AI Insights Engine processing for customer:", event.customerId);

  const insights: Insight[] = [];
  const actionsTriggered: AutoAction[] = [];
  let maxRiskScore = 0;

  // Analyze each policy for risk
  for (const policy of event.policies) {
    const riskScore = calculateRiskScore(event, policy);
    maxRiskScore = Math.max(maxRiskScore, riskScore);

    console.log(`Policy ${policy.policyId} risk score: ${riskScore}`);

    // High risk - premium at risk
    if (riskScore >= RISK_THRESHOLD_HIGH) {
      insights.push({
        type: "PREMIUM_AT_RISK",
        severity: "HIGH",
        title: "Premium Payment at Risk",
        message: `Your ${policy.policyType} policy premium of R${policy.monthlyPremium} due on ${policy.nextDueDate} may not be covered. Your risk score is ${Math.round(riskScore * 100)}%.`,
        policyId: policy.policyId,
        recommendedAction: "Consider using your Smart Cover Wallet balance to cover this premium.",
      });

      // Auto-cover if enabled and sufficient funds
      if (AUTO_COVER_ENABLED && event.walletBalance >= policy.monthlyPremium) {
        const today = new Date();
        const dueDate = new Date(policy.nextDueDate);
        const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysUntilDue <= 2 && daysUntilDue >= 0) {
          actionsTriggered.push({
            type: "AUTO_COVER_PREMIUM",
            policyId: policy.policyId,
            amount: policy.monthlyPremium,
            description: `Auto-covered ${policy.policyType} premium of R${policy.monthlyPremium} from Smart Cover Wallet to prevent policy lapse.`,
            timestamp: new Date().toISOString(),
          });

          insights.push({
            type: "WALLET_COVER_APPLIED",
            severity: "MEDIUM",
            title: "Premium Auto-Covered",
            message: `Your Smart Cover Wallet automatically covered your ${policy.policyType} premium of R${policy.monthlyPremium}. Your policy remains active and your cover is protected.`,
            policyId: policy.policyId,
          });
        }
      }
    }
    // Medium risk - early warning
    else if (riskScore >= RISK_THRESHOLD_MEDIUM) {
      insights.push({
        type: "PREMIUM_AT_RISK",
        severity: "MEDIUM",
        title: "Premium Payment - Heads Up",
        message: `We've noticed some changes in your spending pattern. Your ${policy.policyType} premium of R${policy.monthlyPremium} is due on ${policy.nextDueDate}. Your Smart Cover Wallet has R${event.walletBalance} available as a safety net.`,
        policyId: policy.policyId,
        recommendedAction: "Keep shopping at participating retailers to build your wallet balance.",
      });
    }
  }

  // Check wallet balance vs upcoming premiums
  const totalUpcomingPremiums = event.policies.reduce((sum, p) => sum + p.monthlyPremium, 0);
  if (event.walletBalance < totalUpcomingPremiums * 0.5) {
    insights.push({
      type: "LOW_BALANCE_WARNING",
      severity: "LOW",
      title: "Build Your Safety Net",
      message: `Your Premium Wallet balance (R${event.walletBalance}) covers less than half of your monthly premiums (R${totalUpcomingPremiums}). Keep earning cashback at participating retailers!`,
      recommendedAction: "Shop at Pick n Pay, Checkers, or Shoprite to earn 1% cashback.",
    });
  }

  // Detect spending pattern changes
  const spendingChange = detectSpendingChanges(event.recentTransactions);
  if (spendingChange.hasChange) {
    insights.push({
      type: "SPENDING_PATTERN_CHANGE",
      severity: spendingChange.direction === "INCREASE" ? "MEDIUM" : "LOW",
      title: "Spending Pattern Change Detected",
      message: `Your recent spending has ${spendingChange.direction === "INCREASE" ? "increased" : "decreased"} by ${Math.abs(spendingChange.percentage)}%. ${spendingChange.direction === "INCREASE" ? "This may affect your ability to cover upcoming premiums." : "Great job managing your finances!"}`,
    });
  }

  // Cashback milestone celebrations
  if (event.walletBalance >= 100) {
    insights.push({
      type: "CASHBACK_MILESTONE",
      severity: "LOW",
      title: "Milestone Reached!",
      message: `Congratulations! Your Premium Wallet has reached R${event.walletBalance}. That's enough to cover ${Math.floor(event.walletBalance / (totalUpcomingPremiums || 1))} month(s) of premiums.`,
    });
  }

  const result: InsightResult = {
    customerId: event.customerId,
    insights,
    actionsTriggered,
    overallRiskScore: maxRiskScore,
  };

  console.log("Insights generated:", JSON.stringify(result));
  return result;
};
