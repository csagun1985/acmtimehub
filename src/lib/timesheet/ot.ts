import { format, startOfDay } from "date-fns";
import { getHourStandards } from "./standards";

export type DayInput = {
  date: Date;
  hours: number;
  isOff: boolean;
};

export type OtAllocation = {
  date: Date;
  hours: number;
};

export type OtResult = {
  weekTotal: number;
  dailyOtSum: number;
  weeklyExcess: number;
  dilHours: number;
  /** Buckets to create (earnedDate = day, hours that day). */
  allocations: OtAllocation[];
};

/**
 * DIL OT = max(sum of daily excesses, weekly excess).
 * - Working day: excess = max(0, hours - dailyStandard)
 * - Off day with hours: 100% of hours count as OT
 * Allocations: put daily excesses on their days first; leftover weekly-only OT on last non-empty day.
 */
export function calculateDilOt(
  employmentType: string,
  days: DayInput[]
): OtResult {
  const { daily, weekly } = getHourStandards(employmentType);
  const sorted = [...days].sort(
    (a, b) => startOfDay(a.date).getTime() - startOfDay(b.date).getTime()
  );

  let weekTotal = 0;
  let dailyOtSum = 0;
  const dailyExcessByDate = new Map<string, number>();

  for (const d of sorted) {
    const hours = Math.max(0, Number(d.hours) || 0);
    weekTotal += hours;
    let excess = 0;
    if (d.isOff) {
      excess = hours; // 100% of hours on Off days
    } else if (hours > daily) {
      excess = hours - daily;
    }
    excess = Math.round(excess * 100) / 100;
    if (excess > 0) {
      dailyOtSum += excess;
      const key = format(startOfDay(d.date), "yyyy-MM-dd");
      dailyExcessByDate.set(key, (dailyExcessByDate.get(key) ?? 0) + excess);
    }
  }

  weekTotal = Math.round(weekTotal * 100) / 100;
  dailyOtSum = Math.round(dailyOtSum * 100) / 100;
  const weeklyExcess = Math.round(Math.max(0, weekTotal - weekly) * 100) / 100;
  const dilHours = Math.round(Math.max(dailyOtSum, weeklyExcess) * 100) / 100;

  const allocations: OtAllocation[] = [];
  for (const d of sorted) {
    const key = format(startOfDay(d.date), "yyyy-MM-dd");
    const h = dailyExcessByDate.get(key) ?? 0;
    if (h > 0) {
      allocations.push({ date: startOfDay(d.date), hours: h });
    }
  }

  // If weekly excess > daily OT sum, add remainder to last day with hours (or last day of week)
  if (dilHours > dailyOtSum + 1e-9) {
    const remainder = Math.round((dilHours - dailyOtSum) * 100) / 100;
    const anchor =
      [...sorted].reverse().find((d) => (Number(d.hours) || 0) > 0) ??
      sorted[sorted.length - 1];
    if (anchor) {
      const key = format(startOfDay(anchor.date), "yyyy-MM-dd");
      const existing = allocations.find(
        (a) => format(a.date, "yyyy-MM-dd") === key
      );
      if (existing) existing.hours = Math.round((existing.hours + remainder) * 100) / 100;
      else allocations.push({ date: startOfDay(anchor.date), hours: remainder });
    }
  }

  return {
    weekTotal,
    dailyOtSum,
    weeklyExcess,
    dilHours,
    allocations: allocations.filter((a) => a.hours > 0),
  };
}
