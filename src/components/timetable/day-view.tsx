"use client";

import React from "react";
import { ScheduleEvent, getEventCategoryStyle } from "./types";

export interface DayViewProps {
  events: ScheduleEvent[];
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

export function DayView({ events, onSelectEvent }: DayViewProps) {
  // Group events by start time e.g. "10:00", "16:00", "18:00"
  const eventsByHour: Record<string, ScheduleEvent[]> = {};
  for (const hour of HOURS) {
    eventsByHour[hour] = events.filter((evt) => evt.startTime === hour);
  }

  return (
    <div className="w-full bg-white dark:bg-card rounded-2xl md:rounded-3xl p-5 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 overflow-x-auto">
      <div className="min-w-[850px] space-y-6">
        {HOURS.map((hour) => {
          const hourEvents = eventsByHour[hour] || [];
          return (
            <div key={hour} className="relative pt-1">
              {/* Dashed Timeline Line */}
              <div className="flex items-center gap-4 mb-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">
                  {hour}
                </span>
                <div className="flex-1 border-b border-dashed border-slate-200 dark:border-slate-800" />
              </div>

              {/* Event Cards Grid for this hour */}
              {hourEvents.length > 0 && (
                <div className="ml-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 py-1">
                  {hourEvents.map((evt) => {
                    const style = getEventCategoryStyle(evt.category);
                    return (
                      <div
                        key={evt.id}
                        onClick={() => onSelectEvent(evt)}
                        className={`rounded-2xl p-3 border-2 ${style.bg} ${style.border} hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between min-h-[90px]`}
                      >
                        {/* Title & Badge */}
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                              {evt.title}
                            </h4>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${style.badgeBg} ${style.badgeText}`}
                            >
                              {evt.type}
                            </span>
                          </div>
                          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 mt-1">
                            {evt.startTime} - {evt.endTime}
                          </p>
                        </div>

                        {/* Footer: Classroom & Instructor */}
                        <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600 dark:text-slate-400 border-t border-slate-200/40 dark:border-slate-700/40 pt-1.5 mt-2">
                          <span className="truncate">{evt.classroom}</span>
                          <span className="truncate font-bold">{evt.instructor}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
