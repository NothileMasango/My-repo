"use client";

import React from "react";

interface HeaderProps {
  customerName: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Header({ customerName, activeTab, onTabChange }: HeaderProps) {
  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "wallet", label: "Wallet" },
    { id: "policies", label: "Policies" },
    { id: "insights", label: "AI Insights" },
  ];

  const firstName = customerName.split(" ")[0];

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center">
              <span className="text-white font-bold text-lg">SC</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-none">
                Smart Cover Wallet
              </h1>
              <p className="text-xs text-gray-500">by OM Bank</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">Hi, {firstName}</p>
              <p className="text-xs text-gray-500">OM Bank Member</p>
            </div>
            <div className="w-9 h-9 rounded-full gradient-gold flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {customerName.split(" ").map((n) => n[0]).join("")}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab.id
                  ? "bg-green-50 text-green-700 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
              {tab.id === "insights" && (
                <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs bg-red-500 text-white rounded-full">
                  2
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
