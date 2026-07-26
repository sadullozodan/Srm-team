"use client";

import React from "react";
import { ScheduleEvent, getEventCategoryStyle } from "./types";

export interface WeekViewProps {
  events: ScheduleEvent[];
  weekDays: { dayName: string; dateFormatted: string; dayIndex: number }[];
  onSelectEvent: (event: ScheduleEvent) => void;
}

const HOURS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
];

export function WeekView({ events, weekDays, onSelectEvent }: WeekViewProps) {
  return (
    <div className="w-full bg-white dark:bg-card rounded-2xl md:rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 overflow-x-auto">
      <div className="min-w-[900px]">
        {/* 7-Column Header Row */}
        <div className="grid grid-cols-8 gap-2 mb-4">
          <div className="text-center font-bold text-slate-400 text-xs py-2">
            Time
          </div>
          {weekDays.map((wd) => (
            <div
              key={wd.dayName + wd.dateFormatted}
              className="bg-slate-100/80 dark:bg-slate-800/60 rounded-xl py-2.5 px-2 text-center text-xs font-bold text-slate-700 dark:text-slate-200"
            >
              {wd.dayName} {wd.dateFormatted}
            </div>
          ))}
        </div>

        {/* Timeline Grid Rows */}
        <div className="space-y-4">
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8 gap-2 items-start relative">
              {/* Hour Label */}
              <div className="text-xs font-bold text-slate-400 py-1">
                {hour}
              </div>

              {/* Day Cell Columns */}
              {weekDays.map((wd) => {
                const cellEvents = events.filter(
                  (evt) => evt.dayOfWeek === wd.dayIndex && evt.startTime === hour
                );

                return (
                  <div
                    key={wd.dayIndex}
                    className="min-h-[60px] border-t border-dashed border-slate-200 dark:border-slate-800 pt-1 space-y-1.5"
                  >
                    {cellEvents.map((evt) => {
                      const style = getEventCategoryStyle(evt.category);
                      return (
                        <div
                          key={evt.id}
                          onClick={() => onSelectEvent(evt)}
                          className={`rounded-xl p-2 border-2 ${style.bg} ${style.border} hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer space-y-1 text-xs`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-slate-900 dark:text-slate-100 truncate text-[11px]">
                              {evt.title}
                            </span>
                            <span
                              className={`text-[8px] font-bold px-1 py-0.5 rounded-full shrink-0 ${style.badgeBg} ${style.badgeText}`}
                            >
                              {evt.type}
                            </span>
                          </div>
                          <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400">
                            {evt.startTime} - {evt.endTime}
                          </p>
                          <div className="flex items-center justify-between text-[9px] font-semibold text-slate-600 dark:text-slate-400 border-t border-slate-200/40 dark:border-slate-700/40 pt-1">
                            <span className="truncate">{evt.classroom}</span>
                            <span className="truncate font-bold">{evt.instructor}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
