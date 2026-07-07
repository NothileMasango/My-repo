"use client";

import React from "react";
import InsightCard from "./InsightCard";
import { mockInsights, mockWallet, mockPolicies } from "@/lib/mock-data";

export default function InsightsView() {
  const unreadCount = mockInsights.filter((i) => !i.isRead).length;
  const totalPremiums = mockPolicies.reduce((sum, p) => sum + p.monthlyPremium, 0);
  const coverageRatio = mockWallet.balance / totalPremiums;

  return (
    <div className="space-y-6">
      {/* AI Engine Status */}
      <div className="glass-card p-5 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-lg">AI Insights Engine</h3>
            <p className="text-sm text-gray-600">
              Continuously monitoring your financial patterns
            </p>
          </div>
        </div>

        {/* AI Metrics */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/60 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-purple-700">
              {Math.round(coverageRatio * 100)}%
            </p>
            <p className="text-xs text-gray-500">Protection Level</p>
          </div>
          <div className="bg-white/60 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-green-600">Low</p>
            <p className="text-xs text-gray-500">Overall Risk</p>
          </div>
          <div className="bg-white/60 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-blue-600">1</p>
            <p className="text-xs text-gray-500">Auto-Covers</p>
          </div>
        </div>
      </div>

      {/* How AI Protects You */}
      <div className="glass-card p-5">
        <h3 className="text-base font-bold text-gray-800 mb-3">
          How AI Protects Your Premiums
        </h3>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 text-xs">1</span>
            </div>
            <p className="text-sm text-gray-600">
              Monitors your spending patterns and account balance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 text-xs">2</span>
            </div>
            <p className="text-sm text-gray-600">
              Predicts when a premium payment might be at risk
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 text-xs">3</span>
            </div>
            <p className="text-sm text-gray-600">
              Sends early warnings so you can take action
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 text-xs">4</span>
            </div>
            <p className="text-sm text-gray-600">
              Auto-covers premiums from your wallet if needed
            </p>
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-800">Your Insights</h3>
          {unreadCount > 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="space-y-3">
          {mockInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              alertType={insight.alertType}
              severity={insight.severity}
              title={insight.title}
              message={insight.message}
              actionTaken={insight.actionTaken}
              actionDescription={insight.actionDescription}
              isRead={insight.isRead}
            />
          ))}
        </div>
      </div>

      {/* Prediction confidence */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-medium text-gray-500">About our AI</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Our AI insights engine analyzes payment patterns, spending behavior, and account
          balance trends to predict premium payment risks. It uses multi-factor risk scoring
          considering income patterns, spending changes, payment history, and days until
          premium due dates.
        </p>
      </div>
    </div>
  );
}
