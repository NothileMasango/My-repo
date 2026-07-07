"use client";

import React from "react";
import WalletCard from "./WalletCard";
import TransactionList from "./TransactionList";
import CashbackChart from "./CashbackChart";
import InsightCard from "./InsightCard";
import RetailerGrid from "./RetailerGrid";
import {
  mockWallet,
  mockTransactions,
  mockCashbackHistory,
  mockInsights,
  participatingRetailers,
} from "@/lib/mock-data";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Hero - Value Proposition */}
      <div className="glass-card p-6 bg-gradient-to-r from-green-50 to-amber-50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-green flex items-center justify-center flex-shrink-0">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-lg">
              One product. Two safety nets.
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Every grocery shop helps put food on the table today and protects what matters most tomorrow.
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Card */}
      <WalletCard
        balance={mockWallet.balance}
        monthlyEarnings={mockWallet.monthlyEarnings}
        monthlyCap={20}
        totalCashbackEarned={mockWallet.totalCashbackEarned}
        totalPremiumsCovered={mockWallet.totalPremiumsCovered}
      />

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-green-600">R14.32</p>
          <p className="text-xs text-gray-500 mt-1">This Month</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-amber-600">R5.68</p>
          <p className="text-xs text-gray-500 mt-1">Until Cap</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">6</p>
          <p className="text-xs text-gray-500 mt-1">Transactions</p>
        </div>
      </div>

      {/* Latest AI Insight */}
      {mockInsights.filter((i) => !i.isRead).length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Latest Insight
          </h3>
          <InsightCard {...mockInsights.find((i) => !i.isRead)!} />
        </div>
      )}

      {/* Cashback Chart */}
      <CashbackChart data={mockCashbackHistory} monthlyCap={20} />

      {/* Recent Transactions */}
      <TransactionList transactions={mockTransactions.slice(0, 4)} />

      {/* Participating Retailers */}
      <RetailerGrid retailers={participatingRetailers} />
    </div>
  );
}
