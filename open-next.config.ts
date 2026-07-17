import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// R2 incremental cache can be added later; deploy works without it.
const config = defineCloudflareConfig({});

export default {
  ...config,
  buildCommand: "npm run build:next",
};
