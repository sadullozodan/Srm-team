"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Loader2,
  MessageCircle,
  Plus,
  Trash2,
} from "lucide-react";
import {
  enrollmentsApi,
  groupsApi,
  journalApi,
  queryKeys,
} from "@/lib/api/resources";
import type {
  AttendanceRecordDto,
  SetAttendanceRequest,
  SetWeekResultRequest,
} from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { JournalChart } from "@/components/progressbook/journal-chart";
import { cn } from "@/lib/utils";

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

function getMonday(d: Date): Date {
  const m = new Date(d);
  const day = m.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  m.setDate(m.getDate() + diff);
  return m;
}

function weekdayDates(): string[] {
  const monday = getMonday(new Date());
  const dates: string[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function ScoreSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-7 w-14 rounded-md border-border bg-secondary px-2 text-xs">
        <SelectValue placeholder="0" />
      </SelectTrigger>
      <SelectContent>
        {["0", "1", "2", "3", "4", "5"].map((n) => (
          <SelectItem key={n} value={n} className="text-xs">
            {n}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function AttendanceCell({
  record,
  present,
  score,
  onToggle,
  onScoreChange,
  onSave,
}: {
  record: AttendanceRecordDto | undefined;
  present: boolean;
  score: string;
  onToggle: (checked: boolean) => void;
  onScoreChange: (v: string) => void;
  onSave: (body: Omit<SetAttendanceRequest, "studentId">) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <input
        type="checkbox"
        checked={present}
        onChange={(e) => onToggle(e.target.checked)}
        className="size-3.5 rounded border-border accent-primary"
      />
      <button
        type="button"
        title={record?.comment ?? "Add comment"}
        onClick={() => {
          const c = prompt("Comment:", record?.comment ?? "");
          if (c !== null) {
            onSave({
              status: present ? "Present" : "Absent",
              score: Number(score) || 0,
              comment: c || null,
            });
          }
        }}
      >
        <MessageCircle
          className={cn("size-3.5", record?.comment ? "text-primary" : "text-muted-foreground")}
        />
      </button>
      <ScoreSelect
        value={score}
        onChange={(v) => onScoreChange(v)}
      />
    </div>
  );
}

function ResultCells({
  result,
  dailyTotal,
  onSave,
}: {
  result: { bonus: number; exam: number; sum: number } | undefined;
  dailyTotal: number;
  onSave: (body: Omit<SetWeekResultRequest, "studentId">) => void;
}) {
  const [bonus, setBonus] = useState(result?.bonus != null ? String(result.bonus) : "");
  const [exam, setExam] = useState(result?.exam != null ? String(result.exam) : "");

  function commit() {
    onSave({
      bonus: Number(bonus) || 0,
      exam: Number(exam) || 0,
      sum: dailyTotal,
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
        <span className="inline-block h-6 w-14 rounded-md bg-secondary px-1.5 py-1 text-center text-xs font-semibold tabular-nums text-primary">
          {dailyTotal}
        </span>
      </td>
    </>
  );
}

function WeekTable({
  week,
  students,
  onSaveAttendance,
  onSaveResult,
  showAverage = false,
  averages,
}: {
  week: { id: string; lessons: { id: string; date: string; topic: string | null; attendances: AttendanceRecordDto[] | null }[] | null; results: { studentId: string; bonus: number; exam: number; sum: number }[] | null };
  students: Student[];
  onSaveAttendance: (lessonId: string, body: SetAttendanceRequest) => void;
  onSaveResult: (body: SetWeekResultRequest) => void;
  showAverage?: boolean;
  averages?: Map<string, number>;
}) {
  const lessons = [...(week.lessons ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Store local check state per lesson+student
  const [checkState, setCheckState] = useState<Record<string, Record<string, boolean>>>({});
  const [scoreState, setScoreState] = useState<Record<string, Record<string, string>>>({});

  function getChecked(lessonId: string, studentId: string): boolean {
    const lesson = lessons.find((l) => l.id === lessonId);
    const record = lesson?.attendances?.find((a) => a.studentId === studentId);
    // Local state overrides API state after first interaction
    if (checkState[lessonId]?.[studentId] !== undefined) return checkState[lessonId][studentId];
    return record?.status === "Present";
  }

  function getScore(lessonId: string, studentId: string): string {
    const lesson = lessons.find((l) => l.id === lessonId);
    const record = lesson?.attendances?.find((a) => a.studentId === studentId);
    if (scoreState[lessonId]?.[studentId] !== undefined) return scoreState[lessonId][studentId];
    return record?.score != null ? String(record.score) : "0";
  }

  function totalOfScores(studentId: string, overrideChecked?: Record<string, boolean>, overrideScores?: Record<string, string>): number {
    let scoreTotal = 0;
    let presentCount = 0;
    for (const l of lessons) {
      const sc = overrideScores && l.id in overrideScores ? Number(overrideScores[l.id]) : Number(getScore(l.id, studentId));
      scoreTotal += sc || 0;
      const checked = overrideChecked && l.id in overrideChecked ? overrideChecked[l.id] : getChecked(l.id, studentId);
      if (checked) presentCount++;
    }
    const existing = resultByStudent.get(studentId);
    return scoreTotal + (existing?.exam ?? 0) + presentCount;
  }

  function saveSum(studentId: string, overrideChecked?: Record<string, boolean>, overrideScores?: Record<string, string>) {
    const existing = resultByStudent.get(studentId);
    onSaveResult({
      studentId,
      bonus: existing?.bonus ?? 0,
      exam: existing?.exam ?? 0,
      sum: totalOfScores(studentId, overrideChecked, overrideScores),
    });
  }

  function setChecked(lessonId: string, studentId: string, checked: boolean) {
    setCheckState((prev) => ({
      ...prev,
      [lessonId]: { ...prev[lessonId], [studentId]: checked },
    }));
    onSaveAttendance(lessonId, {
      studentId,
      status: checked ? "Present" : "Absent",
      score: Number(getScore(lessonId, studentId)) || 0,
      comment: null,
    });
    saveSum(studentId, { [lessonId]: checked });
  }

  function setScore(lessonId: string, studentId: string, v: string) {
    setScoreState((prev) => ({
      ...prev,
      [lessonId]: { ...prev[lessonId], [studentId]: v },
    }));
    onSaveAttendance(lessonId, {
      studentId,
      status: getChecked(lessonId, studentId) ? "Present" : "Absent",
      score: Number(v) || 0,
      comment: null,
    });
    saveSum(studentId, undefined, { [lessonId]: v });
  }

  function selectAll(lessonId: string, checked: boolean) {
    for (const student of students) {
      setCheckState((prev) => ({
        ...prev,
        [lessonId]: { ...prev[lessonId], [student.id]: checked },
      }));
      onSaveAttendance(lessonId, {
        studentId: student.id,
        status: checked ? "Present" : "Absent",
        score: Number(getScore(lessonId, student.id)) || 0,
        comment: null,
      });
    }
    for (const student of students) saveSum(student.id, { [lessonId]: checked });
  }

  const resultByStudent = new Map<string, { bonus: number; exam: number; sum: number }>();
  for (const r of week.results ?? []) resultByStudent.set(r.studentId, r);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-separate border-spacing-0 text-xs">
        <thead>
          <tr className="text-muted-foreground">
            <th rowSpan={2} className="border-b border-border px-3 py-3 text-left font-medium">
              Students
            </th>
            {lessons.map((lesson) => (
              <th key={lesson.id} className="border-b border-border px-3 py-2 font-medium">
                <span className="mr-1">{fmtLessonDate(lesson.date)}</span>
                {lesson.topic && <span className="text-primary">✎</span>}
              </th>
            ))}
            <th colSpan={3} className="border-b border-border px-3 py-2 font-medium">
              End of week
            </th>
            {showAverage && (
              <th rowSpan={2} className="border-b border-border px-3 py-2 font-medium">
                Average
              </th>
            )}
          </tr>
          <tr className="text-muted-foreground">
            {lessons.map((lesson) => (
              <th key={lesson.id} className="border-b border-border px-3 py-2 font-normal">
                <div className="flex items-center justify-center gap-1.5">
                  <input
                    type="checkbox"
                    onChange={(e) => selectAll(lesson.id, e.target.checked)}
                    className="size-3.5 rounded border-border accent-primary"
                  />
                  <span>Att</span>
                  <span>Score</span>
                </div>
              </th>
            ))}
            <th className="border-b border-border px-3 pb-2 font-normal">Bonus</th>
            <th className="border-b border-border px-3 pb-2 font-normal">Exam</th>
            <th className="border-b border-border px-3 pb-2 font-normal">Sum</th>
          </tr>
        </thead>
        <tbody>
          {[...students]
            .sort((a, b) => {
              const aSum = resultByStudent.get(a.id)?.sum ?? 0;
              const bSum = resultByStudent.get(b.id)?.sum ?? 0;
              return bSum - aSum;
            })
            .map((student) => {
            const result = resultByStudent.get(student.id);
            return (
              <tr key={student.id} className="text-foreground/90">
                <td className="whitespace-nowrap border-b border-border px-3 py-2 font-medium">
                  <Link href={`/students/${student.id}`} className="hover:text-primary">
                    {student.name}
                  </Link>
                  {result && result.sum > 0 && (
                    <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-semibold tabular-nums text-primary">
                      {result.sum}
                    </span>
                  )}
                </td>
                {lessons.map((lesson) => (
                  <td key={lesson.id} className="border-b border-border px-3 py-2">
                    <AttendanceCell
                      record={lesson.attendances?.find((a) => a.studentId === student.id)}
                      present={getChecked(lesson.id, student.id)}
                      score={getScore(lesson.id, student.id)}
                      onToggle={(checked) => setChecked(lesson.id, student.id, checked)}
                      onScoreChange={(v) => setScore(lesson.id, student.id, v)}
                      onSave={(body) =>
                        onSaveAttendance(lesson.id, { ...body, studentId: student.id } as SetAttendanceRequest)
                      }
                    />
                  </td>
                ))}
                <ResultCells
                  result={result}
                  dailyTotal={totalOfScores(student.id)}
                  onSave={(body) => onSaveResult({ ...body, studentId: student.id } as SetWeekResultRequest)}
                />
                {showAverage && (
                  <td className="border-b border-border px-3 py-2 text-center font-semibold tabular-nums text-primary">
                    {averages?.get(student.id) ?? "—"}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function DeleteDialog({
  weekNumber,
  weekId,
  onConfirm,
}: {
  weekNumber: number;
  weekId: string;
  onConfirm: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="Delete week"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Trash2 className="size-4 text-destructive" />
      </Button>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <Card
            className="w-80 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-1 text-sm font-semibold">Delete Week {weekNumber}?</p>
            <p className="mb-4 text-xs text-muted-foreground">
              All lessons, attendance records, and scores for this week will be permanently removed. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  onConfirm(weekId);
                  setOpen(false);
                }}
              >
                Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
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
    queryClient.refetchQueries({ queryKey: ["Journal", groupId] });

  // ponytail: Set of open week IDs. New weeks start closed.
  const [openWeeks, setOpenWeeks] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  }

  const [adding, setAdding] = useState(false);
  const addWeek = useMutation({
    mutationFn: async (weekNumber: number) => {
      const week = await journalApi.addWeek(groupId, { weekNumber, title: `Week ${weekNumber}` });
      const dates = weekdayDates();
      await Promise.all(
        dates.map((date) =>
          journalApi.addLesson(week.id, { date, topic: "" })
        )
      );
      return week;
    },
    onSuccess: () => {
      invalidate();
      showToast("Week added");
    },
    onSettled: () => setAdding(false),
  });

  const deleteWeek = useMutation({
    mutationFn: (weekId: string) => journalApi.deleteWeek(weekId),
    onSuccess: () => {
      invalidate();
      showToast("Week deleted");
    },
  });

  const saveAttendance = useMutation({
    mutationFn: (vars: { lessonId: string; body: SetAttendanceRequest }) =>
      journalApi.setAttendance(vars.lessonId, vars.body),
    onSuccess: () => {
      invalidate();
      showToast("Saved");
    },
  });

  const saveResult = useMutation({
    mutationFn: (vars: { weekId: string; body: SetWeekResultRequest }) =>
      journalApi.setWeekResult(vars.weekId, vars.body),
    onSuccess: () => {
      invalidate();
      showToast("Saved");
    },
  });

  const students: Student[] = (rosterQuery.data ?? [])
    .filter((e) => e.status !== "Left")
    .map((e) => ({ id: e.studentId, name: e.studentName ?? "—" }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const weeks = [...(journalQuery.data ?? [])].sort(
    (a, b) => a.weekNumber - b.weekNumber
  );
  const showAverage = weeks.length >= 4;
  const averages = new Map<string, number>();
  if (showAverage) {
    for (const s of students) {
      let total = 0;
      for (const w of weeks) {
        const r = (w.results ?? []).find((x) => x.studentId === s.id);
        if (r) total += r.sum;
      }
      averages.set(s.id, Math.ceil(total / weeks.length));
    }
  }

  const nextWeekNumber = weeks.length
    ? Math.max(...weeks.map((w) => w.weekNumber)) + 1
    : 1;

  function toggleWeek(id: string) {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

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
          onClick={() => {
            setAdding(true);
            addWeek.mutate(nextWeekNumber);
          }}
          disabled={adding}
        >
          {adding ? <Loader2 className="animate-spin" /> : <Plus className="size-4" />}
          New week
        </Button>
      </div>

      <Card>
        <CardContent className="p-5">
          <h2 className="mb-4 text-center text-lg font-semibold">Exam graphics</h2>
          {journalQuery.isPending ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : (
            <JournalChart weeks={weeks} students={students} />
          )}
        </CardContent>
      </Card>

      {journalQuery.isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Couldn&apos;t load the journal.
          </CardContent>
        </Card>
      ) : rosterQuery.isPending ? (
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
            No weeks yet. Use &ldquo;New week&rdquo; to start the journal.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {weeks.map((week) => {
            const open = openWeeks.has(week.id);
            return (
              <Card key={week.id} className="overflow-hidden">
                <div
                  className="flex cursor-pointer items-center justify-between border-b border-border px-5 py-3"
                  onClick={() => toggleWeek(week.id)}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <ChevronDown
                      className={cn("size-4 transition-transform", open ? "" : "-rotate-90")}
                    />
                    {week.title ?? `Week ${week.weekNumber}`}
                  </div>
                  <DeleteDialog
                    weekNumber={week.weekNumber}
                    weekId={week.id}
                    onConfirm={(id) => deleteWeek.mutate(id)}
                  />
                </div>
                {open && (
                  <div className="p-5">
                    <WeekTable
                      week={week}
                      students={students}
                      onSaveAttendance={(lessonId, body) =>
                        saveAttendance.mutate({ lessonId, body })
                      }
                      onSaveResult={(body) => saveResult.mutate({ weekId: week.id, body })}
                      showAverage={showAverage}
                      averages={averages}
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
      <style>{`@keyframes slideDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      {toast && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
          <div
            className="flex items-center gap-2.5 rounded-full border border-border/50 bg-background/95 px-5 py-2.5 text-sm font-medium text-foreground shadow-2xl backdrop-blur-sm"
            style={{ animation: 'slideDown 0.25s ease-out' }}
          >
          <span className="flex size-5 items-center justify-center rounded-full bg-primary/10">
            <Check className="size-3 text-primary" />
          </span>
          {toast}
          </div>
        </div>
      )}
    </div>
  );
}
