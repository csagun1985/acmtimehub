import { format } from "date-fns";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getFiscalYear, getFiscalYearBounds } from "@/lib/leave/fiscal";
import { formatWeekLabel } from "@/lib/timesheet/week";
import { PageHeader } from "@/components/ui";

export default async function AdminTimesheetExportPage({
  searchParams,
}: {
  searchParams: Promise<{ fy?: string }>;
}) {
  await requireRole("ADMIN");
  const params = await searchParams;
  const fy = params.fy || getFiscalYear(new Date());
  const { start, end } = getFiscalYearBounds(fy);

  const weeks = await prisma.timesheetWeek.findMany({
    where: {
      status: "APPROVED",
      weekStart: { gte: start, lte: end },
    },
    include: { user: true, days: { orderBy: { date: "asc" } } },
    orderBy: [{ weekStart: "asc" }, { user: { name: "asc" } }],
  });

  const header = [
    "WeekStart",
    "WeekEnd",
    "FiscalYear",
    "Name",
    "Email",
    "State",
    "EmploymentType",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
    "WeekTotal",
    "DilOtCredited",
    "Late",
    "ApprovedAt",
    "WeekNote",
  ];

  const rows = weeks.map((w) => {
    const byDow: Record<number, number> = {};
    for (const d of w.days) byDow[d.weekday] = d.hours;
    // weekday: 0=Sun ... 6=Sat; export Mon-Sun order
    const monSun = [1, 2, 3, 4, 5, 6, 0].map((dow) => byDow[dow] ?? 0);
    return [
      format(w.weekStart, "yyyy-MM-dd"),
      format(w.weekEnd, "yyyy-MM-dd"),
      fy,
      w.user.name,
      w.user.email,
      w.user.state,
      w.user.employmentType,
      ...monSun,
      w.weekTotalHours,
      w.dilHoursCredited,
      w.isLate ? "Y" : "N",
      w.reviewedAt ? format(w.reviewedAt, "yyyy-MM-dd HH:mm") : "",
      JSON.stringify(w.weekNote ?? ""),
    ].join(",");
  });

  const csv = [header.join(","), ...rows].join("\n");

  return (
    <div>
      <PageHeader
        title="Timesheet export"
        subtitle={`Approved weeks for ${fy}. CSV download for payroll.`}
      />

      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <a
          href="/admin/timesheets?fy=FY2027"
          className="rounded-md border border-[var(--line)] px-3 py-1.5"
        >
          FY2027
        </a>
        <a
          href="/admin/timesheets?fy=FY2028"
          className="rounded-md border border-[var(--line)] px-3 py-1.5"
        >
          FY2028
        </a>
      </div>

      <div className="mb-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <p className="text-sm text-[var(--muted)]">
          {weeks.length} approved week-row{weeks.length === 1 ? "" : "s"} in {fy}.
        </p>
        <a
          className="mt-3 inline-block rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white"
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}
          download={`timesheets-${fy}.csv`}
        >
          Download CSV
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Person</th>
              <th className="px-4 py-3">Week</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">DIL OT</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((w) => (
              <tr key={w.id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3">{w.user.name}</td>
                <td className="px-4 py-3">{formatWeekLabel(w.weekStart)}</td>
                <td className="px-4 py-3 tabular-nums">{w.weekTotalHours}h</td>
                <td className="px-4 py-3 tabular-nums">{w.dilHoursCredited}h</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
