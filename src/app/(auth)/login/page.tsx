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

  // Already signed in? Skip the form.
  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/");
  }, [isLoading, isAuthenticated, router]);

  // Wake the API early: free hosting (Render) spins the service down after
  // inactivity, and the first request can take ~50s. Ping /health on mount so
  // it's warming up while the user types.
  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (base) fetch(`${base}/health`, { mode: "cors" }).catch(() => {});
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    // If the request drags on, it's almost always a cold start — say so.
    const wakeHint = setTimeout(() => setWaking(true), 4000);
    try {
      // The backend matches the stored digits literally — so a "+" or a space
      // here reads as a wrong password. Normalize to the bare 992… form first.
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
      className="rounded-2xl bg-card p-6 shadow-sm sm:p-8"
    >
      <AuthTabs />

      <div className="mt-8 space-y-4">
        <div>
          <label htmlFor="phone" className="sr-only">
            Phone
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
            placeholder="Phone number"
          />
        </div>

        <div className="relative">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="h-13 pr-11"
            placeholder="Password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-5" />
            ) : (
              <Eye className="size-5" />
            )}
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        {waking && !error && (
          <p className="rounded-lg bg-amber-500/10 px-3 py-2 text-sm text-amber-600 dark:text-amber-400">
            Waking the server up — free hosting sleeps after inactivity, so the first sign-in can take up
            to a minute. Hang tight…
          </p>
        )}

        <Button type="submit" className="h-12 w-full" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          {submitting ? "Signing in…" : "Log in"}
        </Button>

        <Link
          href="/forgot-password"
          className="block text-center text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
