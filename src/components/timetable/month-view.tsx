"use client";

import React from "react";
import { ScheduleEvent, getEventCategoryStyle } from "./types";

export interface MonthDayCell {
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday?: boolean;
  dateStr: string;
}

export interface MonthViewProps {
  events: ScheduleEvent[];
  monthDays: MonthDayCell[];
  onSelectEvent: (event: ScheduleEvent) => void;
  onOpenDayPopover: (dateTitle: string, events: ScheduleEvent[]) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthView({
  events,
  monthDays,
  onSelectEvent,
  onOpenDayPopover,
}: MonthViewProps) {
  return (
    <div className="w-full bg-white dark:bg-card rounded-2xl md:rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 overflow-x-auto">
      <div className="min-w-[850px]">
        {/* 7-Column Header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="bg-slate-100/80 dark:bg-slate-800/60 rounded-xl py-2.5 text-center text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 7-Column Month Grid */}
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((cell, idx) => {
            const dayEvents = events.filter((evt) => evt.dateDay === cell.dayNumber && cell.isCurrentMonth);
            const previewEvents = dayEvents.slice(0, 2);
            const overflowCount = dayEvents.length - previewEvents.length;

            return (
              <div
                key={idx}
                className={`min-h-[110px] p-2.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  cell.isCurrentMonth
                    ? "bg-white dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800"
                    : "bg-slate-50/50 dark:bg-slate-900/10 border-slate-100 dark:border-slate-800/40 opacity-40"
                }`}
              >
                {/* Cell Header: Date Number */}
                <div className="flex items-center justify-end">
                  {cell.isToday ? (
                    <span className="size-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-xs">
                      {cell.dayNumber}
                    </span>
                  ) : (
                    <span
                      className={`text-xs font-bold ${
                        cell.isCurrentMonth
                          ? "text-slate-800 dark:text-slate-200"
                          : "text-slate-400"
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                  )}
                </div>

                {/* Class Chips Preview */}
                <div className="space-y-1.5 my-1">
                  {previewEvents.map((evt) => {
                    const style = getEventCategoryStyle(evt.category);
                    return (
                      <button
                        key={evt.id}
                        onClick={() => onSelectEvent(evt)}
                        className={`w-full text-left px-2 py-1 rounded-lg border ${style.bg} ${style.border} hover:opacity-90 transition-all text-[10px] font-semibold truncate flex items-center gap-1.5 shadow-2xs`}
                      >
                        <span className="opacity-80 shrink-0 font-mono">
                          {evt.startTime}
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">|</span>
                        <span className={`truncate font-bold ${style.text}`}>
                          {evt.title}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Overflow Link "+X more" */}
                {overflowCount > 0 ? (
                  <button
                    onClick={() =>
                      onOpenDayPopover(`${cell.dayNumber} February 2023`, dayEvents)
                    }
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline text-left pt-0.5 transition-all"
                  >
                    +{overflowCount} more
                  </button>
                ) : (
                  <div className="h-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
