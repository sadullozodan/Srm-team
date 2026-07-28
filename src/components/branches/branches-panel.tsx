"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { branchesApi, groupsApi, queryKeys } from "@/lib/api/resources";
import type { BranchDto } from "@/lib/api/types";
import { BranchChart } from "./branch-chart";
import { BranchTable } from "./branch-table";
import { BranchDrawer } from "./branch-drawer";

export function BranchesPanel() {
  const [year, setYear] = useState(2023);
  const [selectedBranch, setSelectedBranch] = useState<BranchDto | null>(null);
  const [search, setSearch] = useState("");

  const branchesQuery = useQuery({
    queryKey: queryKeys.list("Branches", search ? { search } : undefined),
    queryFn: () => branchesApi.list(search ? { search } : undefined),
  });

  const groupsQuery = useQuery({
    queryKey: ["Groups", "all"],
    queryFn: () => groupsApi.list({ pageSize: 200 }),
  });

  const branches = branchesQuery.data?.items ?? [];
  const allGroups = groupsQuery.data?.items ?? [];

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

          <Link
            href="/branches/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="size-4 stroke-[3]" />
            <span>ADD NEW</span>
          </Link>
        </div>
      </div>

      <BranchChart year={year} />

      <BranchTable
        branches={branches}
        search={search}
        onSearchChange={setSearch}
        loading={branchesQuery.isPending}
        onOpenDrawer={(branch: BranchDto) => setSelectedBranch(branch)}
      />

      <BranchDrawer
        branch={selectedBranch}
        groups={allGroups.filter((g) => g.branchId === selectedBranch?.id)}
        onClose={() => setSelectedBranch(null)}
      />
    </div>
  );
}
