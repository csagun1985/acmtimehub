import { differenceInCalendarDays, startOfDay } from "date-fns";

export type UserEligibilityFields = {
  employmentStatus: string;
  probationEndDate: Date | null;
  entitleAlAccrual?: boolean;
  entitleSlAccrual?: boolean;
  endDate?: Date | null;
};

/** Whether the person may request/use a leave type based on entitlements + employment. */
export function canUseLeaveType(
  user: UserEligibilityFields,
  leaveType: "AL" | "SL",
  asOf: Date = new Date()
): boolean {
  if (leaveType === "AL" && user.entitleAlAccrual === false) return false;
  if (leaveType === "SL" && user.entitleSlAccrual === false) return false;

  // Casual never uses AL/SL unless entitlements were explicitly turned on above
  if (user.employmentStatus === "CASUAL") {
    return leaveType === "AL"
      ? user.entitleAlAccrual === true
      : user.entitleSlAccrual === true;
  }

  if (user.endDate && startOfDay(asOf) > startOfDay(user.endDate)) return false;

  if (user.employmentStatus === "PERMANENT") return true;
  if (user.probationEndDate) {
    return startOfDay(asOf) >= startOfDay(user.probationEndDate);
  }
  return false;
}

/** @deprecated prefer canUseLeaveType — kept for callers checking both AL+SL eligibility banner */
export function canUseAlSl(
  user: UserEligibilityFields,
  asOf: Date = new Date()
): boolean {
  return canUseLeaveType(user, "AL", asOf) || canUseLeaveType(user, "SL", asOf);
}

export function eligibilityMessage(
  user: UserEligibilityFields,
  leaveType?: "AL" | "SL"
): string {
  if (leaveType === "AL" && user.entitleAlAccrual === false) {
    return "You are not entitled to Annual Leave accrual under your employment arrangement.";
  }
  if (leaveType === "SL" && user.entitleSlAccrual === false) {
    return "You are not entitled to Sick Leave accrual under your employment arrangement.";
  }
  if (
    user.employmentStatus === "CASUAL" &&
    user.entitleAlAccrual === false &&
    user.entitleSlAccrual === false
  ) {
    return "Casual employment does not include Annual Leave or Sick Leave entitlements.";
  }
  if (user.endDate && startOfDay(new Date()) > startOfDay(user.endDate)) {
    return "Your employment end date has passed. Leave requests are no longer available.";
  }
  if (canUseAlSl(user)) return "";
  if (user.probationEndDate) {
    return `AL and SL can be used after your probation ends (${user.probationEndDate.toISOString().slice(0, 10)}) or when you are converted to Permanent.`;
  }
  return "AL and SL can be used after you pass probation or are converted to Permanent status. Leave still accrues from your contract start date.";
}

/**
 * Minimum notice (calendar days) before AL start date, based on leave duration.
 * - 1 day (or half-day): at least 3 days before
 * - 2 days: at least 2 weeks (14 days) before
 * - 3+ days: at least 4 weeks (28 days) before
 */
export function requiredAlNoticeDays(amountDays: number): number {
  if (amountDays <= 1) return 3;
  if (amountDays <= 2) return 14;
  return 28;
}

export function assertAlNoticePeriod(
  amountDays: number,
  leaveStart: Date,
  asOf: Date = new Date()
): void {
  const required = requiredAlNoticeDays(amountDays);
  const daysAhead = differenceInCalendarDays(
    startOfDay(leaveStart),
    startOfDay(asOf)
  );
  if (daysAhead < required) {
    const label =
      amountDays <= 1
        ? "1 day of AL"
        : amountDays <= 2
          ? "2 days of AL"
          : "3 or more days of AL";
    throw new Error(
      `${label} must be requested at least ${required} day${required === 1 ? "" : "s"} before the start date. This request is only ${daysAhead} day${daysAhead === 1 ? "" : "s"} ahead.`
    );
  }
}
