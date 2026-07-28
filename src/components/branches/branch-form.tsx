"use client";

// Shared create/edit form for a branch (POST/PUT /api/Branches).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { branchesApi } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { ActivationStatus, BranchDto, BranchWriteDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STATUSES: ActivationStatus[] = ["Active", "Inactive"];

interface FormState {
  title: string;
  city: string;
  district: string;
  address: string;
  status: ActivationStatus;
}

function toState(b?: BranchDto): FormState {
  return {
    title: b?.title ?? "",
    city: b?.city ?? "",
    district: b?.district ?? "",
    address: b?.address ?? "",
    status: b?.status ?? "Active",
  };
}

function toWriteDto(f: FormState): BranchWriteDto {
  const clean = (v: string) => (v.trim() === "" ? null : v.trim());
  return {
    title: f.title.trim(),
    city: clean(f.city),
    district: clean(f.district),
    address: clean(f.address),
    status: f.status,
  };
}

export function BranchForm({
  branchId,
  initial,
}: {
  branchId?: string;
  initial?: BranchDto;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => toState(initial));
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (body: BranchWriteDto) =>
      branchId ? branchesApi.update(branchId, body) : branchesApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Branches"] });
      router.push("/branches");
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Couldn't save the branch.");
    },
  });

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    mutation.mutate(toWriteDto(form));
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <Card>
        <CardContent className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">Branch details</h2>

          <Field label="Title" required>
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              className="h-10"
              placeholder="e.g. Sadbarg"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City">
              <Input
                value={form.city}
                onChange={(e) => set("city", e.target.value)}
                className="h-10"
                placeholder="Dushanbe"
              />
            </Field>
            <Field label="District">
              <Input
                value={form.district}
                onChange={(e) => set("district", e.target.value)}
                className="h-10"
                placeholder="Shohmansur"
              />
            </Field>
          </div>

          <Field label="Address">
            <Input
              value={form.address}
              onChange={(e) => set("address", e.target.value)}
              className="h-10"
              placeholder="Ayni street 46"
            />
          </Field>

          <Field label="Status">
            <div className="inline-flex flex-wrap gap-2">
              {STATUSES.map((option) => {
                const active = option === form.status;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => set("status", option)}
                    aria-pressed={active}
                    className={cn(
                      "h-10 rounded-lg border px-4 text-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-secondary text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </Field>
        </CardContent>
      </Card>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" className="h-10" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Save branch
        </Button>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="h-10"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
      {children}
    </div>
  );
}
