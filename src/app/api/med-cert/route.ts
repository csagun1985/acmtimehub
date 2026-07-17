import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveMedCertPath } from "@/lib/actions";
import {
  medCertObjectKey,
  medCertServeUrl,
  putMedCertObject,
} from "@/lib/storage/med-certs";

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

  const bytes = new Uint8Array(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = medCertObjectKey(requestId, safeName);
  const contentType = file.type || "application/octet-stream";

  await putMedCertObject(key, bytes, contentType);
  // Store object key; UI links via authenticated /api/med-cert/[id]
  await saveMedCertPath(requestId, key);

  return NextResponse.json({ ok: true, path: medCertServeUrl(requestId), key });
}
