"use client";

import { Amplify } from "aws-amplify";
import { useEffect, useState } from "react";

/**
 * Configures Amplify at runtime (not build time).
 * The amplify_outputs.json is loaded dynamically to avoid build errors
 * when the file doesn't exist yet.
 */
export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    async function configure() {
      try {
        const response = await fetch("/amplify_outputs.json");
        if (response.ok) {
          const outputs = await response.json();
          Amplify.configure(outputs);
        } else {
          console.warn("amplify_outputs.json not found. Run `npx ampx sandbox` to generate.");
        }
      } catch (e) {
        console.warn("Could not load Amplify config:", e);
      }
      setConfigured(true);
    }
    configure();
  }, []);

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-green-700 flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">SC</span>
          </div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
