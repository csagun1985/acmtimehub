import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import Holidays from "date-holidays";
import { startOfDay, format } from "date-fns";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const prisma = new PrismaClient({
  adapter: new PrismaLibSQL({ url }),
});

async function seedHolidays(state: "NSW" | "VIC", years: number[]) {
  const region = state === "NSW" ? "AU-NSW" : "AU-VIC";
  const hd = new Holidays(region);
  for (const year of years) {
    for (const h of hd.getHolidays(year)) {
      if (h.type !== "public") continue;
      const date = startOfDay(new Date(h.date));
      await prisma.publicHoliday.upsert({
        where: { date_state: { date, state } },
        create: { date, state, name: h.name },
        update: { name: h.name },
      });
    }
  }
  console.log(`Seeded holidays for ${state}: ${years.join(", ")}`);
}

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);
  const years = [2026, 2027];

  await seedHolidays("NSW", years);
  await seedHolidays("VIC", years);

  const admin = await prisma.user.upsert({
    where: { email: "admin@sil.local" },
    update: { employmentStatus: "PERMANENT", employmentType: "FULL_TIME" },
    create: {
      email: "admin@sil.local",
      name: "SIL Admin",
      passwordHash,
      role: "ADMIN",
      state: "NSW",
      employmentStatus: "PERMANENT",
      employmentType: "FULL_TIME",
      startDate: startOfDay(new Date("2024-07-01")),
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@sil.local" },
    update: { employmentStatus: "PERMANENT", employmentType: "FULL_TIME" },
    create: {
      email: "manager@sil.local",
      name: "Team Manager",
      passwordHash,
      role: "MANAGER",
      state: "NSW",
      employmentStatus: "PERMANENT",
      employmentType: "FULL_TIME",
      startDate: startOfDay(new Date("2024-07-01")),
    },
  });

  const staffNsw = await prisma.user.upsert({
    where: { email: "staff.nsw@sil.local" },
    update: {
      employmentStatus: "PERMANENT",
      employmentType: "FULL_TIME",
      timesheetApproverId: manager.id,
      silApproverId: manager.id,
    },
    create: {
      email: "staff.nsw@sil.local",
      name: "Alex NSW",
      passwordHash,
      role: "STAFF",
      state: "NSW",
      employmentStatus: "PERMANENT",
      employmentType: "FULL_TIME",
      startDate: startOfDay(new Date("2026-07-01")),
      timesheetApproverId: manager.id,
      silApproverId: manager.id,
    },
  });

  const staffVic = await prisma.user.upsert({
    where: { email: "staff.vic@sil.local" },
    update: {
      employmentStatus: "PERMANENT",
      employmentType: "FULL_TIME",
      timesheetApproverId: manager.id,
      silApproverId: manager.id,
    },
    create: {
      email: "staff.vic@sil.local",
      name: "Sam VIC",
      passwordHash,
      role: "STAFF",
      state: "VIC",
      employmentStatus: "PERMANENT",
      employmentType: "FULL_TIME",
      startDate: startOfDay(new Date("2026-07-01")),
      timesheetApproverId: manager.id,
      silApproverId: manager.id,
    },
  });

  const staffCasual = await prisma.user.upsert({
    where: { email: "staff.casual@sil.local" },
    update: {
      employmentStatus: "CASUAL",
      employmentType: "PART_TIME",
      entitleAlAccrual: false,
      entitleSlAccrual: false,
      entitlePublicHoliday: false,
      timesheetApproverId: manager.id,
      silApproverId: manager.id,
    },
    create: {
      email: "staff.casual@sil.local",
      name: "Casey Casual",
      passwordHash,
      role: "STAFF",
      state: "NSW",
      employmentStatus: "CASUAL",
      employmentType: "PART_TIME",
      entitleAlAccrual: false,
      entitleSlAccrual: false,
      entitlePublicHoliday: false,
      startDate: startOfDay(new Date("2026-07-01")),
      timesheetApproverId: manager.id,
      silApproverId: manager.id,
    },
  });

  // Give demo staff 10 AL opening days for easier testing
  const fy = "FY2027";
  for (const u of [staffNsw, staffVic]) {
    await prisma.leaveLedger.deleteMany({
      where: { userId: u.id, leaveType: "AL", fiscalYear: fy, kind: "OPENING" },
    });
    await prisma.leaveLedger.create({
      data: {
        userId: u.id,
        leaveType: "AL",
        kind: "OPENING",
        amount: 10,
        fiscalYear: fy,
        note: "Test opening balance — 10 AL days",
      },
    });
  }

  console.log("Seeded users:");
  console.log({
    admin: admin.email,
    manager: manager.email,
    staffNsw: staffNsw.email,
    staffVic: staffVic.email,
    staffCasual: staffCasual.email,
    password: "Password123!",
    holidaySample: format(startOfDay(new Date("2026-12-25")), "yyyy-MM-dd"),
    testAlOpening: "10 days for STAFF users",
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
