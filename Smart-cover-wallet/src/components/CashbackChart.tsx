"use client";

import React from "react";

interface CashbackChartProps {
  data: { month: string; amount: number }[];
  monthlyCap: number;
}

export default function CashbackChart({ data, monthlyCap }: CashbackChartProps) {
  const maxAmount = monthlyCap;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Cashback History</h3>
        <span className="text-xs text-gray-500">Last 6 months</span>
      </div>
      
      {/* Simple bar chart */}
      <div className="flex items-end justify-between gap-2 h-40 mt-4">
        {data.map((item, index) => {
          const height = (item.amount / maxAmount) * 100;
          const isCurrentMonth = index === data.length - 1;
          const isCapped = item.amount >= monthlyCap;
          
          return (
            <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-semibold text-gray-700">
                R{item.amount.toFixed(0)}
              </span>
              <div className="w-full relative" style={{ height: "120px" }}>
                <div
                  className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${
                    isCurrentMonth
                      ? "bg-gradient-to-t from-green-600 to-green-400"
                      : isCapped
                      ? "bg-gradient-to-t from-amber-500 to-amber-300"
                      : "bg-gradient-to-t from-green-400 to-green-200"
                  }`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className={`text-xs ${isCurrentMonth ? "font-bold text-green-700" : "text-gray-500"}`}>
                {item.month}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Cap indicator */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <span className="text-xs text-gray-500">
          R{monthlyCap} monthly cap reached
        </span>
        <div className="w-3 h-3 rounded-full bg-green-400 ml-3" />
        <span className="text-xs text-gray-500">
          Earning in progress
        </span>
      </div>
    </div>
  );
}
