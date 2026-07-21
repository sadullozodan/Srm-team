"use client";

// Shared create/edit form for an employee. Drives POST /api/Employees (create)
// or PUT /api/Employees/{id} (edit). Branch and position options come from
// their own list endpoints.
//
// Laid out as the team's Figma draws it: "Basic details" on the left, the photo
// card and position picker down the right.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check } from "lucide-react";
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
import { normalizePhone } from "@/lib/phone";
import {
  FormActions,
  FormError,
  NumberField,
  Panel,
  PhotoCard,
  Pill,
  SectionTitle,
  SelectBox,
  TextAreaField,
  TextField,
} from "@/app/(app)/panels";
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
    // Stored the same way the login screen sends it, so the two agree.
    phoneNumber: normalizePhone(f.phoneNumber),
    email: clean(f.email),
    address: clean(f.address),
    telegramUsername: clean(f.telegramUsername),
    description: clean(f.description),
    // A blob: preview is local to this tab — never send it.
    photoUrl: f.photoUrl.startsWith("blob:") ? null : clean(f.photoUrl),
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
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <SectionTitle>Basic details</SectionTitle>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="First name"
                value={form.firstName}
                onChange={(v) => set("firstName", v)}
                required
              />
              <TextField
                label="Last name"
                value={form.lastName}
                onChange={(v) => set("lastName", v)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Birth date"
                type="date"
                value={form.birthDate}
                onChange={(v) => set("birthDate", v)}
              />
              <TextField
                label="Phone number"
                type="tel"
                value={form.phoneNumber}
                onChange={(v) => set("phoneNumber", v)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                label="Email"
                type="email"
                value={form.email}
                onChange={(v) => set("email", v)}
              />
              <TextField
                label="Address"
                value={form.address}
                onChange={(v) => set("address", v)}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <NumberField
                label="Experience"
                value={form.experience}
                onChange={(v) => set("experience", v)}
              />
              <NumberField
                label="Hour rate"
                value={form.hourRate}
                onChange={(v) => set("hourRate", v)}
              />
            </div>

            <SelectBox
              label="Branch"
              value={form.branchId}
              onChange={(v) => set("branchId", v)}
              disabled={branchesQuery.isPending}
            >
              <option value="">Branch</option>
              {branchesQuery.data?.items?.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.title ?? "Untitled"}
                </option>
              ))}
            </SelectBox>

            <TextField
              label="Telegram user name"
              value={form.telegramUsername}
              onChange={(v) => set("telegramUsername", v)}
            />

            <TextAreaField
              label="Description"
              value={form.description}
              onChange={(v) => set("description", v)}
            />

            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Status
              </span>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => set("status", option)}
                    aria-pressed={option === form.status}
                    className={cn(
                      "rounded-xl border px-4 py-2 text-xs font-bold transition-colors",
                      option === form.status
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <FormError message={error} />

          <FormActions
            saveLabel={employeeId ? "SAVE CHANGES" : "SAVE ACCOUNT"}
            saving={mutation.isPending}
            onCancel={() => router.back()}
          />
        </Panel>

        <div className="space-y-6 lg:col-span-5">
          <PhotoCard value={form.photoUrl} onChange={(v) => set("photoUrl", v)} />

          <Panel className="h-fit">
            <SectionTitle>Positions</SectionTitle>

            {employeeId && initial?.positions?.length ? (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-muted-foreground">Current:</span>
                {initial.positions.map((position) => (
                  <Pill key={position} tone="brand">
                    {position}
                  </Pill>
                ))}
              </div>
            ) : null}

            <div className="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-border p-2">
              {positionsQuery.isPending ? (
                <p className="p-2 text-xs text-muted-foreground">Loading…</p>
              ) : positionsQuery.data?.items?.length ? (
                positionsQuery.data.items.map((position) => {
                  const checked = form.positionIds.includes(position.id);
                  return (
                    <button
                      key={position.id}
                      type="button"
                      onClick={() => togglePosition(position.id)}
                      className="flex w-full items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted"
                    >
                      <span className="flex items-center gap-2 text-xs font-medium">
                        {position.color && (
                          <span
                            className="size-2.5 shrink-0 rounded-full"
                            style={{ backgroundColor: position.color }}
                          />
                        )}
                        {position.name ?? "—"}
                      </span>
                      {checked && <Check className="size-4 shrink-0 text-primary" />}
                    </button>
                  );
                })
              ) : (
                <p className="p-2 text-xs text-muted-foreground">No positions found.</p>
              )}
            </div>

            {employeeId && (
              <p className="text-[11px] text-muted-foreground">
                The API returns position names, not ids — re-select to change them.
              </p>
            )}
          </Panel>
        </div>
      </div>
    </form>
  );
}
