import { env } from "@turtle/env";
import { createFlag } from "./lib/create-flag";

export const showBetaFeature = createFlag("showBetaFeature", {
  decide: () => env.FLAG_SHOW_BETA_FEATURE,
  description: "Shows the beta feature example banner.",
});
