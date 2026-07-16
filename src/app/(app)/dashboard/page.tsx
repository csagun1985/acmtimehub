import Link from "next/link";
import { format } from "date-fns";
import { requireSession } from "@/lib/session";
import { getAlSlBalances } from "@/lib/leave/accrual";
import { getDilBalance } from "@/lib/leave/dil";
import { getFiscalYear } from "@/lib/leave/fiscal";
import { canUseAlSl, eligibilityMessage } from "@/lib/leave/eligibility";
import { BalanceCard, Button, PageHeader } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await requireSession();
  const dbUser = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });
  const [balances, dil, pending] = await Promise.all([
    getAlSlBalances(session.user.id),
    getDilBalance(session.user.id),
    prisma.leaveRequest.count({
      where: { userId: session.user.id, status: "PENDING" },
    }),
  ]);

  const dilHint = dil.expiringSoon
    ? `${dil.expiringSoon.hours}h expire on ${format(dil.expiringSoon.expiresAt, "dd MMM yyyy")}`
    : undefined;
  const eligible = canUseAlSl(dbUser);

  return (
    <div>
      <PageHeader
        title={`Hello, ${session.user.name.split(" ")[0]}`}
        subtitle={`Fiscal ${getFiscalYear()} · ${session.user.state} public holidays · Accrued and remaining shown for each type`}
        action={
          <Link href="/requests/new">
            <Button>Request leave</Button>
          </Link>
        }
      />

      {!eligible ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-[var(--warn)]">
          {eligibilityMessage(dbUser)} Accrual continues from your contract start date.
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        <BalanceCard
          title="Annual Leave"
          color="var(--al)"
          accruedLabel="Accrued to date"
          accrued={balances.al.accrued + balances.al.opening}
          remaining={balances.al.remaining}
          unit="days"
        />
        <BalanceCard
          title="Sick Leave"
          color="var(--sl)"
          accruedLabel="Accrued to date"
          accrued={balances.sl.accrued + balances.sl.opening}
          remaining={balances.sl.remaining}
          unit="days"
        />
        <BalanceCard
          title="Day in Lieu"
          color="var(--dil)"
          accruedLabel="Hours earned"
          accrued={dil.earned}
          remaining={dil.remaining}
          unit="hrs"
          hint={dilHint}
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <h2 className="font-semibold">Quick actions</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/requests/new?type=AL">
              <Button variant="secondary">Book AL</Button>
            </Link>
            <Link href="/requests/new?type=SL">
              <Button variant="secondary">Book SL</Button>
            </Link>
            <Link href="/requests/new?type=DIL_USE">
              <Button variant="secondary">Use DIL</Button>
            </Link>
            <Link href="/timesheet">
              <Button variant="secondary">Timesheet</Button>
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <h2 className="font-semibold">Status</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            You have <strong className="text-[var(--ink)]">{pending}</strong> pending
            request{pending === 1 ? "" : "s"}. Medical certificates are required for
            sick leave of 2 or more consecutive calendar days.
          </p>
          <Link
            href="/requests"
            className="mt-3 inline-block text-sm font-medium text-[var(--brand)]"
          >
            View my requests →
          </Link>
        </div>
      </div>
    </div>
  );
}
