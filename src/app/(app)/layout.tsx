"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader } from "@/components/ui/Loading";
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
        <Loader size="md" />
      </div>
    );
  }

  return <AppShell>{children}</AppShell>;
}
