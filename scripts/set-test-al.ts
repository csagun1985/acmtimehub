import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const fy = "FY2027";

async function main() {
  const staff = await prisma.user.findMany({ where: { role: "STAFF" } });
  for (const u of staff) {
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
    console.log("Set 10 AL opening for", u.email);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
