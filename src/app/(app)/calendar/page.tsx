import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";

const typeColor: Record<string, string> = {
  AL: "var(--al)",
  SL: "var(--sl)",
  DIL_USE: "var(--dil)",
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  await requireSession();
  const params = await searchParams;
  const base = params.month
    ? startOfMonth(parseISO(params.month + "-01"))
    : startOfMonth(new Date());

  const monthStart = startOfMonth(base);
  const monthEnd = endOfMonth(base);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const leaves = await prisma.leaveRequest.findMany({
    where: {
      status: "APPROVED",
      type: { in: ["AL", "SL", "DIL_USE"] },
      startDate: { lte: monthEnd },
      endDate: { gte: monthStart },
    },
    include: { user: { select: { name: true } } },
  });

  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const prev = format(subMonths(base, 1), "yyyy-MM");
  const next = format(addMonths(base, 1), "yyyy-MM");

  return (
    <div>
      <PageHeader
        title="Team calendar"
        subtitle="Approved AL, SL, and DIL Use across all staff"
        action={
          <div className="flex items-center gap-2 text-sm">
            <Link
              href={`/calendar?month=${prev}`}
              className="rounded-md border border-[var(--line)] px-3 py-1.5"
            >
              ← Prev
            </Link>
            <span className="min-w-[9rem] text-center font-medium">
              {format(base, "MMMM yyyy")}
            </span>
            <Link
              href={`/calendar?month=${next}`}
              className="rounded-md border border-[var(--line)] px-3 py-1.5"
            >
              Next →
            </Link>
          </div>
        }
      />

      <div className="mb-3 flex gap-4 text-xs text-[var(--muted)]">
        <span>
          <span className="mr-1 inline-block size-2 rounded-full bg-[var(--al)]" /> AL
        </span>
        <span>
          <span className="mr-1 inline-block size-2 rounded-full bg-[var(--sl)]" /> SL
        </span>
        <span>
          <span className="mr-1 inline-block size-2 rounded-full bg-[var(--dil)]" /> DIL Use
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
        <div className="grid grid-cols-7 border-b border-[var(--line)] bg-[var(--bg)] text-center text-xs font-medium text-[var(--muted)]">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d} className="px-2 py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const dayLeaves = leaves.filter(
              (l) =>
                format(l.startDate, "yyyy-MM-dd") <= key &&
                format(l.endDate, "yyyy-MM-dd") >= key
            );
            const inMonth = isSameMonth(day, base);
            return (
              <div
                key={key}
                className={`min-h-24 border-b border-r border-[var(--line)] p-1.5 ${
                  inMonth ? "bg-white" : "bg-[var(--bg)]/60"
                }`}
              >
                <div
                  className={`text-xs ${inMonth ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}
                >
                  {format(day, "d")}
                </div>
                <div className="mt-1 space-y-0.5">
                  {dayLeaves.slice(0, 3).map((l) => (
                    <div
                      key={l.id + key}
                      className="truncate rounded px-1 text-[10px] leading-4 text-white"
                      style={{ background: typeColor[l.type] ?? "#666" }}
                      title={`${l.user.name} · ${l.type}`}
                    >
                      {l.user.name.split(" ")[0]}
                    </div>
                  ))}
                  {dayLeaves.length > 3 ? (
                    <div className="text-[10px] text-[var(--muted)]">
                      +{dayLeaves.length - 3} more
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
