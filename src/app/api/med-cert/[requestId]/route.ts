import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getMedCertObject, resolveMedCertKey } from "@/lib/storage/med-certs";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ requestId: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { requestId } = await ctx.params;
  const leaveReq = await prisma.leaveRequest.findUnique({
    where: { id: requestId },
    include: { user: { select: { silApproverId: true } } },
  });

  if (!leaveReq?.medCertPath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const allowed =
    leaveReq.userId === session.user.id ||
    session.user.role === "ADMIN" ||
    leaveReq.user.silApproverId === session.user.id;

  if (!allowed) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const key = resolveMedCertKey(leaveReq.medCertPath);
  const obj = await getMedCertObject(key);
  if (!obj) {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }

  const fileName = key.split("/").pop() || "med-cert";
  return new NextResponse(Buffer.from(obj.body), {
    status: 200,
    headers: {
      "Content-Type": obj.contentType,
      "Content-Disposition": `inline; filename="${fileName}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
