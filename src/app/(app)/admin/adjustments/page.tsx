import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { adminAdjustBalance } from "@/lib/actions";
import { Button, Field, PageHeader, inputClass } from "@/components/ui";

export default async function AdjustmentsPage() {
  await requireRole("ADMIN");
  const people = await prisma.user.findMany({ orderBy: { name: "asc" } });

  async function action(formData: FormData) {
    "use server";
    await adminAdjustBalance(formData);
  }

  return (
    <div className="max-w-xl">
      <PageHeader
        title="Balance adjustments"
        subtitle="Positive amounts credit, negative amounts debit. Reason is required for audit."
      />
      <form
        action={action}
        className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6"
      >
        <Field label="Person">
          <select name="userId" required className={inputClass}>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.role})
              </option>
            ))}
          </select>
        </Field>
        <Field label="Leave type">
          <select name="leaveType" className={inputClass}>
            <option value="AL">Annual Leave (days)</option>
            <option value="SL">Sick Leave (days)</option>
            <option value="DIL">DIL (hours)</option>
          </select>
        </Field>
        <Field label="Amount" hint="e.g. 2 or -1.5">
          <input name="amount" type="number" step="0.25" required className={inputClass} />
        </Field>
        <Field label="Reason">
          <input name="note" required className={inputClass} />
        </Field>
        <Button type="submit">Apply adjustment</Button>
      </form>
    </div>
  );
}
