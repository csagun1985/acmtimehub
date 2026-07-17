import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required so OpenNext can patch Prisma for Workers
  serverExternalPackages: ["@prisma/client", ".prisma/client"],
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
