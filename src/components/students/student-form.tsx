"use client";

// Shared create/edit form for a student. Drives POST /api/Students (create) or
// PUT /api/Students/{id} (edit) and mirrors the Figma "Add new student" / "Profile"
// two-column layout (basic details + photo).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, Plus, Trash2 } from "lucide-react";
import { branchesApi, studentsApi, queryKeys } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type {
  Gender,
  StudentDto,
  StudentStatus,
  StudentWriteDto,
} from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FormState {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: Gender;
  address: string;
  email: string;
  status: StudentStatus;
  phoneNumber: string;
  phones: { number: string; label: string }[];
  branchId: string;
  telegramUsername: string;
  description: string;
  photoUrl: string;
}

function toState(s?: StudentDto): FormState {
  return {
    firstName: s?.firstName ?? "",
    lastName: s?.lastName ?? "",
    birthDate: s?.birthDate ? s.birthDate.slice(0, 10) : "",
    gender: s?.gender ?? "Male",
    address: s?.address ?? "",
    email: s?.email ?? "",
    status: s?.status ?? "Active",
    phoneNumber: s?.phoneNumber ?? "",
    phones:
      s?.phones?.map((p) => ({ number: p.number ?? "", label: p.label ?? "" })) ?? [],
    branchId: s?.branchId ?? "",
    telegramUsername: s?.telegramUsername ?? "",
    description: s?.description ?? "",
    photoUrl: s?.photoUrl ?? "",
  };
}

function toWriteDto(f: FormState): StudentWriteDto {
  const clean = (v: string) => (v.trim() === "" ? null : v.trim());
  return {
    firstName: f.firstName.trim(),
    lastName: f.lastName.trim(),
    birthDate: f.birthDate || null,
    gender: f.gender,
    address: clean(f.address),
    email: clean(f.email),
    status: f.status,
    phoneNumber: f.phoneNumber.trim(),
    telegramUsername: clean(f.telegramUsername),
    description: clean(f.description),
    photoUrl: clean(f.photoUrl),
    branchId: f.branchId || null,
    phones: f.phones
      .filter((p) => p.number.trim() !== "")
      .map((p) => ({ number: p.number.trim(), label: p.label.trim() || null })),
  };
}

const GENDERS: Gender[] = ["Male", "Female"];
const STATUSES: StudentStatus[] = ["Active", "Inactive", "Finished"];

export function StudentForm({
  studentId,
  initial,
}: {
  studentId?: string;
  initial?: StudentDto;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => toState(initial));
  const [error, setError] = useState<string | null>(null);

  const branchesQuery = useQuery({
    queryKey: queryKeys.list("Branches", { pageSize: 100 }),
    queryFn: () => branchesApi.list({ pageSize: 100 }),
  });

  const mutation = useMutation({
    mutationFn: (body: StudentWriteDto) =>
      studentId ? studentsApi.update(studentId, body) : studentsApi.create(body),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ["Students"] });
      router.push(`/students/${saved.id}`);
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Couldn't save the student.");
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        {/* Basic details */}
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

            <Field label="Birth date">
              <Input
                type="date"
                value={form.birthDate}
                onChange={(e) => set("birthDate", e.target.value)}
                className="h-10"
              />
            </Field>

            <Field label="Gender">
              <Segmented
                options={GENDERS}
                value={form.gender}
                onChange={(v) => set("gender", v)}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Address">
                <Input
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  className="h-10"
                  placeholder="Address"
                />
              </Field>
              <Field label="Email">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="h-10"
                  placeholder="Email"
                />
              </Field>
            </div>

            <Field label="Status">
              <Segmented
                options={STATUSES}
                value={form.status}
                onChange={(v) => set("status", v)}
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

            {/* Additional phones */}
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Phones</p>
              {form.phones.map((phone, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="grid flex-1 gap-2 sm:grid-cols-2">
                    <Input
                      value={phone.number}
                      onChange={(e) =>
                        set(
                          "phones",
                          form.phones.map((p, i) =>
                            i === index ? { ...p, number: e.target.value } : p
                          )
                        )
                      }
                      className="h-10"
                      placeholder="Phone number"
                    />
                    <Input
                      value={phone.label}
                      onChange={(e) =>
                        set(
                          "phones",
                          form.phones.map((p, i) =>
                            i === index ? { ...p, label: e.target.value } : p
                          )
                        )
                      }
                      className="h-10"
                      placeholder="Description"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10"
                    aria-label="Remove phone"
                    onClick={() =>
                      set(
                        "phones",
                        form.phones.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                className="h-10 gap-1.5"
                onClick={() =>
                  set("phones", [...form.phones, { number: "", label: "" }])
                }
              >
                <Plus className="size-4" />
                Add new phone
              </Button>
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

        {/* Photo */}
        <Card className="h-fit">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-lg font-semibold">Photo</h2>
            <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border p-6">
              {form.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.photoUrl}
                  alt="Student avatar"
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
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm whitespace-pre-line text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" className="h-10" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Save account
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

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
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
  );
}
