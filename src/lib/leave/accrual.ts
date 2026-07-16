import { LedgerKind } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import {
  getFiscalYear,
  getFiscalYearBounds,
  monthsWorkedInFiscalYear,
} from "./fiscal";

export const AL_ANNUAL = 20;
export const SL_ANNUAL = 10;
export const AL_PER_MONTH = AL_ANNUAL / 12;
export const SL_PER_MONTH = SL_ANNUAL / 12;

export function expectedAccrualDays(
  leaveType: "AL" | "SL",
  startDate: Date,
  fiscalYear: string,
  asOf: Date = new Date()
): number {
  const months = monthsWorkedInFiscalYear(startDate, fiscalYear, asOf);
  const perMonth = leaveType === "AL" ? AL_PER_MONTH : SL_PER_MONTH;
  return Math.round(months * perMonth * 1000) / 1000;
}

/** Sum ledger credits/debits for AL or SL in a fiscal year. */
export async function ledgerSum(
  userId: string,
  leaveType: "AL" | "SL",
  fiscalYear: string
): Promise<number> {
  const agg = await prisma.leaveLedger.aggregate({
    where: { userId, leaveType, fiscalYear },
    _sum: { amount: true },
  });
  return agg._sum.amount ?? 0;
}

/**
 * Ensure ACCRUAL ledger rows reflect entitlement earned to date.
 * Opening + adjustments + usage stay as separate rows.
 * Accrual is stored as a single "true-up" ACCRUAL row per FY (idempotent replace).
 */
export async function syncAccrualForUser(
  userId: string,
  asOf: Date = new Date()
): Promise<void> {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  const fiscalYear = getFiscalYear(asOf);
  const { start: fyStart } = getFiscalYearBounds(fiscalYear);

  // Accrual starts only from FY go-live / membership
  if (user.startDate > asOf) return;

  // Cap accrual as-of date at employment end
  const effectiveAsOf =
    user.endDate && user.endDate < asOf ? user.endDate : asOf;

  for (const leaveType of ["AL", "SL"] as const) {
    const entitled =
      leaveType === "AL" ? user.entitleAlAccrual : user.entitleSlAccrual;

    await prisma.leaveLedger.deleteMany({
      where: { userId, leaveType, fiscalYear, kind: LedgerKind.ACCRUAL },
    });

    if (!entitled) continue;

    const expected = expectedAccrualDays(
      leaveType,
      user.startDate,
      fiscalYear,
      effectiveAsOf
    );
    if (expected > 0) {
      await prisma.leaveLedger.create({
        data: {
          userId,
          leaveType,
          kind: LedgerKind.ACCRUAL,
          amount: expected,
          fiscalYear,
          note: `Accrued to ${effectiveAsOf.toISOString().slice(0, 10)} (from ${user.startDate.toISOString().slice(0, 10)}, FY starts ${fyStart.toISOString().slice(0, 10)})`,
        },
      });
    }
  }
}

export type BalanceSnapshot = {
  leaveType: "AL" | "SL";
  fiscalYear: string;
  accrued: number;
  remaining: number;
  opening: number;
  used: number;
  adjustments: number;
};

export async function getAlSlBalances(
  userId: string,
  asOf: Date = new Date()
): Promise<{ al: BalanceSnapshot; sl: BalanceSnapshot }> {
  await syncAccrualForUser(userId, asOf);
  const fiscalYear = getFiscalYear(asOf);

  async function snap(leaveType: "AL" | "SL"): Promise<BalanceSnapshot> {
    const rows = await prisma.leaveLedger.findMany({
      where: { userId, leaveType, fiscalYear },
    });
    let accrued = 0;
    let opening = 0;
    let used = 0;
    let adjustments = 0;
    for (const r of rows) {
      if (r.kind === LedgerKind.ACCRUAL) accrued += r.amount;
      else if (r.kind === LedgerKind.OPENING) opening += r.amount;
      else if (r.kind === LedgerKind.USAGE) used += Math.abs(r.amount);
      else if (r.kind === LedgerKind.ADJUSTMENT) adjustments += r.amount;
      else if (r.kind === LedgerKind.FORFEIT) adjustments += r.amount;
    }
    const remaining =
      Math.round((accrued + opening + adjustments - used) * 1000) / 1000;
    return {
      leaveType,
      fiscalYear,
      accrued: Math.round(accrued * 1000) / 1000,
      remaining: Math.max(0, remaining),
      opening,
      used: Math.round(used * 1000) / 1000,
      adjustments,
    };
  }

  return { al: await snap("AL"), sl: await snap("SL") };
}
