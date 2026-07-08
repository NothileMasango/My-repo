"use client";

export default function WalletCard({ wallet }: { wallet: any }) {
  const balance = wallet?.balance || 0;
  const monthlyEarnings = wallet?.monthlyEarnings || 0;
  const monthlyCap = wallet?.monthlyCap || 150;
  const totalCashback = wallet?.totalCashbackEarned || 0;
  const totalPremiums = wallet?.totalPremiumsCovered || 0;
  const capPercent = (monthlyEarnings / monthlyCap) * 100;

  return (
    <div className="relative overflow-hidden rounded-3xl gradient-green p-6 text-white shadow-2xl">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
      <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-green-100 text-sm font-medium">Smart Cover Wallet</p>
            <h2 className="text-4xl font-bold mt-1">R{balance.toFixed(2)}</h2>
          </div>
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
          </div>
        </div>

        {/* Monthly cashback progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-green-100">Monthly cashback (10%)</span>
            <span className="font-semibold">R{monthlyEarnings.toFixed(2)} / R{monthlyCap.toFixed(2)}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-300 to-yellow-400 h-3 rounded-full transition-all duration-700 shadow-sm"
              style={{ width: `${Math.min(capPercent, 100)}%` }}
            />
          </div>
          <p className="text-green-200 text-xs mt-1.5">
            {capPercent >= 100 ? "Monthly cap reached! Resets on the 1st." : `R${(monthlyCap - monthlyEarnings).toFixed(2)} more available this month`}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 rounded-xl p-3.5 backdrop-blur-sm">
            <p className="text-green-100 text-xs">Total Cashback Earned</p>
            <p className="text-xl font-bold mt-0.5">R{totalCashback.toFixed(2)}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3.5 backdrop-blur-sm">
            <p className="text-green-100 text-xs">Premiums Protected</p>
            <p className="text-xl font-bold mt-0.5">R{totalPremiums.toFixed(2)}</p>
          </div>
        </div>

        {!wallet && (
          <div className="mt-4 bg-white/10 rounded-xl p-4 text-center">
            <p className="text-green-100 text-sm">No wallet yet. Visit <a href="/dashboard/seed" className="underline font-medium">Seed Data</a> to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
