import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Best-effort Cloudflare env (undefined outside Workers / without bindings). */
export function getCfEnv(): CloudflareEnv | undefined {
  try {
    return getCloudflareContext().env;
  } catch {
    return undefined;
  }
}

export async function getCfEnvAsync(): Promise<CloudflareEnv | undefined> {
  try {
    const ctx = await getCloudflareContext({ async: true });
    return ctx.env;
  } catch {
    return undefined;
  }
}
