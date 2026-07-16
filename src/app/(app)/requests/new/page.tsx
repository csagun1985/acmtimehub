import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import { submitLeaveRequest } from "@/lib/actions";
import { PageHeader } from "@/components/ui";
import { LeaveRequestForm } from "@/components/LeaveRequestForm";
import Link from "next/link";

export default async function NewRequestPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; error?: string }>;
}) {
  await requireSession();
  const params = await searchParams;
  const defaultType = params.type ?? "AL";

  async function action(formData: FormData) {
    "use server";
    try {
      const result = await submitLeaveRequest(formData);
      if (result.medCertRequired) {
        redirect(`/requests/${result.id}/med-cert`);
      }
      redirect("/requests");
    } catch (e) {
      if (e && typeof e === "object" && "digest" in e) throw e; // Next redirect
      const message = e instanceof Error ? e.message : "Failed";
      redirect(
        `/requests/new?error=${encodeURIComponent(message)}&type=${formData.get("type")}`
      );
    }
  }

  return (
    <div className="max-w-xl">
      <PageHeader
        title="New request"
        subtitle="AL & SL use days (weekends & state PHs excluded). DIL uses hours."
      />

      {params.error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
          {params.error}
        </div>
      ) : null}

      <div className="mb-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
        <p className="font-medium text-[var(--ink)]">AL notice periods</p>
        <ul className="mt-1 list-disc space-y-0.5 pl-5">
          <li>1 day AL — request at least <strong>3 days</strong> before</li>
          <li>2 days AL — request at least <strong>2 weeks</strong> before</li>
          <li>3+ days AL — request at least <strong>4 weeks</strong> before</li>
        </ul>
        <p className="mt-2">
          AL/SL can be used after probation or Permanent status. For SL carer’s leave / unexpected
          emergencies, see{" "}
          <Link href="/guidelines#unexpected-emergencies-carer-s-leave" className="text-[var(--brand)] underline">
            Guidelines
          </Link>
          .
        </p>
      </div>

      <LeaveRequestForm defaultType={defaultType} action={action} />
    </div>
  );
}
