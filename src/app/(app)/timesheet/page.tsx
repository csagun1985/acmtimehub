import Link from "next/link";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import {
  getOrCreateTimesheetWeek,
  saveTimesheetDraft,
  submitTimesheet,
} from "@/lib/timesheet/actions";
import { calculateDilOt } from "@/lib/timesheet/ot";
import { getHourStandards } from "@/lib/timesheet/standards";
import {
  formatWeekLabel,
  getSubmitDeadline,
  isLateSubmission,
  weekStartFromParam,
} from "@/lib/timesheet/week";
import { PageHeader, Button } from "@/components/ui";
import { TimesheetWeekForm } from "@/components/TimesheetWeekForm";
import { addWeeks, subWeeks, format as formatDate } from "date-fns";

export default async function TimesheetPage({
  searchParams,
}: {
  searchParams: Promise<{ week?: string; error?: string }>;
}) {
  const session = await requireSession();
  const params = await searchParams;
  const weekStart = weekStartFromParam(params.week);
  const weekStartKey = formatDate(weekStart, "yyyy-MM-dd");

  const dbUser = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
  });
  const week = await getOrCreateTimesheetWeek(session.user.id, weekStart);
  const standards = getHourStandards(dbUser.employmentType);
  const ot = calculateDilOt(
    dbUser.employmentType,
    week.days.map((d) => ({ date: d.date, hours: d.hours, isOff: d.isOff }))
  );
  const deadline = getSubmitDeadline(weekStart);
  const currentlyLate = isLateSubmission(weekStart, new Date());

  async function saveAction(formData: FormData) {
    "use server";
    try {
      await saveTimesheetDraft(formData);
      redirect(`/timesheet?week=${weekStartKey}`);
    } catch (e) {
      if (e && typeof e === "object" && "digest" in e) throw e;
      const message = e instanceof Error ? e.message : "Failed";
      redirect(`/timesheet?week=${weekStartKey}&error=${encodeURIComponent(message)}`);
    }
  }

  async function submitAction(formData: FormData) {
    "use server";
    try {
      await submitTimesheet(formData);
      redirect(`/timesheet?week=${weekStartKey}`);
    } catch (e) {
      if (e && typeof e === "object" && "digest" in e) throw e;
      const message = e instanceof Error ? e.message : "Failed";
      redirect(`/timesheet?week=${weekStartKey}&error=${encodeURIComponent(message)}`);
    }
  }

  const prev = formatDate(subWeeks(weekStart, 1), "yyyy-MM-dd");
  const next = formatDate(addWeeks(weekStart, 1), "yyyy-MM-dd");

  return (
    <div>
      <PageHeader
        title="Timesheet"
        subtitle="Enter total hours per day (Mon–Sun). DIL OT is created when your manager approves."
        action={
          <div className="flex items-center gap-2 text-sm">
            <Link
              href={`/timesheet?week=${prev}`}
              className="rounded-md border border-[var(--line)] px-3 py-1.5"
            >
              ← Prev
            </Link>
            <Link
              href={`/timesheet?week=${next}`}
              className="rounded-md border border-[var(--line)] px-3 py-1.5"
            >
              Next →
            </Link>
            <Link href="/timesheet/history">
              <Button variant="secondary">History</Button>
            </Link>
          </div>
        }
      />

      {params.error ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
          {params.error}
        </div>
      ) : null}

      {currentlyLate && week.status === "DRAFT" ? (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-[var(--warn)]">
          Past Monday 12:00 Sydney deadline — submit will be flagged as late.
        </div>
      ) : null}

      <TimesheetWeekForm
        weekStart={weekStartKey}
        weekLabel={formatWeekLabel(weekStart)}
        deadlineLabel={format(deadline, "EEE dd MMM yyyy HH:mm") + " (Sydney)"}
        isLateAlready={week.isLate}
        status={week.status}
        weekNote={week.weekNote}
        days={week.days.map((d) => ({
          id: d.id,
          date: d.date.toISOString(),
          hours: d.hours,
          isOff: d.isOff,
          note: d.note,
        }))}
        employmentType={dbUser.employmentType}
        dailyStandard={standards.daily}
        weeklyStandard={standards.weekly}
        previewDil={ot.dilHours}
        weekTotal={ot.weekTotal}
        rejectionReason={week.rejectionReason}
        saveAction={saveAction}
        submitAction={submitAction}
      />
    </div>
  );
}
