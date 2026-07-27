"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Upload, ChevronDown, Calendar } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  paymentsApi,
  expensesApi,
  queryKeys,
} from "@/lib/api/resources";

const FETCH_ALL = { page: 1, pageSize: 1000 };

export function NetViewPanel() {
  const [selectedCategory, setSelectedCategory] = useState("All category");
  const [selectedDate, setSelectedDate] = useState("");

  const paymentsQuery = useQuery({
    queryKey: queryKeys.list(paymentsApi.key, FETCH_ALL),
    queryFn: () => paymentsApi.list(FETCH_ALL),
  });
  const expensesQuery = useQuery({
    queryKey: queryKeys.list(expensesApi.key, FETCH_ALL),
    queryFn: () => expensesApi.list(FETCH_ALL),
  });

  const netRows = useMemo(() => {
    const payments = (paymentsQuery.data?.items ?? []).map((p) => ({
      id: `p-${p.id}`,
      fullName: p.studentName ?? "—",
      category: "Student" as const,
      date: p.date ? new Date(p.date).toLocaleDateString("ru-RU") : "—",
      amount: `+ ${p.paid}`,
      type: "positive" as const,
    }));
    const expenses = (expensesQuery.data?.items ?? []).map((e) => ({
      id: `e-${e.id}`,
      fullName: e.name ?? e.category,
      category: e.category === "Tax" ? "Income tax" as const : e.category === "OfficeExpenses" ? "Office" as const : "Mentor" as const,
      date: e.date ? new Date(e.date).toLocaleDateString("ru-RU") : "—",
      amount: `- ${e.amount}`,
      type: "negative" as const,
    }));
    return [...payments, ...expenses].sort((a, b) => b.date.localeCompare(a.date));
  }, [paymentsQuery.data, expensesQuery.data]);

  return (
    <div className="w-full bg-white dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-6 font-sans">
      {/* 1. Panel Header */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Back arrow + Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/accounting"
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="size-5 stroke-[2.5]" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Net
          </h1>
        </div>

        {/* Right: EXPORT Button */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50/70 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950/40 text-xs font-bold tracking-wider transition-all shadow-xs">
          <Upload className="size-4 stroke-[2.5]" />
          <span>EXPORT</span>
        </button>
      </div>

      {/* 2. Filters Bar: Category & Date with Floating Labels */}
      <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-1 max-w-xl">
        {/* Category */}
        <CustomSelect
          label="Category"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={["All category", "Student", "Mentor", "Income tax"]}
          className="flex-1 min-w-[180px]"
        />

        {/* Date */}
        <div className="relative flex-1 min-w-[180px]">
          <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
            Date
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-9"
            />
            <Calendar className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">FULL NAME</th>
              <th className="py-3.5 px-4">CATEGORY</th>
              <th className="py-3.5 px-4">DATE</th>
              <th className="py-3.5 px-4 text-right sm:pr-8">AMOUNT</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm font-medium">
            {netRows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
              >
                {/* FULL NAME */}
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-800 dark:text-slate-200">
                  {row.fullName}
                </td>

                {/* CATEGORY */}
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  {row.category}
                </td>

                {/* DATE */}
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs">
                  {row.date}
                </td>

                {/* AMOUNT: Positive (Green Pill) / Negative (Red Pill) */}
                <td className="py-3.5 px-4 text-right sm:pr-8">
                  {row.type === "positive" ? (
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
                      {row.amount}
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-500 dark:bg-rose-950/80 dark:text-rose-400">
                      {row.amount}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
