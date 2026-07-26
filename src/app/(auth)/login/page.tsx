"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/context";
import { ApiError } from "@/lib/api/client";
import { normalizePhone } from "@/lib/phone";
import { AuthTabs } from "../auth-tabs";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [waking, setWaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/");
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (base) fetch(`${base}/health`, { mode: "cors" }).catch(() => {});
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const wakeHint = setTimeout(() => setWaking(true), 4000);

    try {
      await login({ phone: normalizePhone(phone), password });
      router.replace("/");
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Incorrect phone number or password.");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
      clearTimeout(wakeHint);
      setWaking(false);
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[1.25rem] border border-border/80 bg-card/92 p-5 shadow-[0_24px_80px_rgb(26_31_48_/_0.12)] backdrop-blur sm:p-7 dark:shadow-[0_30px_90px_rgb(0_0_0_/_0.32)]"
    >
      <AuthTabs />

      <div className="mt-7">
        <h1 className="text-2xl font-bold tracking-[-0.025em]">Welcome back</h1>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
          Sign in to continue to your OMUZ workspace.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-sm font-medium text-foreground">
            Phone number
          </label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            required
            className="h-13"
            placeholder="992 90 123 45 67"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="h-13 pr-11"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        {waking && !error && (
          <p className="rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
            Waking the server up. Free hosting sleeps after inactivity, so the first sign-in can take up
            to a minute.
          </p>
        )}

        <Button type="submit" className="h-12 w-full" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {submitting ? "Signing in..." : "Log in"}
        </Button>

        <Link
          href="/forgot-password"
          className="block text-center text-sm font-semibold text-primary transition-colors hover:text-[color-mix(in_oklch,var(--primary),black_12%)] hover:underline"
        >
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
