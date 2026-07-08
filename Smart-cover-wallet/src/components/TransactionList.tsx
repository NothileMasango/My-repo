"use client";

export default function TransactionList({ transactions }: { transactions: any[] }) {
  if (transactions.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-medium">No transactions yet</p>
        <p className="text-gray-400 text-xs mt-1">Add a grocery purchase to start earning 10% cashback!</p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {transactions.filter(t => t.cashbackApplied).length} earned cashback
        </span>
      </div>
      <div className="space-y-1">
        {transactions.map((txn) => (
          <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 rounded-lg px-2 -mx-2 transition-colors">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold shadow-sm ${
                txn.isParticipatingRetailer
                  ? "bg-gradient-to-br from-green-100 to-green-50 text-green-700 border border-green-200"
                  : "bg-gray-100 text-gray-500"
              }`}>
                {txn.merchantName?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">{txn.merchantName}</p>
                <p className="text-xs text-gray-500">{formatDate(txn.transactionDate)} &middot; {txn.merchantCategory}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm text-gray-800">-R{txn.amount?.toFixed(2)}</p>
              {txn.cashbackApplied && (
                <p className="text-xs text-green-600 font-semibold">+R{txn.cashbackAmount?.toFixed(2)} back</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
