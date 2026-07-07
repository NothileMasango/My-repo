"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import WalletView from "@/components/WalletView";
import PoliciesView from "@/components/PoliciesView";
import InsightsView from "@/components/InsightsView";
import { mockCustomer } from "@/lib/mock-data";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simple demo auth (in production, this uses Amplify Auth / Cognito)
  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "wallet":
        return <WalletView />;
      case "policies":
        return <PoliciesView />;
      case "insights":
        return <InsightsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      <Header
        customerName={mockCustomer.fullName}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      <main className="max-w-6xl mx-auto px-4 py-6">{renderContent()}</main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-4 py-8 text-center border-t border-gray-100 mt-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded gradient-green flex items-center justify-center">
            <span className="text-white font-bold text-xs">SC</span>
          </div>
          <span className="font-bold text-gray-700 text-sm">Smart Cover Wallet</span>
        </div>
        <p className="text-xs text-gray-500">
          by OM Bank &middot; Powered by Old Mutual
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Transforming everyday spending into financial resilience
        </p>
      </footer>
    </div>
  );
}

// Demo login screen
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: accept any login
    onLogin();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-green-50 via-white to-amber-50">
      <div className="w-full max-w-md">
        {/* Logo & Brand */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-3xl gradient-green flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-bold text-3xl">SC</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Smart Cover Wallet</h1>
          <p className="text-gray-500 mt-2">by OM Bank</p>
        </div>

        {/* Value proposition */}
        <div className="glass-card p-4 mb-6 text-center">
          <p className="text-sm text-gray-700 font-medium">
            Earn cashback on groceries. Protect your insurance premiums.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            One product. Two safety nets.
          </p>
        </div>

        {/* Login Form */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Sign In</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="thandi@email.co.za"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl gradient-green text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              Sign In to Smart Cover Wallet
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Demo Mode: Click Sign In with any credentials
            </p>
          </div>
        </div>

        {/* Eligibility note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            Available exclusively to OM Bank customers with active Old Mutual policies
          </p>
        </div>
      </div>
    </div>
  );
}
