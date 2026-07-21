"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";
import {
  enrollmentsApi,
  groupsApi,
  journalApi,
  queryKeys,
} from "@/lib/api/resources";
import type {
  AddLessonRequest,
  AttendanceRecordDto,
  AttendanceStatus,
  JournalWeekDto,
  SetAttendanceRequest,
  SetWeekResultRequest,
  WeekResultDto,
} from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { JournalChart } from "@/components/progressbook/journal-chart";
import { cn } from "@/lib/utils";

const STATUSES: AttendanceStatus[] = ["Present", "Absent", "Late"];
const statusStyle: Record<AttendanceStatus, string> = {
  Present: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  Absent: "bg-destructive/15 text-destructive border-destructive/30",
  Late: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
};

const lessonDateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "2-digit",
});

function fmtLessonDate(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : lessonDateFmt.format(d);
}

interface Student {
  id: string;
  name: string;
}

export default function JournalPage() {
  const params = useParams<{ groupId: string }>();
  const groupId = params.groupId;
  const queryClient = useQueryClient();

  const groupQuery = useQuery({
    queryKey: queryKeys.detail("Groups", groupId),
    queryFn: () => groupsApi.get(groupId),
    enabled: !!groupId,
  });

  const rosterQuery = useQuery({
    queryKey: ["Enrollments", "group", groupId],
    queryFn: () => enrollmentsApi.byGroup(groupId),
    enabled: !!groupId,
  });

  const journalQuery = useQuery({
    queryKey: ["Journal", groupId],
    queryFn: () => journalApi.byGroup(groupId),
    enabled: !!groupId,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["Journal", groupId] });

  const addWeek = useMutation({
    mutationFn: (weekNumber: number) =>
      journalApi.addWeek(groupId, { weekNumber, title: `Week ${weekNumber}` }),
    onSuccess: invalidate,
  });
  const deleteWeek = useMutation({
    mutationFn: (weekId: string) => journalApi.deleteWeek(weekId),
    onSuccess: invalidate,
  });
  const addLesson = useMutation({
    mutationFn: (vars: { weekId: string; body: AddLessonRequest }) =>
      journalApi.addLesson(vars.weekId, vars.body),
    onSuccess: invalidate,
  });
  const saveAttendance = useMutation({
    mutationFn: (vars: { lessonId: string; body: SetAttendanceRequest }) =>
      journalApi.setAttendance(vars.lessonId, vars.body),
    onSuccess: invalidate,
  });
  const saveResult = useMutation({
    mutationFn: (vars: { weekId: string; body: SetWeekResultRequest }) =>
      journalApi.setWeekResult(vars.weekId, vars.body),
    onSuccess: invalidate,
  });

  const students: Student[] = (rosterQuery.data ?? [])
    .filter((e) => e.status !== "Left")
    .map((e) => ({ id: e.studentId, name: e.studentName ?? "—" }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const weeks = [...(journalQuery.data ?? [])].sort(
    (a, b) => a.weekNumber - b.weekNumber
  );
  const nextWeekNumber = weeks.length
    ? Math.max(...weeks.map((w) => w.weekNumber)) + 1
    : 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/progressbook"
            aria-label="Back to progressbook"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-6" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Journal
            {groupQuery.data?.name ? (
              <span className="text-muted-foreground"> · {groupQuery.data.name}</span>
            ) : null}
          </h1>
        </div>
        <Button
          size="lg"
          className="h-10 gap-1.5"
          onClick={() => addWeek.mutate(nextWeekNumber)}
          disabled={addWeek.isPending}
        >
          {addWeek.isPending ? <Loader2 className="animate-spin" /> : <Plus className="size-4" />}
          New week
        </Button>
      </div>

      {journalQuery.isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Couldn&apos;t load the journal.
          </CardContent>
        </Card>
      ) : journalQuery.isPending || rosterQuery.isPending ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : students.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            This group has no enrolled students yet.
          </CardContent>
        </Card>
      ) : weeks.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            No weeks yet. Use “New week” to start the journal.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <h2 className="mb-4 text-center text-lg font-semibold">Exam graphics</h2>
              <JournalChart weeks={weeks} students={students} />
            </CardContent>
          </Card>
          {weeks.map((week) => (
            <WeekBlock
              key={week.id}
              week={week}
              students={students}
              onAddLesson={(body) => addLesson.mutate({ weekId: week.id, body })}
              addingLesson={addLesson.isPending}
              onDeleteWeek={() => {
                if (window.confirm(`Delete Week ${week.weekNumber}?`)) {
                  deleteWeek.mutate(week.id);
                }
              }}
              onSaveAttendance={(lessonId, body) =>
                saveAttendance.mutate({ lessonId, body })
              }
              onSaveResult={(body) => saveResult.mutate({ weekId: week.id, body })}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function WeekBlock({
  week,
  students,
  onAddLesson,
  addingLesson,
  onDeleteWeek,
  onSaveAttendance,
  onSaveResult,
}: {
  week: JournalWeekDto;
  students: Student[];
  onAddLesson: (body: AddLessonRequest) => void;
  addingLesson: boolean;
  onDeleteWeek: () => void;
  onSaveAttendance: (lessonId: string, body: SetAttendanceRequest) => void;
  onSaveResult: (body: SetWeekResultRequest) => void;
}) {
  const [open, setOpen] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const lessons = [...(week.lessons ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Index attendance by lesson+student and results by student for O(1) lookups.
  const attByLesson = new Map<string, Map<string, AttendanceRecordDto>>();
  for (const lesson of lessons) {
    const map = new Map<string, AttendanceRecordDto>();
    for (const a of lesson.attendances ?? []) map.set(a.studentId, a);
    attByLesson.set(lesson.id, map);
  }
  const resultByStudent = new Map<string, WeekResultDto>();
  for (const r of week.results ?? []) resultByStudent.set(r.studentId, r);

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-3">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 font-semibold"
        >
          <ChevronDown
            className={cn("size-4 transition-transform", open ? "" : "-rotate-90")}
          />
          {week.title ?? `Week ${week.weekNumber}`}
        </button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAdd((v) => !v)}>
            <Plus className="size-3.5" />
            Add lesson
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Delete week"
            onClick={onDeleteWeek}
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </div>

      {open && (
        <>
          {showAdd && (
            <AddLessonForm
              pending={addingLesson}
              onAdd={(body) => {
                onAddLesson(body);
                setShowAdd(false);
              }}
            />
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="sticky left-0 z-10 bg-card px-4 py-2 text-left text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Students
                  </th>
                  {lessons.map((lesson) => (
                    <th
                      key={lesson.id}
                      className="min-w-40 border-l border-border px-3 py-2 text-center"
                    >
                      <div className="text-xs font-semibold">{fmtLessonDate(lesson.date)}</div>
                      {lesson.topic && (
                        <div className="truncate text-xs font-normal text-muted-foreground">
                          {lesson.topic}
                        </div>
                      )}
                    </th>
                  ))}
                  <th className="border-l border-border px-3 py-2 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Bonus
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Exam
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Sum
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const result = resultByStudent.get(student.id);
                  return (
                    <tr key={student.id} className="border-b border-border last:border-0">
                      <td className="sticky left-0 z-10 bg-card px-4 py-2 font-medium whitespace-nowrap">
                        <Link href={`/students/${student.id}`} className="hover:text-primary">
                          {student.name}
                        </Link>
                      </td>
                      {lessons.map((lesson) => (
                        <td key={lesson.id} className="border-l border-border px-3 py-2">
                          <AttendanceCell
                            record={attByLesson.get(lesson.id)?.get(student.id)}
                            onSave={(body) =>
                              onSaveAttendance(lesson.id, { ...body, studentId: student.id })
                            }
                          />
                        </td>
                      ))}
                      <ResultCells
                        result={result}
                        onSave={(body) => onSaveResult({ ...body, studentId: student.id })}
                      />
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </Card>
  );
}

function AttendanceCell({
  record,
  onSave,
}: {
  record: AttendanceRecordDto | undefined;
  onSave: (body: Omit<SetAttendanceRequest, "studentId">) => void;
}) {
  const [status, setStatus] = useState<AttendanceStatus | null>(record?.status ?? null);
  const [score, setScore] = useState(record?.score != null ? String(record.score) : "");

  useEffect(() => {
    setStatus(record?.status ?? null);
    setScore(record?.score != null ? String(record.score) : "");
  }, [record?.status, record?.score]);

  function commit(nextStatus: AttendanceStatus | null, nextScore: string) {
    onSave({
      status: nextStatus ?? "Present",
      score: Number(nextScore) || 0,
      comment: record?.comment ?? null,
    });
  }

  return (
    <div className="flex items-center justify-center gap-1">
      {STATUSES.map((st) => {
        const active = status === st;
        return (
          <button
            key={st}
            type="button"
            aria-label={st}
            title={st}
            onClick={() => {
              setStatus(st);
              commit(st, score);
            }}
            className={cn(
              "flex size-6 items-center justify-center rounded-md border text-xs font-semibold transition-colors",
              active ? statusStyle[st] : "border-border text-muted-foreground hover:bg-muted"
            )}
          >
            {st[0]}
          </button>
        );
      })}
      <input
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        onBlur={() => {
          if (score !== "" || status) commit(status, score);
        }}
        placeholder="—"
        className="h-6 w-12 rounded-md border border-input bg-transparent px-1.5 text-center text-xs outline-none focus-visible:border-ring dark:bg-input/30"
      />
    </div>
  );
}

function ResultCells({
  result,
  onSave,
}: {
  result: WeekResultDto | undefined;
  onSave: (body: Omit<SetWeekResultRequest, "studentId">) => void;
}) {
  const [bonus, setBonus] = useState(result?.bonus != null ? String(result.bonus) : "");
  const [exam, setExam] = useState(result?.exam != null ? String(result.exam) : "");
  const [sum, setSum] = useState(result?.sum != null ? String(result.sum) : "");

  useEffect(() => {
    setBonus(result?.bonus != null ? String(result.bonus) : "");
    setExam(result?.exam != null ? String(result.exam) : "");
    setSum(result?.sum != null ? String(result.sum) : "");
  }, [result?.bonus, result?.exam, result?.sum]);

  function commit() {
    onSave({
      bonus: Number(bonus) || 0,
      exam: Number(exam) || 0,
      sum: Number(sum) || 0,
    });
  }

  const cell =
    "h-6 w-14 rounded-md border border-input bg-transparent px-1.5 text-center text-xs outline-none focus-visible:border-ring dark:bg-input/30";

  return (
    <>
      <td className="border-l border-border px-3 py-2 text-center">
        <input type="number" value={bonus} onChange={(e) => setBonus(e.target.value)} onBlur={commit} className={cell} />
      </td>
      <td className="px-3 py-2 text-center">
        <input type="number" value={exam} onChange={(e) => setExam(e.target.value)} onBlur={commit} className={cell} />
      </td>
      <td className="px-3 py-2 text-center">
        <input
          type="number"
          value={sum}
          onChange={(e) => setSum(e.target.value)}
          onBlur={commit}
          className={cn(cell, "bg-secondary font-semibold text-primary")}
        />
      </td>
    </>
  );
}

function AddLessonForm({
  pending,
  onAdd,
}: {
  pending: boolean;
  onAdd: (body: AddLessonRequest) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [topic, setTopic] = useState("");

  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-border bg-muted/30 p-4">
      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Date</label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-9 w-40"
        />
      </div>
      <div className="min-w-48 flex-1 space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Topic</label>
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Lesson topic"
          className="h-9"
        />
      </div>
      <Button
        size="sm"
        className="h-9"
        disabled={pending || !date}
        onClick={() => onAdd({ date, topic: topic.trim() })}
      >
        {pending && <Loader2 className="animate-spin" />}
        Add lesson
      </Button>
    </div>
  );
}
