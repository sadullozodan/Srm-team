"use client";

import React from "react";
import { X, SquarePen, ChevronRight } from "lucide-react";
import { BranchItem } from "./types";

export interface BranchDrawerProps {
  branch: BranchItem | null;
  onClose: () => void;
}

export function BranchDrawer({ branch, onClose }: BranchDrawerProps) {
  if (!branch) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md sm:max-w-lg bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full p-6 sm:p-8 shadow-2xl overflow-y-auto space-y-6 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            Branch
          </h2>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              {branch.title}
            </h1>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
              Status:{" "}
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {branch.status}
              </span>
            </p>
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm">
            <SquarePen className="size-4" />
            <span>EDIT</span>
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">City:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {branch.city}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">District:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {branch.district}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Address:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {branch.address}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Phone number:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
              {branch.phone}
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
            Groups
          </h3>

          <div className="space-y-3">
            {branch.groupsList.map((grp) => (
              <div
                key={grp.id}
                className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all space-y-2 relative group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {grp.name}
                  </h4>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {grp.startDate}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <span>{grp.scheduleDays}</span>
                  <div className="flex items-center gap-2 font-mono">
                    <span>{grp.classTime}</span>
                    <ChevronRight className="size-4 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
