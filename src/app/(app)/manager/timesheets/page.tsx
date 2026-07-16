import { format } from "date-fns";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { reviewTimesheet } from "@/lib/timesheet/actions";
import { calculateDilOt } from "@/lib/timesheet/ot";
import { getHourStandards } from "@/lib/timesheet/standards";
import { formatWeekLabel } from "@/lib/timesheet/week";
import { Button, PageHeader, inputClass } from "@/components/ui";

export default async function ManagerTimesheetsPage() {
  const session = await requireRole("MANAGER", "ADMIN");
  const isAdmin = session.user.role === "ADMIN";
  const pending = await prisma.timesheetWeek.findMany({
    where: {
      status: "SUBMITTED",
      ...(isAdmin
        ? {}
        : { user: { timesheetApproverId: session.user.id } }),
    },
    include: {
      user: true,
      days: { orderBy: { date: "asc" } },
    },
    orderBy: [{ isLate: "desc" }, { submittedAt: "asc" }],
  });

  return (
    <div>
      <PageHeader
        title="Timesheet approvals"
        subtitle={`${pending.length} pending week${pending.length === 1 ? "" : "s"}${
          isAdmin ? "" : " assigned to you"
        }`}
      />

      <div className="space-y-4">
        {pending.length === 0 ? (
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
            No timesheets waiting for approval.
          </div>
        ) : (
          pending.map((w) => {
            const standards = getHourStandards(w.user.employmentType);
            const ot = calculateDilOt(
              w.user.employmentType,
              w.days.map((d) => ({ date: d.date, hours: d.hours, isOff: d.isOff }))
            );
            return (
              <div
                key={w.id}
                className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">
                      {w.user.name}{" "}
                      <span className="text-sm font-normal text-[var(--muted)]">
                        · {w.user.employmentType === "PART_TIME" ? "PT" : "FT"} ·{" "}
                        {standards.daily}/{standards.weekly}h
                      </span>
                      {w.isLate ? (
                        <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-[var(--warn)]">
                          LATE
                        </span>
                      ) : null}
                    </h3>
                    <p className="mt-1 text-sm">
                      {formatWeekLabel(w.weekStart)} · Total{" "}
                      <strong>{ot.weekTotal}h</strong> · Est. DIL OT{" "}
                      <strong>{ot.dilHours}h</strong>
                    </p>
                    {w.weekNote ? (
                      <p className="mt-1 text-sm text-[var(--muted)]">Note: {w.weekNote}</p>
                    ) : null}
                    <ul className="mt-2 grid gap-1 text-xs text-[var(--muted)] sm:grid-cols-2">
                      {w.days.map((d) => (
                        <li key={d.id}>
                          {format(d.date, "EEE dd")}: {d.hours}h
                          {d.isOff ? " (Off)" : ""}
                          {d.note ? ` — ${d.note}` : ""}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <form action={reviewTimesheet}>
                    <input type="hidden" name="weekId" value={w.id} />
                    <input type="hidden" name="decision" value="APPROVE" />
                    <Button type="submit">Approve</Button>
                  </form>
                </div>
                <form action={reviewTimesheet} className="mt-4 flex flex-wrap items-end gap-2">
                  <input type="hidden" name="weekId" value={w.id} />
                  <input type="hidden" name="decision" value="REJECT" />
                  <input
                    name="rejectionReason"
                    placeholder="Rejection reason"
                    className={`${inputClass} max-w-md`}
                  />
                  <Button type="submit" variant="danger">
                    Reject
                  </Button>
                </form>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
