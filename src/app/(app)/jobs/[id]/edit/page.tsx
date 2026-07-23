"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { jobsApi, queryKeys } from "@/lib/api/resources";
import { JobForm } from "@/components/jobs/job-form";
import { Card, CardContent } from "@/components/ui/card";

export default function EditJobPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.detail("Jobs", id),
    queryFn: () => jobsApi.get(id),
    enabled: !!id,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/jobs" aria-label="Back to jobs" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit job</h1>
      </div>
      {isError ? (
        <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load this job.</CardContent></Card>
      ) : isPending ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : (
        <JobForm jobId={id} initial={data} />
      )}
    </div>
  );
}
