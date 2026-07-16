import { format } from "date-fns";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { updateOwnProfile } from "@/lib/actions";
import { Button, Field, PageHeader, inputClass } from "@/components/ui";

function statusLabel(status: string) {
  if (status === "PROBATION") return "Probationary";
  if (status === "PERMANENT") return "Permanent";
  if (status === "CASUAL") return "Casual";
  return status;
}

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  const session = await requireSession();
  const params = await searchParams;
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    include: {
      timesheetApprover: { select: { name: true } },
      silApprover: { select: { name: true } },
    },
  });

  async function saveAction(formData: FormData) {
    "use server";
    try {
      await updateOwnProfile(formData);
      const { redirect } = await import("next/navigation");
      redirect("/profile?saved=1");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to save";
      const { redirect } = await import("next/navigation");
      redirect(`/profile?error=${encodeURIComponent(message)}`);
    }
  }

  return (
    <div>
      <PageHeader
        title="My profile"
        subtitle="Update your personal details. Employment settings are managed by your manager or admin."
      />
      {params.error ? (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
          {params.error}
        </div>
      ) : null}
      {params.saved ? (
        <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Profile saved.
        </div>
      ) : null}

      <form
        action={saveAction}
        className="mb-8 grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 md:grid-cols-2"
      >
        <h2 className="md:col-span-2 font-semibold">Personal details</h2>
        <Field label="Name">
          <input
            name="name"
            required
            className={inputClass}
            defaultValue={user.name}
          />
        </Field>
        <Field label="Phone number">
          <input
            name="phone"
            type="tel"
            className={inputClass}
            defaultValue={user.phone ?? ""}
          />
        </Field>
        <Field label="Personal email" hint="Separate from your login email">
          <input
            name="personalEmail"
            type="email"
            className={inputClass}
            defaultValue={user.personalEmail ?? ""}
          />
        </Field>
        <Field label="Birthdate">
          <input
            name="birthDate"
            type="date"
            className={inputClass}
            defaultValue={
              user.birthDate ? format(user.birthDate, "yyyy-MM-dd") : ""
            }
          />
        </Field>
        <Field label="Address" hint="Street, suburb, state, postcode">
          <textarea
            name="address"
            rows={3}
            className={inputClass}
            defaultValue={user.address ?? ""}
          />
        </Field>
        <div className="md:col-span-2">
          <Button type="submit">Save personal details</Button>
        </div>
      </form>

      <div className="grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 md:grid-cols-2">
        <h2 className="md:col-span-2 font-semibold">Employment (read-only)</h2>
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Access type
          </div>
          <div className="mt-1 text-sm">
            {user.role === "ADMIN"
              ? "Admin"
              : user.role === "MANAGER"
                ? "Manager"
                : "Staff"}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Login email
          </div>
          <div className="mt-1 text-sm">{user.email}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            State
          </div>
          <div className="mt-1 text-sm">{user.state}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Start date
          </div>
          <div className="mt-1 text-sm">
            {format(user.startDate, "dd MMM yyyy")}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            End date
          </div>
          <div className="mt-1 text-sm">
            {user.endDate ? format(user.endDate, "dd MMM yyyy") : "—"}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Employment status
          </div>
          <div className="mt-1 text-sm">{statusLabel(user.employmentStatus)}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Employment type
          </div>
          <div className="mt-1 text-sm">
            {user.employmentType === "PART_TIME" ? "Part time" : "Full time"}
          </div>
        </div>
        <div className="md:col-span-2">
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Entitlements
          </div>
          <div className="mt-1 text-sm">
            {[
              user.entitleAlAccrual ? "AL accrual" : null,
              user.entitleSlAccrual ? "SL accrual" : null,
              user.entitlePublicHoliday ? "Public holiday" : null,
            ]
              .filter(Boolean)
              .join(" · ") || "None (typical for Casual)"}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            Timesheet Approver
          </div>
          <div className="mt-1 text-sm">
            {user.timesheetApprover?.name ?? "Not assigned"}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
            SIL Approver
          </div>
          <div className="mt-1 text-sm">
            {user.silApprover?.name ?? "Not assigned"}
          </div>
        </div>
      </div>
    </div>
  );
}
