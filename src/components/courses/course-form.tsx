"use client";

// Shared create/edit form for a course. Drives POST /api/Courses (create) or
// PUT /api/Courses/{id} (edit).

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImagePlus } from "lucide-react";
import { coursesApi } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { CourseDto, CourseWriteDto } from "@/lib/api/types";
import { Input } from "@/components/ui/input";
import {
  FormActions,
  FormError,
  LabeledField as Field,
  Panel,
  SectionTitle,
} from "@/app/(app)/panels";

interface FormState {
  title: string;
  fee: string;
  durationMonths: string;
  logoUrl: string;
  description: string;
}

function toState(c?: CourseDto): FormState {
  return {
    title: c?.title ?? "",
    fee: c?.fee != null ? String(c.fee) : "",
    durationMonths: c?.durationMonths != null ? String(c.durationMonths) : "",
    logoUrl: c?.logoUrl ?? "",
    description: c?.description ?? "",
  };
}

function toWriteDto(f: FormState): CourseWriteDto {
  const clean = (v: string) => (v.trim() === "" ? null : v.trim());
  return {
    title: f.title.trim(),
    fee: Number(f.fee) || 0,
    durationMonths: Number(f.durationMonths) || 0,
    logoUrl: clean(f.logoUrl),
    description: clean(f.description),
  };
}

export function CourseForm({
  courseId,
  initial,
}: {
  courseId?: string;
  initial?: CourseDto;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<FormState>(() => toState(initial));
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (body: CourseWriteDto) =>
      courseId ? coursesApi.update(courseId, body) : coursesApi.create(body),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ["Courses"] });
      router.push(`/courses/${saved.id}`);
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.message : "Couldn't save the course.");
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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <Panel>
          <SectionTitle>Course details</SectionTitle>

          <div className="space-y-5">
            <Field label="Title" required>
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
                className="h-10"
                placeholder="e.g. C# / .NET"
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Fee">
                <Input
                  type="number"
                  min={0}
                  value={form.fee}
                  onChange={(e) => set("fee", e.target.value)}
                  className="h-10"
                  placeholder="500"
                />
              </Field>
              <Field label="Duration (months)">
                <Input
                  type="number"
                  min={0}
                  value={form.durationMonths}
                  onChange={(e) => set("durationMonths", e.target.value)}
                  className="h-10"
                  placeholder="6"
                />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                placeholder="What does this course cover?"
              />
            </Field>
          </div>
        </Panel>

        <Panel className="h-fit">
          <SectionTitle>Logo</SectionTitle>
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border p-6">
              {form.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.logoUrl}
                  alt="Course logo"
                  className="size-24 rounded-xl object-cover"
                />
              ) : (
                <div className="flex size-24 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <ImagePlus className="size-8" />
                </div>
              )}
              <Input
                value={form.logoUrl}
                onChange={(e) => set("logoUrl", e.target.value)}
                className="h-10"
                placeholder="Logo URL"
              />
          </div>
        </Panel>
      </div>

      <FormError message={error} />

      <FormActions
        saveLabel="SAVE COURSE"
        saving={mutation.isPending}
        onCancel={() => router.back()}
      />
    </form>
  );
}
