import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cache } from "react";
import { createLocalPrismaClient } from "./prisma-local";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const clientLog =
  process.env.NODE_ENV === "development"
    ? (["error", "warn"] as const)
    : (["error"] as const);

/** Per-request D1 client (Workers must not reuse one client across requests). */
const getD1Client = cache(() => {
  const { env } = getCloudflareContext();
  if (!env.DB) {
    throw new Error("D1 binding DB is not configured");
  }
  return new PrismaClient({
    adapter: new PrismaD1(env.DB),
    log: [...clientLog],
  });
});

/**
 * Local `next dev`: use SQLite when DATABASE_URL is file:...
 * Cloudflare Workers / preview: use D1 via the DB binding.
 * Set USE_D1=1 to force D1 even when a file URL is present (wrangler local).
 */
function shouldUseD1(): boolean {
  const forceD1 =
    process.env.USE_D1 === "1" || process.env.USE_D1 === "true";
  const fileSqlite = process.env.DATABASE_URL?.startsWith("file:");

  if (fileSqlite && !forceD1) return false;

  try {
    const { env } = getCloudflareContext();
    return Boolean(env?.DB);
  } catch {
    return false;
  }
}

function createSqliteClient(): PrismaClient {
  return createLocalPrismaClient();
}

export function getPrisma(): PrismaClient {
  if (shouldUseD1()) {
    return getD1Client();
  }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createSqliteClient();
  }
  return globalForPrisma.prisma;
}

/** Drop-in singleton; resolves to SQLite or D1 per request/runtime. */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});
