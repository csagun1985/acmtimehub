import { format } from "date-fns";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getAlSlBalances } from "@/lib/leave/accrual";
import { getDilBalance } from "@/lib/leave/dil";
import { PageHeader } from "@/components/ui";

export default async function ReportsPage() {
  await requireRole("ADMIN");
  const people = await prisma.user.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const snapshot = await Promise.all(
    people.map(async (p) => {
      const [b, dil] = await Promise.all([
        getAlSlBalances(p.id),
        getDilBalance(p.id),
      ]);
      return { p, b, dil };
    })
  );

  const taken = await prisma.leaveRequest.findMany({
    where: { status: "APPROVED" },
    include: { user: true },
    orderBy: { startDate: "desc" },
    take: 100,
  });

  const missingCert = await prisma.leaveRequest.findMany({
    where: {
      type: "SL",
      medCertRequired: true,
      medCertPath: null,
      status: { in: ["PENDING", "APPROVED"] },
    },
    include: { user: true },
  });

  const csvRows = [
    ["Name", "Email", "State", "Role", "AL Accrued", "AL Remaining", "SL Accrued", "SL Remaining", "DIL Earned", "DIL Remaining"].join(","),
    ...snapshot.map(({ p, b, dil }) =>
      [
        p.name,
        p.email,
        p.state,
        p.role,
        b.al.accrued + b.al.opening,
        b.al.remaining,
        b.sl.accrued + b.sl.opening,
        b.sl.remaining,
        dil.earned,
        dil.remaining,
      ].join(",")
    ),
  ].join("\n");

  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Balance snapshot, recent approved leave, and SL without medical certificate."
      />

      <div className="mb-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
        <h2 className="font-semibold">Export balance snapshot (CSV)</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Copy or download the current accrued/remaining figures.
        </p>
        <a
          className="mt-3 inline-block rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white"
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(csvRows)}`}
          download={`sil-balances-${format(new Date(), "yyyy-MM-dd")}.csv`}
        >
          Download CSV
        </a>
      </div>

      {missingCert.length > 0 ? (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-[var(--warn)]">
            Sick leave missing medical certificate ({missingCert.length})
          </h2>
          <ul className="mt-2 space-y-1 text-sm">
            {missingCert.map((r) => (
              <li key={r.id}>
                {r.user.name} · {format(r.startDate, "dd MMM yyyy")} –{" "}
                {format(r.endDate, "dd MMM yyyy")} · {r.status}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <h2 className="mb-2 font-semibold">Recent approved leave</h2>
      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Person</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {taken.map((r) => (
              <tr key={r.id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3">{r.user.name}</td>
                <td className="px-4 py-3">{r.type}</td>
                <td className="px-4 py-3">
                  {format(r.startDate, "dd MMM yyyy")}
                  {format(r.startDate, "yyyy-MM-dd") !== format(r.endDate, "yyyy-MM-dd")
                    ? ` – ${format(r.endDate, "dd MMM yyyy")}`
                    : ""}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {r.type.startsWith("DIL") ? `${r.amount}h` : `${r.amount}d`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
