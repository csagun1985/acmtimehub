import { format } from "date-fns";
import { prisma } from "@/lib/prisma";

export type HistoryRow = {
  id: string;
  createdAt: Date;
  action: string;
  actionLabel: string;
  entityType: string;
  entityId: string | null;
  detail: string | null;
  actorName: string;
  subjectName: string | null;
  summary: string;
};

const ACTION_LABELS: Record<string, string> = {
  REQUEST_CREATED: "Leave submitted",
  REQUEST_APPROVED: "Leave approved",
  REQUEST_REJECTED: "Leave rejected",
  REQUEST_CANCELLED: "Leave cancelled",
  MED_CERT_UPLOADED: "Medical certificate uploaded",
  TIMESHEET_SAVED: "Timesheet saved",
  TIMESHEET_SUBMITTED: "Timesheet submitted",
  TIMESHEET_APPROVED: "Timesheet approved",
  TIMESHEET_REJECTED: "Timesheet rejected",
  PROFILE_UPDATED: "Profile updated",
  EMPLOYMENT_UPDATED: "Employment updated",
  USER_CREATED: "User created",
  USER_UPDATED: "User updated",
  OPENING_BALANCES_SET: "Opening balances set",
  BALANCE_ADJUSTED: "Balance adjusted",
};

function actionLabel(action: string) {
  return ACTION_LABELS[action] ?? action.replaceAll("_", " ").toLowerCase();
}

async function visibleSubjectIds(viewer: {
  id: string;
  role: string;
}): Promise<"ALL" | string[]> {
  if (viewer.role === "ADMIN") return "ALL";

  if (viewer.role === "MANAGER") {
    const reports = await prisma.user.findMany({
      where: {
        OR: [
          { timesheetApproverId: viewer.id },
          { silApproverId: viewer.id },
          { id: viewer.id },
        ],
      },
      select: { id: true },
    });
    return [...new Set(reports.map((r) => r.id))];
  }

  return [viewer.id];
}

export async function getActivityHistory(
  viewer: { id: string; role: string },
  limit = 100
): Promise<HistoryRow[]> {
  const subjects = await visibleSubjectIds(viewer);
  const leaveWhere = subjects === "ALL" ? {} : { userId: { in: subjects } };
  const weekWhere = subjects === "ALL" ? {} : { userId: { in: subjects } };

  const [leaveRequests, weeks] = await Promise.all([
    prisma.leaveRequest.findMany({
      where: leaveWhere,
      select: {
        id: true,
        userId: true,
        type: true,
        startDate: true,
        endDate: true,
        amount: true,
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 500,
    }),
    prisma.timesheetWeek.findMany({
      where: weekWhere,
      select: {
        id: true,
        userId: true,
        weekStart: true,
        user: { select: { name: true } },
      },
      orderBy: { weekStart: "desc" },
      take: 500,
    }),
  ]);

  const leaveIds = leaveRequests.map((r) => r.id);
  const weekIds = weeks.map((w) => w.id);
  const leaveById = new Map(leaveRequests.map((r) => [r.id, r]));
  const weekById = new Map(weeks.map((w) => [w.id, w]));

  const orFilters =
    subjects === "ALL"
      ? undefined
      : [
          { actorId: { in: subjects } },
          { entityType: "User", entityId: { in: subjects } },
          ...(leaveIds.length
            ? [{ entityType: "LeaveRequest", entityId: { in: leaveIds } }]
            : []),
          ...(weekIds.length
            ? [{ entityType: "TimesheetWeek", entityId: { in: weekIds } }]
            : []),
        ];

  const logs = await prisma.auditLog.findMany({
    where: orFilters ? { OR: orFilters } : undefined,
    include: {
      actor: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: Math.min(limit * 2, 300),
  });

  const userEntityIds = [
    ...new Set(
      logs
        .filter((l) => l.entityType === "User" && l.entityId)
        .map((l) => l.entityId as string)
    ),
  ];
  const users =
    userEntityIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: userEntityIds } },
          select: { id: true, name: true },
        })
      : [];
  const userNameById = new Map(users.map((u) => [u.id, u.name]));

  const rows: HistoryRow[] = [];
  for (const log of logs) {
    if (rows.length >= limit) break;

    let subjectName: string | null = null;
    let summary = log.detail?.trim() || "";

    if (log.entityType === "LeaveRequest" && log.entityId) {
      const req = leaveById.get(log.entityId);
      if (!req && subjects !== "ALL") continue;
      if (req) {
        subjectName = req.user.name;
        const dates =
          format(req.startDate, "dd MMM yyyy") +
          (format(req.startDate, "yyyy-MM-dd") !==
          format(req.endDate, "yyyy-MM-dd")
            ? ` – ${format(req.endDate, "dd MMM yyyy")}`
            : "");
        const amt = req.type.startsWith("DIL")
          ? `${req.amount}h`
          : `${req.amount}d`;
        summary = [req.type, dates, amt, summary].filter(Boolean).join(" · ");
      }
    } else if (log.entityType === "TimesheetWeek" && log.entityId) {
      const week = weekById.get(log.entityId);
      if (!week && subjects !== "ALL") continue;
      if (week) {
        subjectName = week.user.name;
        summary = [
          `Week of ${format(week.weekStart, "dd MMM yyyy")}`,
          summary,
        ]
          .filter(Boolean)
          .join(" · ");
      }
    } else if (log.entityType === "User" && log.entityId) {
      subjectName = userNameById.get(log.entityId) ?? null;
      if (
        viewer.role === "STAFF" &&
        log.entityId !== viewer.id &&
        log.actorId !== viewer.id
      ) {
        continue;
      }
    }

    rows.push({
      id: log.id,
      createdAt: log.createdAt,
      action: log.action,
      actionLabel: actionLabel(log.action),
      entityType: log.entityType,
      entityId: log.entityId,
      detail: log.detail,
      actorName: log.actor?.name ?? "System",
      subjectName,
      summary,
    });
  }

  return rows;
}
