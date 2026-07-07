"use client";

const SEVERITY_COLORS: Record<string, string> = {
  LOW: "bg-blue-50 border-blue-200 text-blue-800",
  MEDIUM: "bg-amber-50 border-amber-200 text-amber-800",
  HIGH: "bg-red-50 border-red-200 text-red-800",
  CRITICAL: "bg-red-100 border-red-400 text-red-900",
};

const ICONS: Record<string, string> = {
  PREMIUM_AT_RISK: "!",
  LOW_BALANCE_WARNING: "$",
  CASHBACK_MILESTONE: "★",
  WALLET_COVER_APPLIED: "✓",
  SPENDING_PATTERN_CHANGE: "~",
};

export default function InsightList({ insights, client, onRefresh }: { insights: any[]; client: any; onRefresh: () => void }) {
  async function markRead(id: string) {
    await client.models.InsightAlert.update({ id, isRead: true });
    onRefresh();
  }

  if (insights.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-gray-500 text-sm">No insights yet. The AI engine will generate alerts based on your activity.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">AI Insights</h3>
      {insights.map((insight) => (
        <div
          key={insight.id}
          className={`relative border rounded-xl p-4 ${SEVERITY_COLORS[insight.severity] || SEVERITY_COLORS.LOW} ${
            !insight.isRead ? "ring-2 ring-green-300" : ""
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-white/60 flex items-center justify-center text-lg font-bold flex-shrink-0">
              {ICONS[insight.alertType] || "?"}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-sm">{insight.title}</h4>
              <p className="text-xs mt-1 opacity-80">{insight.message}</p>
              {!insight.isRead && (
                <button
                  onClick={() => markRead(insight.id)}
                  className="mt-2 text-xs font-medium underline opacity-70 hover:opacity-100"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
