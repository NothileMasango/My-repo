"use client";

import React from "react";
import WalletCard from "./WalletCard";
import { mockWallet, mockWalletTransactions } from "@/lib/mock-data";

export default function WalletView() {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      CASHBACK_CREDIT: "Cashback",
      PREMIUM_DEBIT: "Premium Cover",
      GROCERY_DEBIT: "Grocery Payment",
      MANUAL_CREDIT: "Top-up",
      REVERSAL: "Reversal",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    if (type.includes("CREDIT")) return "text-green-600";
    if (type.includes("DEBIT")) return "text-red-600";
    return "text-gray-600";
  };

  const getTypeIcon = (type: string) => {
    if (type === "CASHBACK_CREDIT") return "+";
    if (type === "PREMIUM_DEBIT") return "→";
    return "•";
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Wallet Card */}
      <WalletCard
        balance={mockWallet.balance}
        monthlyEarnings={mockWallet.monthlyEarnings}
        monthlyCap={20}
        totalCashbackEarned={mockWallet.totalCashbackEarned}
        totalPremiumsCovered={mockWallet.totalPremiumsCovered}
      />

      {/* How it works */}
      <div className="glass-card p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-3">How Your Wallet Works</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-green-700 font-bold text-sm">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Shop at participating retailers</p>
              <p className="text-xs text-gray-500">Earn 1% cashback on grocery purchases, up to R20/month</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-green-700 font-bold text-sm">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Cashback auto-deposits</p>
              <p className="text-xs text-gray-500">Every qualifying purchase adds to your Smart Cover Wallet</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-amber-700 font-bold text-sm">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">AI monitors your premiums</p>
              <p className="text-xs text-gray-500">If a premium payment is at risk, your wallet steps in</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-700 font-bold text-sm">4</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">Stay covered, always</p>
              <p className="text-xs text-gray-500">Your insurance policies stay active, protecting your family</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Ledger */}
      <div className="glass-card p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Wallet Activity</h3>
        <div className="space-y-3">
          {mockWalletTransactions.map((wt) => (
            <div
              key={wt.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold ${
                    wt.type.includes("CREDIT")
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {getTypeIcon(wt.type)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {wt.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {formatDateTime(wt.createdAt!)}
                    </span>
                    <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">
                      {getTypeLabel(wt.type)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold text-sm ${getTypeColor(wt.type)}`}>
                  {wt.amount > 0 ? "+" : ""}R{Math.abs(wt.amount).toFixed(2)}
                </p>
                <p className="text-xs text-gray-400">
                  Bal: R{wt.balanceAfter.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
