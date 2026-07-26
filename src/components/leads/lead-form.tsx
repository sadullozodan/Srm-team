"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { coursesApi, leadsApi, queryKeys } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { LeadDto, LeadOccupation, LeadType, LeadWriteDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TYPES: LeadType[] = ["Lead", "Client"];
const OCCUPATIONS: LeadOccupation[] = ["Pupil", "Employee", "Graduate", "Student"];

interface FormState {
  fullName: string;
  phone: string;
  courseId: string;
  occupation: LeadOccupation;
  type: LeadType;
  lessonTime: string;
  utmSource: string;
  registerMonth: string;
  notes: string;
}

function toState(l?: LeadDto): FormState {
  return {
    fullName: l?.fullName ?? "",
    phone: l?.phone ?? "",
    courseId: l?.courseId ?? "",
    occupation: l?.occupation ?? "Pupil",
    type: l?.type ?? "Lead",
    lessonTime: l?.lessonTime ? l.lessonTime.slice(0, 5) : "",
    utmSource: l?.utmSource ?? "",
    registerMonth: l?.registerMonth ?? "",
    notes: l?.notes ?? "",
  };
}

function toWriteDto(f: FormState): LeadWriteDto {
  const clean = (v: string) => (v.trim() === "" ? null : v.trim());
  return {
    fullName: f.fullName.trim(),
    phone: f.phone.trim(),
    courseId: f.courseId || null,
    occupation: f.occupation,
    type: f.type,
    lessonTime: f.lessonTime ? `${f.lessonTime}:00` : null,
    utmSource: clean(f.utmSource),
    registerMonth: clean(f.registerMonth),
    notes: clean(f.notes),
  };
}

export function LeadForm({ leadId, initial }: { leadId?: string; initial?: LeadDto }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => toState(initial));
  const [error, setError] = useState<string | null>(null);

  const coursesQuery = useQuery({
    queryKey: queryKeys.list("Courses", { pageSize: 100 }),
    queryFn: () => coursesApi.list({ pageSize: 100 }),
  });

  const mutation = useMutation({
    mutationFn: (body: LeadWriteDto) =>
      leadId ? leadsApi.update(leadId, body) : leadsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Leads"] });
      router.push("/courses/clients");
    },
    onError: (err) =>
      setError(err instanceof ApiError ? err.message : "Couldn't save the lead."),
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
          <h2 className="text-lg font-semibold">Lead details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name" required>
              <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required className="h-10" placeholder="Full name" />
            </Field>
            <Field label="Phone" required>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} required className="h-10" placeholder="Phone" />
            </Field>
          </div>
          <Field label="Type">
            <div className="inline-flex gap-2">
              {TYPES.map((t) => {
                const active = t === form.type;
                return (
                  <button key={t} type="button" onClick={() => set("type", t)} aria-pressed={active} className={cn("h-10 rounded-lg border px-4 text-sm font-medium transition-colors", active ? "border-primary bg-secondary text-primary" : "border-border text-muted-foreground hover:bg-muted")}>{t}</button>
                );
              })}
            </div>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Course">
              <Select value={form.courseId} onChange={(e) => set("courseId", e.target.value)} disabled={coursesQuery.isPending}>
                <option value="">Select course</option>
                {coursesQuery.data?.items?.map((c) => <option key={c.id} value={c.id}>{c.title ?? "Untitled"}</option>)}
              </Select>
            </Field>
            <Field label="Occupation">
              <Select value={form.occupation} onChange={(e) => set("occupation", e.target.value as LeadOccupation)}>
                {OCCUPATIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Lesson time">
              <Input type="time" value={form.lessonTime} onChange={(e) => set("lessonTime", e.target.value)} className="h-10" />
            </Field>
            <Field label="UTM source">
              <Input value={form.utmSource} onChange={(e) => set("utmSource", e.target.value)} className="h-10" placeholder="instagram" />
            </Field>
            <Field label="Register month">
              <Input value={form.registerMonth} onChange={(e) => set("registerMonth", e.target.value)} className="h-10" placeholder="June" />
            </Field>
          </div>
          <Field label="Notes">
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={3} className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30" placeholder="Notes" />
          </Field>
        </CardContent>
      </Card>

      {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" className="h-10" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Save lead
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
