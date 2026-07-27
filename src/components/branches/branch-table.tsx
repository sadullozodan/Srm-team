"use client";

import { Search, ArrowRight, Loader2 } from "lucide-react";
import type { BranchDto } from "@/lib/api/types";

export interface BranchTableProps {
  branches: BranchDto[];
  search: string;
  onSearchChange: (q: string) => void;
  loading: boolean;
  onOpenDrawer: (branch: BranchDto) => void;
}

export function BranchTable({ branches, search, onSearchChange, loading, onOpenDrawer }: BranchTableProps) {
  return (
    <div className="space-y-4">
      <div className="relative w-full max-w-xs">
        <label className="absolute -top-2.5 left-3 bg-slate-50 dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
          Search
        </label>
        <div className="relative flex items-center">
          <Search className="absolute left-3 size-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name"
            className="w-full pl-9 pr-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-6">TITLE</th>
              <th className="py-4 px-4">CITY</th>
              <th className="py-4 px-4">DISTRICT</th>
              <th className="py-4 px-4">ADDRESS</th>
              <th className="py-4 px-4 text-center">STATUS</th>
              <th className="py-4 px-6 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm font-medium">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <Loader2 className="size-5 animate-spin mx-auto" />
                </td>
              </tr>
            ) : branches.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                  No branches found.
                </td>
              </tr>
            ) : (
              branches.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100">
                    {b.title ?? "—"}
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                    {b.city ?? "—"}
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                    {b.district ?? "—"}
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                    {b.address ?? "—"}
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      b.status === "Active"
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400"
                        : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => onOpenDrawer(b)}
                      className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                    >
                      <ArrowRight className="size-4 stroke-[2.5]" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
