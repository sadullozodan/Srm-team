"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth/context";
import { ApiError } from "@/lib/api/client";
import { normalizePhone } from "@/lib/phone";
import { AuthTabs } from "../auth-tabs";

// Field order is the Figma's. Everything after `phone` is optional on the
// backend, so an empty box is sent as null rather than an empty string.
const FIELDS = [
  { name: "firstName", label: "First name", type: "text", autoComplete: "given-name", required: true },
  { name: "lastName", label: "Last name", type: "text", autoComplete: "family-name", required: true },
  { name: "birthDate", label: "Date of birthday", type: "date", autoComplete: "bday", required: false },
  { name: "address", label: "Address", type: "text", autoComplete: "street-address", required: false },
  { name: "phone", label: "Phone", type: "tel", autoComplete: "tel", required: true },
  { name: "parentPhone", label: "Parent's phone", type: "tel", autoComplete: "off", required: false },
] as const;

type FieldName = (typeof FIELDS)[number]["name"];

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading } = useAuth();

  const [values, setValues] = useState<Record<FieldName, string>>({
    firstName: "",
    lastName: "",
    birthDate: "",
    address: "",
    phone: "",
    parentPhone: "",
  });
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace("/");
  }, [isLoading, isAuthenticated, router]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // The phone doubles as the account's userName, so it has to be stored in
      // the same shape the login screen will send.
      await register({
        firstName: values.firstName,
        lastName: values.lastName,
        phone: normalizePhone(values.phone),
        password,
        birthDate: values.birthDate || null,
        address: values.address || null,
        parentPhone: values.parentPhone ? normalizePhone(values.parentPhone) : null,
      });
      router.replace("/");
    } catch (err) {
      if (err instanceof ApiError) {
        // Duplicate phone and weak password both come back as 400.
        setError(err.message || "Couldn't create the account.");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    } finally {
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
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="sr-only">
              {field.label}
            </label>
            <Input
              id={field.name}
              type={field.type}
              value={values[field.name]}
              onChange={(e) =>
                setValues((v) => ({ ...v, [field.name]: e.target.value }))
              }
              autoComplete={field.autoComplete}
              required={field.required}
              maxLength={100}
              className="h-13"
              placeholder={field.label}
            />
          </div>
        ))}

        <div className="relative">
          <label htmlFor="password" className="sr-only">
            Password
          </label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
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

        <Button type="submit" className="h-12 w-full" disabled={submitting}>
          {submitting && <Loader2 className="animate-spin" />}
          Sign up
        </Button>
      </div>
    </form>
  );
}
