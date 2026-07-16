import Link from "next/link";
import { format } from "date-fns";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { adminUpsertUser, updateEmploymentProfile } from "@/lib/actions";
import { AU_STATES } from "@/lib/types";
import { peopleEditableWhere } from "@/lib/permissions";
import { Button, Field, PageHeader, inputClass } from "@/components/ui";

function statusLabel(status: string) {
  if (status === "PROBATION") return "Probationary";
  if (status === "PERMANENT") return "Permanent";
  if (status === "CASUAL") return "Casual";
  return status;
}

export default async function PeoplePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; edit?: string; saved?: string }>;
}) {
  const session = await requireRole("ADMIN", "MANAGER");
  const isAdmin = session.user.role === "ADMIN";
  const params = await searchParams;

  const people = await prisma.user.findMany({
    where: peopleEditableWhere(session.user.id, session.user.role),
    include: {
      timesheetApprover: { select: { id: true, name: true } },
      silApprover: { select: { id: true, name: true } },
    },
    orderBy: { name: "asc" },
  });

  const approverOptions = await prisma.user.findMany({
    where: {
      active: true,
      role: { in: ["MANAGER", "ADMIN"] },
    },
    orderBy: { name: "asc" },
    select: { id: true, name: true, role: true },
  });

  const editing = params.edit
    ? people.find((p) => p.id === params.edit) ?? null
    : null;

  async function createAction(formData: FormData) {
    "use server";
    try {
      await adminUpsertUser(formData);
      const { redirect } = await import("next/navigation");
      redirect("/admin/people?saved=1");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed";
      const { redirect } = await import("next/navigation");
      redirect(`/admin/people?error=${encodeURIComponent(message)}`);
    }
  }

  async function employmentAction(formData: FormData) {
    "use server";
    try {
      await updateEmploymentProfile(formData);
      const userId = String(formData.get("userId"));
      const { redirect } = await import("next/navigation");
      redirect(`/admin/people?edit=${userId}&saved=1`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed";
      const { redirect } = await import("next/navigation");
      redirect(`/admin/people?error=${encodeURIComponent(message)}`);
    }
  }

  return (
    <div>
      <PageHeader
        title="People"
        subtitle={
          isAdmin
            ? "Create staff, assign Timesheet / SIL Approvers, and manage employment."
            : "Edit employment for candidates you are assigned to approve."
        }
      />
      {params.error ? (
        <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
          {params.error}
        </div>
      ) : null}
      {params.saved ? (
        <div className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Saved.
        </div>
      ) : null}

      {isAdmin ? (
        <form
          action={createAction}
          className="mb-8 grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 md:grid-cols-2"
        >
          <h2 className="md:col-span-2 font-semibold">Add person</h2>
          <Field label="Name">
            <input name="name" required className={inputClass} />
          </Field>
          <Field label="Login email">
            <input name="email" type="email" required className={inputClass} />
          </Field>
          <Field label="Start date">
            <input
              name="startDate"
              type="date"
              required
              className={inputClass}
              defaultValue="2026-07-01"
            />
          </Field>
          <Field label="End date" hint="Optional termination date">
            <input name="endDate" type="date" className={inputClass} />
          </Field>
          <Field label="Password">
            <input name="password" type="password" required className={inputClass} />
          </Field>
          <Field label="State (public holidays)">
            <select name="state" className={inputClass} defaultValue="NSW">
              {AU_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Access type" hint="Staff, Manager, or Admin login permissions">
            <select name="role" className={inputClass} defaultValue="STAFF">
              <option value="STAFF">Staff</option>
              <option value="MANAGER">Manager</option>
              <option value="ADMIN">Admin</option>
            </select>
          </Field>
          <Field label="Employment status">
            <select name="employmentStatus" className={inputClass} defaultValue="PROBATION">
              <option value="PROBATION">Probationary</option>
              <option value="PERMANENT">Permanent</option>
              <option value="CASUAL">Casual</option>
            </select>
          </Field>
          <Field label="Employment type" hint="Sets daily/weekly hour standards for DIL OT">
            <select name="employmentType" className={inputClass} defaultValue="FULL_TIME">
              <option value="FULL_TIME">Full time (8h / 40h)</option>
              <option value="PART_TIME">Part time (4h / 20h)</option>
            </select>
          </Field>
          <Field
            label="Probation end date"
            hint="Optional. AL/SL usable on/after this date, or when Permanent."
          >
            <input name="probationEndDate" type="date" className={inputClass} />
          </Field>
          <Field label="Timesheet Approver">
            <select name="timesheetApproverId" className={inputClass} defaultValue="">
              <option value="">— Unassigned —</option>
              {approverOptions.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.role})
                </option>
              ))}
            </select>
          </Field>
          <Field label="SIL Approver">
            <select name="silApproverId" className={inputClass} defaultValue="">
              <option value="">— Unassigned —</option>
              {approverOptions.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.role})
                </option>
              ))}
            </select>
          </Field>
          <fieldset className="md:col-span-2 rounded-xl border border-[var(--line)] p-3">
            <legend className="px-1 text-sm font-medium">Entitlements</legend>
            <p className="mb-2 text-xs text-[var(--muted)]">
              Casual: leave unchecked (no AL, SL, or public holiday).
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="entitleAlAccrual" defaultChecked />
                AL accrual
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="entitleSlAccrual" defaultChecked />
                SL accrual
              </label>
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="entitlePublicHoliday" defaultChecked />
                Public holiday
              </label>
            </div>
          </fieldset>
          <div className="md:col-span-2">
            <Button type="submit">Create user</Button>
          </div>
        </form>
      ) : null}

      <form
        action={employmentAction}
        className="mb-8 grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 md:grid-cols-2"
      >
        <h2 className="md:col-span-2 font-semibold">Edit employment</h2>
        {people.length === 0 ? (
          <p className="md:col-span-2 text-sm text-[var(--muted)]">
            No candidates assigned to you yet. Ask Admin to set you as Timesheet or SIL Approver.
          </p>
        ) : (
          <>
            <Field label="Person">
              <select
                name="userId"
                required
                className={inputClass}
                defaultValue={editing?.id ?? ""}
                key={editing?.id ?? "none"}
              >
                <option value="" disabled>
                  Select a person…
                </option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {statusLabel(p.employmentStatus)} ·{" "}
                    {p.employmentType === "PART_TIME" ? "PT" : "FT"}
                  </option>
                ))}
              </select>
            </Field>
            <div className="flex items-end">
              <p className="text-xs text-[var(--muted)]">
                Or open someone from the table below to prefill.
              </p>
            </div>
            <Field label="Start date">
              <input
                name="startDate"
                type="date"
                required
                className={inputClass}
                key={`start-${editing?.id ?? "x"}`}
                defaultValue={
                  editing
                    ? format(editing.startDate, "yyyy-MM-dd")
                    : "2026-07-01"
                }
              />
            </Field>
            <Field label="End date" hint="Optional termination">
              <input
                name="endDate"
                type="date"
                className={inputClass}
                key={`end-${editing?.id ?? "x"}`}
                defaultValue={
                  editing?.endDate ? format(editing.endDate, "yyyy-MM-dd") : ""
                }
              />
            </Field>
            <Field label="State">
              <select
                name="state"
                className={inputClass}
                key={`state-${editing?.id ?? "x"}`}
                defaultValue={editing?.state ?? "NSW"}
              >
                {AU_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Employment status">
              <select
                name="employmentStatus"
                className={inputClass}
                key={`status-${editing?.id ?? "x"}`}
                defaultValue={editing?.employmentStatus ?? "PERMANENT"}
              >
                <option value="PROBATION">Probationary</option>
                <option value="PERMANENT">Permanent</option>
                <option value="CASUAL">Casual</option>
              </select>
            </Field>
            <Field label="Employment type">
              <select
                name="employmentType"
                className={inputClass}
                key={`type-${editing?.id ?? "x"}`}
                defaultValue={editing?.employmentType ?? "FULL_TIME"}
              >
                <option value="FULL_TIME">Full time</option>
                <option value="PART_TIME">Part time</option>
              </select>
            </Field>
            <Field label="Probation end date">
              <input
                name="probationEndDate"
                type="date"
                className={inputClass}
                key={`prob-${editing?.id ?? "x"}`}
                defaultValue={
                  editing?.probationEndDate
                    ? format(editing.probationEndDate, "yyyy-MM-dd")
                    : ""
                }
              />
            </Field>
            {isAdmin ? (
              <>
                <Field label="Access type" hint="Staff, Manager, or Admin login permissions">
                  <select
                    name="role"
                    className={inputClass}
                    key={`role-${editing?.id ?? "x"}`}
                    defaultValue={editing?.role ?? "STAFF"}
                  >
                    <option value="STAFF">Staff</option>
                    <option value="MANAGER">Manager</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </Field>
                <Field label="Timesheet Approver">
                  <select
                    name="timesheetApproverId"
                    className={inputClass}
                    key={`ts-${editing?.id ?? "x"}`}
                    defaultValue={editing?.timesheetApproverId ?? ""}
                  >
                    <option value="">— Unassigned —</option>
                    {approverOptions.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.role})
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="SIL Approver">
                  <select
                    name="silApproverId"
                    className={inputClass}
                    key={`sil-${editing?.id ?? "x"}`}
                    defaultValue={editing?.silApproverId ?? ""}
                  >
                    <option value="">— Unassigned —</option>
                    {approverOptions.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.role})
                      </option>
                    ))}
                  </select>
                </Field>
              </>
            ) : (
              <div className="md:col-span-2 text-sm text-[var(--muted)]">
                Access type:{" "}
                <strong className="text-[var(--ink)]">
                  {editing?.role === "ADMIN"
                    ? "Admin"
                    : editing?.role === "MANAGER"
                      ? "Manager"
                      : "Staff"}
                </strong>
                {" · "}
                Timesheet Approver:{" "}
                <strong className="text-[var(--ink)]">
                  {editing?.timesheetApprover?.name ?? "—"}
                </strong>
                {" · "}
                SIL Approver:{" "}
                <strong className="text-[var(--ink)]">
                  {editing?.silApprover?.name ?? "—"}
                </strong>
                <span className="block text-xs">
                  Only Admin can change access type and approver assignments.
                </span>
              </div>
            )}
            <fieldset className="md:col-span-2 rounded-xl border border-[var(--line)] p-3">
              <legend className="px-1 text-sm font-medium">Entitlements</legend>
              <p className="mb-2 text-xs text-[var(--muted)]">
                Casual typically has no AL accrual, SL accrual, or public holiday.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="entitleAlAccrual"
                    key={`al-${editing?.id ?? "x"}-${editing?.entitleAlAccrual}`}
                    defaultChecked={editing ? editing.entitleAlAccrual : true}
                  />
                  AL accrual
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="entitleSlAccrual"
                    key={`sl-${editing?.id ?? "x"}-${editing?.entitleSlAccrual}`}
                    defaultChecked={editing ? editing.entitleSlAccrual : true}
                  />
                  SL accrual
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="entitlePublicHoliday"
                    key={`ph-${editing?.id ?? "x"}-${editing?.entitlePublicHoliday}`}
                    defaultChecked={editing ? editing.entitlePublicHoliday : true}
                  />
                  Public holiday
                </label>
              </div>
            </fieldset>
            <div className="md:col-span-2">
              <Button type="submit">Save employment</Button>
            </div>
          </>
        )}
      </form>

      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Access</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Timesheet Approver</th>
              <th className="px-4 py-3">SIL Approver</th>
              <th className="px-4 py-3">Entitlements</th>
              <th className="px-4 py-3">Start / End</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {people.map((p) => (
              <tr key={p.id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3 font-medium">
                  {p.name}
                  <div className="text-xs text-[var(--muted)]">{p.email}</div>
                </td>
                <td className="px-4 py-3 text-xs">
                  {p.role === "ADMIN"
                    ? "Admin"
                    : p.role === "MANAGER"
                      ? "Manager"
                      : "Staff"}
                </td>
                <td className="px-4 py-3">
                  {statusLabel(p.employmentStatus)} ·{" "}
                  {p.employmentType === "PART_TIME" ? "PT" : "FT"}
                </td>
                <td className="px-4 py-3 text-xs">
                  {p.timesheetApprover?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-xs">{p.silApprover?.name ?? "—"}</td>
                <td className="px-4 py-3 text-xs">
                  {[
                    p.entitleAlAccrual ? "AL" : null,
                    p.entitleSlAccrual ? "SL" : null,
                    p.entitlePublicHoliday ? "PH" : null,
                  ]
                    .filter(Boolean)
                    .join(" · ") || "—"}
                </td>
                <td className="px-4 py-3 text-xs">
                  {format(p.startDate, "dd MMM yyyy")}
                  {p.endDate ? ` → ${format(p.endDate, "dd MMM yyyy")}` : ""}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/people?edit=${p.id}`}
                    className="text-[var(--brand)] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
