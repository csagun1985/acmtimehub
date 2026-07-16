"use client";

import { format } from "date-fns";
import { Button, Field, inputClass } from "@/components/ui";

type Day = {
  id: string;
  date: string; // ISO
  hours: number;
  isOff: boolean;
  note: string | null;
};

type Props = {
  weekStart: string;
  weekLabel: string;
  deadlineLabel: string;
  isLateAlready: boolean;
  status: string;
  weekNote: string | null;
  days: Day[];
  employmentType: string;
  dailyStandard: number;
  weeklyStandard: number;
  previewDil: number;
  weekTotal: number;
  rejectionReason?: string | null;
  saveAction: (formData: FormData) => Promise<void>;
  submitAction: (formData: FormData) => Promise<void>;
};

export function TimesheetWeekForm({
  weekStart,
  weekLabel,
  deadlineLabel,
  isLateAlready,
  status,
  weekNote,
  days,
  employmentType,
  dailyStandard,
  weeklyStandard,
  previewDil,
  weekTotal,
  rejectionReason,
  saveAction,
  submitAction,
}: Props) {
  const locked = status === "SUBMITTED" || status === "APPROVED";

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">
        <p>
          <strong className="text-[var(--ink)]">{weekLabel}</strong>
          {" · "}
          {employmentType === "PART_TIME" ? "Part-time" : "Full-time"}
          {` (${dailyStandard}h/day, ${weeklyStandard}h/week)`}
        </p>
        <p className="mt-1">
          Submit by <strong className="text-[var(--ink)]">{deadlineLabel}</strong> (Sydney time).
          Late submissions are allowed and flagged.
        </p>
        <p className="mt-1">
          Tick <strong>Off</strong> for non-work days. Hours on Off days count fully toward DIL OT.
          DIL OT = hours above daily/weekly standard (whichever is higher).
        </p>
      </div>

      {status === "REJECTED" && rejectionReason ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
          Rejected: {rejectionReason}. Edit and resubmit.
        </div>
      ) : null}

      {status === "SUBMITTED" ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-[var(--warn)]">
          Submitted{isLateAlready ? " (late)" : ""} — waiting for manager approval.
        </div>
      ) : null}

      {status === "APPROVED" ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Approved. DIL credited from this week (see History / Dashboard).
        </div>
      ) : null}

      <form className="space-y-4">
        <input type="hidden" name="weekStart" value={weekStart} />

        <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--line)] bg-[var(--bg)] text-[var(--muted)]">
              <tr>
                <th className="px-3 py-2 font-medium">Day</th>
                <th className="px-3 py-2 font-medium">Off</th>
                <th className="px-3 py-2 font-medium">Hours</th>
                <th className="px-3 py-2 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => {
                const key = format(new Date(d.date), "yyyy-MM-dd");
                const label = format(new Date(d.date), "EEE dd MMM");
                return (
                  <tr key={d.id} className="border-b border-[var(--line)] last:border-0">
                    <td className="px-3 py-2 font-medium">{label}</td>
                    <td className="px-3 py-2">
                      <input
                        type="checkbox"
                        name={`off_${key}`}
                        defaultChecked={d.isOff}
                        disabled={locked}
                        className="size-4"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="number"
                        name={`hours_${key}`}
                        step="0.25"
                        min="0"
                        defaultValue={d.hours || ""}
                        disabled={locked}
                        className={`${inputClass} max-w-[6rem]`}
                        placeholder="0"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        name={`note_${key}`}
                        defaultValue={d.note ?? ""}
                        disabled={locked}
                        className={inputClass}
                        placeholder="Optional"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Field label="Week note">
          <textarea
            name="weekNote"
            rows={2}
            defaultValue={weekNote ?? ""}
            disabled={locked}
            className={inputClass}
            placeholder="Optional note for the manager"
          />
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm">
          <div>
            Week total (saved): <strong>{weekTotal}h</strong>
            {" · "}
            Est. DIL OT: <strong>{previewDil}h</strong>
          </div>
          {!locked ? (
            <div className="flex gap-2">
              <Button formAction={saveAction} variant="secondary" type="submit">
                Save draft
              </Button>
              <Button formAction={submitAction} type="submit">
                Submit week
              </Button>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
}
