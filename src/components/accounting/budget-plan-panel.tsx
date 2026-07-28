"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Upload,
  Plus,
  SquarePen,
  Trash2,
  Calendar,
} from "lucide-react";
import { BudgetPlanChart } from "./budget-plan-chart";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  budgetsApi,
  queryKeys,
} from "@/lib/api/resources";
import { Toast } from "@/components/ui/toast";

const FETCH_ALL = { page: 1, pageSize: 1000 };
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function BudgetPlanPanel() {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<string | null>(null);
  const budgetsQuery = useQuery({
    queryKey: queryKeys.list(budgetsApi.key, FETCH_ALL),
    queryFn: () => budgetsApi.list(FETCH_ALL),
  });

  const budgets = useMemo(() => {
    const items = budgetsQuery.data?.items ?? [];
    return items.map((b) => ({
      id: b.id,
      categoryName: b.categoryName ?? "—",
      from: b.fromDate ? new Date(b.fromDate).toLocaleDateString("ru-RU") : "—",
      to: b.toDate ? new Date(b.toDate).toLocaleDateString("ru-RU") : "—",
      amountAllocated: String(b.amountAllocated),
      amountSpent: String(b.amountSpent),
      status: b.status === "Active" ? "Ative" : "Inactive",
    }));
  }, [budgetsQuery.data]);

  const chartData = useMemo(() => {
    const items = budgetsQuery.data?.items ?? [];
    const allocatedByMonth = new Array(12).fill(0);
    const spentByMonth = new Array(12).fill(0);
    for (const b of items) {
      const from = new Date(b.fromDate);
      const to = new Date(b.toDate);
      const fromMonth = from.getMonth();
      const toMonth = to.getMonth();
      for (let m = fromMonth; m <= toMonth; m++) {
        if (m >= 0 && m < 12) {
          allocatedByMonth[m] += b.amountAllocated;
          spentByMonth[m] += b.amountSpent;
        }
      }
    }
    return MONTHS.map((month, i) => ({
      month,
      allocated: allocatedByMonth[i],
      spent: spentByMonth[i],
    }));
  }, [budgetsQuery.data]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => budgetsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.list(budgetsApi.key, FETCH_ALL) });
      setToast("Budget deleted");
    },
  });

  // Chart Date Filters
  const [chartFromDate, setChartFromDate] = useState("Jan 2023");
  const [chartToDate, setChartToDate] = useState("Dec 2023");
  const [tableStatus, setTableStatus] = useState("All status");
  const [tableDate, setTableDate] = useState("July 2023");

  return (
    <div className="w-full bg-white dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-6 font-sans relative">
      {/* 1. Main Page Header & Actions */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Back Arrow + Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/accounting"
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="size-5 stroke-[2.5]" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Budget plan
          </h1>
        </div>

        {/* Right: EXPORT Button */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50/70 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950/40 text-xs font-bold tracking-wider transition-all shadow-xs">
          <Upload className="size-4 stroke-[2.5]" />
          <span>EXPORT</span>
        </button>
      </div>

      {/* 2. Recharts Line Chart Component */}
      <BudgetPlanChart data={chartData} />

      {/* 3. Filters & Add Button Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Dropdown */}
          <CustomSelect
            label="Status"
            value={tableStatus}
            onChange={setTableStatus}
            options={["All status", "Ative"]}
            className="w-44"
          />

          {/* Date Picker */}
          <div className="relative w-44">
            <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
              Date
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={tableDate}
                onChange={(e) => setTableDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-9"
              />
<Calendar className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
        <Toast message={toast} onClose={() => setToast(null)} />

        {/* + ADD NEW Button */}
        <Link
          href="/accounting/budget/new"
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-indigo-600/20"
        >
          <Plus className="size-4 stroke-[3]" />
          <span>ADD NEW</span>
        </Link>
      </div>

      {/* 4. Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">CATEGORY NAME</th>
              <th className="py-3.5 px-4">FROM</th>
              <th className="py-3.5 px-4">TO</th>
              <th className="py-3.5 px-4">AMOUNT ALLOCATED</th>
              <th className="py-3.5 px-4">AMOUNT SPENT</th>
              <th className="py-3.5 px-4 text-center">STATUS</th>
              <th className="py-3.5 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm font-medium">
            {budgets.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
              >
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-slate-100">
                  {row.categoryName}
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                  {row.from}
                </td>
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                  {row.to}
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                  {row.amountAllocated}
                </td>
                <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                  {row.amountSpent}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
                    {row.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/accounting/budget/${row.id}/edit`} onClick={(e) => e.stopPropagation()} className="p-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
                      <SquarePen className="size-4" />
                    </Link>
                    <button onClick={(e) => { e.stopPropagation(); if (confirm("Delete this budget?")) deleteMutation.mutate(row.id); }} className="p-1 text-rose-500 hover:text-rose-700">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
