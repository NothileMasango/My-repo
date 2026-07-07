"use client";

import React from "react";
import PolicyCard from "./PolicyCard";
import { mockPolicies, mockWallet } from "@/lib/mock-data";

export default function PoliciesView() {
  const totalMonthlyPremiums = mockPolicies.reduce(
    (sum, p) => sum + p.monthlyPremium,
    0
  );
  const walletCoverageMonths = mockWallet.balance / totalMonthlyPremiums;

  return (
    <div className="space-y-6">
      {/* Coverage Summary */}
      <div className="glass-card p-5 bg-gradient-to-br from-blue-50 to-indigo-50">
        <h3 className="text-lg font-bold text-gray-800 mb-3">
          Insurance Coverage Summary
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">Active Policies</p>
            <p className="text-2xl font-bold text-blue-700">
              {mockPolicies.filter((p) => p.status === "ACTIVE").length}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total Monthly Premiums</p>
            <p className="text-2xl font-bold text-gray-800">
              R{totalMonthlyPremiums.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Wallet Coverage</p>
            <p className="text-2xl font-bold text-green-600">
              {walletCoverageMonths.toFixed(1)} months
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">AI Protection</p>
            <p className="text-2xl font-bold text-amber-600">Active</p>
          </div>
        </div>
      </div>

      {/* Protection Status */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">Smart Cover Protection Active</h4>
            <p className="text-xs text-gray-500">
              Your Smart Cover Wallet is monitoring your policies and will step in if needed
            </p>
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-3 border border-green-100">
          <p className="text-sm text-green-800">
            <span className="font-semibold">Auto-cover enabled:</span> If your wallet has
            sufficient funds and a premium payment is at risk, we&apos;ll automatically cover it
            to keep your policy active.
          </p>
        </div>
      </div>

      {/* Policy Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-800">Your Policies</h3>
        {mockPolicies.map((policy) => (
          <PolicyCard
            key={policy.id}
            policyNumber={policy.policyNumber}
            policyType={policy.policyType}
            monthlyPremium={policy.monthlyPremium}
            status={policy.status}
            nextDueDate={policy.nextDueDate}
            coverAmount={policy.coverAmount}
            riskScore={policy.riskScore}
          />
        ))}
      </div>

      {/* Eligibility note */}
      <div className="glass-card p-4 bg-amber-50 border-amber-200">
        <p className="text-xs text-amber-800">
          <span className="font-semibold">Eligibility:</span> Smart Cover Wallet is exclusively
          available to customers with both an OM Bank account and at least one active Old
          Mutual policy. You qualify!
        </p>
      </div>
    </div>
  );
}
