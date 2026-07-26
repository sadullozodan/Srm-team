"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import { usersApi } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { ActivationStatus } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/form-field";
import { normalizePhone } from "@/lib/phone";

const STATUS_OPTIONS: ActivationStatus[] = ["Active", "Inactive"];

export default function NewUserPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<ActivationStatus>("Active");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      usersApi.create({
        fullName: fullName.trim(),
        userName: normalizePhone(userName.trim()),
        password,
        status,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
      router.push("/administration/users");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Couldn't create the user."),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/administration/users" aria-label="Back" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create user</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          mutation.mutate();
        }}
        className="max-w-xl space-y-6"
      >
        <Card>
          <CardContent className="space-y-5 p-6">
            <h2 className="text-lg font-semibold">Account details</h2>
            <Field label="Full name" required>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={150}
                className="h-10"
                placeholder="e.g. John Doe"
              />
            </Field>
            <Field label="Username (phone)" required>
              <Input
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                maxLength={50}
                className="h-10"
                placeholder="e.g. +998901234567"
              />
            </Field>
            <Field label="Password" required>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  maxLength={100}
                  className="h-10 pr-11"
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute top-1/2 right-3.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value as ActivationStatus)} className="sm:max-w-44">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
          </CardContent>
        </Card>

        {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

        <div className="flex items-center gap-3">
          <Button type="submit" size="lg" className="h-10" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="animate-spin" />}
            Create user
          </Button>
          <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
