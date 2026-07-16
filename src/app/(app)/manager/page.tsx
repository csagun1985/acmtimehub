import { format } from "date-fns";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { reviewRequest } from "@/lib/actions";
import { Button, PageHeader, inputClass } from "@/components/ui";

const typeLabel: Record<string, string> = {
  AL: "Annual Leave",
  SL: "Sick Leave",
  DIL_CREDIT: "DIL OT Credit",
  DIL_USE: "DIL Use",
};

export default async function ManagerPage() {
  const session = await requireRole("MANAGER", "ADMIN");
  const isAdmin = session.user.role === "ADMIN";
  const pending = await prisma.leaveRequest.findMany({
    where: {
      status: "PENDING",
      ...(isAdmin
        ? {}
        : { user: { silApproverId: session.user.id } }),
    },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="SIL Approvals"
        subtitle={`${pending.length} pending request${pending.length === 1 ? "" : "s"}${
          isAdmin ? "" : " assigned to you"
        }`}
      />

      <div className="space-y-4">
        {pending.length === 0 ? (
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
            Inbox clear — no pending requests.
          </div>
        ) : (
          pending.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">
                    {r.user.name}{" "}
                    <span className="text-sm font-normal text-[var(--muted)]">
                      · {r.user.state}
                    </span>
                  </h3>
                  <p className="mt-1 text-sm">
                    <strong>{typeLabel[r.type]}</strong> ·{" "}
                    {format(r.startDate, "dd MMM yyyy")}
                    {format(r.startDate, "yyyy-MM-dd") !==
                    format(r.endDate, "yyyy-MM-dd")
                      ? ` – ${format(r.endDate, "dd MMM yyyy")}`
                      : ""}
                    {r.isHalfDay ? " (½ day)" : ""} ·{" "}
                    {r.type.startsWith("DIL") ? `${r.amount}h` : `${r.amount}d`}
                  </p>
                  {r.reason ? (
                    <p className="mt-1 text-sm text-[var(--muted)]">Reason: {r.reason}</p>
                  ) : null}
                  {r.notes ? (
                    <p className="mt-1 text-sm text-[var(--muted)]">Notes: {r.notes}</p>
                  ) : null}
                  {r.medCertRequired ? (
                    <p className="mt-1 text-xs text-[var(--warn)]">
                      Med cert required
                      {r.medCertPath ? " — uploaded" : " — not uploaded yet"}
                    </p>
                  ) : null}
                </div>
                <div className="flex gap-2">
                  <form action={reviewRequest}>
                    <input type="hidden" name="requestId" value={r.id} />
                    <input type="hidden" name="decision" value="APPROVE" />
                    <Button type="submit">Approve</Button>
                  </form>
                </div>
              </div>
              <form action={reviewRequest} className="mt-4 flex flex-wrap items-end gap-2">
                <input type="hidden" name="requestId" value={r.id} />
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
          ))
        )}
      </div>
    </div>
  );
}
