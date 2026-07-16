export type Role = "STAFF" | "MANAGER" | "ADMIN";
export type AuState =
  | "NSW"
  | "VIC"
  | "QLD"
  | "SA"
  | "WA"
  | "TAS"
  | "ACT"
  | "NT";
export type EmploymentStatus = "PROBATION" | "PERMANENT" | "CASUAL";
export type EmploymentType = "FULL_TIME" | "PART_TIME";
export type LeaveType = "AL" | "SL" | "DIL_CREDIT" | "DIL_USE";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
export type LedgerKind =
  | "OPENING"
  | "ACCRUAL"
  | "USAGE"
  | "ADJUSTMENT"
  | "FORFEIT"
  | "EXPIRY";

export const AU_STATES: AuState[] = [
  "NSW",
  "VIC",
  "QLD",
  "SA",
  "WA",
  "TAS",
  "ACT",
  "NT",
];

export const LedgerKind = {
  OPENING: "OPENING",
  ACCRUAL: "ACCRUAL",
  USAGE: "USAGE",
  ADJUSTMENT: "ADJUSTMENT",
  FORFEIT: "FORFEIT",
  EXPIRY: "EXPIRY",
} as const;

export const RequestStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
} as const;

export const LeaveType = {
  AL: "AL",
  SL: "SL",
  DIL_CREDIT: "DIL_CREDIT",
  DIL_USE: "DIL_USE",
} as const;

/** Default entitlements from employment status. Casual = no leave, no PH. */
export function defaultEntitlements(employmentStatus: string): {
  entitleAlAccrual: boolean;
  entitleSlAccrual: boolean;
  entitlePublicHoliday: boolean;
} {
  if (employmentStatus === "CASUAL") {
    return {
      entitleAlAccrual: false,
      entitleSlAccrual: false,
      entitlePublicHoliday: false,
    };
  }
  return {
    entitleAlAccrual: true,
    entitleSlAccrual: true,
    entitlePublicHoliday: true,
  };
}
