import { addDays, startOfDay } from "date-fns";
import { prisma } from "@/lib/prisma";
import { dilExpiryDate } from "./fiscal";

export type DilSnapshot = {
  earned: number;
  remaining: number;
  expiringSoon: { hours: number; expiresAt: Date } | null;
};

export async function getDilBalance(
  userId: string,
  asOf: Date = new Date()
): Promise<DilSnapshot> {
  const today = startOfDay(asOf);
  const buckets = await prisma.dilBucket.findMany({
    where: { userId },
    orderBy: { earnedDate: "asc" },
  });

  let earned = 0;
  let remaining = 0;
  let expiringSoon: DilSnapshot["expiringSoon"] = null;
  const soon = addDays(today, 7);

  for (const b of buckets) {
    const available = Math.max(0, b.hours - b.usedHours);
    if (b.expiresAt < today) continue; // expired unused
    earned += b.hours;
    remaining += available;
    if (available > 0 && b.expiresAt <= soon) {
      if (!expiringSoon || b.expiresAt < expiringSoon.expiresAt) {
        expiringSoon = { hours: available, expiresAt: b.expiresAt };
      }
    }
  }

  return {
    earned: Math.round(earned * 100) / 100,
    remaining: Math.round(remaining * 100) / 100,
    expiringSoon,
  };
}

export async function createDilBucket(options: {
  userId: string;
  hours: number;
  earnedDate: Date;
  requestId?: string;
  timesheetWeekId?: string;
  note?: string;
}) {
  const earnedDate = startOfDay(options.earnedDate);
  return prisma.dilBucket.create({
    data: {
      userId: options.userId,
      hours: options.hours,
      usedHours: 0,
      earnedDate,
      expiresAt: dilExpiryDate(earnedDate),
      requestId: options.requestId,
      timesheetWeekId: options.timesheetWeekId,
      note: options.note,
    },
  });
}

/** FIFO consume non-expired DIL hours. Throws if insufficient. */
export async function consumeDilHours(
  userId: string,
  hours: number,
  asOf: Date = new Date()
): Promise<void> {
  if (hours <= 0) throw new Error("Hours must be positive.");
  const today = startOfDay(asOf);
  const buckets = await prisma.dilBucket.findMany({
    where: {
      userId,
      expiresAt: { gte: today },
    },
    orderBy: { earnedDate: "asc" },
  });

  let remaining = Math.round(hours * 100) / 100;
  const available = buckets.reduce(
    (s, b) => s + Math.max(0, b.hours - b.usedHours),
    0
  );
  if (available + 1e-9 < remaining) {
    throw new Error(
      `Insufficient DIL balance. Available ${available.toFixed(2)}h, requested ${remaining.toFixed(2)}h.`
    );
  }

  for (const b of buckets) {
    if (remaining <= 0) break;
    const free = Math.round((b.hours - b.usedHours) * 100) / 100;
    if (free <= 0) continue;
    const take = Math.min(free, remaining);
    await prisma.dilBucket.update({
      where: { id: b.id },
      data: { usedHours: Math.round((b.usedHours + take) * 100) / 100 },
    });
    remaining = Math.round((remaining - take) * 100) / 100;
  }
}

export async function addOpeningDilBucket(options: {
  userId: string;
  hours: number;
  earnedDate: Date;
  note?: string;
}) {
  return createDilBucket(options);
}
