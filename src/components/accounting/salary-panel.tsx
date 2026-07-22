"use client";

import { useState } from "react";
import Link from "next/link";
import {
  RotateCw,
  Search,
  ChevronDown,
  Calendar,
  SquarePen,
  Trash2,
  X,
  Plus,
  ArrowUp,
  Check,
} from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";

interface SalaryRowData {
  id: number;
  fullName: string;
  total: string;
  prepaid: string;
  remaining: string;
  paid: string;
  month: string;
  status: "Active" | "Inactive";
}

interface DailySalaryRow {
  id: number;
  group: string;
  month: string;
  hours: number;
  salary: string;
  bonus: string;
  actionType: "check_edit" | "done";
}

const SALARY_DATA: SalaryRowData[] = [
  {
    id: 1,
    fullName: "Abdulsamad Ahmad",
    total: "4500",
    prepaid: "1000",
    remaining: "3500",
    paid: "3500",
    month: "November",
    status: "Active",
  },
  {
    id: 2,
    fullName: "Abdulsamad Ahmad",
    total: "4500",
    prepaid: "1000",
    remaining: "3500",
    paid: "3500",
    month: "December",
    status: "Active",
  },
  {
    id: 3,
    fullName: "Abdulsamad Ahmad",
    total: "4500",
    prepaid: "1000",
    remaining: "3500",
    paid: "3500",
    month: "January",
    status: "Inactive",
  },
  {
    id: 4,
    fullName: "Abdulsamad Ahmad",
    total: "4500",
    prepaid: "1000",
    remaining: "3500",
    paid: "3500",
    month: "February",
    status: "Active",
  },
  {
    id: 5,
    fullName: "Abdulsamad Ahmad",
    total: "4500",
    prepaid: "1000",
    remaining: "3500",
    paid: "3500",
    month: "February",
    status: "Active",
  },
  {
    id: 6,
    fullName: "Abdulsamad Ahmad",
    total: "4500",
    prepaid: "1000",
    remaining: "3500",
    paid: "3500",
    month: "February",
    status: "Active",
  },
  {
    id: 7,
    fullName: "Shamsuddinov Najibullo",
    total: "4500",
    prepaid: "1000",
    remaining: "3500",
    paid: "3500",
    month: "February",
    status: "Active",
  },
  {
    id: 8,
    fullName: "Shamsuddinov Najibullo",
    total: "4500",
    prepaid: "1000",
    remaining: "3500",
    paid: "3500",
    month: "February",
    status: "Active",
  },
  {
    id: 9,
    fullName: "Shamsuddinov Najibullo",
    total: "4500",
    prepaid: "1000",
    remaining: "3500",
    paid: "3500",
    month: "February",
    status: "Active",
  },
  {
    id: 10,
    fullName: "Shamsuddinov Najibullo",
    total: "4500",
    prepaid: "1000",
    remaining: "3500",
    paid: "3500",
    month: "February",
    status: "Active",
  },
];

const INITIAL_DAILY_SALARIES: DailySalaryRow[] = [
  {
    id: 1,
    group: "React Dec 3",
    month: "December",
    hours: 20,
    salary: "1400 s",
    bonus: "0",
    actionType: "check_edit",
  },
  {
    id: 2,
    group: "React Jan 2",
    month: "January",
    hours: 24,
    salary: "1780 s",
    bonus: "100",
    actionType: "check_edit",
  },
  {
    id: 3,
    group: "JS Feb 2",
    month: "February",
    hours: 32,
    salary: "2240 s",
    bonus: "0",
    actionType: "done",
  },
  {
    id: 4,
    group: "HTML & CSS Feb 2",
    month: "February",
    hours: 28,
    salary: "1960 s",
    bonus: "40",
    actionType: "done",
  },
];

export function SalaryPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All month");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<SalaryRowData | null>(null);
  const [dailySalaryMode, setDailySalaryMode] = useState<"Default" | "Detail">("Default");
  const [dailySalaries, setDailySalaries] = useState<DailySalaryRow[]>(INITIAL_DAILY_SALARIES);

  const handleRowClick = (employee: SalaryRowData) => {
    setSelectedEmployee(employee);
    setIsDrawerOpen(true);
  };

  const handleBonusChange = (id: number, val: string) => {
    setDailySalaries((prev) =>
      prev.map((row) => (row.id === id ? { ...row, bonus: val } : row))
    );
  };

  return (
    <div className="w-full bg-white dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-6 font-sans relative">
      {/* 1. Main Page Header & Actions */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Salary
        </h1>

        {/* REFRESH Button */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-indigo-600/20">
          <RotateCw className="size-4 stroke-[2.5]" />
          <span>REFRESH</span>
        </button>
      </div>

      {/* 2. Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 pt-1 max-w-xl">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
            Search
          </label>
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Month */}
        <CustomSelect
          label="Month"
          value={selectedMonth}
          onChange={setSelectedMonth}
          options={["All month", "November", "December", "January", "February"]}
          className="flex-1 min-w-[180px]"
        />
      </div>

      {/* 3. Main Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">FULL NAME</th>
              <th className="py-3.5 px-4">TOTAL</th>
              <th className="py-3.5 px-4">PREPAID</th>
              <th className="py-3.5 px-4">REMAINING</th>
              <th className="py-3.5 px-4">PAID</th>
              <th className="py-3.5 px-4">MONTH</th>
              <th className="py-3.5 px-4 text-center">STATUS</th>
              <th className="py-3.5 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm font-medium">
            {SALARY_DATA.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                {/* FULL NAME */}
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-slate-100">
                  {row.fullName}
                </td>

                {/* TOTAL */}
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                  {row.total}
                </td>

                {/* PREPAID */}
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                  {row.prepaid}
                </td>

                {/* REMAINING */}
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                  {row.remaining}
                </td>

                {/* PAID */}
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                  {row.paid}
                </td>

                {/* MONTH */}
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                  {row.month}
                </td>

                {/* STATUS BADGES */}
                <td className="py-3.5 px-4 text-center">
                  {row.status === "Active" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-500 dark:bg-rose-950/80 dark:text-rose-400">
                      Inactive
                    </span>
                  )}
                </td>

                {/* ACTION */}
                <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      title="Edit"
                      className="p-1 text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 rounded hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                    >
                      <SquarePen className="size-4" />
                    </button>
                    <button
                      title="Delete"
                      className="p-1 text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 rounded hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Salary Detail Drawer / Slide-over (matching image_74e781.png) */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end transition-opacity duration-300"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="w-full max-w-xl lg:max-w-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full p-6 sm:p-8 shadow-2xl overflow-y-auto space-y-6 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="size-5" />
              </button>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Salary
              </h2>
            </div>

            {/* Employee Profile Section */}
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                {selectedEmployee ? selectedEmployee.fullName : "Shamsuddinov Najibullo"}
              </h3>

              {/* Role Badges */}
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-600 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800">
                  Developer
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-600 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800">
                  Mentor
                </span>
              </div>
            </div>

            {/* "Add transaction" Card Button */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:shadow-md transition-all">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                Add transaction
              </span>
              <div className="size-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Plus className="size-5 stroke-[3]" />
              </div>
            </div>

            {/* Transactions Section */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                Transactions
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/60">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 dark:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
                      <th className="py-3 px-4">AMOUNT</th>
                      <th className="py-3 px-4">DATE</th>
                      <th className="py-3 px-4">BONUS</th>
                      <th className="py-3 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm font-medium">
                    {/* Row 1 */}
                    <tr>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200">500 s</td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs">13.08.23, 16:50</td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200">200 s</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 text-indigo-500 hover:text-indigo-700">
                            <SquarePen className="size-4" />
                          </button>
                          <button className="p-1 text-rose-500 hover:text-rose-700">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {/* Row 2 */}
                    <tr>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200">200 s</td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs">13.08.23, 16:50</td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200">200 s</td>
                      <td className="py-3 px-4 text-right pr-6">
                        <ArrowUp className="size-4 text-emerald-500 ml-auto" />
                      </td>
                    </tr>
                    {/* Row 3 */}
                    <tr>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200">300 s</td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs">13.08.23, 16:50</td>
                      <td className="py-3 px-4 text-slate-800 dark:text-slate-200">200 s</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 text-indigo-500 hover:text-indigo-700">
                            <SquarePen className="size-4" />
                          </button>
                          <button className="p-1 text-rose-500 hover:text-rose-700">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Daily Salaries Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  Daily salaries
                </h4>

                {/* Toggle Switch */}
                <div className="bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1">
                  <button
                    onClick={() => setDailySalaryMode("Default")}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      dailySalaryMode === "Default"
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    Default
                  </button>
                  <button
                    onClick={() => setDailySalaryMode("Detail")}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                      dailySalaryMode === "Detail"
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                        : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    Detail
                  </button>
                </div>
              </div>

              {/* Daily Salaries Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/60">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-100/70 dark:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
                      <th className="py-3 px-4">GROUP</th>
                      <th className="py-3 px-4">MONTH</th>
                      <th className="py-3 px-4">HOURS</th>
                      <th className="py-3 px-4">SALARY</th>
                      <th className="py-3 px-4">BONUS</th>
                      <th className="py-3 px-4 text-center">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm font-medium">
                    {dailySalaries.map((row) => (
                      <tr key={row.id}>
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {row.group}
                        </td>
                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                          {row.month}
                        </td>
                        <td className="py-3 px-4 text-slate-800 dark:text-slate-200">
                          {row.hours}
                        </td>
                        <td className="py-3 px-4 text-slate-800 dark:text-slate-200">
                          {row.salary}
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={row.bonus}
                            onChange={(e) => handleBonusChange(row.id, e.target.value)}
                            className="w-16 px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          {row.actionType === "check_edit" ? (
                            <div className="flex items-center justify-center gap-2">
                              <Check className="size-4 text-emerald-500 stroke-[3]" />
                              <SquarePen className="size-4 text-indigo-500" />
                            </div>
                          ) : (
                            <button className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs">
                              Done
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
