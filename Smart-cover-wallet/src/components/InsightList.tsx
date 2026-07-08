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

const ICON_BG: Record<string, string> = {
  PREMIUM_AT_RISK: "bg-red-100 text-red-600",
  LOW_BALANCE_WARNING: "bg-amber-100 text-amber-600",
  CASHBACK_MILESTONE: "bg-green-100 text-green-600",
  WALLET_COVER_APPLIED: "bg-green-100 text-green-600",
  SPENDING_PATTERN_CHANGE: "bg-blue-100 text-blue-600",
};

export default function InsightList({ insights, client, onRefresh }: { insights: any[]; client: any; onRefresh: () => void }) {
  async function markRead(id: string) {
    await client.models.InsightAlert.update({ id, isRead: true });
    onRefresh();
  }

  if (insights.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
          <span className="text-purple-600 text-lg">🧠</span>
        </div>
        <p className="text-gray-500 text-sm font-medium">No insights yet</p>
        <p className="text-gray-400 text-xs mt-1">The AI engine will generate alerts based on your activity.</p>
        <a href="/dashboard/insights-test" className="inline-block mt-3 text-xs text-purple-600 font-medium underline">
          Run AI Engine →
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">AI Insights</h3>
        <div className="flex items-center gap-2">
          {insights.filter(i => !i.isRead).length > 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
              {insights.filter(i => !i.isRead).length} new
            </span>
          )}
          <a href="/dashboard/insights-test" className="text-xs text-purple-600 font-medium hover:underline">
            Run AI →
          </a>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`relative border rounded-2xl p-4 transition-all hover:shadow-md ${
              SEVERITY_COLORS[insight.severity] || SEVERITY_COLORS.LOW
            } ${!insight.isRead ? "ring-2 ring-offset-1 ring-green-300" : ""}`}
          >
            {!insight.isRead && (
              <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
            )}
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                ICON_BG[insight.alertType] || "bg-gray-100 text-gray-600"
              }`}>
                {ICONS[insight.alertType] || "?"}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{insight.title}</h4>
                <p className="text-xs mt-1 opacity-80 leading-relaxed">{insight.message}</p>
                {insight.actionTaken && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-xs font-medium text-green-700">Action taken automatically</span>
                  </div>
                )}
                {!insight.isRead && (
                  <button onClick={() => markRead(insight.id)} className="mt-2 text-xs font-medium underline opacity-60 hover:opacity-100">
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
