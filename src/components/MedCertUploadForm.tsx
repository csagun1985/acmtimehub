"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Field, inputClass } from "@/components/ui";

export function MedCertUploadForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    form.set("requestId", requestId);
    const res = await fetch("/api/med-cert", { method: "POST", body: form });
    const data = (await res.json()) as { error?: string };
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }
    router.push("/requests");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6"
    >
      {error ? (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
          {error}
        </div>
      ) : null}
      <Field label="Upload PDF or image">
        <input
          type="file"
          name="file"
          required
          accept=".pdf,image/*"
          className={inputClass}
        />
      </Field>
      <Button type="submit" disabled={loading}>
        {loading ? "Uploading…" : "Upload certificate"}
      </Button>
    </form>
  );
}
