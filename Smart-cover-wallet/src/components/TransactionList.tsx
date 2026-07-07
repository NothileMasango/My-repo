"use client";

import React from "react";

interface Transaction {
  id: string;
  merchantName: string;
  merchantCategory: string;
  amount: number;
  cashbackAmount: number;
  cashbackApplied: boolean;
  transactionDate: string;
  status: string;
  isParticipatingRetailer: boolean;
}

interface TransactionListProps {
  transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {transactions.filter((t) => t.cashbackApplied).length} earned cashback
        </span>
      </div>
      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${
                  transaction.isParticipatingRetailer
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {transaction.merchantName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">
                  {transaction.merchantName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(transaction.transactionDate)} &middot;{" "}
                  {transaction.merchantCategory}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm text-gray-800">
                -R{transaction.amount.toFixed(2)}
              </p>
              {transaction.cashbackApplied && (
                <p className="text-xs text-green-600 font-medium">
                  +R{transaction.cashbackAmount.toFixed(2)} cashback
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
