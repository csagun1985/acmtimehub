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

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_DilBucket" (
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
INSERT INTO "new_DilBucket" ("createdAt", "earnedDate", "expiresAt", "hours", "id", "note", "requestId", "usedHours", "userId") SELECT "createdAt", "earnedDate", "expiresAt", "hours", "id", "note", "requestId", "usedHours", "userId" FROM "DilBucket";
DROP TABLE "DilBucket";
ALTER TABLE "new_DilBucket" RENAME TO "DilBucket";
CREATE INDEX "DilBucket_userId_expiresAt_idx" ON "DilBucket"("userId", "expiresAt");
CREATE INDEX "DilBucket_timesheetWeekId_idx" ON "DilBucket"("timesheetWeekId");
CREATE TABLE "new_User" (
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
INSERT INTO "new_User" ("active", "createdAt", "email", "id", "name", "passwordHash", "role", "startDate", "state", "updatedAt") SELECT "active", "createdAt", "email", "id", "name", "passwordHash", "role", "startDate", "state", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "TimesheetWeek_status_weekStart_idx" ON "TimesheetWeek"("status", "weekStart");

-- CreateIndex
CREATE UNIQUE INDEX "TimesheetWeek_userId_weekStart_key" ON "TimesheetWeek"("userId", "weekStart");

-- CreateIndex
CREATE INDEX "TimesheetDay_weekId_idx" ON "TimesheetDay"("weekId");

-- CreateIndex
CREATE UNIQUE INDEX "TimesheetDay_weekId_date_key" ON "TimesheetDay"("weekId", "date");
