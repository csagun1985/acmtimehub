export function BalanceCard({
  title,
  color,
  accruedLabel,
  accrued,
  remaining,
  unit,
  hint,
}: {
  title: string;
  color: string;
  accruedLabel: string;
  accrued: number;
  remaining: number;
  unit: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
          {title}
        </h3>
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: color }}
          aria-hidden
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-[var(--muted)]">{accruedLabel}</div>
          <div className="text-2xl font-semibold tabular-nums" style={{ color }}>
            {accrued}
            <span className="ml-1 text-sm font-normal text-[var(--muted)]">{unit}</span>
          </div>
        </div>
        <div>
          <div className="text-xs text-[var(--muted)]">Remaining</div>
          <div className="text-2xl font-semibold tabular-nums">
            {remaining}
            <span className="ml-1 text-sm font-normal text-[var(--muted)]">{unit}</span>
          </div>
        </div>
      </div>
      {hint ? <p className="mt-3 text-xs text-[var(--warn)]">{hint}</p> : null}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--ink)]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-[var(--muted)]">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
}) {
  const styles =
    variant === "primary"
      ? "bg-[var(--brand)] text-white hover:bg-[var(--brand-dark)]"
      : variant === "danger"
        ? "bg-[var(--danger)] text-white hover:opacity-90"
        : "border border-[var(--line)] bg-white text-[var(--ink)] hover:border-[var(--brand)] hover:text-[var(--brand)]";
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-50 ${styles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="font-medium text-[var(--ink)]">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-[var(--muted)]">{hint}</span> : null}
    </label>
  );
}

export const inputClass =
  "w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2 outline-none focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand-soft)]";
