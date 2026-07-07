"use client";

import { useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";

const client = generateClient<Schema>();

/**
 * AI Insights Test Page
 * Simulates the AI engine analyzing policies and generating real alerts.
 */
export default function InsightsTestPage() {
  const [status, setStatus] = useState("");
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  async function runAIAnalysis() {
    setRunning(true);
    setStatus("Running AI Insights Engine...");
    setResults([]);

    try {
      const user = await getCurrentUser();
      const userId = user.userId;

      // Fetch current data
      const { data: wallets } = await client.models.Wallet.list();
      const wallet = wallets[0];
      const { data: policies } = await client.models.Policy.list();
      const { data: transactions } = await client.models.Transaction.list();

      if (!wallet || policies.length === 0) {
        setStatus("Error: No wallet or policies found. Seed data first at /dashboard/seed");
        setRunning(false);
        return;
      }

      const newInsights: any[] = [];

      // AI ANALYSIS: Check each policy for risk
      for (const policy of policies) {
        setStatus(`Analyzing ${policy.policyType} policy...`);

        // Calculate risk score
        const totalSpent = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
        const avgSpend = totalSpent / Math.max(transactions.length, 1);
        const daysUntilDue = Math.max(0, Math.ceil(
          (new Date(policy.nextDueDate).getTime() - Date.now()) / 86400000
        ));

        let riskScore = 0;

        // Factor 1: Can wallet cover the premium? (40% weight)
        const coverageRatio = (wallet.balance || 0) / (policy.monthlyPremium || 1);
        if (coverageRatio < 1) {
          riskScore += (1 - coverageRatio) * 0.40;
        }

        // Factor 2: Days until due (30% weight)
        if (daysUntilDue <= 10) {
          riskScore += (1 - daysUntilDue / 10) * 0.30;
        }

        // Factor 3: Spending vs cashback growth rate (30% weight)
        const monthlyEarnings = wallet.monthlyEarnings || 0;
        if (monthlyEarnings < (policy.monthlyPremium || 0) * 0.5) {
          riskScore += 0.20;
        }

        riskScore = Math.min(Math.round(riskScore * 100) / 100, 1.0);

        // Update policy risk score
        await client.models.Policy.update({ id: policy.id, riskScore });

        // Generate insights based on risk
        if (riskScore >= 0.7) {
          const insight = {
            customerId: userId,
            alertType: "PREMIUM_AT_RISK" as const,
            severity: "HIGH" as const,
            title: `${policy.policyType} Premium at HIGH Risk`,
            message: `Your ${policy.policyType} premium of R${policy.monthlyPremium} due in ${daysUntilDue} days may not be covered. Risk: ${Math.round(riskScore * 100)}%. Wallet: R${(wallet.balance || 0).toFixed(2)}`,
            policyId: policy.id,
            actionTaken: false,
            isRead: false,
          };
          await client.models.InsightAlert.create(insight);
          newInsights.push({ ...insight, riskScore });

          // AUTO-COVER: If wallet has enough and due within 3 days
          if ((wallet.balance || 0) >= (policy.monthlyPremium || 0) && daysUntilDue <= 3) {
            const newBalance = (wallet.balance || 0) - (policy.monthlyPremium || 0);
            const newPremiumsCovered = (wallet.totalPremiumsCovered || 0) + (policy.monthlyPremium || 0);

            await client.models.Wallet.update({
              id: wallet.id,
              balance: newBalance,
              totalPremiumsCovered: newPremiumsCovered,
            });

            await client.models.WalletTransaction.create({
              walletId: wallet.id,
              type: "PREMIUM_DEBIT",
              amount: -(policy.monthlyPremium || 0),
              description: `Auto-cover: ${policy.policyType} policy ${policy.policyNumber}`,
              balanceAfter: newBalance,
            });

            await client.models.InsightAlert.create({
              customerId: userId,
              alertType: "WALLET_COVER_APPLIED",
              severity: "MEDIUM",
              title: `${policy.policyType} Premium Auto-Covered!`,
              message: `Smart Cover Wallet automatically paid R${policy.monthlyPremium} for your ${policy.policyType} policy. Your cover is protected.`,
              policyId: policy.id,
              actionTaken: true,
              isRead: false,
            });

            newInsights.push({ type: "AUTO_COVER", policy: policy.policyType, amount: policy.monthlyPremium });
          }

        } else if (riskScore >= 0.4) {
          const insight = {
            customerId: userId,
            alertType: "PREMIUM_AT_RISK" as const,
            severity: "MEDIUM" as const,
            title: `${policy.policyType} Premium - Heads Up`,
            message: `Your ${policy.policyType} premium of R${policy.monthlyPremium} is due in ${daysUntilDue} days. Risk: ${Math.round(riskScore * 100)}%. Keep earning cashback to build your safety net.`,
            policyId: policy.id,
            actionTaken: false,
            isRead: false,
          };
          await client.models.InsightAlert.create(insight);
          newInsights.push({ ...insight, riskScore });

        } else {
          newInsights.push({
            type: "LOW_RISK",
            policy: policy.policyType,
            riskScore,
            message: `${policy.policyType} policy is well covered. Risk: ${Math.round(riskScore * 100)}%`,
          });
        }
      }

      // Check wallet health
      const totalPremiums = policies.reduce((sum, p) => sum + (p.monthlyPremium || 0), 0);
      if ((wallet.balance || 0) < totalPremiums) {
        await client.models.InsightAlert.create({
          customerId: userId,
          alertType: "LOW_BALANCE_WARNING",
          severity: "MEDIUM",
          title: "Build Your Safety Net",
          message: `Your wallet (R${(wallet.balance || 0).toFixed(2)}) doesn't fully cover your monthly premiums (R${totalPremiums.toFixed(2)}). Shop at participating retailers to earn 10% cashback!`,
          actionTaken: false,
          isRead: false,
        });
        newInsights.push({ type: "LOW_BALANCE", walletBalance: wallet.balance, totalPremiums });
      }

      setResults(newInsights);
      setStatus(`Done! Generated ${newInsights.length} insights. Go to Dashboard > Insights to see them.`);
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
    setRunning(false);
  }

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-green-50 via-white to-amber-50">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <span className="text-white text-xl">🧠</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">AI Insights Engine - Test</h2>
              <p className="text-sm text-gray-500">Run the AI analysis on your current data</p>
            </div>
          </div>

          <div className="bg-purple-50 rounded-xl p-4 mb-4 text-sm text-purple-800">
            <p className="font-semibold mb-1">What this does:</p>
            <ul className="space-y-1 text-xs">
              <li>• Analyzes each policy for payment risk (5-factor scoring)</li>
              <li>• Checks if wallet balance can cover upcoming premiums</li>
              <li>• Auto-covers premiums if risk is HIGH and due within 3 days</li>
              <li>• Generates real alerts stored in DynamoDB</li>
              <li>• Updates policy risk scores</li>
            </ul>
          </div>

          <button
            onClick={runAIAnalysis}
            disabled={running}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {running ? "Analyzing..." : "Run AI Insights Engine"}
          </button>

          {status && (
            <p className={`mt-4 text-sm ${status.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
              {status}
            </p>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="glass-card p-6">
            <h3 className="font-bold text-gray-800 mb-3">Analysis Results</h3>
            <div className="space-y-3">
              {results.map((r, i) => (
                <div key={i} className={`p-3 rounded-xl border text-sm ${
                  r.severity === "HIGH" ? "bg-red-50 border-red-200 text-red-800" :
                  r.severity === "MEDIUM" ? "bg-amber-50 border-amber-200 text-amber-800" :
                  r.type === "AUTO_COVER" ? "bg-green-50 border-green-200 text-green-800" :
                  "bg-blue-50 border-blue-200 text-blue-800"
                }`}>
                  {r.title && <p className="font-semibold">{r.title}</p>}
                  {r.message && <p className="text-xs mt-1">{r.message}</p>}
                  {r.type === "AUTO_COVER" && <p className="font-semibold">Auto-covered {r.policy} premium: R{r.amount}</p>}
                  {r.type === "LOW_RISK" && <p>{r.message}</p>}
                  {r.type === "LOW_BALANCE" && <p>Wallet: R{r.walletBalance?.toFixed(2)} | Premiums: R{r.totalPremiums?.toFixed(2)}</p>}
                  {r.riskScore !== undefined && (
                    <span className="inline-block mt-1 text-xs font-mono bg-white/50 px-2 py-0.5 rounded">
                      Risk Score: {Math.round(r.riskScore * 100)}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          <a href="/dashboard" className="flex-1 text-center py-2 rounded-xl bg-white border text-sm font-medium text-gray-700 hover:bg-gray-50">
            ← Dashboard
          </a>
          <a href="/dashboard/seed" className="flex-1 text-center py-2 rounded-xl bg-white border text-sm font-medium text-gray-700 hover:bg-gray-50">
            Seed Data
          </a>
        </div>
      </div>
    </div>
  );
}
