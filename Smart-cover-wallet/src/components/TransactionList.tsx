"use client";

export default function TransactionList({ transactions }: { transactions: any[] }) {
  if (transactions.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-gray-500 text-sm">No transactions yet. Add one to start earning cashback!</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-5">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.map((txn) => (
          <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${
                txn.isParticipatingRetailer ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {txn.merchantName?.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800">{txn.merchantName}</p>
                <p className="text-xs text-gray-500">{txn.transactionDate} &middot; {txn.merchantCategory}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-sm text-gray-800">-R{txn.amount?.toFixed(2)}</p>
              {txn.cashbackApplied && (
                <p className="text-xs text-green-600 font-medium">+R{txn.cashbackAmount?.toFixed(2)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
