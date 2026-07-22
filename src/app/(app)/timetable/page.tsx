"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, MapPin } from "lucide-react";
import { timetableApi, queryKeys } from "@/lib/api/resources";
import type { DayName, ScheduleEntryDto } from "@/lib/api/types";
import { Panel, PanelHeader } from "../panels";

const DAYS: DayName[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const hhmm = (t: string | null) => (t ? t.slice(0, 5) : "");

export default function TimetablePage() {
  const params = { pageSize: 300 };
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Timetable", params),
    queryFn: () => timetableApi.list(params),
  });

  const byDay = useMemo(() => {
    const map = new Map<DayName, ScheduleEntryDto[]>();
    for (const day of DAYS) map.set(day, []);
    for (const entry of data?.items ?? []) map.get(entry.day)?.push(entry);
    for (const list of map.values()) list.sort((a, b) => (a.startTime ?? "").localeCompare(b.startTime ?? ""));
    return map;
  }, [data]);

  return (
    <Panel>
      <PanelHeader title="Timetable" />

      {isError ? (
        <p className="py-10 text-center text-sm text-destructive">Couldn&apos;t load the timetable.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {DAYS.map((day) => {
            const lessons = byDay.get(day) ?? [];
            return (
              <div key={day} className="rounded-2xl border border-border bg-muted/20 p-3">
                <div className="mb-3 flex items-center justify-between px-1">
                  <h3 className="text-sm font-black tracking-tight">{day.slice(0, 3)}</h3>
                  <span className="text-[11px] font-medium text-muted-foreground">{lessons.length}</span>
                </div>

                <div className="space-y-2.5">
                  {isPending ? (
                    <div className="h-20 animate-pulse rounded-xl bg-muted" />
                  ) : lessons.length === 0 ? (
                    <p className="px-1 py-6 text-center text-[11px] text-muted-foreground">No lessons</p>
                  ) : (
                    lessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

function LessonCard({ lesson }: { lesson: ScheduleEntryDto }) {
  const accent = lesson.color ?? "var(--primary)";
  return (
    <div
      className="rounded-xl border border-border bg-card p-3 shadow-xs transition-shadow hover:shadow-md"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <p className="text-xs font-bold">{lesson.title ?? lesson.groupName ?? "Lesson"}</p>
      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <Clock className="size-3" />
        {hhmm(lesson.startTime)}–{hhmm(lesson.endTime)}
      </div>
      {lesson.room && (
        <div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <MapPin className="size-3" />
          {lesson.room}
        </div>
      )}
      {lesson.mentorName && <p className="mt-1 text-[11px] text-muted-foreground">{lesson.mentorName}</p>}
    </div>
  );
}
