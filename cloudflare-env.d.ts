/// <reference types="@cloudflare/workers-types" />

/**
 * Cloudflare Worker bindings for acmtimehub.
 * Regenerate with: npm run cf-typegen
 */
declare global {
  interface CloudflareEnv {
    DB: D1Database;
    MED_CERTS: R2Bucket;
  }
}

export {};
