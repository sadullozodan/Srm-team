"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { timetableApi, queryKeys } from "@/lib/api/resources";
import { ScheduleForm } from "@/components/timetable/schedule-form";
import { Card, CardContent } from "@/components/ui/card";

export default function EditSchedulePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.detail("Timetable", id),
    queryFn: () => timetableApi.get(id),
    enabled: !!id,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/timetable" aria-label="Back to timetable" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit timetable entry</h1>
      </div>
      {isError ? (
        <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load this entry.</CardContent></Card>
      ) : isPending ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : (
        <ScheduleForm entryId={id} initial={data} />
      )}
    </div>
  );
}
