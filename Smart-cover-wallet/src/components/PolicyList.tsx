"use client";

const POLICY_LABELS: Record<string, string> = {
  EASIPLUS_FUNERAL: "EasiPlus Funeral Plan",
  STANDARD_FUNERAL: "Standard Funeral Cover",
};

const POLICY_DETAILS: Record<string, string> = {
  EASIPLUS_FUNERAL: "From R39/mo \u2022 No medical tests \u2022 Covers family & extended \u2022 Up to 6 missed premiums allowed",
  STANDARD_FUNERAL: "Cover up to R50k\u2013R70k \u2022 Premium holiday benefits \u2022 Covers direct & extended family",
};

export default function PolicyList({ policies }: { policies: any[] }) {
  if (policies.length === 0) {
    return (
      <div className="glass-card p-6 text-center">
        <p className="text-gray-500 text-sm">No policies linked yet. Seed data to add Old Mutual policies.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-800">Your Old Mutual Policies</h3>
      <div className="glass-card p-4 bg-green-50 border-green-100">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">📱</span>
          <span className="font-semibold text-sm text-green-800">WhatsApp Notifications Active</span>
        </div>
        <p className="text-xs text-green-700">
          You will receive a WhatsApp message before we use your Smart Cover Wallet to pay any premium automatically.
        </p>
      </div>
      {policies.map((policy) => (
        <div key={policy.id} className="glass-card p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-navy flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-800">{POLICY_LABELS[policy.policyType] || policy.policyType}</h4>
                <p className="text-xs text-gray-500">{policy.policyNumber}</p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              policy.status === "ACTIVE" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>{policy.status}</span>
          </div>

          <p className="text-xs text-gray-500 mb-3 italic">
            {POLICY_DETAILS[policy.policyType] || "Old Mutual insurance policy"}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500">Monthly Premium</p>
              <p className="font-bold text-gray-800">R{policy.monthlyPremium?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Cover Amount</p>
              <p className="font-bold text-gray-800">R{(policy.coverAmount / 1000).toFixed(0)}k</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Next Due</p>
              <p className="font-semibold text-sm text-gray-700">{policy.nextDueDate}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">AI Risk Score</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                (policy.riskScore || 0) <= 0.3 ? "bg-green-50 text-green-600" :
                (policy.riskScore || 0) <= 0.6 ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600"
              }`}>{Math.round((policy.riskScore || 0) * 100)}%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
