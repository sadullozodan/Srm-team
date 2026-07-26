"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { BranchItem, INITIAL_BRANCHES } from "./types";
import { BranchChart } from "./branch-chart";
import { BranchTable } from "./branch-table";
import { BranchDrawer } from "./branch-drawer";
import { AddBranchModal } from "./add-branch-modal";

export function BranchesPanel() {
  const [branches, setBranches] = useState<BranchItem[]>(INITIAL_BRANCHES);
  const [year, setYear] = useState(2023);
  const [selectedBranch, setSelectedBranch] = useState<BranchItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddBranch = (newBranch: BranchItem) => {
    setBranches((prev) => [newBranch, ...prev]);
  };

  return (
    <div className="w-full space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Branches
        </h1>

        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-3 py-1.5 flex items-center gap-3 shadow-2xs">
            <button
              onClick={() => setYear((y) => y - 1)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Year: {year}
            </span>
            <button
              onClick={() => setYear((y) => y + 1)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="size-4 stroke-[3]" />
            <span>ADD NEW</span>
          </button>
        </div>
      </div>

      <BranchChart />

      <BranchTable
        branches={branches}
        onOpenDrawer={(branch: BranchItem) => setSelectedBranch(branch)}
      />

      <BranchDrawer
        branch={selectedBranch}
        onClose={() => setSelectedBranch(null)}
      />

      <AddBranchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddBranch={handleAddBranch}
      />
    </div>
  );
}
