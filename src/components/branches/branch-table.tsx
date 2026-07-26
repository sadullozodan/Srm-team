"use client";

import React, { useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { BranchItem } from "./types";

export interface BranchTableProps {
  branches: BranchItem[];
  onOpenDrawer: (branch: BranchItem) => void;
}

export function BranchTable({ branches, onOpenDrawer }: BranchTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBranches = branches.filter(
    (b) =>
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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
              <th className="py-4 px-4">ADRESS</th>
              <th className="py-4 px-4">GROUPS</th>
              <th className="py-4 px-4">STUDENTS</th>
              <th className="py-4 px-4 text-center">STATUS</th>
              <th className="py-4 px-6 text-center">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm font-medium">
            {filteredBranches.map((b) => (
              <tr
                key={b.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
              >
                <td className="py-4 px-6 font-semibold text-slate-900 dark:text-slate-100">
                  {b.title}
                </td>
                <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                  {b.city}
                </td>
                <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                  {b.district}
                </td>
                <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                  {b.address}
                </td>
                <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                  {b.groupsCount}
                </td>
                <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                  {b.studentsCount}
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
