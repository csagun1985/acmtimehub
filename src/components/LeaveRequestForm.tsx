"use client";

import { useState } from "react";
import { Button, Field, inputClass } from "@/components/ui";

type Props = {
  defaultType: string;
  action: (formData: FormData) => Promise<void>;
};

export function LeaveRequestForm({ defaultType, action }: Props) {
  const [type, setType] = useState(defaultType);
  const [slCategory, setSlCategory] = useState("SELF");

  return (
    <form action={action} className="space-y-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6">
      <Field label="Type">
        <select
          name="type"
          className={inputClass}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="AL">Annual Leave (AL)</option>
          <option value="SL">Sick Leave (SL)</option>
          <option value="DIL_USE">DIL Use</option>
        </select>
      </Field>

      {type === "SL" ? (
        <div className="space-y-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] p-4">
          <Field
            label="Sick Leave category"
            hint="See Guidelines for unexpected emergencies and who counts as family / household."
          >
            <select
              name="slCategory"
              className={inputClass}
              value={slCategory}
              onChange={(e) => setSlCategory(e.target.value)}
            >
              <option value="SELF">Own illness or injury</option>
              <option value="CARER_EMERGENCY">
                Carer’s leave — family/household illness, injury, or unexpected emergency
              </option>
            </select>
          </Field>
          {slCategory === "CARER_EMERGENCY" ? (
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              An unexpected emergency is unforeseen, sudden, and urgent. It is not limited to
              illness or injury (e.g. collecting a child from school). Your notes should cover who
              needs care, your relationship to them, and the situation. Manager approval depends on
              the circumstances.
            </p>
          ) : (
            <p className="text-xs leading-relaxed text-[var(--muted)]">
              A medical certificate is required for own illness/injury of 2 or more consecutive
              calendar days.
            </p>
          )}
        </div>
      ) : (
        <input type="hidden" name="slCategory" value="SELF" />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Start / OT date" hint="For DIL OT Credit this is the date overtime was worked">
          <input type="date" name="startDate" required className={inputClass} />
        </Field>
        <Field label="End date" hint="Same as start for single day / OT credit">
          <input type="date" name="endDate" className={inputClass} />
        </Field>
      </div>

      <Field label="Hours (DIL only)" hint="Decimals allowed e.g. 3.5">
        <input
          type="number"
          name="hours"
          step="0.25"
          min="0"
          className={inputClass}
          placeholder="e.g. 4"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isHalfDay" className="size-4" />
        Half-day (AL/SL, single day only)
      </label>

      <Field label="Reason">
        <input name="reason" className={inputClass} placeholder="Short reason" />
      </Field>

      <Field
        label="Detailed notes"
        hint={
          type === "SL" && slCategory === "CARER_EMERGENCY"
            ? "Required — who needs care, relationship (family/household), and what happened"
            : "Optional for most requests"
        }
      >
        <textarea name="notes" rows={4} className={inputClass} />
      </Field>

      <Button type="submit">Submit for approval</Button>
    </form>
  );
}
