export type EmploymentType = "FULL_TIME" | "PART_TIME";

export type TimesheetStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED";

export const TimesheetStatus = {
  DRAFT: "DRAFT",
  SUBMITTED: "SUBMITTED",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export function getHourStandards(employmentType: string): {
  daily: number;
  weekly: number;
} {
  if (employmentType === "PART_TIME") {
    return { daily: 4, weekly: 20 };
  }
  return { daily: 8, weekly: 40 };
}
