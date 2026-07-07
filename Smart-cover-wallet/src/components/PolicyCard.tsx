"use client";

import React from "react";

interface PolicyCardProps {
  policyNumber: string;
  policyType: string;
  monthlyPremium: number;
  status: string;
  nextDueDate: string;
  coverAmount: number;
  riskScore: number;
}

const policyTypeLabels: Record<string, string> = {
  LIFE: "Life Cover",
  FUNERAL: "Funeral Cover",
  SAVINGS: "Savings Plan",
  RETIREMENT: "Retirement",
  DISABILITY: "Disability",
};

const policyTypeIcons: Record<string, string> = {
  LIFE: "heart",
  FUNERAL: "shield",
  SAVINGS: "piggy",
  RETIREMENT: "sunset",
  DISABILITY: "umbrella",
};

export default function PolicyCard({
  policyNumber,
  policyType,
  monthlyPremium,
  status,
  nextDueDate,
  coverAmount,
  riskScore,
}: PolicyCardProps) {
  const getRiskColor = (score: number) => {
    if (score <= 0.3) return "text-green-600 bg-green-50";
    if (score <= 0.6) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  const getRiskLabel = (score: number) => {
    if (score <= 0.3) return "Low Risk";
    if (score <= 0.6) return "Medium Risk";
    return "High Risk";
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="glass-card p-5 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl gradient-navy flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              {policyType === "LIFE" ? (
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              ) : (
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              )}
            </svg>
          </div>
          <div>
            <h4 className="font-bold text-gray-800">
              {policyTypeLabels[policyType] || policyType}
            </h4>
            <p className="text-xs text-gray-500">{policyNumber}</p>
          </div>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <div>
          <p className="text-xs text-gray-500">Monthly Premium</p>
          <p className="font-bold text-gray-800">R{monthlyPremium.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Cover Amount</p>
          <p className="font-bold text-gray-800">
            R{(coverAmount / 1000).toFixed(0)}k
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Next Due</p>
          <p className="font-semibold text-sm text-gray-700">
            {formatDate(nextDueDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">AI Risk Score</p>
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getRiskColor(riskScore)}`}
          >
            {getRiskLabel(riskScore)} ({Math.round(riskScore * 100)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
