import path from "node:path";
import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

const clientLog: Prisma.LogLevel[] =
  process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"];

function resolveSqliteUrl(url: string): string {
  const filePath = url.slice("file:".length);
  if (!filePath || path.isAbsolute(filePath)) {
    return url;
  }
  return `file:${path.resolve(process.cwd(), filePath)}`;
}

/** Local SQLite client (not used on Cloudflare Workers). */
export function createLocalPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url?.startsWith("file:")) {
    throw new Error(
      "Local SQLite requires DATABASE_URL=file:... when not using D1"
    );
  }
  return new PrismaClient({
    adapter: new PrismaLibSQL({ url: resolveSqliteUrl(url) }),
    log: clientLog,
  });
}
