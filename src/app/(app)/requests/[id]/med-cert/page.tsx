import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import { MedCertUploadForm } from "@/components/MedCertUploadForm";

export default async function MedCertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireSession();
  const { id } = await params;
  const req = await prisma.leaveRequest.findUnique({ where: { id } });
  if (!req || req.userId !== session.user.id) notFound();

  return (
    <div className="max-w-lg">
      <PageHeader
        title="Medical certificate"
        subtitle="Required for sick leave of 2 or more consecutive calendar days."
      />
      {req.medCertPath ? (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <p className="text-sm">Certificate already uploaded.</p>
          <a
            href={req.medCertPath}
            className="mt-2 inline-block text-[var(--brand)]"
            target="_blank"
          >
            Open file
          </a>
        </div>
      ) : (
        <MedCertUploadForm requestId={req.id} />
      )}
    </div>
  );
}
