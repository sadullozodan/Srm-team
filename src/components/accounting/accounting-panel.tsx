"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  DollarSign,
  PiggyBank,
  Frown,
  Smile,
  CreditCard,
  Receipt,
  Users,
  UserCheck,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  ArrowUpRight,
  MoreVertical,
  SlidersHorizontal,
} from "lucide-react";
import { IncomeExpenseChart } from "./income-expense-chart";
import { StudentsPaymentDonutChart } from "./students-payment-donut-chart";

export function AccountingPanel() {
  const pathname = usePathname();
  const [selectedYear, setSelectedYear] = useState("Year 2023");
  const [activeTab, setActiveTab] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    React: true, // React group expanded by default as specified
    "C# 2 August": false,
  });

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <div className="w-full bg-white dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6 sm:space-y-8 font-sans">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Accounting
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Financial summary, payment analytics, and group tracking
          </p>
        </div>

        {/* Global Controls / Filters */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search group or student..."
              className="w-full sm:w-64 pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <SlidersHorizontal className="size-4 text-slate-500" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* 2. Key Performance Indicator (KPI) Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total payment (Static) */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-emerald-100">
              Total payment
            </span>
            <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md text-white">
              <DollarSign className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black tracking-tight">
              20 500 s
            </span>
          </div>
          <div className="absolute -bottom-6 -right-6 size-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Paid amount (Static) */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 text-white shadow-md shadow-purple-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-purple-100">
              Paid amount
            </span>
            <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md text-white">
              <PiggyBank className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black tracking-tight">
              11 000 s
            </span>
          </div>
          <div className="absolute -bottom-6 -right-6 size-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Not paid (Static) */}
        <div className="relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-orange-100">
              Not paid
            </span>
            <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md text-white">
              <Frown className="size-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-2xl sm:text-3xl font-black tracking-tight">
              5 000 s
            </span>
          </div>
          <div className="absolute -bottom-6 -right-6 size-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Net (Clickable Routing Link to /accounting/net) */}
        <Link
          href="/accounting/net"
          className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/10 cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-sky-100 group-hover:text-white transition-colors">
              Net
            </span>
            <div className="p-2.5 rounded-xl bg-white/15 backdrop-blur-md text-white group-hover:bg-white/25 transition-colors">
              <Smile className="size-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black tracking-tight">
              5 000 s
            </span>
            <span className="text-[11px] font-semibold bg-white/20 px-2 py-0.5 rounded-full text-white/90 group-hover:bg-white/30 transition-colors">
              View →
            </span>
          </div>
          <div className="absolute -bottom-6 -right-6 size-24 bg-white/10 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform" />
        </Link>
      </div>

      {/* 3. Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        {[
          { label: "Payments", icon: CreditCard, href: "/accounting/payments" },
          { label: "Expenses", icon: Receipt, href: "/accounting/expenses" },
          { label: "Debtors", icon: Users, href: "/accounting/debtors" },
          { label: "Accountant", icon: UserCheck, href: "/accounting/accountant" },
        ].map((action) => {
          const Icon = action.icon;
          const isActive = action.href ? pathname === action.href : activeTab === action.label;
          const content = (
            <>
              <Icon className={`size-4 ${isActive ? "text-indigo-400 dark:text-indigo-600" : "text-slate-500"}`} />
              <span>{action.label}</span>
            </>
          );
          const cls = `flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] ${
            isActive
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
              : "bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800"
          }`;

          if (action.href) {
            return (
              <Link key={action.label} href={action.href} className={cls}>
                {content}
              </Link>
            );
          }

          return (
            <button
              key={action.label}
              onClick={() => setActiveTab(action.label)}
              className={cls}
            >
              {content}
            </button>
          );
        })}
      </div>

      {/* 4. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Income / Expense Line Chart (7 cols on lg) */}
        <div className="lg:col-span-7">
          <IncomeExpenseChart />
        </div>

        {/* Right: Students Payment Donut Chart (5 cols on lg) */}
        <div className="lg:col-span-5">
          <StudentsPaymentDonutChart />
        </div>
      </div>

      {/* 5. Data Tables and Summary Section */}
      <div className="space-y-4 pt-2">
        {/* Table Top Toolbar / Summary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm font-bold">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Total payment 60 / 10500 s</span>
            </div>
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <span className="size-2 rounded-full bg-rose-500" />
              <span>Not paid 24 / 4500 s</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Showing 2 groups
            </span>
          </div>
        </div>

        {/* Groups Accordion / Main Table */}
        <div className="space-y-3">
          {/* Group 1: C# 2 August (Collapsed) */}
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/30 transition-all">
            <button
              onClick={() => toggleGroup("C# 2 August")}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                  <ChevronRight
                    className={`size-4 transition-transform duration-200 ${
                      expandedGroups["C# 2 August"] ? "rotate-90" : ""
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                    C# 2 August
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    12 students • 4 not paid
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
                <div className="text-right">
                  <span className="block text-slate-900 dark:text-slate-100">
                    18 000 s
                  </span>
                  <span className="block text-xs text-rose-500 font-medium">
                    Not paid: 6 000 s
                  </span>
                </div>
              </div>
            </button>

            {expandedGroups["C# 2 August"] && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 text-center">
                No active students loaded for C# 2 August.
              </div>
            )}
          </div>

          {/* Group 2: React (Expanded by default) */}
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/30 shadow-xs transition-all">
            {/* React Group Header */}
            <button
              onClick={() => toggleGroup("React")}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-200/60 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <ChevronRight
                    className={`size-4 transition-transform duration-200 ${
                      expandedGroups["React"] ? "rotate-90" : ""
                    }`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                      React
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full">
                      Active
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    12 students • 4 not paid
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs sm:text-sm font-semibold">
                <div className="text-right">
                  <span className="block text-slate-900 dark:text-slate-100 font-bold">
                    18 000 s
                  </span>
                  <span className="block text-xs text-rose-500 font-medium">
                    Not paid: 6 000 s
                  </span>
                </div>
              </div>
            </button>

            {/* Expanded Student Sub-table for React Group */}
            {expandedGroups["React"] && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/80 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
                      <th className="py-3 px-4 sm:px-6">FULL NAME</th>
                      <th className="py-3 px-4 sm:px-6">PHONE</th>
                      <th className="py-3 px-4 sm:px-6">SUM</th>
                      <th className="py-3 px-4 sm:px-6 text-center">STATUS</th>
                      <th className="py-3 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm">
                    {/* Row 1 for Tojiev Olimjon (Not paid, 0 s) */}
                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-slate-100">
                        Tojiev Olimjon
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-600 dark:text-slate-300">
                        +992 900 11 22 33
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 dark:text-slate-100">
                        0 s
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60">
                          Not paid
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <MoreVertical className="size-4" />
                        </button>
                      </td>
                    </tr>

                    {/* Row 2 for Tojiev Olimjon (Paid, 1000 s) */}
                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-slate-100">
                        Tojiev Olimjon
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-600 dark:text-slate-300">
                        +992 918 44 55 66
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 dark:text-slate-100">
                        1000 s
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                          Paid
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <MoreVertical className="size-4" />
                        </button>
                      </td>
                    </tr>

                    {/* Row 3 for Tojiev Olimjon (Not paid, 0 s) */}
                    <tr className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-slate-100">
                        Tojiev Olimjon
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-medium text-slate-600 dark:text-slate-300">
                        +992 935 77 88 99
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 dark:text-slate-100">
                        0 s
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60">
                          Not paid
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                          <MoreVertical className="size-4" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
