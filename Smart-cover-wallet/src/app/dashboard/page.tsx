"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, signOut } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../amplify/data/resource";
import WalletCard from "@/components/WalletCard";
import TransactionList from "@/components/TransactionList";
import PolicyList from "@/components/PolicyList";
import InsightList from "@/components/InsightList";
import AddTransaction from "@/components/AddTransaction";

const client = generateClient<Schema>();

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [policies, setPolicies] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      const { data: wallets } = await client.models.Wallet.list();
      if (wallets.length > 0) setWallet(wallets[0]);
      const { data: txns } = await client.models.Transaction.list();
      setTransactions(txns.sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()));
      const { data: pols } = await client.models.Policy.list();
      setPolicies(pols);
      const { data: ins } = await client.models.InsightAlert.list();
      setInsights(ins);
    } catch (e) {
      console.error("Error loading data:", e);
      router.replace("/auth");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    await signOut();
    router.replace("/auth");
  }

  async function handleAddTransaction(txn: any) {
    const { data: newTxn } = await client.models.Transaction.create(txn);
    const CASHBACK_RATE = 0.10;
    const MONTHLY_CAP = 150;

    if (txn.isParticipatingRetailer && wallet) {
      const cashbackAmount = Math.min(
        txn.amount * CASHBACK_RATE,
        Math.max(0, MONTHLY_CAP - (wallet.monthlyEarnings || 0))
      );
      if (cashbackAmount > 0) {
        const roundedCashback = Math.round(cashbackAmount * 100) / 100;
        const newBalance = (wallet.balance || 0) + roundedCashback;
        const newMonthly = (wallet.monthlyEarnings || 0) + roundedCashback;
        const newTotal = (wallet.totalCashbackEarned || 0) + roundedCashback;

        await client.models.Wallet.update({ id: wallet.id, balance: newBalance, monthlyEarnings: newMonthly, totalCashbackEarned: newTotal });
        await client.models.WalletTransaction.create({ walletId: wallet.id, type: "CASHBACK_CREDIT", amount: roundedCashback, description: `10% cashback - ${txn.merchantName}`, balanceAfter: newBalance });
        if (newTxn) await client.models.Transaction.update({ id: newTxn.id, cashbackAmount: roundedCashback, cashbackApplied: true });

        if (newTotal >= 500 && (wallet.totalCashbackEarned || 0) < 500) {
          await client.models.InsightAlert.create({ customerId: txn.customerId, alertType: "CASHBACK_MILESTONE", severity: "LOW", title: "R500 Cashback Milestone!", message: "Your safety net is growing strong!", isRead: false, actionTaken: false });
        }
      }
    }
    await loadData();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-amber-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl gradient-green flex items-center justify-center mx-auto mb-4 animate-pulse shadow-lg">
            <span className="text-white font-bold text-xl">SC</span>
          </div>
          <p className="text-gray-500 font-medium">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "home" },
    { id: "add", label: "Shop", icon: "cart" },
    { id: "policies", label: "Policies", icon: "shield" },
    { id: "insights", label: "Insights", icon: "bell" },
  ];

  const unreadInsights = insights.filter(i => !i.isRead).length;
  const monthlyCashback = wallet?.monthlyEarnings || 0;
  const remainingCap = 150 - monthlyCashback;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">SC</span>
              </div>
              <div>
                <h1 className="font-bold text-gray-900 text-lg leading-none">Smart Cover Wallet</h1>
                <p className="text-xs text-gray-500">by OM Bank &middot; Powered by Old Mutual</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/dashboard/insights-test"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-medium shadow-sm hover:shadow-md transition-all"
              >
                🧠 AI Console
              </a>
              <button onClick={handleSignOut} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                Sign Out
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-green-50 text-green-700 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                {tab.id === "insights" && unreadInsights > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs bg-red-500 text-white rounded-full">
                    {unreadInsights}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Hero */}
            <div className="glass-card p-6 bg-gradient-to-r from-green-50 to-amber-50">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl gradient-green flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 text-lg">One product. Two safety nets.</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Every grocery shop helps put food on the table today and protects what matters most tomorrow.
                  </p>
                </div>
              </div>
            </div>

            {/* Wallet Card */}
            <WalletCard wallet={wallet} />

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-green-600">R{monthlyCashback.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-1">This Month</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">R{remainingCap.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-1">Until R150 Cap</p>
              </div>
              <div className="glass-card p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{transactions.length}</p>
                <p className="text-xs text-gray-500 mt-1">Transactions</p>
              </div>
            </div>

            {/* Latest Insight (if unread) */}
            {unreadInsights > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Latest Insight
                </h3>
                <div className={`border rounded-xl p-4 ${
                  insights.find(i => !i.isRead)?.severity === "HIGH" ? "bg-red-50 border-red-200" :
                  insights.find(i => !i.isRead)?.severity === "MEDIUM" ? "bg-amber-50 border-amber-200" :
                  "bg-blue-50 border-blue-200"
                }`}>
                  <h4 className="font-semibold text-sm">{insights.find(i => !i.isRead)?.title}</h4>
                  <p className="text-xs mt-1 opacity-80">{insights.find(i => !i.isRead)?.message}</p>
                </div>
              </div>
            )}

            {/* Recent Transactions */}
            <TransactionList transactions={transactions.slice(0, 5)} />

            {/* Participating Retailers */}
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Participating Retailers</h3>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">10% Cashback</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {["Pick n Pay", "Checkers", "Shoprite", "Woolworths", "Spar", "Food Lovers", "Makro", "OK Foods", "Boxer"].map((name) => (
                  <div key={name} className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold">
                      {name.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-600 text-center font-medium leading-tight">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "add" && (
          <AddTransaction onSubmit={handleAddTransaction} customerId={user?.userId || ""} />
        )}

        {activeTab === "policies" && <PolicyList policies={policies} />}

        {activeTab === "insights" && <InsightList insights={insights} client={client} onRefresh={loadData} />}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 py-8 text-center border-t border-gray-100 mt-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 rounded gradient-green flex items-center justify-center">
            <span className="text-white font-bold text-xs">SC</span>
          </div>
          <span className="font-bold text-gray-700 text-sm">Smart Cover Wallet</span>
        </div>
        <p className="text-xs text-gray-500">by OM Bank &middot; Powered by Old Mutual</p>
        <p className="text-xs text-gray-400 mt-1">Transforming everyday spending into financial resilience</p>
      </footer>
    </div>
  );
}
