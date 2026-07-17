import { redirect } from "next/navigation";
import { auth, signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { Button, Field, inputClass } from "@/components/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/timesheet");
  const params = await searchParams;
  const showDemoLogins =
    process.env.NODE_ENV === "development" ||
    process.env.SHOW_DEMO_LOGINS === "1";

  async function loginAction(formData: FormData) {
    "use server";
    try {
      await signIn("credentials", {
        email: String(formData.get("email")),
        password: String(formData.get("password")),
        redirectTo: "/timesheet",
      });
    } catch (e) {
      if (e instanceof AuthError) {
        redirect("/login?error=CredentialsSignin");
      }
      throw e;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm">
        <div className="mb-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
            ACM Recruitment
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-[var(--ink)]">
            Time<span className="text-[var(--brand)]">Hub</span>
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Sign in to manage timesheets, Annual Leave, Sick Leave, and Day in Lieu.
          </p>
        </div>

        {params.error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-[var(--danger)]">
            Invalid email or password.
          </div>
        ) : null}

        <form action={loginAction} className="space-y-4">
          <Field label="Email">
            <input
              className={inputClass}
              type="email"
              name="email"
              required
              autoComplete="username"
              defaultValue={showDemoLogins ? "staff.nsw@sil.local" : undefined}
            />
          </Field>
          <Field label="Password">
            <input
              className={inputClass}
              type="password"
              name="password"
              required
              autoComplete="current-password"
              defaultValue={showDemoLogins ? "Password123!" : undefined}
            />
          </Field>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>

        {showDemoLogins ? (
          <div className="mt-6 rounded-lg bg-[var(--bg)] p-3 text-xs text-[var(--muted)]">
            <p className="font-medium text-[var(--ink)]">Demo accounts (local only)</p>
            <ul className="mt-1 space-y-0.5">
              <li>staff.nsw@sil.local / Password123!</li>
              <li>staff.vic@sil.local / Password123!</li>
              <li>manager@sil.local / Password123!</li>
              <li>admin@sil.local / Password123!</li>
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
