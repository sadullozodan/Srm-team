"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, TriangleAlert } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { AppShell } from "@/components/app-shell";

// Guards every authenticated route: unauthenticated visitors are bounced to the
// login screen; the chrome only mounts once we have a resolved user.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AppShell>
      <AccessBanner />
      {children}
    </AppShell>
  );
}

// Most CRM endpoints are admin-only, so a Student-only account gets 403 on every
// page. Explain that up front instead of leaving a wall of "Couldn't load…".
function AccessBanner() {
  const { user } = useAuth();
  const roles = user?.roles ?? [];
  const hasElevatedRole = roles.some((r) => r !== "Student");
  if (hasElevatedRole) return null;

  return (
    <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-300">
      <TriangleAlert className="mt-0.5 size-5 shrink-0" />
      <div>
        <p className="font-medium">Limited access</p>
        <p className="mt-0.5 text-amber-700/90 dark:text-amber-300/90">
          Your account role is <b>Student</b>, which the backend blocks from most
          pages (that&apos;s why they show &ldquo;Couldn&apos;t load…&rdquo;). Ask
          the backend owner for an <b>Admin</b> account, or to upgrade your role.
        </p>
      </div>
    </div>
  );
}
