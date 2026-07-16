import { requireSession } from "@/lib/session";
import { PageHeader } from "@/components/ui";

const sections = [
  {
    title: "Overview",
    body: [
      "Service Incentive Leave covers Annual Leave (AL), Sick Leave (SL), and Day in Lieu (DIL).",
      "The leave year runs from 1 July to 30 June.",
      "All leave requests are approved by your SIL Approver (or Admin) before they are confirmed.",
    ],
  },
  {
    title: "Accrual and when you can use AL / SL",
    body: [
      "AL and SL start accruing from your contract start date when your employment includes those entitlements.",
      "You can use AL and SL only after you pass your probationary period, or when you are converted to Permanent status.",
      "Casual employment typically has no AL accrual, SL accrual, or public holiday entitlement.",
      "Balances still appear on your dashboard while you accrue during probation — usage is unlocked once eligible.",
    ],
  },
  {
    title: "Annual Leave (AL)",
    body: [
      "Entitlement is 20 days per fiscal year, accrued from your start date (pro-rata).",
      "Half-days (0.5) are allowed.",
      "Unused AL carries over at year end as a Service Incentive Leave with manager's approval.",
      "Weekends and Australian public holidays for your assigned state are not counted against your balance.",
      "Notice periods: 1 day of AL must be requested at least 3 days before the start date; 2 days of AL at least 2 weeks before; 3 or more days of AL at least 4 weeks before.",
    ],
  },
  {
    title: "Sick Leave (SL)",
    body: [
      "Entitlement is 10 days per fiscal year, accrued from your start date (pro-rata).",
      "Half-days (0.5) are allowed.",
      "Unused SL does not carry over; it resets each fiscal year.",
      "Weekends and public holidays for your state are not counted against your balance.",
      "A medical certificate must be uploaded in the app for sick leave of 2 or more consecutive calendar days (own illness/injury).",
      "You may use SL for your own illness or injury, or as carer’s leave when an immediate family or household member needs care because of an illness, injury, or unexpected emergency.",
    ],
  },
  {
    title: "Unexpected emergencies (carer’s leave)",
    body: [
      "An unexpected emergency is an unforeseen or sudden and urgent event or situation.",
      "Whether you can take leave because of an unexpected emergency depends on the circumstances.",
      "Unexpected emergencies are not limited to illnesses or injuries — for example, they can include needing time to pick up a child from school.",
      "Things to consider may include: how much notice (if any) you had of the emergency; whether you can work from home or use other arrangements (such as changing your pattern of work); the age and independence of the person who needs care; and whether you can make alternative care arrangements.",
      "When requesting SL for an unexpected emergency, describe the situation in your notes so your manager can assess the request.",
    ],
  },
  {
    title: "Immediate family and household members",
    body: [
      "An immediate family member includes: spouse or former spouse; de facto partner or former de facto partner; child; parent; grandparent; grandchild; sibling; or a child, parent, grandparent, grandchild or sibling of your spouse or de facto partner (including former spouse or former de facto partner).",
      "A de facto partner is a person who lives with you in a relationship as a couple on a genuine domestic basis but is not married to you. They may be the same sex or a different sex, and may be a current or former de facto partner.",
      "This definition includes step-relations (for example, step-parents and step-children) as well as adoptive relations.",
      "A household member is any person who lives with you.",
    ],
  },
  {
    title: "Day in Lieu (DIL)",
    body: [
      "DIL is earned from overtime on your approved weekly timesheet, and used as time off under Service Incentive Leave.",
      "Earn DIL: fill Timesheet (Mon–Sun hours). On approval, OT above your daily/weekly standard is credited automatically (full-time 8h/day & 40h/week; part-time 4h/day & 20h/week). Hours on days you mark Off count fully toward DIL.",
      "Use DIL: submit a DIL Use request under Leave. You cannot use more hours than you have available.",
      "Unused DIL credit expires 90 days after the date the overtime was worked. Oldest credit is used first (FIFO).",
      "Approved DIL Use appears on the team calendar.",
    ],
  },
  {
    title: "Timesheets",
    body: [
      "Weeks run Monday to Sunday. Enter total hours per day and optional notes. Tick Off for days you are not rostered.",
      "Submit each week by Monday 12:00 noon Australia/Sydney. Late submissions are allowed and flagged for your manager.",
      "Your Timesheet Approver (or Admin) approves or rejects the whole week. Rejected weeks can be edited and resubmitted.",
    ],
  },
  {
    title: "Public holidays",
    body: [
      "We use Australian public holidays based on the state assigned to your profile.",
      "If your employment includes a public holiday entitlement, public holidays inside a leave range are excluded from the day/hour count for AL, SL, and DIL Use.",
      "Casual arrangements typically do not include a public holiday entitlement.",
    ],
  },
  {
    title: "Your profile",
    body: [
      "Staff can update name, phone, personal email, birthdate, and address under My profile.",
      "Admin sets Access type (Staff, Manager, or Admin), Timesheet Approver, and SIL Approver on each person’s profile. Assigned managers (and Admin) approve the matching submissions, and can edit that candidate’s employment details.",
      "Admin can approve any timesheet or leave request and can edit any profile.",
      "Managers and Admin also set start/end dates, employment status (Probationary, Permanent, Casual), employment type (Part time / Full time), and entitlements (AL accrual, SL accrual, Public holiday).",
    ],
  },
  {
    title: "How to request leave",
    body: [
      "Go to Request leave, choose the type, enter dates (and hours for DIL), and add a reason or notes as required.",
      "For AL, plan ahead using the notice periods above — the system will reject requests that are too short notice.",
      "For SL, choose whether it is your own illness/injury or carer’s leave / unexpected emergency, and provide notes.",
      "Earn DIL via Timesheet approval; spend DIL with a DIL Use request.",
      "Your request stays Pending until your manager approves or rejects it.",
      "You can cancel a pending request from My requests.",
      "After approval, leave shows on the team calendar (AL, SL, and DIL Use).",
    ],
  },
  {
    title: "Balances on your dashboard",
    body: [
      "For each leave type you will see both accrued/earned and remaining.",
      "AL and SL are shown in days; DIL is shown in hours.",
      "If any DIL hours are close to expiry, a reminder may appear on your dashboard.",
    ],
  },
];

export default async function GuidelinesPage() {
  await requireSession();

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Guidelines"
        subtitle="How Service Incentive Leave works — AL, SL, and DIL."
      />

      <div className="space-y-4">
        {sections.map((section) => (
          <section
            key={section.title}
            id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
            className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5"
          >
            <h2 className="text-lg font-semibold text-[var(--ink)]">{section.title}</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[var(--muted)]">
              {section.body.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-6 text-xs text-[var(--muted)]">
        Unexpected emergency and family definitions are based on Australian Fair Work guidance for
        carer’s leave. If anything is unclear, contact your manager or Admin before submitting a
        request.
      </p>
    </div>
  );
}
