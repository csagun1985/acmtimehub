"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { differenceInCalendarDays, endOfDay, startOfDay } from "date-fns";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getAlSlBalances } from "@/lib/leave/accrual";
import { consumeDilHours, createDilBucket, getDilBalance } from "@/lib/leave/dil";
import { getFiscalYear, parseDateInput } from "@/lib/leave/fiscal";
import { countLeaveDays } from "@/lib/leave/working-days";
import { ensurePublicHolidays } from "@/lib/leave/holidays";
import {
  assertAlNoticePeriod,
  canUseLeaveType,
  eligibilityMessage,
} from "@/lib/leave/eligibility";
import {
  LedgerKind,
  RequestStatus,
  defaultEntitlements,
  AU_STATES,
  type AuState,
  type LeaveType,
  type Role,
} from "@/lib/types";
import {
  canApproveSil,
  canEditCandidateProfile,
} from "@/lib/permissions";

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

function needsMedCert(start: Date, end: Date): boolean {
  // Consecutive calendar days including weekends for the 2-day rule
  return differenceInCalendarDays(endOfDay(end), startOfDay(start)) + 1 >= 2;
}

export async function submitLeaveRequest(formData: FormData) {
  const user = await actor();
  const type = String(formData.get("type")) as LeaveType;
  const startStr = String(formData.get("startDate") ?? "");
  const endStr = String(formData.get("endDate") ?? startStr);
  const isHalfDay = formData.get("isHalfDay") === "on";
  const reasonRaw = String(formData.get("reason") ?? "").trim() || null;
  const notesRaw = String(formData.get("notes") ?? "").trim() || null;
  const dilHoursRaw = String(formData.get("hours") ?? "").trim();
  const slCategory = String(formData.get("slCategory") ?? "SELF").trim();

  if (!["AL", "SL", "DIL_USE"].includes(type)) {
    if (type === "DIL_CREDIT") {
      throw new Error("DIL OT is earned via Timesheet. Use DIL Use under Service Incentive Leave to take time off.");
    }
    throw new Error("Invalid leave type");
  }

  const startDate = parseDateInput(startStr);
  const endDate = parseDateInput(endStr || startStr);
  if (endDate < startDate) throw new Error("End date before start date");

  const dbUser = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });

  let amount = 0;
  let medCertRequired = false;
  let reason = reasonRaw;
  let notes = notesRaw;

  if (type === "AL" || type === "SL") {
    if (!canUseLeaveType(dbUser, type)) {
      throw new Error(eligibilityMessage(dbUser, type));
    }

    amount = await countLeaveDays({
      state: dbUser.state as AuState,
      startDate,
      endDate,
      isHalfDay,
      excludePublicHolidays: dbUser.entitlePublicHoliday,
    });
    if (amount <= 0) throw new Error("No leave days in range (weekend/PH only).");

    if (type === "AL") {
      assertAlNoticePeriod(amount, startDate);
    }

    if (type === "SL") {
      if (!["SELF", "CARER_EMERGENCY"].includes(slCategory)) {
        throw new Error("Select a Sick Leave category.");
      }
      if (slCategory === "CARER_EMERGENCY") {
        if (!notesRaw || notesRaw.length < 20) {
          throw new Error(
            "For carer’s leave / unexpected emergency, add detailed notes (who needs care, relationship, and what happened)."
          );
        }
        reason = reasonRaw
          ? `Carer / unexpected emergency — ${reasonRaw}`
          : "Carer / unexpected emergency";
        notes = notesRaw;
      } else {
        reason = reasonRaw
          ? `Own illness/injury — ${reasonRaw}`
          : "Own illness/injury";
        // Med cert required for own illness when 2+ consecutive calendar days
        medCertRequired = needsMedCert(startDate, endDate);
      }
    }

    const balances = await getAlSlBalances(user.id);
    const remaining = type === "AL" ? balances.al.remaining : balances.sl.remaining;
    if (amount > remaining + 1e-9) {
      throw new Error(
        `Insufficient ${type} balance. Remaining ${remaining} day(s), requested ${amount}.`
      );
    }
  } else if (type === "DIL_USE") {
    amount = Number(dilHoursRaw);
    if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter valid hours to use.");
    const dil = await getDilBalance(user.id);
    if (amount > dil.remaining + 1e-9) {
      throw new Error(
        `Insufficient DIL. Available ${dil.remaining}h, requested ${amount}h.`
      );
    }
  }

  const request = await prisma.leaveRequest.create({
    data: {
      userId: user.id,
      type,
      startDate,
      endDate: endDate,
      amount,
      isHalfDay: type === "AL" || type === "SL" ? isHalfDay : false,
      reason,
      notes,
      medCertRequired,
      status: RequestStatus.PENDING,
    },
  });

  await audit(user.id, "REQUEST_CREATED", "LeaveRequest", request.id, type);
  revalidatePath("/dashboard");
  revalidatePath("/requests");
  revalidatePath("/manager");
  return { ok: true, id: request.id, medCertRequired };
}

export async function cancelOwnRequest(requestId: string) {
  const user = await actor();
  const req = await prisma.leaveRequest.findUniqueOrThrow({ where: { id: requestId } });
  if (req.userId !== user.id) throw new Error("Forbidden");
  if (req.status !== RequestStatus.PENDING) throw new Error("Only pending requests can be cancelled.");
  await prisma.leaveRequest.update({
    where: { id: requestId },
    data: { status: RequestStatus.CANCELLED },
  });
  await audit(user.id, "REQUEST_CANCELLED", "LeaveRequest", requestId);
  revalidatePath("/requests");
  revalidatePath("/manager");
}

export async function reviewRequest(formData: FormData) {
  const user = await actor();
  if (user.role !== "MANAGER" && user.role !== "ADMIN") throw new Error("Forbidden");

  const requestId = String(formData.get("requestId"));
  const decision = String(formData.get("decision")); // APPROVE | REJECT
  const rejectionReason = String(formData.get("rejectionReason") ?? "").trim() || null;

  const req = await prisma.leaveRequest.findUniqueOrThrow({
    where: { id: requestId },
    include: { user: true },
  });
  if (req.status !== RequestStatus.PENDING) throw new Error("Already reviewed");
  if (!canApproveSil(user, req.user)) {
    throw new Error("You are not the SIL Approver for this person");
  }

  if (decision === "REJECT") {
    await prisma.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.REJECTED,
        rejectionReason,
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
    });
    await audit(user.id, "REQUEST_REJECTED", "LeaveRequest", requestId, rejectionReason ?? undefined);
  } else if (decision === "APPROVE") {
    // Re-check eligibility and balances at approval time
    if (req.type === "AL" || req.type === "SL") {
      if (!canUseLeaveType(req.user, req.type as "AL" | "SL")) {
        throw new Error(eligibilityMessage(req.user, req.type as "AL" | "SL"));
      }
      const balances = await getAlSlBalances(req.userId);
      const remaining = req.type === "AL" ? balances.al.remaining : balances.sl.remaining;
      if (req.amount > remaining + 1e-9) {
        throw new Error(`Insufficient ${req.type} balance at approval.`);
      }
      const fy = getFiscalYear(req.startDate);
      await prisma.leaveLedger.create({
        data: {
          userId: req.userId,
          leaveType: req.type,
          kind: LedgerKind.USAGE,
          amount: -req.amount,
          fiscalYear: fy,
          requestId: req.id,
          note: `${req.type} usage`,
          createdById: user.id,
        },
      });
    } else if (req.type === "DIL_USE") {
      await consumeDilHours(req.userId, req.amount, new Date());
    }

    await prisma.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: RequestStatus.APPROVED,
        reviewedById: user.id,
        reviewedAt: new Date(),
      },
    });
    await audit(user.id, "REQUEST_APPROVED", "LeaveRequest", requestId);
  } else {
    throw new Error("Invalid decision");
  }

  revalidatePath("/manager");
  revalidatePath("/dashboard");
  revalidatePath("/requests");
  revalidatePath("/calendar");
}

export async function saveMedCertPath(requestId: string, path: string) {
  const user = await actor();
  const req = await prisma.leaveRequest.findUniqueOrThrow({
    where: { id: requestId },
    include: { user: true },
  });
  const allowed =
    req.userId === user.id ||
    user.role === "ADMIN" ||
    canApproveSil(user, req.user);
  if (!allowed) throw new Error("Forbidden");
  await prisma.leaveRequest.update({
    where: { id: requestId },
    data: { medCertPath: path },
  });
  await audit(user.id, "MED_CERT_UPLOADED", "LeaveRequest", requestId, path);
  revalidatePath("/requests");
}

export async function updateOwnProfile(formData: FormData) {
  const user = await actor();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;
  const personalEmail = String(formData.get("personalEmail") ?? "").trim().toLowerCase() || null;
  const address = String(formData.get("address") ?? "").trim() || null;
  const birthRaw = String(formData.get("birthDate") ?? "").trim();
  const birthDate = birthRaw ? parseDateInput(birthRaw) : null;

  if (!name) throw new Error("Name is required");

  await prisma.user.update({
    where: { id: user.id },
    data: { name, phone, personalEmail, address, birthDate },
  });
  await audit(user.id, "PROFILE_UPDATED", "User", user.id);
  revalidatePath("/profile");
  revalidatePath("/dashboard");
}

export async function updateEmploymentProfile(formData: FormData) {
  const actorUser = await actor();
  if (actorUser.role !== "ADMIN" && actorUser.role !== "MANAGER") {
    throw new Error("Forbidden");
  }

  const userId = String(formData.get("userId"));
  const target = await prisma.user.findUniqueOrThrow({ where: { id: userId } });
  if (!canEditCandidateProfile(actorUser, target)) {
    throw new Error("You can only edit profiles for people you are assigned to approve");
  }

  const startDate = parseDateInput(String(formData.get("startDate")));
  const endRaw = String(formData.get("endDate") ?? "").trim();
  const endDate = endRaw ? parseDateInput(endRaw) : null;
  const state = String(formData.get("state")) as AuState;
  const employmentStatus = String(formData.get("employmentStatus") ?? "PROBATION");
  const employmentType = String(formData.get("employmentType") ?? "FULL_TIME");
  const probationEndRaw = String(formData.get("probationEndDate") ?? "").trim();
  const probationEndDate = probationEndRaw ? parseDateInput(probationEndRaw) : null;

  if (!AU_STATES.includes(state)) throw new Error("Invalid state");
  if (!["PROBATION", "PERMANENT", "CASUAL"].includes(employmentStatus)) {
    throw new Error("Invalid employment status");
  }
  if (!["FULL_TIME", "PART_TIME"].includes(employmentType)) {
    throw new Error("Invalid employment type");
  }

  // Checkboxes: present + "on" = entitled; absent = not entitled
  let entitleAlAccrual = formData.get("entitleAlAccrual") === "on";
  let entitleSlAccrual = formData.get("entitleSlAccrual") === "on";
  let entitlePublicHoliday = formData.get("entitlePublicHoliday") === "on";

  // Casual with no entitlement boxes → force no leave / no PH
  if (
    employmentStatus === "CASUAL" &&
    !formData.has("entitleAlAccrual") &&
    !formData.has("entitleSlAccrual") &&
    !formData.has("entitlePublicHoliday")
  ) {
    ({ entitleAlAccrual, entitleSlAccrual, entitlePublicHoliday } =
      defaultEntitlements("CASUAL"));
  }

  const active = endDate
    ? endDate >= startOfDayToday()
    : formData.get("active") !== "off";

  const data: Record<string, unknown> = {
    startDate,
    endDate,
    state,
    employmentStatus,
    employmentType,
    probationEndDate,
    entitleAlAccrual,
    entitleSlAccrual,
    entitlePublicHoliday,
    active,
  };

  // Only Admin assigns Access type and Timesheet / SIL Approvers
  if (actorUser.role === "ADMIN") {
    const role = String(formData.get("role") ?? "").trim();
    if (role) {
      if (!["STAFF", "MANAGER", "ADMIN"].includes(role)) {
        throw new Error("Invalid access type");
      }
      data.role = role;
    }

    const tsRaw = String(formData.get("timesheetApproverId") ?? "").trim();
    const silRaw = String(formData.get("silApproverId") ?? "").trim();
    data.timesheetApproverId = tsRaw || null;
    data.silApproverId = silRaw || null;
    if (tsRaw) await assertApproverUser(tsRaw);
    if (silRaw) await assertApproverUser(silRaw);
  }

  await prisma.user.update({
    where: { id: userId },
    data,
  });
  await ensurePublicHolidays(state, new Date().getFullYear());
  await audit(actorUser.id, "EMPLOYMENT_UPDATED", "User", userId, employmentStatus);
  revalidatePath("/admin/people");
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/timesheet");
}

async function assertApproverUser(userId: string) {
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u || (u.role !== "MANAGER" && u.role !== "ADMIN")) {
    throw new Error("Approver must be a Manager or Admin");
  }
  if (!u.active) throw new Error("Approver must be an active user");
}

function startOfDayToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function adminUpsertUser(formData: FormData) {
  const user = await actor();
  if (user.role !== "ADMIN") throw new Error("Forbidden");

  const id = String(formData.get("id") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const name = String(formData.get("name") ?? "").trim();
  const startDate = parseDateInput(String(formData.get("startDate")));
  const endRaw = String(formData.get("endDate") ?? "").trim();
  const endDate = endRaw ? parseDateInput(endRaw) : null;
  const state = String(formData.get("state")) as AuState;
  const role = String(formData.get("role")) as Role;
  const employmentStatus = String(formData.get("employmentStatus") ?? "PROBATION");
  const employmentType = String(formData.get("employmentType") ?? "FULL_TIME");
  const probationEndRaw = String(formData.get("probationEndDate") ?? "").trim();
  const probationEndDate = probationEndRaw ? parseDateInput(probationEndRaw) : null;
  const password = String(formData.get("password") ?? "");

  if (!email || !name) throw new Error("Name and email required");
  if (!AU_STATES.includes(state)) throw new Error("Invalid state");
  if (!["PROBATION", "PERMANENT", "CASUAL"].includes(employmentStatus)) {
    throw new Error("Invalid employment status");
  }
  if (!["FULL_TIME", "PART_TIME"].includes(employmentType)) {
    throw new Error("Invalid employment type");
  }

  let entitleAlAccrual = formData.get("entitleAlAccrual") === "on";
  let entitleSlAccrual = formData.get("entitleSlAccrual") === "on";
  let entitlePublicHoliday = formData.get("entitlePublicHoliday") === "on";
  if (
    employmentStatus === "CASUAL" &&
    !formData.has("entitleAlAccrual") &&
    !formData.has("entitleSlAccrual") &&
    !formData.has("entitlePublicHoliday")
  ) {
    ({ entitleAlAccrual, entitleSlAccrual, entitlePublicHoliday } =
      defaultEntitlements("CASUAL"));
  }

  const tsRaw = String(formData.get("timesheetApproverId") ?? "").trim();
  const silRaw = String(formData.get("silApproverId") ?? "").trim();
  if (tsRaw) await assertApproverUser(tsRaw);
  if (silRaw) await assertApproverUser(silRaw);

  const employmentFields = {
    startDate,
    endDate,
    state,
    role,
    employmentStatus,
    employmentType,
    probationEndDate,
    entitleAlAccrual,
    entitleSlAccrual,
    entitlePublicHoliday,
    timesheetApproverId: tsRaw || null,
    silApproverId: silRaw || null,
    active: endDate ? endDate >= startOfDayToday() : true,
  };

  if (id) {
    const data: Record<string, unknown> = { email, name, ...employmentFields };
    if (password) data.passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({ where: { id }, data });
    await audit(user.id, "USER_UPDATED", "User", id, email);
  } else {
    if (!password) throw new Error("Password required for new user");
    const created = await prisma.user.create({
      data: {
        email,
        name,
        ...employmentFields,
        passwordHash: await bcrypt.hash(password, 10),
      },
    });
    await ensurePublicHolidays(state, new Date().getFullYear());
    await audit(user.id, "USER_CREATED", "User", created.id, email);
  }

  revalidatePath("/admin/people");
}

export async function adminUpdateEligibility(formData: FormData) {
  // Backwards-compatible wrapper → employment profile update
  return updateEmploymentProfile(formData);
}

export async function adminSetOpeningBalances(formData: FormData) {
  const user = await actor();
  if (user.role !== "ADMIN") throw new Error("Forbidden");

  const userId = String(formData.get("userId"));
  const fy = getFiscalYear(new Date());
  const al = Number(formData.get("alOpening") ?? 0);
  const sl = Number(formData.get("slOpening") ?? 0);
  const dilHours = Number(formData.get("dilOpening") ?? 0);
  const dilEarnedStr = String(formData.get("dilEarnedDate") ?? "");

  // Replace existing OPENING rows for this FY
  await prisma.leaveLedger.deleteMany({
    where: { userId, fiscalYear: fy, kind: LedgerKind.OPENING },
  });

  if (al) {
    await prisma.leaveLedger.create({
      data: {
        userId,
        leaveType: "AL",
        kind: LedgerKind.OPENING,
        amount: al,
        fiscalYear: fy,
        note: "Opening balance 1 Jul 2026",
        createdById: user.id,
      },
    });
  }
  if (sl) {
    await prisma.leaveLedger.create({
      data: {
        userId,
        leaveType: "SL",
        kind: LedgerKind.OPENING,
        amount: sl,
        fiscalYear: fy,
        note: "Opening balance 1 Jul 2026",
        createdById: user.id,
      },
    });
  }
  if (dilHours > 0) {
    const earnedDate = dilEarnedStr
      ? parseDateInput(dilEarnedStr)
      : parseDateInput("2026-07-01");
    await createDilBucket({
      userId,
      hours: dilHours,
      earnedDate,
      note: "Opening DIL balance",
    });
  }

  await audit(user.id, "OPENING_BALANCES_SET", "User", userId, `AL=${al} SL=${sl} DIL=${dilHours}`);
  revalidatePath("/admin/balances");
  revalidatePath("/dashboard");
}

export async function adminAdjustBalance(formData: FormData) {
  const user = await actor();
  if (user.role !== "ADMIN") throw new Error("Forbidden");

  const userId = String(formData.get("userId"));
  const leaveType = String(formData.get("leaveType")); // AL | SL | DIL
  const amount = Number(formData.get("amount"));
  const note = String(formData.get("note") ?? "").trim();
  if (!note) throw new Error("Reason required");
  if (!Number.isFinite(amount) || amount === 0) throw new Error("Invalid amount");

  if (leaveType === "AL" || leaveType === "SL") {
    await prisma.leaveLedger.create({
      data: {
        userId,
        leaveType,
        kind: LedgerKind.ADJUSTMENT,
        amount,
        fiscalYear: getFiscalYear(new Date()),
        note,
        createdById: user.id,
      },
    });
  } else if (leaveType === "DIL") {
    if (amount > 0) {
      await createDilBucket({
        userId,
        hours: amount,
        earnedDate: new Date(),
        note: `Adjustment: ${note}`,
      });
    } else {
      await consumeDilHours(userId, Math.abs(amount));
    }
  } else {
    throw new Error("Invalid leave type");
  }

  await audit(user.id, "BALANCE_ADJUSTED", "User", userId, `${leaveType} ${amount}: ${note}`);
  revalidatePath("/admin/adjustments");
  revalidatePath("/dashboard");
}
