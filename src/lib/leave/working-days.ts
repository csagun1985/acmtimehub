import { eachDayOfInterval, endOfDay, format, startOfDay } from "date-fns";
import type { AuState } from "@/lib/types";
import { getHolidayKeys, isWeekend } from "./holidays";

/**
 * Count leave days between start and end (inclusive):
 * - Weekdays only
 * - Exclude Australian public holidays for the staff member's state (if entitled)
 * - Half-day on a single eligible day = 0.5
 */
export async function countLeaveDays(options: {
  state: AuState;
  startDate: Date;
  endDate: Date;
  isHalfDay?: boolean;
  /** When false (e.g. Casual), public holidays are not excluded */
  excludePublicHolidays?: boolean;
}): Promise<number> {
  const start = startOfDay(options.startDate);
  const end = endOfDay(options.endDate);
  const excludePh = options.excludePublicHolidays !== false;
  const holidayKeys = excludePh
    ? await getHolidayKeys(options.state, start, end)
    : new Set<string>();

  const eligible = eachDayOfInterval({ start, end }).filter((d) => {
    if (isWeekend(d)) return false;
    const key = format(d, "yyyy-MM-dd");
    return !holidayKeys.has(key);
  });

  if (eligible.length === 0) return 0;
  if (options.isHalfDay) {
    if (eligible.length !== 1) {
      throw new Error("Half-day leave must be a single eligible working day.");
    }
    return 0.5;
  }
  return eligible.length;
}
