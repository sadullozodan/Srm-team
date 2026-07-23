"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/ui/Loading";
import { studentsApi, queryKeys } from "@/lib/api/resources";
import { StudentForm } from "@/components/students/student-form";
import { PanelHeader } from "../../../panels";

export default function EditStudentPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.detail("Students", id),
    queryFn: () => studentsApi.get(id),
    enabled: !!id,
  });

  return (
    <div className="space-y-6">
      <PanelHeader title="Edit student" backHref={`/students/${id}`} />

      {isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Couldn&apos;t load this student
          {error instanceof Error ? `: ${error.message}` : "."}
        </div>
      ) : isPending ? (
        <div className="flex items-center justify-center py-16">
          <Loader size="md" />
        </div>
      ) : (
        <StudentForm studentId={id} initial={data} />
      )}
    </div>
  );
}
