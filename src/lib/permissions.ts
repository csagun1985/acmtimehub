/** Access control for assigned Timesheet / SIL approvers vs Admin. */

export type ApproverActor = {
  id: string;
  role: string;
};

export type StaffApprovers = {
  timesheetApproverId: string | null;
  silApproverId: string | null;
};

/** Admin can always edit; assigned Timesheet or SIL approver can edit that candidate. */
export function canEditCandidateProfile(
  actor: ApproverActor,
  staff: StaffApprovers
): boolean {
  if (actor.role === "ADMIN") return true;
  if (actor.role !== "MANAGER") return false;
  return (
    staff.timesheetApproverId === actor.id || staff.silApproverId === actor.id
  );
}

/** Admin can always approve SIL; otherwise only the assigned SIL Approver. */
export function canApproveSil(
  actor: ApproverActor,
  staff: Pick<StaffApprovers, "silApproverId">
): boolean {
  if (actor.role === "ADMIN") return true;
  if (actor.role !== "MANAGER") return false;
  return staff.silApproverId === actor.id;
}

/** Admin can always approve timesheets; otherwise only the assigned Timesheet Approver. */
export function canApproveTimesheet(
  actor: ApproverActor,
  staff: Pick<StaffApprovers, "timesheetApproverId">
): boolean {
  if (actor.role === "ADMIN") return true;
  if (actor.role !== "MANAGER") return false;
  return staff.timesheetApproverId === actor.id;
}

/** Prisma filter: people this manager may edit / see on People. */
export function peopleEditableWhere(actorId: string, role: string) {
  if (role === "ADMIN") return {};
  return {
    OR: [{ timesheetApproverId: actorId }, { silApproverId: actorId }],
  };
}
