import { format } from "date-fns";
import { requireSession } from "@/lib/session";
import { getActivityHistory } from "@/lib/audit/history";
import { PageHeader } from "@/components/ui";

export default async function HistoryPage() {
  const session = await requireSession();
  const rows = await getActivityHistory(
    { id: session.user.id, role: session.user.role },
    120
  );

  const subtitle =
    session.user.role === "ADMIN"
      ? "Full activity log — submissions, approvals, and profile changes."
      : session.user.role === "MANAGER"
        ? "Activity for you and people you are assigned to approve."
        : "Your leave and timesheet activity — use this as proof of submission.";

  return (
    <div>
      <PageHeader title="History" subtitle={subtitle} />

      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Person</th>
              <th className="px-4 py-3 font-medium">By</th>
              <th className="px-4 py-3 font-medium">Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-8 text-center text-[var(--muted)]"
                >
                  No activity yet.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-[var(--line)] last:border-0"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">
                    {format(r.createdAt, "dd MMM yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-3 font-medium">{r.actionLabel}</td>
                  <td className="px-4 py-3">{r.subjectName ?? "—"}</td>
                  <td className="px-4 py-3">{r.actorName}</td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {r.summary || "—"}
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
