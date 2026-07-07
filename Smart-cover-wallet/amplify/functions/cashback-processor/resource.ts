import { defineFunction } from "@aws-amplify/backend";

export const cashbackProcessor = defineFunction({
  name: "cashback-processor",
  entry: "./handler.ts",
  timeoutSeconds: 30,
  memoryMB: 256,
  environment: {
    MONTHLY_CASHBACK_CAP: "150.00",
    CASHBACK_PERCENTAGE: "10.0",
  },
});
