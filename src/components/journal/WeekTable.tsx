"use client";

import { Pencil, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeekData, Student } from "@/lib/types";
import { ScoreDropdown } from "./ScoreDropdown";

interface WeekTableProps {
  week: WeekData;
  students: Student[];
  onToggleAttendance: (studentId: string, dayIndex: number) => void;
  onChangeScore: (studentId: string, dayIndex: number, score: number) => void;
  onChangeBonus: (studentId: string, bonus: number) => void;
  onChangeExam: (studentId: string, exam: number) => void;
}

export function WeekTable({
  week,
  students,
  onToggleAttendance,
  onChangeScore,
  onChangeBonus,
  onChangeExam,
}: WeekTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-white/5">
            <th className="sticky left-0 z-10 bg-surface px-4 py-3 text-xs font-semibold text-gray-500 dark:bg-surface-dark dark:text-gray-400">
              Students
            </th>
            {week.dates.map((date, i) => (
              <th
                key={i}
                colSpan={2}
                className="px-3 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400"
              >
                <div className="flex items-center justify-center gap-1">
                  {date}
                  <Pencil size={12} className="text-brand" />
                </div>
              </th>
            ))}
            <th
              colSpan={4}
              className="px-3 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400"
            >
              End of week
            </th>
          </tr>

          <tr className="border-b border-gray-200 dark:border-white/5">
            <th className="bg-surface dark:bg-surface-dark" />
            {week.dates.map((_, i) => (
              <th
                key={`att-${i}`}
                className="px-1 py-2 text-center text-[10px] font-medium text-gray-400 dark:text-gray-500"
              >
                Att
              </th>
            ))}
            {week.dates.map((_, i) => (
              <th
                key={`score-${i}`}
                className="px-1 py-2 text-center text-[10px] font-medium text-gray-400 dark:text-gray-500"
              >
                Score
              </th>
            ))}
            <th className="px-1 py-2 text-center text-[10px] font-medium text-gray-400 dark:text-gray-500">
              Att
            </th>
            <th className="px-1 py-2 text-center text-[10px] font-medium text-gray-400 dark:text-gray-500">
              Bonus
            </th>
            <th className="px-1 py-2 text-center text-[10px] font-medium text-gray-400 dark:text-gray-500">
              Exam
            </th>
            <th className="px-1 py-2 text-center text-[10px] font-medium text-gray-400 dark:text-gray-500">
              Sum
            </th>
          </tr>
        </thead>

        <tbody>
          {students.map((student, si) => {
            const attDays = week.attendance[student.id] ?? [];
            const scoreDays = week.scores[student.id] ?? [];
            const end = week.endOfWeek[student.id] ?? { bonus: 0, exam: 0, sum: 0 };

            return (
              <tr
                key={student.id}
                className="border-b border-gray-100 transition-colors hover:bg-gray-50 last:border-0 dark:border-white/[0.03] dark:hover:bg-white/5"
              >
                <td className="sticky left-0 z-10 bg-surface px-4 py-3 text-sm font-medium text-gray-900 dark:bg-surface-dark dark:text-gray-100">
                  {si + 1}. {student.name}
                </td>

                {week.dates.map((_, di) => (
                  <td key={`att-${di}`} className="px-1 py-3 text-center">
                    <button
                      onClick={() => onToggleAttendance(student.id, di)}
                      className={cn(
                        "mx-auto flex size-5 items-center justify-center rounded-md border transition-colors",
                        attDays[di]
                          ? "border-brand bg-brand text-white"
                          : "border-gray-300 bg-white text-transparent dark:border-gray-600 dark:bg-transparent"
                      )}
                    >
                      {attDays[di] && <Check size={12} />}
                    </button>
                  </td>
                ))}

                {week.dates.map((_, di) => (
                  <td key={`score-${di}`} className="px-1 py-3 text-center">
                    {attDays[di] ? (
                      <ScoreDropdown
                        value={scoreDays[di] ?? 0}
                        onChange={(v) => onChangeScore(student.id, di, v)}
                      />
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </td>
                ))}

                <td className="px-1 py-3 text-center">
                  <button
                    onClick={() => onToggleAttendance(student.id, 0)}
                    className={cn(
                      "mx-auto flex size-5 items-center justify-center rounded-md border transition-colors",
                      "border-gray-300 bg-white dark:border-gray-600 dark:bg-transparent"
                    )}
                  >
                    {false && <Check size={12} />}
                  </button>
                </td>

                <td className="px-1 py-3 text-center">
                  <ScoreDropdown
                    value={end.bonus}
                    onChange={(v) => onChangeBonus(student.id, v)}
                    min={0}
                    max={20}
                  />
                </td>

                <td className="px-1 py-3 text-center">
                  <ScoreDropdown
                    value={end.exam}
                    onChange={(v) => onChangeExam(student.id, v)}
                  />
                </td>

                <td className="px-1 py-3 text-center">
                  <span className="inline-block rounded-full bg-gold px-3 py-1 text-sm font-bold text-gray-900">
                    {end.sum}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
