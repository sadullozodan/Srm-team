"use client";

// Shared create/edit form for a group. Drives POST /api/Groups (create) or
// PUT /api/Groups/{id} (edit). Course/branch/mentor options come from their
// own list endpoints.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  branchesApi,
  coursesApi,
  employeesApi,
  groupsApi,
  queryKeys,
} from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { GroupDto, GroupStatus, GroupWriteDto } from "@/lib/api/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  FormActions,
  FormError,
  LabeledField as Field,
  Panel,
  SectionTitle,
} from "@/app/(app)/panels";
import { cn } from "@/lib/utils";

const STATUSES: GroupStatus[] = ["New", "Started", "Finished", "Cancelled"];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface FormState {
  name: string;
  courseId: string;
  branchId: string;
  startDate: string;
  endDate: string;
  requiredStudents: string;
  status: GroupStatus;
  days: string[];
  startTime: string;
  endTime: string;
  room: string;
  mentorIds: string[];
}

function splitDays(days: string | null): string[] {
  return days ? days.split(",").map((d) => d.trim()).filter(Boolean) : [];
}

// The API stores time as HH:mm:ss; <input type="time"> gives HH:mm.
function toApiTime(value: string): string | null {
  if (!value) return null;
  return value.length === 5 ? `${value}:00` : value;
}
function toInputTime(value: string | null): string {
  return value ? value.slice(0, 5) : "";
}

function toState(g?: GroupDto): FormState {
  return {
    name: g?.name ?? "",
    courseId: g?.courseId ?? "",
    branchId: g?.branchId ?? "",
    startDate: g?.startDate ? g.startDate.slice(0, 10) : "",
    endDate: g?.endDate ? g.endDate.slice(0, 10) : "",
    requiredStudents: g?.requiredStudents != null ? String(g.requiredStudents) : "",
    status: g?.status ?? "New",
    days: splitDays(g?.days ?? null),
    startTime: toInputTime(g?.startTime ?? null),
    endTime: toInputTime(g?.endTime ?? null),
    room: g?.room ?? "",
    // GroupDto exposes mentor names, not ids, so edit starts with none preselected.
    mentorIds: [],
  };
}

function toWriteDto(f: FormState): GroupWriteDto {
  const clean = (v: string) => (v.trim() === "" ? null : v.trim());
  return {
    name: f.name.trim(),
    courseId: f.courseId,
    branchId: f.branchId || null,
    startDate: f.startDate,
    endDate: f.endDate,
    requiredStudents: Number(f.requiredStudents) || 0,
    status: f.status,
    days: f.days.length > 0 ? f.days.join(",") : null,
    startTime: toApiTime(f.startTime),
    endTime: toApiTime(f.endTime),
    room: clean(f.room),
    mentorIds: f.mentorIds.length > 0 ? f.mentorIds : null,
  };
}

export function GroupForm({
  groupId,
  initial,
}: {
  groupId?: string;
  initial?: GroupDto;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => toState(initial));
  const [error, setError] = useState<string | null>(null);

  const coursesQuery = useQuery({
    queryKey: queryKeys.list("Courses", { pageSize: 100 }),
    queryFn: () => coursesApi.list({ pageSize: 100 }),
  });
  const branchesQuery = useQuery({
    queryKey: queryKeys.list("Branches", { pageSize: 100 }),
    queryFn: () => branchesApi.list({ pageSize: 100 }),
  });
  const mentorsQuery = useQuery({
    queryKey: queryKeys.list("Employees", { pageSize: 100 }),
    queryFn: () => employeesApi.list({ pageSize: 100 }),
  });

  const mutation = useMutation({
    mutationFn: (body: GroupWriteDto) =>
      groupId ? groupsApi.update(groupId, body) : groupsApi.create(body),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ["Groups"] });
      router.push(`/groups/${saved.id}`);
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Couldn't save the group.");
    },
  });

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggle(key: "days" | "mentorIds", value: string) {
    setForm((prev) => {
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      };
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    mutation.mutate(toWriteDto(form));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Panel>
        <SectionTitle>Group details</SectionTitle>
        <div className="space-y-5">

          <Field label="Group name" required>
            <Input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              required
              className="h-10"
              placeholder="e.g. C# 5 June"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Course" required>
              <Select
                value={form.courseId}
                onChange={(e) => set("courseId", e.target.value)}
                required
                disabled={coursesQuery.isPending}
              >
                <option value="">Select course</option>
                {coursesQuery.data?.items?.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title ?? "Untitled"}
                  </option>
                ))}
              </Select>
            </Field>
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
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Start date" required>
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                required
                className="h-10"
              />
            </Field>
            <Field label="End date" required>
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                required
                className="h-10"
              />
            </Field>
            <Field label="Required students">
              <Input
                type="number"
                min={0}
                value={form.requiredStudents}
                onChange={(e) => set("requiredStudents", e.target.value)}
                className="h-10"
                placeholder="15"
              />
            </Field>
          </div>

          <Field label="Status">
            <Select
              value={form.status}
              onChange={(e) => set("status", e.target.value as GroupStatus)}
              className="sm:max-w-56"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Lesson days">
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => {
                const active = form.days.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggle("days", day)}
                    aria-pressed={active}
                    className={cn(
                      "h-10 rounded-lg border px-3.5 text-sm font-medium transition-colors",
                      active
                        ? "border-primary bg-secondary text-primary"
                        : "border-border text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Start time">
              <Input
                type="time"
                value={form.startTime}
                onChange={(e) => set("startTime", e.target.value)}
                className="h-10"
              />
            </Field>
            <Field label="End time">
              <Input
                type="time"
                value={form.endTime}
                onChange={(e) => set("endTime", e.target.value)}
                className="h-10"
              />
            </Field>
            <Field label="Room">
              <Input
                value={form.room}
                onChange={(e) => set("room", e.target.value)}
                className="h-10"
                placeholder="Room 4"
              />
            </Field>
          </div>

          <Field label="Mentors">
            <div className="max-h-52 space-y-1 overflow-y-auto rounded-lg border border-border p-2">
              {mentorsQuery.isPending ? (
                <p className="p-2 text-sm text-muted-foreground">Loading…</p>
              ) : mentorsQuery.data?.items?.length ? (
                mentorsQuery.data.items.map((employee) => {
                  const checked = form.mentorIds.includes(employee.id);
                  return (
                    <label
                      key={employee.id}
                      className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-muted"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle("mentorIds", employee.id)}
                        className="size-4 accent-primary"
                      />
                      <span className="text-sm">
                        {employee.fullName ??
                          ([employee.firstName, employee.lastName]
                            .filter(Boolean)
                            .join(" ") ||
                            "—")}
                      </span>
                    </label>
                  );
                })
              ) : (
                <p className="p-2 text-sm text-muted-foreground">No employees found.</p>
              )}
            </div>
            {groupId && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Current mentors: {initial?.mentors?.join(", ") || "—"}. Re-select to
                update.
              </p>
            )}
          </Field>
        </div>
      </Panel>

      <FormError message={error} />

      <FormActions
        saveLabel={groupId ? "SAVE CHANGES" : "SAVE GROUP"}
        saving={mutation.isPending}
        onCancel={() => router.back()}
      />
    </form>
  );
}

