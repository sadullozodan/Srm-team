"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  X,
  Download,
} from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import { AccountantAreaChart } from "./accountant-area-chart";

interface AccountantRow {
  id: number;
  startedAt: string;
  finishedAt: string;
  totalIncome: string;
  totalExpense: string;
  paid: string;
  notPaid: string;
  net: string;
  branch: string;
  status: "Inprogress" | "Archive";
}

const ACCOUNTANT_DATA: AccountantRow[] = [
  { id: 1, startedAt: "01.04.2023", finishedAt: "01.05.2023", totalIncome: "1000", totalExpense: "500", paid: "500", notPaid: "500", net: "2500", branch: "Sadbarg", status: "Inprogress" },
  { id: 2, startedAt: "01.04.2023", finishedAt: "01.05.2023", totalIncome: "1000", totalExpense: "500", paid: "500", notPaid: "500", net: "2500", branch: "Sadbarg", status: "Inprogress" },
  { id: 3, startedAt: "01.04.2023", finishedAt: "01.05.2023", totalIncome: "1000", totalExpense: "500", paid: "500", notPaid: "500", net: "2500", branch: "Profsous", status: "Archive" },
  { id: 4, startedAt: "01.04.2023", finishedAt: "01.05.2023", totalIncome: "1000", totalExpense: "500", paid: "500", notPaid: "500", net: "2500", branch: "Sadbarg", status: "Inprogress" },
  { id: 5, startedAt: "01.04.2023", finishedAt: "01.05.2023", totalIncome: "1000", totalExpense: "500", paid: "500", notPaid: "500", net: "2500", branch: "Profsous", status: "Archive" },
  { id: 6, startedAt: "01.04.2023", finishedAt: "01.05.2023", totalIncome: "1000", totalExpense: "500", paid: "500", notPaid: "500", net: "2500", branch: "Profsous", status: "Inprogress" },
  { id: 7, startedAt: "01.04.2023", finishedAt: "01.05.2023", totalIncome: "1000", totalExpense: "500", paid: "500", notPaid: "500", net: "2500", branch: "Sadbarg", status: "Archive" },
];

export function AccountantPanel() {
  const [selectedStatus, setSelectedStatus] = useState("All status");
  const [selectedBranch, setSelectedBranch] = useState("All branches");
  const [selectedDate, setSelectedDate] = useState("July 2023");
  const [selectedYear, setSelectedYear] = useState(2024);

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState("01.04.2023 - 01.05.2023");

  const handleRowClick = (row: AccountantRow) => {
    setSelectedDateRange(`${row.startedAt} - ${row.finishedAt}`);
    setIsDrawerOpen(true);
  };

  return (
    <div className="w-full bg-white dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-6 font-sans relative">
      {/* 1. Main Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/accounting"
          className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:opacity-70 transition-all"
        >
          <ArrowLeft className="size-5 stroke-[2.5]" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Accountant
        </h1>
      </div>

      {/* 2. Interactive SVG Area Chart */}
      <div className="bg-slate-50/70 dark:bg-slate-900/40 rounded-2xl p-5 sm:p-6 border border-slate-200/70 dark:border-slate-800/80 space-y-4">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-4">
          {/* Legends */}
          <div className="flex items-center gap-5 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-700 dark:text-slate-300">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-700 dark:text-slate-300">Expense</span>
            </div>
          </div>

          {/* Year Selector */}
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 shadow-xs">
            <button
              onClick={() => setSelectedYear((y) => y - 1)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span>{selectedYear} year</span>
            <button
              onClick={() => setSelectedYear((y) => y + 1)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive Recharts Area Chart */}
        <div className="w-full pt-2">
          <AccountantAreaChart height={300} />
        </div>
      </div>

      {/* 3. Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 max-w-2xl">
        {/* Status */}
        <CustomSelect
          label="Status"
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={["All status", "Inprogress", "Archive"]}
          className="w-full"
        />

        {/* Branch */}
        <CustomSelect
          label="Branch"
          value={selectedBranch}
          onChange={setSelectedBranch}
          options={["All branches", "Sadbarg", "Profsous"]}
          className="w-full"
        />

        {/* Date */}
        <div className="relative">
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

      {/* 4. Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">STARTED AT</th>
              <th className="py-3.5 px-4">FINISHED AT</th>
              <th className="py-3.5 px-4">TOTAL INCOME</th>
              <th className="py-3.5 px-4">TOTAL EXPENSE</th>
              <th className="py-3.5 px-4">PAID</th>
              <th className="py-3.5 px-4">NOT PAID</th>
              <th className="py-3.5 px-4">NET</th>
              <th className="py-3.5 px-4">BRANCH</th>
              <th className="py-3.5 px-4 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm font-medium">
            {ACCOUNTANT_DATA.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row)}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
              >
                {/* STARTED AT */}
                <td className="py-3.5 px-4 sm:px-6 text-slate-800 dark:text-slate-200 font-mono text-xs">
                  {row.startedAt}
                </td>

                {/* FINISHED AT */}
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-mono text-xs">
                  {row.finishedAt}
                </td>

                {/* TOTAL INCOME */}
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                  {row.totalIncome}
                </td>

                {/* TOTAL EXPENSE */}
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                  {row.totalExpense}
                </td>

                {/* PAID */}
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                  {row.paid}
                </td>

                {/* NOT PAID */}
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                  {row.notPaid}
                </td>

                {/* NET */}
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                  {row.net}
                </td>

                {/* BRANCH */}
                <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                  {row.branch}
                </td>

                {/* STATUS */}
                <td className="py-3.5 px-4 text-center">
                  {row.status === "Inprogress" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-600 dark:bg-sky-950/80 dark:text-sky-400">
                      Inprogress
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                      Archive
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Right-Side Report Drawer (image_75b95c.png) */}
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
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                {selectedDateRange}
              </h2>
            </div>

            {/* Top Action Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                Accountant
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="border border-rose-400 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
              >
                <X className="size-3.5 stroke-[2.5]" />
                <span>CLOSE</span>
              </button>
            </div>

            {/* Report Section */}
            <div className="space-y-4">
              {/* Report Header Row */}
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Report
                </h3>
                <button className="border border-indigo-600 text-indigo-600 hover:bg-indigo-50/70 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950/40 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors">
                  <Download className="size-3.5 stroke-[2.5]" />
                  <span>DOWNLOAD</span>
                </button>
              </div>

              {/* Receipt Card Structure */}
              <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs space-y-4">
                {/* Top Block: Light Gray background */}
                <div className="bg-slate-100/90 dark:bg-slate-800 p-4 text-center border-b border-slate-200/80 dark:border-slate-700">
                  <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    Income
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-slate-100 mt-0.5">
                    16 820 c
                  </div>
                </div>

                {/* Main List */}
                <div className="px-5 py-2 space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300">
                    <span>Marketing</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">999 c</span>
                  </div>
                  <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300">
                    <span>Office expense</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">800 c</span>
                  </div>
                  <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300">
                    <span>Salary</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">200 c</span>
                  </div>
                  <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-300">
                    <span>Tax</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">500 c</span>
                  </div>

                  {/* Sub-List (Bordered Container) */}
                  <div className="border border-slate-100 dark:border-slate-700/60 rounded-xl p-3.5 bg-slate-50/50 dark:bg-slate-900/40 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-medium">
                      <span>Income</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">2 000 c</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-medium">
                      <span>Paid</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">3 000 c</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-medium">
                      <span>Not Paid</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">3 500 c</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Block Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                <span>Left amount</span>
                <span className="font-black">3 999 c</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
