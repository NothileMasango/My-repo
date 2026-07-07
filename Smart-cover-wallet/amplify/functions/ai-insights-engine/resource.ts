import { defineFunction } from "@aws-amplify/backend";

export const aiInsightsEngine = defineFunction({
  name: "ai-insights-engine",
  entry: "./handler.ts",
  timeoutSeconds: 60,
  memoryMB: 512,
  environment: {
    RISK_THRESHOLD_HIGH: "0.75",
    RISK_THRESHOLD_MEDIUM: "0.50",
    AUTO_COVER_ENABLED: "true",
    DAYS_BEFORE_DUE_CHECK: "5",
  },
});
