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
  TrendingDown,
} from "lucide-react";
import { IncomeExpenseChart } from "./income-expense-chart";
import { StudentsPaymentDonutChart } from "./students-payment-donut-chart";
import { CustomSelect } from "@/components/ui/custom-select";

export function AccountingPanel() {
  const pathname = usePathname();
  const [selectedBranch, setSelectedBranch] = useState("All branches");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    React: true, // React group expanded by default as in screenshot
    "C# 2 August": false,
  });

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <div className="w-full bg-slate-50/50 dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-4 sm:p-6 lg:p-7 space-y-6 font-sans">
      {/* 1. Top Header Row */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Accounting
        </h1>

        {/* Custom Styled Branch Selector Dropdown */}
        <CustomSelect
          label="Branch"
          value={selectedBranch}
          onChange={setSelectedBranch}
          options={["All branches", "Sadbarg", "Profsous"]}
          className="w-40"
        />
      </div>

      {/* 2. Key Performance Indicator (KPI) Gradient Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total payment */}
        <div className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-[#2ecc71] via-[#22c55e] to-[#10b981] text-white shadow-xs hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer">
          <div className="text-xs font-medium text-emerald-100 opacity-90 group-hover:opacity-100 transition-opacity">
            Total payment
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
            20 500 s
          </div>
          {/* Watermark Icon (Subtle Translucent) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-3.5 size-12 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center pointer-events-none group-hover:scale-115 group-hover:rotate-6 transition-transform duration-300">
            <DollarSign className="size-6 text-white opacity-40 group-hover:opacity-70 stroke-[2.2] transition-opacity" />
          </div>
        </div>

        {/* Paid amount */}
        <div className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-[#a855f7] via-[#9333ea] to-[#8b5cf6] text-white shadow-xs hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer">
          <div className="text-xs font-medium text-purple-100 opacity-90 group-hover:opacity-100 transition-opacity">
            Paid amount
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
            11 000 s
          </div>
          {/* Watermark Icon (Subtle Translucent) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-3.5 size-12 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center pointer-events-none group-hover:scale-115 group-hover:rotate-6 transition-transform duration-300">
            <PiggyBank className="size-6 text-white opacity-40 group-hover:opacity-70 stroke-[1.8] transition-opacity" />
          </div>
        </div>

        {/* Not paid */}
        <div className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-[#f97316] via-[#ff7043] to-[#fb923c] text-white shadow-xs hover:shadow-lg hover:shadow-orange-500/20 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer">
          <div className="text-xs font-medium text-orange-100 opacity-90 group-hover:opacity-100 transition-opacity">
            Not paid
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
            5 000 s
          </div>
          {/* Watermark Icon (Subtle Translucent) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-3.5 size-12 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center pointer-events-none group-hover:scale-115 group-hover:rotate-6 transition-transform duration-300">
            <Frown className="size-6 text-white opacity-40 group-hover:opacity-70 stroke-[1.8] transition-opacity" />
          </div>
        </div>

        {/* Net (Clickable Link to /accounting/net) */}
        <Link
          href="/accounting/net"
          className="group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r from-[#38bdf8] via-[#0284c7] to-[#60a5fa] text-white shadow-xs hover:shadow-lg hover:shadow-sky-500/20 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer block"
        >
          <div className="text-xs font-medium text-sky-100 opacity-90 group-hover:opacity-100 transition-opacity">
            Net
          </div>
          <div className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">
            5 000 s
          </div>
          {/* Watermark Icon (Subtle Translucent) */}
          <div className="absolute top-1/2 -translate-y-1/2 right-3.5 size-12 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center pointer-events-none group-hover:scale-115 group-hover:rotate-6 transition-transform duration-300">
            <Smile className="size-6 text-white opacity-40 group-hover:opacity-70 stroke-[1.8] transition-opacity" />
          </div>
        </Link>
      </div>

      {/* 3. Action Buttons Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Payments", icon: DollarSign, href: "/accounting/payments" },
          { label: "Expenses", icon: TrendingDown, href: "/accounting/expenses" },
          { label: "Debtors", icon: Frown, href: "/accounting/debtors" },
          { label: "Accountant", icon: Receipt, href: "/accounting/accountant" },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-500/40 dark:hover:border-indigo-500/50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-[#5842f4] text-white flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-200">
                  <Icon className="size-4 stroke-[2.5]" />
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {action.label}
                </span>
              </div>
              <ChevronRight className="size-4 text-[#5842f4] group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          );
        })}
      </div>

      {/* 4. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Income / Expense Line Chart (8 cols on lg) */}
        <div className="lg:col-span-8">
          <IncomeExpenseChart />
        </div>

        {/* Right: Students Payment Donut Chart (4 cols on lg) */}
        <div className="lg:col-span-4">
          <StudentsPaymentDonutChart />
        </div>
      </div>

      {/* 5. Summary Banner Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Students payment
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Green Pill Block */}
            <div className="bg-[#e8f5e9] dark:bg-emerald-950/50 rounded-xl px-5 py-2.5 flex items-center justify-between gap-6 min-w-[200px]">
              <span className="text-xs font-semibold text-[#2e7d32] dark:text-emerald-400">
                Total payment
              </span>
              <span className="text-lg font-black text-[#2e7d32] dark:text-emerald-300">
                60 / 10500 s
              </span>
            </div>

            {/* Red Pill Block */}
            <div className="bg-[#ffebee] dark:bg-rose-950/50 rounded-xl px-5 py-2.5 flex items-center justify-between gap-6 min-w-[200px]">
              <span className="text-xs font-semibold text-[#c62828] dark:text-rose-400">
                Not paid
              </span>
              <span className="text-lg font-black text-[#c62828] dark:text-rose-300">
                24 / 4500 s
              </span>
            </div>
          </div>
        </div>

        {/* 6. Accordion Data Table */}
        <div className="space-y-3 pt-2">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-4 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">GROUP</div>
            <div className="col-span-2 text-center">STUDENTS</div>
            <div className="col-span-2 text-center">NOT PAID</div>
            <div className="col-span-2 text-center">TOTAL (SOMONI)</div>
            <div className="col-span-2 text-right">NOT PAID (SOMONI)</div>
          </div>

          {/* Group 1: C# 2 August (Collapsed) */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <button
              onClick={() => toggleGroup("C# 2 August")}
              className="w-full grid grid-cols-12 px-4 py-3.5 text-xs font-bold text-slate-800 dark:text-slate-200 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <div className="col-span-4 flex items-center gap-2">
                <ChevronRight
                  className={`size-4 text-[#5842f4] transition-transform duration-200 ${
                    expandedGroups["C# 2 August"] ? "rotate-90" : ""
                  }`}
                />
                <span>C# 2 August</span>
              </div>
              <div className="col-span-2 text-center text-slate-500">12</div>
              <div className="col-span-2 text-center text-slate-500">4</div>
              <div className="col-span-2 text-center text-slate-700 dark:text-slate-300 font-semibold">18000 s</div>
              <div className="col-span-2 text-right text-slate-700 dark:text-slate-300 font-semibold">6000 s</div>
            </button>
          </div>

          {/* Group 2: React (Expanded) */}
          <div className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xs">
            <button
              onClick={() => toggleGroup("React")}
              className="w-full grid grid-cols-12 px-4 py-3.5 text-xs font-bold text-slate-800 dark:text-slate-200 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800"
            >
              <div className="col-span-4 flex items-center gap-2">
                <ChevronRight
                  className={`size-4 text-[#5842f4] transition-transform duration-200 ${
                    expandedGroups["React"] ? "rotate-90" : ""
                  }`}
                />
                <span>React</span>
              </div>
              <div className="col-span-2 text-center text-slate-500">12</div>
              <div className="col-span-2 text-center text-slate-500">4</div>
              <div className="col-span-2 text-center text-slate-700 dark:text-slate-300 font-semibold">18000 s</div>
              <div className="col-span-2 text-right text-slate-700 dark:text-slate-300 font-semibold">6000 s</div>
            </button>

            {/* Sub-table for React Group */}
            {expandedGroups["React"] && (
              <div className="p-3 bg-slate-50/50 dark:bg-slate-900/40">
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs font-medium">
                    <thead>
                      <tr className="bg-slate-50/70 dark:bg-slate-800/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                        <th className="py-2.5 px-4">FULL NAME</th>
                        <th className="py-2.5 px-4">PHONE</th>
                        <th className="py-2.5 px-4">SUM</th>
                        <th className="py-2.5 px-4 text-center">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr>
                        <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold">Tojiev Olimjon</td>
                        <td className="py-3 px-4 text-slate-500 font-mono">93 800 22 74</td>
                        <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-bold">0 c</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-500 dark:bg-rose-950/60 dark:text-rose-400">
                            Not paid
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold">Tojiev Olimjon</td>
                        <td className="py-3 px-4 text-slate-500 font-mono">93 800 22 74</td>
                        <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-bold">1000 c</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                            Paid
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold">Tojiev Olimjon</td>
                        <td className="py-3 px-4 text-slate-500 font-mono">93 800 22 74</td>
                        <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-bold">0 c</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-500 dark:bg-rose-950/60 dark:text-rose-400">
                            Not paid
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
