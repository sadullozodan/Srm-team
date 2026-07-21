"use client";

// Password recovery as the Figma's three modals, on one route. Step lives in
// local state because there is nothing to bookmark between the screens.
//
// ponytail: step 2 does not call the API, it just carries the code forward.
// The backend only exposes reset-by-code, so a wrong code surfaces on step 3.
// Split it into its own verify call the day the backend grows one.

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";

type Step = "phone" | "code" | "password";

const SCREENS = {
  phone: {
    art: "/auth/forgot-password.png",
    title: "Forgot password?",
    heading: "Verification code",
    body: "Don't worry! We'll send a code to your phone number to reset your password.",
  },
  code: {
    art: "/auth/verify-code.png",
    title: "Forgot password?",
    heading: "Verification code",
    body: "Enter the code that you received.",
  },
  password: {
    art: "/auth/reset-password.png",
    title: "Reset password",
    heading: "Create a new password",
    body: "",
  },
} as const;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const screen = SCREENS[step];

  async function sendCode() {
    await authApi.forgotPassword({ phone });
    setCode("");
    setStep("code");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (step === "code") {
      setStep("password");
      return;
    }

    if (step === "password" && newPassword !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      if (step === "phone") {
        await sendCode();
      } else {
        await authApi.resetPassword({ phone, code, newPassword });
        router.replace("/login");
      }
    } catch (err) {
      setError(
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Something went wrong.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function requestNewCode() {
    setError(null);
    setSubmitting(true);
    try {
      await sendCode();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-card p-6 shadow-sm sm:p-8"
    >
      <h1 className="text-lg font-semibold">{screen.title}</h1>

      <div className="mt-6 flex flex-col items-center text-center">
        <Image src={screen.art} alt="" width={128} height={128} className="size-28" />
        <p className="mt-4 font-semibold">{screen.heading}</p>
        {screen.body && (
          <p className="mt-1 text-sm text-muted-foreground">{screen.body}</p>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {step === "phone" && (
          <div>
            <label htmlFor="phone" className="sr-only">
              Phone
            </label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              required
              maxLength={30}
              className="h-13"
              placeholder="Phone"
            />
          </div>
        )}

        {step === "code" && (
          <div>
            <label htmlFor="code" className="sr-only">
              Verification code
            </label>
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              autoComplete="one-time-code"
              inputMode="numeric"
              required
              minLength={4}
              maxLength={10}
              className="h-13 tracking-[0.4em]"
              placeholder="Code"
            />
            <button
              type="button"
              onClick={requestNewCode}
              disabled={submitting}
              className="mt-3 block w-full text-center text-sm font-medium text-primary hover:underline"
            >
              Request a new code
            </button>
          </div>
        )}

        {step === "password" && (
          <>
            <PasswordField
              id="newPassword"
              label="New password"
              value={newPassword}
              onChange={setNewPassword}
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
            />
            <PasswordField
              id="confirm"
              label="Confirm password"
              value={confirm}
              onChange={setConfirm}
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
            />
          </>
        )}

        {error && (
          <p
            role="alert"
            className="rounded-lg bg-destructive/10 px-3 py-2 text-sm whitespace-pre-line text-destructive"
          >
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" className="h-12 flex-1" disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" />}
            {step === "phone" ? "Send code" : step === "code" ? "Verify" : "Save"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-12 flex-1"
            onClick={() => router.push("/login")}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="new-password"
        required
        minLength={6}
        maxLength={100}
        className="h-13 pr-11"
        placeholder={label}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
      </button>
    </div>
  );
}
