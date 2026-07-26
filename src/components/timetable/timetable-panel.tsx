"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  ViewMode,
  ScheduleEvent,
  MOCK_SCHEDULE_EVENTS,
} from "./types";
import { DayView } from "./day-view";
import { WeekView } from "./week-view";
import { MonthView } from "./month-view";
import { EventModal } from "./event-modal";
import { DayPopover } from "./day-popover";

export function TimetablePanel() {
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);

  // Day Overflow Popover state
  const [popoverData, setPopoverData] = useState<{
    dateTitle: string;
    events: ScheduleEvent[];
  } | null>(null);

  // Date Navigation State
  const [currentDayIndex, setCurrentDayIndex] = useState(0); // Index for days

  // Month Days Setup (Feb 2023)
  const monthDays = [
    { dayNumber: 29, isCurrentMonth: false, dateStr: "2023-01-29" },
    { dayNumber: 30, isCurrentMonth: false, dateStr: "2023-01-30" },
    { dayNumber: 1, isCurrentMonth: true, dateStr: "2023-02-01" },
    { dayNumber: 2, isCurrentMonth: true, dateStr: "2023-02-02" },
    { dayNumber: 3, isCurrentMonth: true, dateStr: "2023-02-03" },
    { dayNumber: 4, isCurrentMonth: true, dateStr: "2023-02-04" },
    { dayNumber: 5, isCurrentMonth: true, dateStr: "2023-02-05" },

    { dayNumber: 6, isCurrentMonth: true, dateStr: "2023-02-06" },
    { dayNumber: 7, isCurrentMonth: true, dateStr: "2023-02-07" },
    { dayNumber: 8, isCurrentMonth: true, dateStr: "2023-02-08" },
    { dayNumber: 9, isCurrentMonth: true, dateStr: "2023-02-09" },
    { dayNumber: 10, isCurrentMonth: true, dateStr: "2023-02-10" },
    { dayNumber: 11, isCurrentMonth: true, dateStr: "2023-02-11" },
    { dayNumber: 12, isCurrentMonth: true, dateStr: "2023-02-12" },

    { dayNumber: 13, isCurrentMonth: true, dateStr: "2023-02-13" },
    { dayNumber: 14, isCurrentMonth: true, dateStr: "2023-02-14" },
    { dayNumber: 15, isCurrentMonth: true, isToday: true, dateStr: "2023-02-15" },
    { dayNumber: 16, isCurrentMonth: true, dateStr: "2023-02-16" },
    { dayNumber: 17, isCurrentMonth: true, dateStr: "2023-02-17" },
    { dayNumber: 18, isCurrentMonth: true, dateStr: "2023-02-18" },
    { dayNumber: 19, isCurrentMonth: true, dateStr: "2023-02-19" },

    { dayNumber: 20, isCurrentMonth: true, dateStr: "2023-02-20" },
    { dayNumber: 21, isCurrentMonth: true, dateStr: "2023-02-21" },
    { dayNumber: 22, isCurrentMonth: true, dateStr: "2023-02-22" },
    { dayNumber: 23, isCurrentMonth: true, dateStr: "2023-02-23" },
    { dayNumber: 24, isCurrentMonth: true, dateStr: "2023-02-24" },
    { dayNumber: 25, isCurrentMonth: true, dateStr: "2023-02-25" },
    { dayNumber: 26, isCurrentMonth: true, dateStr: "2023-02-26" },

    { dayNumber: 27, isCurrentMonth: true, dateStr: "2023-02-27" },
    { dayNumber: 28, isCurrentMonth: true, dateStr: "2023-02-28" },
    { dayNumber: 29, isCurrentMonth: true, dateStr: "2023-02-29" },
    { dayNumber: 30, isCurrentMonth: true, dateStr: "2023-02-30" },
    { dayNumber: 31, isCurrentMonth: true, dateStr: "2023-03-31" },
    { dayNumber: 13, isCurrentMonth: false, dateStr: "2023-03-13" },
    { dayNumber: 13, isCurrentMonth: false, dateStr: "2023-03-13" },
  ];

  // Week Days Setup
  const weekDays = [
    { dayName: "Mon", dateFormatted: "19/03", dayIndex: 0 },
    { dayName: "Tue", dateFormatted: "20/03", dayIndex: 1 },
    { dayName: "Wed", dateFormatted: "21/03", dayIndex: 2 },
    { dayName: "Thu", dateFormatted: "22/03", dayIndex: 3 },
    { dayName: "Fri", dateFormatted: "23/03", dayIndex: 4 },
    { dayName: "Sat", dateFormatted: "24/03", dayIndex: 5 },
    { dayName: "Sun", dateFormatted: "25/03", dayIndex: 6 },
  ];

  // Handle Date Controller Display
  const getDateRangeLabel = () => {
    if (viewMode === "day") {
      return "Monday / 19 Feb";
    }
    if (viewMode === "week") {
      return "Mon / 19 Feb - Sat / 24 Feb";
    }
    return "February 2023";
  };

  return (
    <div className="w-full space-y-6 font-sans">
      {/* Top Header: Title + View Switcher */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Timetable
        </h1>

        {/* View Switcher Toggle Pill (Day | Week | Month) */}
        <div className="bg-slate-200/70 dark:bg-slate-800 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
          <button
            onClick={() => setViewMode("day")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "day"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Day
          </button>
          <button
            onClick={() => setViewMode("week")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "week"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === "month"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Month
          </button>
        </div>
      </div>

      {/* Date Controller Bar (< Date Range >) */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentDayIndex((prev) => prev - 1)}
          className="size-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <ChevronLeft className="size-4 stroke-[3]" />
        </button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 px-5 py-1.5 rounded-2xl shadow-2xs">
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            {getDateRangeLabel()}
          </span>
        </div>

        <button
          onClick={() => setCurrentDayIndex((prev) => prev + 1)}
          className="size-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs hover:bg-indigo-700 active:scale-95 transition-all"
        >
          <ChevronRight className="size-4 stroke-[3]" />
        </button>
      </div>

      {/* Dynamic View Rendering */}
      {viewMode === "day" && (
        <DayView
          events={MOCK_SCHEDULE_EVENTS.filter((e) => e.dateDay === 19)}
          onSelectEvent={setSelectedEvent}
        />
      )}

      {viewMode === "week" && (
        <WeekView
          events={MOCK_SCHEDULE_EVENTS}
          weekDays={weekDays}
          onSelectEvent={setSelectedEvent}
        />
      )}

      {viewMode === "month" && (
        <MonthView
          events={MOCK_SCHEDULE_EVENTS}
          monthDays={monthDays}
          onSelectEvent={setSelectedEvent}
          onOpenDayPopover={(dateTitle, events) =>
            setPopoverData({ dateTitle, events })
          }
        />
      )}

      {/* Day Overflow Popover (+X more) */}
      {popoverData && (
        <DayPopover
          dateTitle={popoverData.dateTitle}
          events={popoverData.events}
          onClose={() => setPopoverData(null)}
          onSelectEvent={(evt) => {
            setSelectedEvent(evt);
          }}
        />
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
