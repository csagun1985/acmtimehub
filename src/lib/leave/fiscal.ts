import {
  addDays,
  differenceInCalendarDays,
  endOfDay,
  format,
  isBefore,
  isWithinInterval,
  max as maxDate,
  min as minDate,
  parseISO,
  startOfDay,
} from "date-fns";

/** Fiscal year runs 1 Jul – 30 Jun. Label is the ending year, e.g. FY2027 = 1 Jul 2026 – 30 Jun 2027. */
export function getFiscalYear(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-based
  const endYear = month >= 6 ? year + 1 : year;
  return `FY${endYear}`;
}

export function getFiscalYearBounds(fiscalYear: string): { start: Date; end: Date } {
  const endYear = Number(fiscalYear.replace("FY", ""));
  const start = startOfDay(new Date(endYear - 1, 6, 1)); // 1 Jul
  const end = endOfDay(new Date(endYear, 5, 30)); // 30 Jun
  return { start, end };
}

export function currentFiscalYearBounds(asOf: Date = new Date()) {
  return getFiscalYearBounds(getFiscalYear(asOf));
}

export function toDateKey(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function parseDateInput(value: string): Date {
  return startOfDay(parseISO(value));
}

export function monthsWorkedInFiscalYear(
  startDate: Date,
  fiscalYear: string,
  asOf: Date = new Date()
): number {
  const { start: fyStart, end: fyEnd } = getFiscalYearBounds(fiscalYear);
  const periodStart = maxDate([startOfDay(startDate), fyStart]);
  const periodEnd = minDate([endOfDay(asOf), fyEnd]);

  if (isBefore(periodEnd, periodStart)) return 0;

  // Count inclusive months from periodStart month through periodEnd month
  const startY = periodStart.getFullYear();
  const startM = periodStart.getMonth();
  const endY = periodEnd.getFullYear();
  const endM = periodEnd.getMonth();
  return (endY - startY) * 12 + (endM - startM) + 1;
}

export function dilExpiryDate(earnedDate: Date): Date {
  return addDays(startOfDay(earnedDate), 90);
}

export function consecutiveCalendarDays(start: Date, end: Date): number {
  return differenceInCalendarDays(endOfDay(end), startOfDay(start)) + 1;
}

export function isSameOrWithin(date: Date, start: Date, end: Date): boolean {
  return isWithinInterval(startOfDay(date), {
    start: startOfDay(start),
    end: endOfDay(end),
  });
}
