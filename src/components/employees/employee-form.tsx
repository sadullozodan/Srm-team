"use client";

// Shared create/edit form for an employee. Drives POST /api/Employees (create)
// or PUT /api/Employees/{id} (edit). Branch and position options come from
// their own list endpoints.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2 } from "lucide-react";
import {
  branchesApi,
  employeesApi,
  positionsApi,
  queryKeys,
} from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type {
  ActivationStatus,
  EmployeeDto,
  EmployeeWriteDto,
} from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STATUSES: ActivationStatus[] = ["Active", "Inactive"];

interface FormState {
  firstName: string;
  lastName: string;
  birthDate: string;
  phoneNumber: string;
  email: string;
  address: string;
  telegramUsername: string;
  description: string;
  photoUrl: string;
  experience: string;
  hourRate: string;
  status: ActivationStatus;
  branchId: string;
  positionIds: string[];
}

function toState(e?: EmployeeDto): FormState {
  return {
    firstName: e?.firstName ?? "",
    lastName: e?.lastName ?? "",
    birthDate: e?.birthDate ? e.birthDate.slice(0, 10) : "",
    phoneNumber: e?.phoneNumber ?? "",
    email: e?.email ?? "",
    address: e?.address ?? "",
    telegramUsername: e?.telegramUsername ?? "",
    description: e?.description ?? "",
    photoUrl: e?.photoUrl ?? "",
    experience: e?.experience != null ? String(e.experience) : "",
    hourRate: e?.hourRate != null ? String(e.hourRate) : "",
    status: e?.status ?? "Active",
    branchId: e?.branchId ?? "",
    // EmployeeDto exposes position names, not ids, so edit starts unselected.
    positionIds: [],
  };
}

function toWriteDto(f: FormState): EmployeeWriteDto {
  const clean = (v: string) => (v.trim() === "" ? null : v.trim());
  return {
    firstName: f.firstName.trim(),
    lastName: f.lastName.trim(),
    birthDate: f.birthDate || null,
    phoneNumber: f.phoneNumber.trim(),
    email: clean(f.email),
    address: clean(f.address),
    telegramUsername: clean(f.telegramUsername),
    description: clean(f.description),
    photoUrl: clean(f.photoUrl),
    experience: Number(f.experience) || 0,
    hourRate: f.hourRate.trim() === "" ? null : Number(f.hourRate),
    status: f.status,
    branchId: f.branchId || null,
    positionIds: f.positionIds.length > 0 ? f.positionIds : null,
  };
}

export function EmployeeForm({
  employeeId,
  initial,
}: {
  employeeId?: string;
  initial?: EmployeeDto;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => toState(initial));
  const [error, setError] = useState<string | null>(null);

  const branchesQuery = useQuery({
    queryKey: queryKeys.list("Branches", { pageSize: 100 }),
    queryFn: () => branchesApi.list({ pageSize: 100 }),
  });
  const positionsQuery = useQuery({
    queryKey: queryKeys.list("Positions", { pageSize: 100 }),
    queryFn: () => positionsApi.list({ pageSize: 100 }),
  });

  const mutation = useMutation({
    mutationFn: (body: EmployeeWriteDto) =>
      employeeId ? employeesApi.update(employeeId, body) : employeesApi.create(body),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ["Employees"] });
      router.push(`/employees/${saved.id}`);
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Couldn't save the employee.");
    },
  });

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function togglePosition(id: string) {
    setForm((prev) => ({
      ...prev,
      positionIds: prev.positionIds.includes(id)
        ? prev.positionIds.filter((v) => v !== id)
        : [...prev.positionIds, id],
    }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    mutation.mutate(toWriteDto(form));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardContent className="space-y-5 p-6">
            <h2 className="text-lg font-semibold">Basic details</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First name" required>
                <Input
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                  required
                  className="h-10"
                  placeholder="First name"
                />
              </Field>
              <Field label="Last name" required>
                <Input
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                  required
                  className="h-10"
                  placeholder="Last name"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Birth date">
                <Input
                  type="date"
                  value={form.birthDate}
                  onChange={(e) => set("birthDate", e.target.value)}
                  className="h-10"
                />
              </Field>
              <Field label="Phone number" required>
                <Input
                  value={form.phoneNumber}
                  onChange={(e) => set("phoneNumber", e.target.value)}
                  required
                  className="h-10"
                  placeholder="Phone number"
                />
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="h-10"
                  placeholder="Email"
                />
              </Field>
              <Field label="Address">
                <Input
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  className="h-10"
                  placeholder="Address"
                />
              </Field>
            </div>

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

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Experience (years)">
                <Input
                  type="number"
                  min={0}
                  value={form.experience}
                  onChange={(e) => set("experience", e.target.value)}
                  className="h-10"
                  placeholder="0"
                />
              </Field>
              <Field label="Hour rate">
                <Input
                  type="number"
                  min={0}
                  value={form.hourRate}
                  onChange={(e) => set("hourRate", e.target.value)}
                  className="h-10"
                  placeholder="e.g. 35"
                />
              </Field>
            </div>

            <Field label="Branch">
              <Select
                value={form.branchId}
                onChange={(e) => set("branchId", e.target.value)}
                disabled={branchesQuery.isPending}
              >
                <option value="">Select branch</option>
                {branchesQuery.data?.items?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.title ?? "Untitled"}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Telegram user name">
              <Input
                value={form.telegramUsername}
                onChange={(e) => set("telegramUsername", e.target.value)}
                className="h-10"
                placeholder="Telegram user name"
              />
            </Field>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                placeholder="Description"
              />
            </Field>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="h-fit">
            <CardContent className="space-y-4 p-6">
              <h2 className="text-lg font-semibold">Photo</h2>
              <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border p-6">
                {form.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.photoUrl}
                    alt="Employee avatar"
                    className="size-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-28 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <ImagePlus className="size-8" />
                  </div>
                )}
                <Input
                  value={form.photoUrl}
                  onChange={(e) => set("photoUrl", e.target.value)}
                  className="h-10"
                  placeholder="Photo URL"
                  // The API rejects anything longer; a data: URI never fits.
                  maxLength={500}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardContent className="space-y-3 p-6">
              <h2 className="text-lg font-semibold">Positions</h2>
              <div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
                {positionsQuery.isPending ? (
                  <p className="p-2 text-sm text-muted-foreground">Loading…</p>
                ) : positionsQuery.data?.items?.length ? (
                  positionsQuery.data.items.map((position) => {
                    const checked = form.positionIds.includes(position.id);
                    return (
                      <label
                        key={position.id}
                        className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePosition(position.id)}
                          className="size-4 accent-primary"
                        />
                        {position.color && (
                          <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: position.color }}
                          />
                        )}
                        <span className="text-sm">{position.name ?? "—"}</span>
                      </label>
                    );
                  })
                ) : (
                  <p className="p-2 text-sm text-muted-foreground">No positions found.</p>
                )}
              </div>
              {employeeId && (
                <p className="text-xs text-muted-foreground">
                  Current: {initial?.positions?.join(", ") || "—"}. Re-select to update.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm whitespace-pre-line text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" className="h-10" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Save employee
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
