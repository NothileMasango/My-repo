"use client";

import { useState } from "react";

const RETAILERS = [
  { name: "Pick n Pay", category: "Grocery", participating: true },
  { name: "Checkers", category: "Grocery", participating: true },
  { name: "Shoprite", category: "Grocery", participating: true },
  { name: "Woolworths Food", category: "Grocery", participating: true },
  { name: "Spar", category: "Grocery", participating: true },
  { name: "Food Lovers Market", category: "Grocery", participating: true },
  { name: "Makro", category: "Wholesale", participating: true },
  { name: "OK Foods", category: "Grocery", participating: true },
  { name: "Boxer", category: "Grocery", participating: true },
  { name: "Engen", category: "Fuel", participating: false },
  { name: "Shell", category: "Fuel", participating: false },
  { name: "Clicks", category: "Pharmacy", participating: false },
  { name: "Other", category: "Other", participating: false },
];

interface Props {
  onSubmit: (txn: any) => Promise<void>;
  customerId: string;
}

export default function AddTransaction({ onSubmit, customerId }: Props) {
  const [selectedRetailer, setSelectedRetailer] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const retailer = RETAILERS.find(r => r.name === selectedRetailer);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedRetailer || !amount) return;

    setSubmitting(true);
    setSuccess(false);

    await onSubmit({
      customerId,
      merchantName: selectedRetailer,
      merchantCategory: retailer?.category || "Other",
      amount: parseFloat(amount),
      cashbackAmount: 0,
      cashbackApplied: false,
      transactionDate: new Date().toISOString().split("T")[0],
      isParticipatingRetailer: retailer?.participating || false,
    });

    setAmount("");
    setSelectedRetailer("");
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Add Grocery Purchase</h3>

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-medium">
          Transaction added! Cashback applied if eligible.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Retailer</label>
          <select
            value={selectedRetailer}
            onChange={(e) => setSelectedRetailer(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            required
          >
            <option value="">Select a store...</option>
            {RETAILERS.map(r => (
              <option key={r.name} value={r.name}>
                {r.name} {r.participating ? "(1% cashback)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (Rands)</label>
          <input
            type="number"
            step="0.01"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 450.00"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 outline-none text-sm"
            required
          />
        </div>

        {selectedRetailer && (
          <div className={`p-3 rounded-xl text-sm ${
            retailer?.participating ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-600"
          }`}>
            {retailer?.participating ? (
              <>Earn <strong>1% cashback</strong> (R{(parseFloat(amount || "0") * 0.01).toFixed(2)}) at {selectedRetailer}</>
            ) : (
              <>{selectedRetailer} is not a participating retailer - no cashback</>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl gradient-green text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {submitting ? "Processing..." : "Add Transaction"}
        </button>
      </form>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-600 mb-2">Participating Retailers (1% cashback)</h4>
        <div className="flex flex-wrap gap-2">
          {RETAILERS.filter(r => r.participating).map(r => (
            <span key={r.name} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{r.name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
