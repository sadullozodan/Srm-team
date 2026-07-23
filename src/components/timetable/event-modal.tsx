"use client";

import React from "react";
import { X } from "lucide-react";
import { ScheduleEvent, getEventCategoryStyle } from "./types";

export interface EventModalProps {
  event: ScheduleEvent | null;
  onClose: () => void;
}

export function EventModal({ event, onClose }: EventModalProps) {
  if (!event) return null;

  const style = getEventCategoryStyle(event.category);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-card text-foreground rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Evan date
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Event Card Preview Box (matching image_99f860.png) */}
        <div
          className={`w-full rounded-2xl p-5 border-2 ${style.bg} ${style.border} shadow-xs space-y-4`}
        >
          {/* Top Row: Title + Badge */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
                {event.title}
              </h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                {event.startTime} - {event.endTime}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-2xs ${style.badgeBg} ${style.badgeText}`}
            >
              {event.type}
            </span>
          </div>

          <div className="border-t border-slate-200/60 dark:border-slate-700/60 pt-3 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>{event.classroom}</span>
            <span>{event.instructor}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950/40 text-xs font-extrabold tracking-wider transition-all"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}
