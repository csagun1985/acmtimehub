import { mkdir, writeFile, readFile, access } from "fs/promises";
import path from "path";
import { getCfEnv } from "@/lib/cloudflare";

const LOCAL_UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

export function medCertObjectKey(requestId: string, safeFileName: string) {
  return `med-certs/${requestId}/${safeFileName}`;
}

/** Authenticated download URL used in the UI. */
export function medCertServeUrl(requestId: string) {
  return `/api/med-cert/${requestId}`;
}

function getR2(): R2Bucket | undefined {
  return getCfEnv()?.MED_CERTS;
}

export async function putMedCertObject(
  key: string,
  bytes: Uint8Array,
  contentType: string,
): Promise<void> {
  const bucket = getR2();
  if (bucket) {
    await bucket.put(key, bytes, {
      httpMetadata: { contentType },
    });
    return;
  }

  const absPath = path.join(LOCAL_UPLOAD_ROOT, key);
  await mkdir(path.dirname(absPath), { recursive: true });
  await writeFile(absPath, Buffer.from(bytes));
}

export async function getMedCertObject(
  key: string,
): Promise<{ body: Uint8Array; contentType: string } | null> {
  const bucket = getR2();
  if (bucket) {
    const obj = await bucket.get(key);
    if (!obj) return null;
    const ab = await obj.arrayBuffer();
    return {
      body: new Uint8Array(ab),
      contentType: obj.httpMetadata?.contentType || "application/octet-stream",
    };
  }

  const absPath = path.join(LOCAL_UPLOAD_ROOT, key);
  try {
    await access(absPath);
  } catch {
    if (key.startsWith("/")) {
      const legacy = path.join(process.cwd(), "public", key.replace(/^\//, ""));
      try {
        const buf = await readFile(legacy);
        return { body: new Uint8Array(buf), contentType: guessContentType(legacy) };
      } catch {
        return null;
      }
    }
    return null;
  }
  const buf = await readFile(absPath);
  return { body: new Uint8Array(buf), contentType: guessContentType(absPath) };
}

function guessContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".webp") return "image/webp";
  return "application/octet-stream";
}

/** Resolve storage key from LeaveRequest.medCertPath (new key or legacy public URL). */
export function resolveMedCertKey(medCertPath: string): string {
  if (medCertPath.startsWith("med-certs/")) return medCertPath;
  if (medCertPath.startsWith("/uploads/")) {
    return medCertPath.slice("/uploads/".length);
  }
  if (medCertPath.startsWith("uploads/")) {
    return medCertPath.slice("uploads/".length);
  }
  return medCertPath.replace(/^\//, "");
}
