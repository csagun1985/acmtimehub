import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { adminSetOpeningBalances } from "@/lib/actions";
import { getAlSlBalances } from "@/lib/leave/accrual";
import { getDilBalance } from "@/lib/leave/dil";
import { Button, Field, PageHeader, inputClass } from "@/components/ui";

export default async function BalancesAdminPage() {
  await requireRole("ADMIN");
  const people = await prisma.user.findMany({
    where: { role: "STAFF" },
    orderBy: { name: "asc" },
  });

  const rows = await Promise.all(
    people.map(async (p) => {
      const [b, dil] = await Promise.all([
        getAlSlBalances(p.id),
        getDilBalance(p.id),
      ]);
      return { user: p, b, dil };
    })
  );

  async function action(formData: FormData) {
    "use server";
    await adminSetOpeningBalances(formData);
  }

  return (
    <div>
      <PageHeader
        title="Opening balances"
        subtitle="Set beginning balances for 1 Jul 2026 go-live. Accrual continues on top of openings."
      />

      <form
        action={action}
        className="mb-8 grid gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 md:grid-cols-2"
      >
        <Field label="Staff member">
          <select name="userId" required className={inputClass}>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="AL opening (days)">
          <input name="alOpening" type="number" step="0.5" defaultValue={0} className={inputClass} />
        </Field>
        <Field label="SL opening (days)">
          <input name="slOpening" type="number" step="0.5" defaultValue={0} className={inputClass} />
        </Field>
        <Field label="DIL opening (hours)">
          <input name="dilOpening" type="number" step="0.25" defaultValue={0} className={inputClass} />
        </Field>
        <Field label="DIL earn date" hint="Defaults to 1 Jul 2026 for 90-day expiry clock">
          <input name="dilEarnedDate" type="date" defaultValue="2026-07-01" className={inputClass} />
        </Field>
        <div className="md:col-span-2">
          <Button type="submit">Save opening balances</Button>
        </div>
      </form>

      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">AL accrued / rem</th>
              <th className="px-4 py-3">SL accrued / rem</th>
              <th className="px-4 py-3">DIL earned / rem</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ user, b, dil }) => (
              <tr key={user.id} className="border-b border-[var(--line)] last:border-0">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 tabular-nums">
                  {b.al.accrued + b.al.opening} / {b.al.remaining}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {b.sl.accrued + b.sl.opening} / {b.sl.remaining}
                </td>
                <td className="px-4 py-3 tabular-nums">
                  {dil.earned} / {dil.remaining}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm">
        <a href="/admin/adjustments" className="text-[var(--brand)]">
          Manual adjustments →
        </a>
      </p>
    </div>
  );
}
