"use client";

import React from "react";

interface InsightCardProps {
  alertType: string;
  severity: string;
  title: string;
  message: string;
  actionTaken: boolean;
  actionDescription?: string;
  isRead: boolean;
}

const severityColors: Record<string, string> = {
  LOW: "bg-blue-50 border-blue-200 text-blue-800",
  MEDIUM: "bg-amber-50 border-amber-200 text-amber-800",
  HIGH: "bg-red-50 border-red-200 text-red-800",
  CRITICAL: "bg-red-100 border-red-400 text-red-900",
};

const alertIcons: Record<string, string> = {
  PREMIUM_AT_RISK: "!",
  LOW_BALANCE_WARNING: "$",
  CASHBACK_MILESTONE: "★",
  WALLET_COVER_APPLIED: "✓",
  SPENDING_PATTERN_CHANGE: "~",
};

const alertIconBg: Record<string, string> = {
  PREMIUM_AT_RISK: "bg-red-100 text-red-600",
  LOW_BALANCE_WARNING: "bg-amber-100 text-amber-600",
  CASHBACK_MILESTONE: "bg-green-100 text-green-600",
  WALLET_COVER_APPLIED: "bg-green-100 text-green-600",
  SPENDING_PATTERN_CHANGE: "bg-blue-100 text-blue-600",
};

export default function InsightCard({
  alertType,
  severity,
  title,
  message,
  actionTaken,
  actionDescription,
  isRead,
}: InsightCardProps) {
  return (
    <div
      className={`relative border rounded-xl p-4 transition-all hover:shadow-md ${
        severityColors[severity] || severityColors.LOW
      } ${!isRead ? "ring-2 ring-offset-1 ring-green-300" : ""}`}
    >
      {!isRead && (
        <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-green-500 rounded-full pulse-glow" />
      )}

      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
            alertIconBg[alertType] || "bg-gray-100 text-gray-600"
          }`}
        >
          {alertIcons[alertType] || "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm">{title}</h4>
          <p className="text-xs mt-1 opacity-80 leading-relaxed">{message}</p>
          {actionTaken && actionDescription && (
            <div className="mt-2 flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs font-medium text-green-700">
                {actionDescription}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
