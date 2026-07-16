import {
  addDays,
  endOfDay,
  format,
  parseISO,
  startOfDay,
  startOfWeek,
} from "date-fns";

const SYDNEY = "Australia/Sydney";

function sydneyParts(date: Date) {
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone: SYDNEY,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(date).map((p) => [p.type, p.value])
  );
  return {
    ymd: `${parts.year}-${parts.month}-${parts.day}`,
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

/** Monday of the (Sydney) calendar week containing `date`. */
export function getWeekStart(date: Date = new Date()): Date {
  const { ymd } = sydneyParts(date);
  const asLocal = startOfDay(parseISO(ymd));
  return startOfWeek(asLocal, { weekStartsOn: 1 });
}

export function getWeekEnd(weekStart: Date): Date {
  return endOfDay(addDays(weekStart, 6));
}

export function weekDays(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => startOfDay(addDays(weekStart, i)));
}

/** Convert Sydney wall-clock date+time → UTC Date. */
export function sydneyWallTimeToUtc(
  ymd: string,
  hour: number,
  minute: number
): Date {
  const base = Date.parse(`${ymd}T00:00:00.000Z`);
  for (let offsetMin = -14 * 60; offsetMin <= 14 * 60; offsetMin++) {
    const candidate = new Date(
      base + hour * 3_600_000 + minute * 60_000 - offsetMin * 60_000
    );
    const p = sydneyParts(candidate);
    if (p.ymd === ymd && p.hour === hour && p.minute === minute) {
      return candidate;
    }
  }
  return new Date(
    `${ymd}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+10:00`
  );
}

/**
 * Deadline for a Mon–Sun week = following Monday 12:00 Australia/Sydney.
 */
export function getSubmitDeadline(weekStart: Date): Date {
  const nextMondayYmd = format(addDays(startOfDay(weekStart), 7), "yyyy-MM-dd");
  return sydneyWallTimeToUtc(nextMondayYmd, 12, 0);
}

export function isLateSubmission(
  weekStart: Date,
  submittedAt: Date = new Date()
): boolean {
  return submittedAt.getTime() > getSubmitDeadline(weekStart).getTime();
}

export function formatWeekLabel(weekStart: Date): string {
  const end = addDays(weekStart, 6);
  return `${format(weekStart, "dd MMM")} – ${format(end, "dd MMM yyyy")}`;
}

export function weekStartFromParam(weekParam?: string): Date {
  if (weekParam && /^\d{4}-\d{2}-\d{2}$/.test(weekParam)) {
    const d = startOfDay(parseISO(weekParam));
    return startOfWeek(d, { weekStartsOn: 1 });
  }
  return getWeekStart(new Date());
}
