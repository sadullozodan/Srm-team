"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { jobsApi } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { JobDto, JobStatus, JobWriteDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STATUSES: JobStatus[] = ["Open", "Closed"];

interface FormState {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  status: JobStatus;
}

function toState(j?: JobDto): FormState {
  return {
    title: j?.title ?? "",
    company: j?.company ?? "",
    location: j?.location ?? "",
    salary: j?.salary != null ? String(j.salary) : "",
    description: j?.description ?? "",
    status: j?.status ?? "Open",
  };
}

function toWriteDto(f: FormState): JobWriteDto {
  const clean = (v: string) => (v.trim() === "" ? null : v.trim());
  return {
    title: f.title.trim(),
    company: clean(f.company),
    location: clean(f.location),
    salary: f.salary.trim() === "" ? null : Number(f.salary),
    description: clean(f.description),
    status: f.status,
  };
}

export function JobForm({ jobId, initial }: { jobId?: string; initial?: JobDto }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => toState(initial));
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (body: JobWriteDto) =>
      jobId ? jobsApi.update(jobId, body) : jobsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Jobs"] });
      router.push("/jobs");
    },
    onError: (err) =>
      setError(err instanceof ApiError ? err.message : "Couldn't save the job."),
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
          <h2 className="text-lg font-semibold">Job details</h2>
          <Field label="Title" required>
            <Input value={form.title} onChange={(e) => set("title", e.target.value)} required className="h-10" placeholder="e.g. Frontend Developer" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Company">
              <Input value={form.company} onChange={(e) => set("company", e.target.value)} className="h-10" placeholder="Company" />
            </Field>
            <Field label="Location">
              <Input value={form.location} onChange={(e) => set("location", e.target.value)} className="h-10" placeholder="Dushanbe" />
            </Field>
          </div>
          <Field label="Salary">
            <Input type="number" min={0} value={form.salary} onChange={(e) => set("salary", e.target.value)} className="h-10 sm:max-w-56" placeholder="5000" />
          </Field>
          <Field label="Status">
            <Segmented options={STATUSES} value={form.status} onChange={(v) => set("status", v)} />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={4} className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30" placeholder="Job description" />
          </Field>
        </CardContent>
      </Card>

      {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" className="h-10" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Save job
        </Button>
        <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
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

function Segmented<T extends string>({ options, value, onChange }: { options: T[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex flex-wrap gap-2">
      {options.map((option) => {
        const active = option === value;
        return (
          <button key={option} type="button" onClick={() => onChange(option)} aria-pressed={active} className={cn("h-10 rounded-lg border px-4 text-sm font-medium transition-colors", active ? "border-primary bg-secondary text-primary" : "border-border text-muted-foreground hover:bg-muted")}>
            {option}
          </button>
        );
      })}
    </div>
  );
}
