"use server";

import { revalidatePath } from "next/cache";
import { format, startOfDay } from "date-fns";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createDilBucket } from "@/lib/leave/dil";
import { calculateDilOt } from "@/lib/timesheet/ot";
import { TimesheetStatus } from "@/lib/timesheet/standards";
import {
  getWeekEnd,
  getWeekStart,
  isLateSubmission,
  weekDays,
  weekStartFromParam,
} from "@/lib/timesheet/week";
import { canApproveTimesheet } from "@/lib/permissions";

async function actor() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

async function audit(
  actorId: string | null,
  action: string,
  entityType: string,
  entityId?: string,
  detail?: string
) {
  await prisma.auditLog.create({
    data: { actorId: actorId ?? undefined, action, entityType, entityId, detail },
  });
}

export async function getOrCreateTimesheetWeek(
  userId: string,
  weekStartInput?: Date
) {
  const weekStart = startOfDay(weekStartInput ?? getWeekStart());
  const weekEnd = getWeekEnd(weekStart);

  let week = await prisma.timesheetWeek.findUnique({
    where: { userId_weekStart: { userId, weekStart } },
    include: { days: { orderBy: { date: "asc" } } },
  });

  if (!week) {
    week = await prisma.timesheetWeek.create({
      data: {
        userId,
        weekStart,
        weekEnd,
        status: TimesheetStatus.DRAFT,
        days: {
          create: weekDays(weekStart).map((date) => ({
            date,
            weekday: date.getDay(),
            hours: 0,
            isOff: false,
          })),
        },
      },
      include: { days: { orderBy: { date: "asc" } } },
    });
  }

  return week;
}

export async function saveTimesheetDraft(formData: FormData) {
  const user = await actor();
  const weekStart = weekStartFromParam(String(formData.get("weekStart") ?? ""));
  const week = await getOrCreateTimesheetWeek(user.id, weekStart);

  if (week.status === TimesheetStatus.SUBMITTED || week.status === TimesheetStatus.APPROVED) {
    throw new Error("This timesheet is locked. Wait for rejection to edit, or view history.");
  }

  // If rejected, move back to draft on save
  const weekNote = String(formData.get("weekNote") ?? "").trim() || null;
  let weekTotal = 0;

  for (const day of week.days) {
    const key = format(day.date, "yyyy-MM-dd");
    const hours = Math.max(0, Number(formData.get(`hours_${key}`)) || 0);
    const isOff = formData.get(`off_${key}`) === "on";
    const note = String(formData.get(`note_${key}`) ?? "").trim() || null;
    weekTotal += hours;
    await prisma.timesheetDay.update({
      where: { id: day.id },
      data: { hours, isOff, note },
    });
  }

  await prisma.timesheetWeek.update({
    where: { id: week.id },
    data: {
      status: TimesheetStatus.DRAFT,
      weekNote,
      weekTotalHours: Math.round(weekTotal * 100) / 100,
      rejectionReason: null,
    },
  });

  await audit(user.id, "TIMESHEET_SAVED", "TimesheetWeek", week.id);
  revalidatePath("/timesheet");
  revalidatePath("/timesheet/history");
}

export async function submitTimesheet(formData: FormData) {
  const user = await actor();
  const weekStart = weekStartFromParam(String(formData.get("weekStart") ?? ""));
  // Persist current form values first
  await saveTimesheetDraft(formData);

  const week = await prisma.timesheetWeek.findUniqueOrThrow({
    where: { userId_weekStart: { userId: user.id, weekStart } },
    include: { days: true },
  });

  if (week.status === TimesheetStatus.SUBMITTED || week.status === TimesheetStatus.APPROVED) {
    throw new Error("Already submitted or approved.");
  }

  const submittedAt = new Date();
  const late = isLateSubmission(weekStart, submittedAt);

  await prisma.timesheetWeek.update({
    where: { id: week.id },
    data: {
      status: TimesheetStatus.SUBMITTED,
      submittedAt,
      isLate: late,
    },
  });

  await audit(
    user.id,
    "TIMESHEET_SUBMITTED",
    "TimesheetWeek",
    week.id,
    late ? "late" : "on-time"
  );
  revalidatePath("/timesheet");
  revalidatePath("/timesheet/history");
  revalidatePath("/manager/timesheets");
}

export async function reviewTimesheet(formData: FormData) {
  const user = await actor();
  if (user.role !== "MANAGER" && user.role !== "ADMIN") throw new Error("Forbidden");

  const weekId = String(formData.get("weekId"));
  const decision = String(formData.get("decision")); // APPROVE | REJECT
  const rejectionReason = String(formData.get("rejectionReason") ?? "").trim() || null;

  const week = await prisma.timesheetWeek.findUniqueOrThrow({
    where: { id: weekId },
    include: { days: { orderBy: { date: "asc" } }, user: true },
  });

  if (week.status !== TimesheetStatus.SUBMITTED) {
    throw new Error("Only submitted timesheets can be reviewed.");
  }
  if (!canApproveTimesheet(user, week.user)) {
    throw new Error("You are not the Timesheet Approver for this person");
  }

  if (decision === "REJECT") {
    await prisma.timesheetWeek.update({
      where: { id: weekId },
      data: {
        status: TimesheetStatus.REJECTED,
        rejectionReason,
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
    });
    await audit(user.id, "TIMESHEET_REJECTED", "TimesheetWeek", weekId, rejectionReason ?? undefined);
  } else if (decision === "APPROVE") {
    const ot = calculateDilOt(
      week.user.employmentType,
      week.days.map((d) => ({
        date: d.date,
        hours: d.hours,
        isOff: d.isOff,
      }))
    );

    // Replace any prior DIL buckets from this week (re-approve safety)
    await prisma.dilBucket.deleteMany({ where: { timesheetWeekId: weekId } });

    for (const alloc of ot.allocations) {
      await createDilBucket({
        userId: week.userId,
        hours: alloc.hours,
        earnedDate: alloc.date,
        timesheetWeekId: weekId,
        note: `Timesheet OT ${format(week.weekStart, "yyyy-MM-dd")}`,
      });
    }

    await prisma.timesheetWeek.update({
      where: { id: weekId },
      data: {
        status: TimesheetStatus.APPROVED,
        dilHoursCredited: ot.dilHours,
        weekTotalHours: ot.weekTotal,
        reviewedById: user.id,
        reviewedAt: new Date(),
        rejectionReason: null,
      },
    });
    await audit(
      user.id,
      "TIMESHEET_APPROVED",
      "TimesheetWeek",
      weekId,
      `DIL ${ot.dilHours}h`
    );
  } else {
    throw new Error("Invalid decision");
  }

  revalidatePath("/manager/timesheets");
  revalidatePath("/manager");
  revalidatePath("/timesheet");
  revalidatePath("/timesheet/history");
  revalidatePath("/dashboard");
}
