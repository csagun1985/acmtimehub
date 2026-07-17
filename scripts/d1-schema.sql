-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "personalEmail" TEXT,
    "phone" TEXT,
    "birthDate" DATETIME,
    "address" TEXT,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "state" TEXT NOT NULL DEFAULT 'NSW',
    "role" TEXT NOT NULL DEFAULT 'STAFF',
    "employmentStatus" TEXT NOT NULL DEFAULT 'PROBATION',
    "probationEndDate" DATETIME,
    "employmentType" TEXT NOT NULL DEFAULT 'FULL_TIME',
    "entitleAlAccrual" BOOLEAN NOT NULL DEFAULT true,
    "entitleSlAccrual" BOOLEAN NOT NULL DEFAULT true,
    "entitlePublicHoliday" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "timesheetApproverId" TEXT,
    "silApproverId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "User_timesheetApproverId_fkey" FOREIGN KEY ("timesheetApproverId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_silApproverId_fkey" FOREIGN KEY ("silApproverId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LeaveRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "amount" REAL NOT NULL,
    "isHalfDay" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "notes" TEXT,
    "medCertRequired" BOOLEAN NOT NULL DEFAULT false,
    "medCertPath" TEXT,
    "rejectionReason" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "LeaveRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LeaveLedger" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "leaveType" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "fiscalYear" TEXT NOT NULL,
    "note" TEXT,
    "requestId" TEXT,
    "createdById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LeaveLedger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DilBucket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "hours" REAL NOT NULL,
    "usedHours" REAL NOT NULL DEFAULT 0,
    "earnedDate" DATETIME NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "requestId" TEXT,
    "timesheetWeekId" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DilBucket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DilBucket_timesheetWeekId_fkey" FOREIGN KEY ("timesheetWeekId") REFERENCES "TimesheetWeek" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PublicHoliday" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "state" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "detail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimesheetWeek" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "weekStart" DATETIME NOT NULL,
    "weekEnd" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "isLate" BOOLEAN NOT NULL DEFAULT false,
    "weekNote" TEXT,
    "weekTotalHours" REAL NOT NULL DEFAULT 0,
    "dilHoursCredited" REAL NOT NULL DEFAULT 0,
    "submittedAt" DATETIME,
    "reviewedById" TEXT,
    "reviewedAt" DATETIME,
    "rejectionReason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "TimesheetWeek_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TimesheetDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "weekday" INTEGER NOT NULL,
    "hours" REAL NOT NULL DEFAULT 0,
    "isOff" BOOLEAN NOT NULL DEFAULT false,
    "note" TEXT,
    CONSTRAINT "TimesheetDay_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "TimesheetWeek" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "LeaveRequest_userId_status_idx" ON "LeaveRequest"("userId", "status");

-- CreateIndex
CREATE INDEX "LeaveRequest_status_createdAt_idx" ON "LeaveRequest"("status", "createdAt");

-- CreateIndex
CREATE INDEX "LeaveRequest_startDate_endDate_idx" ON "LeaveRequest"("startDate", "endDate");

-- CreateIndex
CREATE INDEX "LeaveLedger_userId_leaveType_fiscalYear_idx" ON "LeaveLedger"("userId", "leaveType", "fiscalYear");

-- CreateIndex
CREATE INDEX "DilBucket_userId_expiresAt_idx" ON "DilBucket"("userId", "expiresAt");

-- CreateIndex
CREATE INDEX "DilBucket_timesheetWeekId_idx" ON "DilBucket"("timesheetWeekId");

-- CreateIndex
CREATE INDEX "PublicHoliday_state_date_idx" ON "PublicHoliday"("state", "date");

-- CreateIndex
CREATE UNIQUE INDEX "PublicHoliday_date_state_key" ON "PublicHoliday"("date", "state");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "TimesheetWeek_status_weekStart_idx" ON "TimesheetWeek"("status", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "TimesheetWeek_userId_weekStart_key" ON "TimesheetWeek"("userId", "weekStart");

-- CreateIndex
CREATE INDEX "TimesheetDay_weekId_idx" ON "TimesheetDay"("weekId");

-- CreateIndex
CREATE UNIQUE INDEX "TimesheetDay_weekId_date_key" ON "TimesheetDay"("weekId", "date");

