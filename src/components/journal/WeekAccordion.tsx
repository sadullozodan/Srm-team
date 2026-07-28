"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { WeekData, Student } from "@/lib/types";
import { WeekTable } from "./WeekTable";

interface WeekAccordionProps {
  weeks: WeekData[];
  students: Student[];
  onToggleAttendance: (weekId: string, studentId: string, dayIndex: number) => void;
  onChangeScore: (weekId: string, studentId: string, dayIndex: number, score: number) => void;
  onChangeBonus: (weekId: string, studentId: string, bonus: number) => void;
  onChangeExam: (weekId: string, studentId: string, exam: number) => void;
}

export function WeekAccordion({
  weeks,
  students,
  onToggleAttendance,
  onChangeScore,
  onChangeBonus,
  onChangeExam,
}: WeekAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const sorted = [...weeks].sort((a, b) => b.weekNumber - a.weekNumber);

  return (
    <div className="space-y-3">
      {sorted.map((week) => {
        const isOpen = openId === week.id;

        return (
          <div
            key={week.id}
            className="rounded-2xl border border-dashed border-indigo-200 bg-surface dark:border-white/5 dark:bg-surface-dark"
          >
            <button
              onClick={() => setOpenId(isOpen ? null : week.id)}
              className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Неделя {week.weekNumber} — {week.title}
              </span>
              {isOpen ? (
                <ChevronUp size={18} className="shrink-0 text-gray-400" />
              ) : (
                <ChevronDown size={18} className="shrink-0 text-gray-400" />
              )}
            </button>

            <div
              className={cn(
                "grid transition-all duration-300 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-0 pb-3">
                  <WeekTable
                    week={week}
                    students={students}
                    onToggleAttendance={(sid, di) => onToggleAttendance(week.id, sid, di)}
                    onChangeScore={(sid, di, v) => onChangeScore(week.id, sid, di, v)}
                    onChangeBonus={(sid, v) => onChangeBonus(week.id, sid, v)}
                    onChangeExam={(sid, v) => onChangeExam(week.id, sid, v)}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
