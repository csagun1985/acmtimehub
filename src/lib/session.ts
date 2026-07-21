import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/types";

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  // JWT can outlive a local DB reset/reseed; send them to login instead of 500ing.
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, active: true },
  });
  if (!dbUser?.active) redirect("/login");

  return session;
}

export async function requireRole(...roles: Role[]) {
  const session = await requireSession();
  if (!roles.includes(session.user.role)) {
    redirect("/dashboard");
  }
  return session;
}
