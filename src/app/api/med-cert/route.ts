import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveMedCertPath } from "@/lib/actions";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const requestId = String(form.get("requestId") ?? "");
  const file = form.get("file");

  if (!requestId || !(file instanceof File)) {
    return NextResponse.json({ error: "Missing file or requestId" }, { status: 400 });
  }

  const leaveReq = await prisma.leaveRequest.findUnique({ where: { id: requestId } });
  if (!leaveReq) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (
    leaveReq.userId !== session.user.id &&
    session.user.role !== "ADMIN"
  ) {
    const staff = await prisma.user.findUnique({
      where: { id: leaveReq.userId },
      select: { silApproverId: true },
    });
    if (!staff || staff.silApproverId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const relDir = path.join("uploads", "med-certs", requestId);
  const absDir = path.join(process.cwd(), "public", relDir);
  await mkdir(absDir, { recursive: true });
  const absPath = path.join(absDir, safeName);
  await writeFile(absPath, bytes);

  const publicPath = `/${relDir.replace(/\\/g, "/")}/${safeName}`;
  await saveMedCertPath(requestId, publicPath);

  return NextResponse.json({ ok: true, path: publicPath });
}
