"use client";

import { Amplify } from "aws-amplify";
import { useEffect, useState } from "react";

/**
 * Configures Amplify with the generated outputs.
 * After `npx ampx sandbox` or Amplify deployment, the amplify_outputs.json
 * is auto-generated and contains all the resource endpoints.
 */
export function AmplifyProvider({ children }: { children: React.ReactNode }) {
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    async function configure() {
      try {
        // amplify_outputs.json is generated at build time by Amplify
        const outputs = await import("../../amplify_outputs.json");
        Amplify.configure(outputs.default || outputs);
      } catch (e) {
        // If no outputs yet (first time, dev without sandbox), use defaults
        console.warn("No amplify_outputs.json found. Run `npx ampx sandbox` to generate.");
      }
      setConfigured(true);
    }
    configure();
  }, []);

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl gradient-green flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-lg">SC</span>
          </div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
