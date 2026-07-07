"use client";

export default function WalletCard({ wallet }: { wallet: any }) {
  const balance = wallet?.balance || 0;
  const monthlyEarnings = wallet?.monthlyEarnings || 0;
  const monthlyCap = wallet?.monthlyCap || 20;
  const totalCashback = wallet?.totalCashbackEarned || 0;
  const totalPremiums = wallet?.totalPremiumsCovered || 0;
  const capPercent = (monthlyEarnings / monthlyCap) * 100;

  return (
    <div className="relative overflow-hidden rounded-3xl gradient-green p-6 text-white shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-green-100 text-sm">Smart Cover Wallet</p>
            <h2 className="text-3xl font-bold mt-1">R{balance.toFixed(2)}</h2>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-green-100">Monthly cashback</span>
            <span className="font-semibold">R{monthlyEarnings.toFixed(2)} / R{monthlyCap.toFixed(2)}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2.5">
            <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: `${Math.min(capPercent, 100)}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-green-100 text-xs">Total Cashback</p>
            <p className="text-lg font-bold">R{totalCashback.toFixed(2)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-green-100 text-xs">Premiums Covered</p>
            <p className="text-lg font-bold">R{totalPremiums.toFixed(2)}</p>
          </div>
        </div>

        {!wallet && (
          <p className="text-green-200 text-xs mt-4 text-center">
            No wallet yet. Add a transaction to get started!
          </p>
        )}
      </div>
    </div>
  );
}
