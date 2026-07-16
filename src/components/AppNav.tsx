"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Role = string | undefined;

function isTimesheetPath(pathname: string) {
  return (
    pathname.startsWith("/timesheet") ||
    pathname.startsWith("/manager/timesheets") ||
    pathname.startsWith("/admin/timesheets")
  );
}

function isLeavePath(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/requests") ||
    pathname.startsWith("/calendar") ||
    pathname.startsWith("/guidelines") ||
    pathname.startsWith("/profile") ||
    pathname === "/manager" ||
    pathname.startsWith("/admin/people") ||
    pathname.startsWith("/admin/balances") ||
    pathname.startsWith("/admin/reports") ||
    pathname.startsWith("/admin/adjustments")
  );
}

function subLinkClass(active: boolean) {
  return active
    ? "rounded-full bg-[var(--brand-soft)] px-3 py-1.5 text-sm font-medium text-[var(--brand-dark)]"
    : "rounded-full px-3 py-1.5 text-sm font-medium text-[var(--ink)] hover:bg-[var(--brand-soft)] hover:text-[var(--brand-dark)]";
}

function SectionButton({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2.5 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-semibold uppercase tracking-wide transition ${
        active
          ? "bg-[var(--brand-soft)] text-[var(--ink)]"
          : "text-[var(--ink)] hover:bg-[var(--brand-soft)]/60"
      }`}
    >
      <span className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--brand)] text-white shadow-sm">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M3.5 10.5 10.5 3.5M10.5 3.5H5M10.5 3.5V9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {children}
    </Link>
  );
}

export function AppNav({ role }: { role: Role }) {
  const pathname = usePathname() || "/timesheet";
  const inTimesheet = isTimesheetPath(pathname);
  const inLeave = isLeavePath(pathname);
  const section = inLeave && !inTimesheet ? "leave" : "timesheet";

  return (
    <nav className="flex flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <SectionButton href="/timesheet" active={section === "timesheet"}>
          Timesheet
        </SectionButton>
        <SectionButton href="/dashboard" active={section === "leave"}>
          Service Incentive Leave
        </SectionButton>
      </div>

      {section === "timesheet" ? (
        <div className="flex flex-wrap items-center gap-1">
          <Link href="/timesheet" className={subLinkClass(pathname === "/timesheet")}>
            This week
          </Link>
          <Link
            href="/timesheet/history"
            className={subLinkClass(pathname.startsWith("/timesheet/history"))}
          >
            History
          </Link>
          {(role === "MANAGER" || role === "ADMIN") && (
            <Link
              href="/manager/timesheets"
              className={subLinkClass(pathname.startsWith("/manager/timesheets"))}
            >
              Approvals
            </Link>
          )}
          {role === "ADMIN" && (
            <Link
              href="/admin/timesheets"
              className={subLinkClass(pathname.startsWith("/admin/timesheets"))}
            >
              Export
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-1">
          <Link href="/dashboard" className={subLinkClass(pathname === "/dashboard")}>
            Dashboard
          </Link>
          <Link
            href="/requests/new"
            className={subLinkClass(pathname.startsWith("/requests/new"))}
          >
            Request
          </Link>
          <Link
            href="/requests"
            className={subLinkClass(
              pathname === "/requests" ||
                (pathname.startsWith("/requests/") && !pathname.startsWith("/requests/new"))
            )}
          >
            My requests
          </Link>
          <Link
            href="/calendar"
            className={subLinkClass(pathname.startsWith("/calendar"))}
          >
            Calendar
          </Link>
          <Link
            href="/guidelines"
            className={subLinkClass(pathname.startsWith("/guidelines"))}
          >
            Guidelines
          </Link>
          <Link
            href="/profile"
            className={subLinkClass(pathname.startsWith("/profile"))}
          >
            My profile
          </Link>
          {(role === "MANAGER" || role === "ADMIN") && (
            <Link href="/manager" className={subLinkClass(pathname === "/manager")}>
              Approvals
            </Link>
          )}
          {(role === "MANAGER" || role === "ADMIN") && (
            <Link
              href="/admin/people"
              className={subLinkClass(pathname.startsWith("/admin/people"))}
            >
              People
            </Link>
          )}
          {role === "ADMIN" && (
            <>
              <Link
                href="/admin/balances"
                className={subLinkClass(pathname.startsWith("/admin/balances"))}
              >
                Balances
              </Link>
              <Link
                href="/admin/reports"
                className={subLinkClass(pathname.startsWith("/admin/reports"))}
              >
                Reports
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
