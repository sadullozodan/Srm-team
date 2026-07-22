"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { timetableApi, queryKeys } from "@/lib/api/resources";
import type { LessonType, ScheduleEntryDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const typeVariant: Record<LessonType, "default" | "success" | "warning"> = {
  Lecture: "default",
  Practice: "success",
  Exam: "warning",
};

function timeRange(s: string | null, e: string | null): string {
  if (!s && !e) return "—";
  return `${s ? s.slice(0, 5) : ""} - ${e ? e.slice(0, 5) : ""}`;
}

export default function TimetablePage() {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Timetable", { pageSize: 200 }),
    queryFn: () => timetableApi.list({ pageSize: 200 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => timetableApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Timetable"] }),
  });

  function handleDelete(entry: ScheduleEntryDto) {
    if (window.confirm(`Delete ${entry.title ?? "this entry"}?`)) deleteMutation.mutate(entry.id);
  }

  const entries = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Timetable</h1>
        <Button size="lg" className="gap-1.5" render={<Link href="/timetable/new" />}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

      {isError ? (
        <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load the timetable.</CardContent></Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Mentor</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">{Array.from({ length: 8 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>)}</TableRow>
                ))
              ) : entries.length === 0 ? (
                <TableRow className="hover:bg-transparent"><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">No timetable entries yet.</TableCell></TableRow>
              ) : (
                entries.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.day}</TableCell>
                    <TableCell className="text-muted-foreground">{timeRange(e.startTime, e.endTime)}</TableCell>
                    <TableCell>{e.title ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{e.groupName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{e.mentorName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{e.room ?? "—"}</TableCell>
                    <TableCell><Badge variant={typeVariant[e.type]}>{e.type}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" aria-label="Edit" render={<Link href={`/timetable/${e.id}/edit`} />}><Pencil className="size-4 text-primary" /></Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => handleDelete(e)}><Trash2 className="size-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
