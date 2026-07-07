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

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Fetch wallet
      const { data: wallets } = await client.models.Wallet.list();
      if (wallets.length > 0) setWallet(wallets[0]);

      // Fetch transactions (most recent first)
      const { data: txns } = await client.models.Transaction.list();
      setTransactions(txns.sort((a, b) => 
        new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime()
      ));

      // Fetch policies
      const { data: pols } = await client.models.Policy.list();
      setPolicies(pols);

      // Fetch insights
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
    // Create transaction
    const { data: newTxn } = await client.models.Transaction.create(txn);

    // Calculate cashback if participating retailer - 10% up to R150/month
    const CASHBACK_RATE = 0.10; // 10%
    const MONTHLY_CAP = 150; // R150

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

        // Update wallet
        await client.models.Wallet.update({
          id: wallet.id,
          balance: newBalance,
          monthlyEarnings: newMonthly,
          totalCashbackEarned: newTotal,
        });

        // Create wallet transaction
        await client.models.WalletTransaction.create({
          walletId: wallet.id,
          type: "CASHBACK_CREDIT",
          amount: roundedCashback,
          description: `10% cashback - ${txn.merchantName}`,
          balanceAfter: newBalance,
        });

        // Update the transaction with cashback
        if (newTxn) {
          await client.models.Transaction.update({
            id: newTxn.id,
            cashbackAmount: roundedCashback,
            cashbackApplied: true,
          });
        }

        // Create insight if milestone
        if (newTotal >= 500 && (wallet.totalCashbackEarned || 0) < 500) {
          await client.models.InsightAlert.create({
            customerId: txn.customerId,
            alertType: "CASHBACK_MILESTONE",
            severity: "LOW",
            title: "R500 Cashback Milestone!",
            message: `You've earned over R500 in cashback. Your safety net is growing strong!`,
            isRead: false,
            actionTaken: false,
          });
        }
      }
    }

    // Reload data
    await loadData();
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl gradient-green flex items-center justify-center mx-auto mb-3 animate-pulse">
            <span className="text-white font-bold">SC</span>
          </div>
          <p className="text-gray-500">Loading your wallet...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard" },
    { id: "add", label: "+ Transaction" },
    { id: "policies", label: "Policies" },
    { id: "insights", label: "Insights" },
    { id: "ai-test", label: "🧠 AI Test" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gradient-green flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-base">Smart Cover Wallet</h1>
              <p className="text-xs text-gray-500">by OM Bank</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="text-xs text-gray-500 hover:text-red-500">
            Sign Out
          </button>
        </div>
        <nav className="max-w-4xl mx-auto px-4 flex gap-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab.id
                  ? "bg-green-50 text-green-700 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {tab.id === "insights" && insights.filter(i => !i.isRead).length > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-4 h-4 text-xs bg-red-500 text-white rounded-full">
                  {insights.filter(i => !i.isRead).length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {activeTab === "dashboard" && (
          <>
            <WalletCard wallet={wallet} />
            <TransactionList transactions={transactions.slice(0, 5)} />
          </>
        )}
        {activeTab === "add" && (
          <AddTransaction
            onSubmit={handleAddTransaction}
            customerId={user?.userId || ""}
          />
        )}
        {activeTab === "policies" && <PolicyList policies={policies} />}
        {activeTab === "insights" && <InsightList insights={insights} client={client} onRefresh={loadData} />}
        {activeTab === "ai-test" && (
          <div className="glass-card p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🧠</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">AI Insights Engine</h3>
            <p className="text-sm text-gray-500 mb-4">
              Run the AI engine to analyze your policies, calculate risk scores, and trigger auto-cover protection.
            </p>
            <a
              href="/dashboard/insights-test"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold shadow-lg hover:shadow-xl"
            >
              Open AI Test Console
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
