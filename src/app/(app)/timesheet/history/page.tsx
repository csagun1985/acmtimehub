import Link from "next/link";
import { format } from "date-fns";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { formatWeekLabel } from "@/lib/timesheet/week";
import { PageHeader } from "@/components/ui";

export default async function TimesheetHistoryPage() {
  const session = await requireSession();
  const weeks = await prisma.timesheetWeek.findMany({
    where: { userId: session.user.id },
    orderBy: { weekStart: "desc" },
    take: 52,
  });

  return (
    <div>
      <PageHeader
        title="Timesheet history"
        subtitle="Past weekly timesheets and DIL OT credited on approval."
        action={
          <Link href="/timesheet" className="text-sm font-medium text-[var(--brand)]">
            ← This week
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Week</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">DIL OT</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {weeks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--muted)]">
                  No timesheets yet.
                </td>
              </tr>
            ) : (
              weeks.map((w) => (
                <tr key={w.id} className="border-b border-[var(--line)] last:border-0">
                  <td className="px-4 py-3">
                    <Link
                      href={`/timesheet?week=${format(w.weekStart, "yyyy-MM-dd")}`}
                      className="font-medium text-[var(--brand)]"
                    >
                      {formatWeekLabel(w.weekStart)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{w.weekTotalHours}h</td>
                  <td className="px-4 py-3 tabular-nums">{w.dilHoursCredited}h</td>
                  <td className="px-4 py-3">
                    {w.status}
                    {w.isLate ? (
                      <span className="ml-2 text-xs text-[var(--warn)]">LATE</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {w.submittedAt ? format(w.submittedAt, "dd MMM yyyy HH:mm") : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
