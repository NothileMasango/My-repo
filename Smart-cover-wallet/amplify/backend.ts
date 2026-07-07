import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { cashbackProcessor } from "./functions/cashback-processor/resource";
import { aiInsightsEngine } from "./functions/ai-insights-engine/resource";

const backend = defineBackend({
  auth,
  data,
  cashbackProcessor,
  aiInsightsEngine,
});
