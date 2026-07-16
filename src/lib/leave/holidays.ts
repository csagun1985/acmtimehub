import Holidays from "date-holidays";
import { eachDayOfInterval, endOfDay, format, startOfDay } from "date-fns";
import type { AuState } from "@/lib/types";
import { prisma } from "@/lib/prisma";

const STATE_REGION: Record<AuState, string> = {
  NSW: "AU-NSW",
  VIC: "AU-VIC",
  QLD: "AU-QLD",
  SA: "AU-SA",
  WA: "AU-WA",
  TAS: "AU-TAS",
  ACT: "AU-ACT",
  NT: "AU-NT",
};

function holidaySetFromLib(state: AuState, year: number): Map<string, string> {
  const region = STATE_REGION[state];
  if (!region) return new Map();
  const hd = new Holidays(region);
  const list = hd.getHolidays(year);
  const map = new Map<string, string>();
  for (const h of list) {
    if (h.type !== "public") continue;
    const key = format(new Date(h.date), "yyyy-MM-dd");
    map.set(key, h.name);
  }
  return map;
}

/** Ensure public holidays for a state/year exist in DB (seed from date-holidays). */
export async function ensurePublicHolidays(state: AuState, year: number) {
  const map = holidaySetFromLib(state, year);
  for (const [dateKey, name] of map) {
    const date = startOfDay(new Date(dateKey + "T00:00:00"));
    await prisma.publicHoliday.upsert({
      where: { date_state: { date, state } },
      create: { date, state, name },
      update: { name },
    });
  }
}

export async function getHolidayKeys(
  state: AuState,
  start: Date,
  end: Date
): Promise<Set<string>> {
  const years = new Set<number>();
  for (const d of eachDayOfInterval({ start: startOfDay(start), end: endOfDay(end) })) {
    years.add(d.getFullYear());
  }
  for (const y of years) {
    await ensurePublicHolidays(state, y);
  }

  const rows = await prisma.publicHoliday.findMany({
    where: {
      state,
      date: { gte: startOfDay(start), lte: endOfDay(end) },
    },
  });
  return new Set(rows.map((r) => format(r.date, "yyyy-MM-dd")));
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}
