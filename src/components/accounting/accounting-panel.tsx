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
        <div className="lg:col-span-7 bg-slate-50/70 dark:bg-slate-900/40 rounded-2xl p-5 sm:p-6 border border-slate-200/70 dark:border-slate-800/80 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                Income / Expense
              </h2>
              {/* Legend */}
              <div className="hidden sm:flex items-center gap-4 text-xs font-medium ml-2">
                <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <span className="size-2.5 rounded-full bg-emerald-500 inline-block" />
                  Income
                </span>
                <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
                  <span className="size-2.5 rounded-full bg-rose-500 inline-block" />
                  Expense
                </span>
              </div>
            </div>

            {/* Year Dropdown */}
            <div className="relative inline-block text-left">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                <span>{selectedYear}</span>
                <ChevronDown className="size-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* SVG Line Chart with Responsive ViewBox & Pinned Popup for May */}
          <div className="relative w-full aspect-[16/9] min-h-[220px] max-h-[280px]">
            <svg
              viewBox="0 0 500 240"
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                {/* Income Gradient Fill */}
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                </linearGradient>
                {/* Expense Gradient Fill */}
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <g stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" className="dark:stroke-slate-800">
                <line x1="40" y1="30" x2="480" y2="30" />
                <line x1="40" y1="75" x2="480" y2="75" />
                <line x1="40" y1="120" x2="480" y2="120" />
                <line x1="40" y1="165" x2="480" y2="165" />
                <line x1="40" y1="210" x2="480" y2="210" />
              </g>

              {/* Y Axis Labels */}
              <g fill="#94a3b8" fontSize="10" textAnchor="end" className="dark:fill-slate-400">
                <text x="32" y="34">30k</text>
                <text x="32" y="79">20k</text>
                <text x="32" y="124">10k</text>
                <text x="32" y="169">5k</text>
                <text x="32" y="214">0</text>
              </g>

              {/* X Axis Labels: Jan (40), Feb (113), Mar (186), Apr (260), May (333), Jun (406), Jul (480) */}
              <g fill="#64748b" fontSize="11" fontWeight="500" textAnchor="middle" className="dark:fill-slate-400">
                <text x="40" y="232">Jan</text>
                <text x="113" y="232">Feb</text>
                <text x="186" y="232">Mar</text>
                <text x="260" y="232">Apr</text>
                <text x="333" y="232" fontWeight="700" fill="#0f172a" className="dark:fill-slate-100">May</text>
                <text x="406" y="232">Jun</text>
                <text x="480" y="232">Jul</text>
              </g>

              {/* Income Area Fill */}
              <path
                d="M 40,150 C 75,130 90,110 113,105 C 150,95 160,115 186,100 C 220,80 235,90 260,85 C 295,78 315,68 333,66 C 370,64 385,85 406,80 C 440,70 460,55 480,50 L 480,210 L 40,210 Z"
                fill="url(#incomeGradient)"
              />

              {/* Expense Area Fill */}
              <path
                d="M 40,185 C 75,175 90,160 113,155 C 150,148 160,152 186,140 C 220,125 235,130 260,120 C 295,105 315,100 333,97 C 370,94 385,115 406,125 C 440,140 460,155 480,160 L 480,210 L 40,210 Z"
                fill="url(#expenseGradient)"
              />

              {/* Income Line Curve (Green) */}
              <path
                d="M 40,150 C 75,130 90,110 113,105 C 150,95 160,115 186,100 C 220,80 235,90 260,85 C 295,78 315,68 333,66 C 370,64 385,85 406,80 C 440,70 460,55 480,50"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Expense Line Curve (Red) */}
              <path
                d="M 40,185 C 75,175 90,160 113,155 C 150,148 160,152 186,140 C 220,125 235,130 260,120 C 295,105 315,100 333,97 C 370,94 385,115 406,125 C 440,140 460,155 480,160"
                fill="none"
                stroke="#ef4444"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Vertical Guideline for May (x=333) */}
              <line
                x1="333"
                y1="30"
                x2="333"
                y2="210"
                stroke="#94a3b8"
                strokeDasharray="4 4"
                strokeWidth="1.5"
                className="dark:stroke-slate-600"
              />

              {/* Node points on May: Income (333, 66) & Expense (333, 97) */}
              {/* Income Dot May */}
              <circle cx="333" cy="66" r="6" fill="#22c55e" stroke="#ffffff" strokeWidth="2.5" />
              {/* Expense Dot May */}
              <circle cx="333" cy="97" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />

              {/* Other Month Nodes */}
              <circle cx="40" cy="150" r="3.5" fill="#22c55e" />
              <circle cx="113" cy="105" r="3.5" fill="#22c55e" />
              <circle cx="186" cy="100" r="3.5" fill="#22c55e" />
              <circle cx="260" cy="85" r="3.5" fill="#22c55e" />
              <circle cx="406" cy="80" r="3.5" fill="#22c55e" />
              <circle cx="480" cy="50" r="3.5" fill="#22c55e" />

              <circle cx="40" cy="185" r="3.5" fill="#ef4444" />
              <circle cx="113" cy="155" r="3.5" fill="#ef4444" />
              <circle cx="186" cy="140" r="3.5" fill="#ef4444" />
              <circle cx="260" cy="120" r="3.5" fill="#ef4444" />
              <circle cx="406" cy="125" r="3.5" fill="#ef4444" />
              <circle cx="480" cy="160" r="3.5" fill="#ef4444" />
            </svg>

            {/* Pinned May Data Popup Tooltip (HTML overlay over SVG May x=333) */}
            <div className="absolute top-[8%] left-[60.5%] sm:left-[62%] -translate-x-1/2 bg-slate-900/95 dark:bg-slate-950 text-white rounded-xl px-3.5 py-2.5 shadow-xl border border-slate-700/60 text-xs backdrop-blur-md z-10 pointer-events-none min-w-[130px]">
              <div className="font-semibold text-slate-300 pb-1 border-b border-slate-700/60 mb-1.5 text-[11px] uppercase tracking-wider">
                May
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                    <span className="size-2 rounded-full bg-emerald-400 inline-block" />
                    Income:
                  </span>
                  <span className="font-extrabold text-emerald-300">22 000 s</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 text-rose-400 font-medium">
                    <span className="size-2 rounded-full bg-rose-400 inline-block" />
                    Expense:
                  </span>
                  <span className="font-extrabold text-rose-300">15 000 s</span>
                </div>
              </div>
              {/* Tooltip pointer triangle */}
              <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 size-3 bg-slate-900/95 dark:bg-slate-950 rotate-45 border-r border-b border-slate-700/60" />
            </div>
          </div>
        </div>

        {/* Right: Students Payment Donut Chart (5 cols on lg) */}
        <div className="lg:col-span-5 bg-slate-50/70 dark:bg-slate-900/40 rounded-2xl p-5 sm:p-6 border border-slate-200/70 dark:border-slate-800/80 flex flex-col justify-between">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
            Students payment
          </h2>

          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-center gap-6 my-auto py-2">
            {/* SVG Donut Chart with "Total 60" Center */}
            <div className="relative size-44 sm:size-48 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="size-full -rotate-90">
                {/* Circle circumference = 2 * PI * 38 = ~238.76 */}
                {/* 80% Not paid (Orange): strokeDasharray="191 238.76", strokeDashoffset="0" */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#f97316"
                  strokeWidth="16"
                  strokeDasharray="191 238.76"
                  strokeDashoffset="0"
                  className="transition-all duration-500"
                />
                {/* 20% Paid amount (Purple): strokeDasharray="47.75 238.76", strokeDashoffset="-191" */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="transparent"
                  stroke="#9333ea"
                  strokeWidth="16"
                  strokeDasharray="47.75 238.76"
                  strokeDashoffset="-191"
                  className="transition-all duration-500"
                />
              </svg>

              {/* Center Content: "Total 60" */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 leading-none mt-0.5">
                  60
                </span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-3 w-full sm:w-auto">
              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 shadow-xs">
                <div className="size-3.5 rounded-full bg-purple-600 shrink-0" />
                <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Paid amount 20% - 22
                </div>
              </div>

              <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 shadow-xs">
                <div className="size-3.5 rounded-full bg-orange-500 shrink-0" />
                <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Not paid 80% - 48
                </div>
              </div>
            </div>
          </div>
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
