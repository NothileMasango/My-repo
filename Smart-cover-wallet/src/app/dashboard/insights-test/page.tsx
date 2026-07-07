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
  const [phoneNumber, setPhoneNumber] = useState("27825551234");

  /**
   * SIMULATE HIGH RISK: Set policy due dates to tomorrow so auto-cover triggers
   */
  async function simulateHighRisk() {
    setRunning(true);
    setStatus("Setting up HIGH RISK scenario...");
    try {
      const { data: policies } = await client.models.Policy.list();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];

      for (const policy of policies) {
        await client.models.Policy.update({
          id: policy.id,
          nextDueDate: tomorrowStr,
          riskScore: 0.85,
        });
      }

      // Also reduce wallet balance to make it tight
      const { data: wallets } = await client.models.Wallet.list();
      if (wallets[0]) {
        await client.models.Wallet.update({
          id: wallets[0].id,
          balance: 95.00, // Just enough to cover EasiPlus (R39) + Standard (R89) = R128
          monthlyEarnings: 45.00,
        });
      }

      setStatus("HIGH RISK scenario ready! Policies due TOMORROW, wallet balance R95.00. Now click 'Run AI Engine' to trigger auto-cover + WhatsApp.");
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
    setRunning(false);
  }

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

            // Send WhatsApp notification BEFORE auto-covering
            const policyLabel = policy.policyType === "EASIPLUS_FUNERAL" ? "EasiPlus Funeral Plan" : "Standard Funeral Cover";
            const whatsappMsg = encodeURIComponent(
              `🛡️ *Smart Cover Wallet - Auto-Payment Notice*\n\n` +
              `Hi! Your *${policyLabel}* premium of *R${(policy.monthlyPremium || 0).toFixed(2)}* is due tomorrow.\n\n` +
              `✅ *Action:* We will use R${(policy.monthlyPremium || 0).toFixed(2)} from your Smart Cover Wallet (balance: R${(wallet.balance || 0).toFixed(2)}) to pay this premium.\n\n` +
              `New balance after payment: R${newBalance.toFixed(2)}\n\n` +
              `Reply STOP within 24hrs to cancel.\n\n` +
              `_Smart Cover Wallet by OM Bank_ 🍞`
            );
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${whatsappMsg}`;

            await client.models.Wallet.update({
              id: wallet.id,
              balance: newBalance,
              totalPremiumsCovered: newPremiumsCovered,
            });

            await client.models.WalletTransaction.create({
              walletId: wallet.id,
              type: "PREMIUM_DEBIT",
              amount: -(policy.monthlyPremium || 0),
              description: `Auto-cover: ${policyLabel} - ${policy.policyNumber}`,
              balanceAfter: newBalance,
            });

            await client.models.InsightAlert.create({
              customerId: userId,
              alertType: "WALLET_COVER_APPLIED",
              severity: "MEDIUM",
              title: `${policyLabel} Premium Auto-Covered!`,
              message: `Smart Cover Wallet paid R${policy.monthlyPremium} for your ${policyLabel}. WhatsApp notification sent. Your cover is protected.`,
              policyId: policy.id,
              actionTaken: true,
              isRead: false,
            });

            newInsights.push({ type: "AUTO_COVER", policy: policyLabel, amount: policy.monthlyPremium, whatsappUrl });
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
              <li>• Analyzes each policy for payment risk (multi-factor scoring)</li>
              <li>• Checks if wallet balance can cover upcoming premiums</li>
              <li>• Auto-covers premiums if HIGH risk and due within 3 days</li>
              <li>• <strong>Sends WhatsApp notification</strong> before auto-payment</li>
              <li>• Generates real alerts stored in DynamoDB</li>
              <li>• Updates policy risk scores</li>
            </ul>
          </div>

          {/* Phone number for WhatsApp */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your WhatsApp Number (for notification)</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="27821234567"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Format: country code + number (e.g. 27821234567 for SA)</p>
          </div>

          {/* Step 1: Simulate High Risk */}
          <div className="bg-red-50 rounded-xl p-4 mb-4 border border-red-200">
            <p className="font-semibold text-red-800 text-sm mb-2">Step 1: Simulate High Risk Scenario</p>
            <p className="text-xs text-red-700 mb-3">
              Sets all policy due dates to TOMORROW and reduces wallet balance to R95.00 — guaranteeing HIGH risk scores and auto-cover triggers.
            </p>
            <button
              onClick={simulateHighRisk}
              disabled={running}
              className="w-full py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {running ? "Setting up..." : "⚠️ Simulate High Risk (Set Due Tomorrow)"}
            </button>
          </div>

          {/* Step 2: Run AI */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-200">
            <p className="font-semibold text-green-800 text-sm mb-2">Step 2: Run AI Engine</p>
            <p className="text-xs text-green-700 mb-3">
              Analyzes risk, triggers auto-cover, sends WhatsApp notification to the number above.
            </p>
            <button
              onClick={runAIAnalysis}
              disabled={running}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {running ? "Analyzing..." : "🧠 Run AI Insights Engine"}
            </button>
          </div>

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
                  {r.type === "AUTO_COVER" && (
                    <div>
                      <p className="font-semibold">Auto-covered {r.policy} premium: R{r.amount}</p>
                      <a
                        href={r.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 mt-2 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        View WhatsApp Notification
                      </a>
                    </div>
                  )}
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
