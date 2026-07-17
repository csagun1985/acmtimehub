import Link from "next/link";
import { format } from "date-fns";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { cancelOwnRequest } from "@/lib/actions";
import { Button, PageHeader } from "@/components/ui";

const typeLabel: Record<string, string> = {
  AL: "Annual Leave",
  SL: "Sick Leave",
  DIL_CREDIT: "DIL OT Credit",
  DIL_USE: "DIL Use",
};

export default async function RequestsPage() {
  const session = await requireSession();
  const requests = await prisma.leaveRequest.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="My requests"
        subtitle="Track pending and past leave, OT credit, and DIL use."
        action={
          <Link href="/requests/new">
            <Button>New request</Button>
          </Link>
        }
      />

      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Duration</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium">Notes</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--muted)]">
                  No requests yet.
                </td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="border-b border-[var(--line)] last:border-0">
                  <td className="px-4 py-3 font-medium">{typeLabel[r.type]}</td>
                  <td className="px-4 py-3">
                    {format(r.startDate, "dd MMM yyyy")}
                    {r.type !== "DIL_CREDIT" &&
                    format(r.startDate, "yyyy-MM-dd") !==
                      format(r.endDate, "yyyy-MM-dd")
                      ? ` – ${format(r.endDate, "dd MMM yyyy")}`
                      : ""}
                    {r.isHalfDay ? " (½ day)" : ""}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {r.type.startsWith("DIL") ? `${r.amount}h` : `${r.amount}d`}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                    {r.medCertRequired && !r.medCertPath ? (
                      <div className="mt-1 text-xs text-[var(--warn)]">Med cert needed</div>
                    ) : null}
                    {r.medCertPath ? (
                      <a
                        href={`/api/med-cert/${r.id}`}
                        className="mt-1 block text-xs text-[var(--brand)]"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View cert
                      </a>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-[var(--muted)]">
                    {format(r.createdAt, "dd MMM yyyy HH:mm")}
                  </td>
                  <td className="px-4 py-3 text-[var(--muted)]">
                    {r.reason || r.notes || "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === "PENDING" ? (
                      <form
                        action={async () => {
                          "use server";
                          await cancelOwnRequest(r.id);
                        }}
                      >
                        <Button type="submit" variant="secondary">
                          Cancel
                        </Button>
                      </form>
                    ) : r.medCertRequired && !r.medCertPath ? (
                      <Link
                        href={`/requests/${r.id}/med-cert`}
                        className="text-[var(--brand)]"
                      >
                        Upload cert
                      </Link>
                    ) : null}
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

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-800",
    APPROVED: "bg-emerald-50 text-emerald-800",
    REJECTED: "bg-red-50 text-red-800",
    CANCELLED: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${colors[status] ?? ""}`}
    >
      {status}
    </span>
  );
}
