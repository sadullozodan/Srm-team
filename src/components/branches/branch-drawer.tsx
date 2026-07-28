"use client";

import Link from "next/link";
import { X, SquarePen, ChevronRight } from "lucide-react";
import type { BranchDto, GroupDto } from "@/lib/api/types";

export interface BranchDrawerProps {
  branch: BranchDto | null;
  groups: GroupDto[];
  onClose: () => void;
}

function fmtTime(t: string | null) {
  if (!t) return "";
  return t.length >= 5 ? t.slice(0, 5) : t;
}

export function BranchDrawer({ branch, groups, onClose }: BranchDrawerProps) {
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
              <span className={`font-bold ${branch.status === "Active" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-500"}`}>
                {branch.status}
              </span>
            </p>
          </div>

          <Link
            href={`/branches/${branch.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
          >
            <SquarePen className="size-4" />
            <span>EDIT</span>
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">City:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {branch.city ?? "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">District:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {branch.district ?? "—"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500 dark:text-slate-400">Address:</span>
            <span className="font-bold text-slate-900 dark:text-slate-100">
              {branch.address ?? "—"}
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
              Groups
            </h3>
            <span className="text-xs text-slate-500">{groups.length}</span>
          </div>

          <div className="space-y-3">
            {groups.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No groups for this branch.</p>
            ) : (
              groups.map((grp) => (
                <Link
                  key={grp.id}
                  href={`/groups/${grp.id}`}
                  className="block bg-white dark:bg-slate-800/80 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all space-y-2 relative group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {grp.name ?? "—"}
                    </h4>
                    <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      {grp.startDate}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                    <span>{grp.days ?? "—"} {grp.room ? `· ${grp.room}` : ""}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span>
                        {fmtTime(grp.startTime)}{grp.startTime && grp.endTime ? " - " : ""}{fmtTime(grp.endTime)}
                        {grp.enrolledCount > 0 && (
                          <span className="ml-2 text-indigo-500">({grp.enrolledCount})</span>
                        )}
                      </span>
                      <ChevronRight className="size-4 text-indigo-600 dark:text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
