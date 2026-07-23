"use client";

import React from "react";
import { X } from "lucide-react";
import { ScheduleEvent, getEventCategoryStyle } from "./types";

export interface DayPopoverProps {
  dateTitle: string;
  events: ScheduleEvent[];
  onClose: () => void;
  onSelectEvent: (event: ScheduleEvent) => void;
}

export function DayPopover({
  dateTitle,
  events,
  onClose,
  onSelectEvent,
}: DayPopoverProps) {
  return (
    <div
      className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs sm:max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-3 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Popover Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            {dateTitle}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Class Chips List */}
        <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1 no-scrollbar">
          {events.map((evt) => {
            const style = getEventCategoryStyle(evt.category);
            return (
              <button
                key={evt.id}
                onClick={() => {
                  onSelectEvent(evt);
                }}
                className={`w-full text-left p-2.5 rounded-xl border ${style.bg} ${style.border} hover:opacity-90 transition-all flex items-center justify-between text-xs font-semibold shadow-2xs group`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-[11px] font-bold opacity-80 shrink-0">
                    {evt.startTime}
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">|</span>
                  <span className={`truncate font-bold ${style.text}`}>
                    {evt.title}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${style.badgeBg} ${style.badgeText}`}
                >
                  {evt.type}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
