"use client";

import { useState } from "react";
import { getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";

const client = generateClient<Schema>();

const SEED_WALLET = {
  balance: 856.42, totalCashbackEarned: 2412.87, totalPremiumsCovered: 1256.45,
  monthlyEarnings: 98.50, monthlyCap: 150, lastResetDate: "2026-07-01",
};

const SEED_POLICIES = [
  { policyNumber: "OM-LIFE-2024-5678", policyType: "LIFE" as const, monthlyPremium: 450.0, premiumDueDate: 25, status: "ACTIVE" as const, nextDueDate: "2026-07-25", coverAmount: 500000.0, riskScore: 0.23 },
  { policyNumber: "OM-FUN-2024-9012", policyType: "FUNERAL" as const, monthlyPremium: 125.0, premiumDueDate: 28, status: "ACTIVE" as const, nextDueDate: "2026-07-28", coverAmount: 50000.0, riskScore: 0.12 },
  { policyNumber: "OM-SAV-2024-3456", policyType: "SAVINGS" as const, monthlyPremium: 300.0, premiumDueDate: 1, status: "ACTIVE" as const, nextDueDate: "2026-08-01", coverAmount: 150000.0, riskScore: 0.05 },
  { policyNumber: "OM-DIS-2024-7890", policyType: "DISABILITY" as const, monthlyPremium: 200.0, premiumDueDate: 15, status: "ACTIVE" as const, nextDueDate: "2026-08-15", coverAmount: 250000.0, riskScore: 0.18 },
];

const SEED_TRANSACTIONS = [
  { merchantName: "Pick n Pay - Sandton", merchantCategory: "Grocery", amount: 1245.67, cashbackAmount: 124.57, cashbackApplied: true, transactionDate: "2026-07-06", isParticipatingRetailer: true },
  { merchantName: "Checkers - Rosebank", merchantCategory: "Grocery", amount: 876.23, cashbackAmount: 25.93, cashbackApplied: true, transactionDate: "2026-07-04", isParticipatingRetailer: true },
  { merchantName: "Woolworths Food", merchantCategory: "Grocery", amount: 432.10, cashbackAmount: 43.21, cashbackApplied: true, transactionDate: "2026-07-02", isParticipatingRetailer: true },
  { merchantName: "Engen Garage", merchantCategory: "Fuel", amount: 950.00, cashbackAmount: 0, cashbackApplied: false, transactionDate: "2026-07-03", isParticipatingRetailer: false },
  { merchantName: "Shoprite - Soweto", merchantCategory: "Grocery", amount: 654.89, cashbackAmount: 65.49, cashbackApplied: true, transactionDate: "2026-06-30", isParticipatingRetailer: true },
];

const SEED_INSIGHTS = [
  { alertType: "WALLET_COVER_APPLIED" as const, severity: "MEDIUM" as const, title: "Premium Auto-Covered", message: "Smart Cover Wallet covered your Funeral premium of R125.00.", actionTaken: true, isRead: true },
  { alertType: "CASHBACK_MILESTONE" as const, severity: "LOW" as const, title: "R400 Cashback Milestone!", message: "Your lifetime cashback exceeded R400!", actionTaken: false, isRead: false },
  { alertType: "PREMIUM_AT_RISK" as const, severity: "LOW" as const, title: "Life Premium Coming Up", message: "Life premium R450.00 due 25 Aug. Wallet: R156.42.", actionTaken: false, isRead: false },
];

export default function SeedPage() {
  const [status, setStatus] = useState("");
  const [seeding, setSeeding] = useState(false);

  async function seedData() {
    setSeeding(true);
    setStatus("Seeding...");
    try {
      const user = await getCurrentUser();
      const userId = user.userId;

      setStatus("Creating wallet...");
      await client.models.Wallet.create({ customerId: userId, ...SEED_WALLET });

      setStatus("Creating policies...");
      for (const p of SEED_POLICIES) {
        await client.models.Policy.create({ customerId: userId, ...p });
      }

      setStatus("Creating transactions...");
      for (const t of SEED_TRANSACTIONS) {
        await client.models.Transaction.create({ customerId: userId, ...t });
      }

      setStatus("Creating insights...");
      for (const i of SEED_INSIGHTS) {
        await client.models.InsightAlert.create({ customerId: userId, ...i });
      }

      setStatus("Done! All demo data created. Go to Dashboard to see it.");
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
    setSeeding(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl gradient-green flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">SC</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Seed Demo Data</h2>
        <p className="text-sm text-gray-500 mb-6">
          Click below to populate your account with sample wallet, policies, transactions, and AI insights.
        </p>

        <button
          onClick={seedData}
          disabled={seeding}
          className="w-full py-3 rounded-xl gradient-green text-white font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 mb-4"
        >
          {seeding ? "Seeding..." : "Seed Demo Data"}
        </button>

        {status && (
          <p className={`text-sm ${status.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
            {status}
          </p>
        )}

        <a href="/dashboard" className="block mt-4 text-sm text-blue-600 underline">
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
