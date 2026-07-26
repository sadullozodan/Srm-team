"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { employeesApi, groupsApi, timetableApi, queryKeys } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type {
  DayOfWeek,
  LessonType,
  ScheduleEntryDto,
  ScheduleEntryWriteDto,
} from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

const DAYS: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const TYPES: LessonType[] = ["Lecture", "Practice", "Exam"];

interface FormState {
  groupId: string;
  mentorId: string;
  title: string;
  type: LessonType;
  day: DayOfWeek;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
}

function toState(s?: ScheduleEntryDto): FormState {
  return {
    groupId: s?.groupId ?? "",
    mentorId: s?.mentorId ?? "",
    title: s?.title ?? "",
    type: s?.type ?? "Lecture",
    day: s?.day ?? "Monday",
    date: s?.date ? s.date.slice(0, 10) : "",
    startTime: s?.startTime ? s.startTime.slice(0, 5) : "",
    endTime: s?.endTime ? s.endTime.slice(0, 5) : "",
    room: s?.room ?? "",
  };
}

function toWriteDto(f: FormState): ScheduleEntryWriteDto {
  const clean = (v: string) => (v.trim() === "" ? null : v.trim());
  const time = (v: string) => (v ? `${v}:00` : null);
  return {
    groupId: f.groupId,
    mentorId: f.mentorId,
    title: f.title.trim(),
    type: f.type,
    day: f.day,
    date: f.date || null,
    startTime: time(f.startTime),
    endTime: time(f.endTime),
    room: clean(f.room),
  };
}

export function ScheduleForm({ entryId, initial }: { entryId?: string; initial?: ScheduleEntryDto }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => toState(initial));
  const [error, setError] = useState<string | null>(null);

  const groupsQuery = useQuery({ queryKey: queryKeys.list("Groups", { pageSize: 100 }), queryFn: () => groupsApi.list({ pageSize: 100 }) });
  const mentorsQuery = useQuery({ queryKey: queryKeys.list("Employees", { pageSize: 100 }), queryFn: () => employeesApi.list({ pageSize: 100 }) });

  const mutation = useMutation({
    mutationFn: (body: ScheduleEntryWriteDto) =>
      entryId ? timetableApi.update(entryId, body) : timetableApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Timetable"] });
      router.push("/timetable");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Couldn't save the entry."),
  });

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        mutation.mutate(toWriteDto(form));
      }}
      className="max-w-2xl space-y-6"
    >
      <Card>
        <CardContent className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">Timetable entry</h2>
          <Field label="Title" required>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required className="h-10" placeholder="e.g. JS Basics" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Group">
              <Select value={form.groupId} onChange={(e) => set("groupId", e.target.value)} disabled={groupsQuery.isPending}>
                <option value="">Select group</option>
                {groupsQuery.data?.items?.map((g) => <option key={g.id} value={g.id}>{g.name ?? "—"}</option>)}
              </Select>
            </Field>
            <Field label="Mentor">
              <Select value={form.mentorId} onChange={(e) => set("mentorId", e.target.value)} disabled={mentorsQuery.isPending}>
                <option value="">Select mentor</option>
                {mentorsQuery.data?.items?.map((m) => <option key={m.id} value={m.id}>{m.fullName ?? [m.firstName, m.lastName].filter(Boolean).join(" ")}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Day">
              <Select value={form.day} onChange={(e) => set("day", e.target.value as DayOfWeek)}>
                {DAYS.map((d) => <option key={d} value={d}>{d}</option>)}
              </Select>
            </Field>
            <Field label="Type">
              <Select value={form.type} onChange={(e) => set("type", e.target.value as LessonType)}>
                {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Date">
              <Input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className="h-10" />
            </Field>
            <Field label="Start time">
              <Input type="time" value={form.startTime} onChange={(e) => set("startTime", e.target.value)} className="h-10" />
            </Field>
            <Field label="End time">
              <Input type="time" value={form.endTime} onChange={(e) => set("endTime", e.target.value)} className="h-10" />
            </Field>
          </div>
          <Field label="Room">
            <Input value={form.room} onChange={(e) => set("room", e.target.value)} className="h-10 sm:max-w-56" placeholder="Room 4" />
          </Field>
        </CardContent>
      </Card>

      {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" className="h-10" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Save entry
        </Button>
        <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium">{label}{required && <span className="text-destructive"> *</span>}</label>
      {children}
    </div>
  );
}
