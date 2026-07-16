import Link from "next/link";
import Image from "next/image";
import { auth, signOut } from "@/lib/auth";
import { AppNav } from "@/components/AppNav";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = session?.user?.role;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-[var(--line)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-start justify-between gap-4 px-4 py-4">
          <div className="flex min-w-0 flex-1 flex-wrap items-start gap-5">
            <Link href="/timesheet" className="shrink-0 pt-1">
              <span className="text-2xl font-semibold tracking-tight text-[var(--ink)]">
                Time<span className="text-[var(--brand)]">Hub</span>
              </span>
            </Link>
            <AppNav role={role} />
          </div>

          <div className="ml-auto flex w-max max-w-full shrink-0 flex-col items-center gap-2">
            <div
              className="flex items-center justify-center gap-4"
              aria-label="Partner brands"
            >
              <a
                href="https://www.acmrecruitment.com.au/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md opacity-95 transition hover:opacity-100"
                title="ACM Recruitment"
              >
                <Image
                  src="/brand/acm-logo.png"
                  alt="ACM Recruitment"
                  width={160}
                  height={52}
                  className="h-11 w-auto object-contain"
                  priority
                />
              </a>
              <span className="h-8 w-px bg-[var(--line)]" aria-hidden />
              <a
                href="https://www.salveohomecare.com.au/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md opacity-95 transition hover:opacity-100"
                title="Salveo Homecare"
              >
                <Image
                  src="/brand/salveo-logo.svg"
                  alt="Salveo Homecare"
                  width={170}
                  height={52}
                  className="h-11 w-auto object-contain"
                  priority
                />
              </a>
            </div>

            <div className="flex items-center justify-center gap-3 text-sm">
              <Link href="/profile" className="text-right hover:opacity-80">
                <div className="font-medium text-[var(--ink)]">{session?.user?.name}</div>
                <div className="text-xs uppercase tracking-wide text-[var(--muted)]">
                  {session?.user?.role} · {session?.user?.state}
                </div>
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-[var(--line)] px-3 py-1.5 text-sm font-medium text-[var(--ink)] hover:border-[var(--brand)] hover:text-[var(--brand)]"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
