"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Plus,
  ChevronDown,
  Calendar,
  X,
} from "lucide-react";

interface BudgetItem {
  id: number;
  categoryName: string;
  from: string;
  to: string;
  amountAllocated: string;
  amountSpent: string;
  status: string;
}

const INITIAL_BUDGET_DATA: BudgetItem[] = [
  {
    id: 1,
    categoryName: "Marketing",
    from: "01.04.2023",
    to: "01.05.2023",
    amountAllocated: "1000",
    amountSpent: "1000",
    status: "Ative",
  },
  {
    id: 2,
    categoryName: "Office expenses",
    from: "01.04.2023",
    to: "01.05.2023",
    amountAllocated: "1000",
    amountSpent: "1000",
    status: "Ative",
  },
  {
    id: 3,
    categoryName: "Tax",
    from: "01.04.2023",
    to: "01.05.2023",
    amountAllocated: "1000",
    amountSpent: "1000",
    status: "Ative",
  },
  {
    id: 4,
    categoryName: "Marketing",
    from: "01.04.2023",
    to: "01.05.2023",
    amountAllocated: "1000",
    amountSpent: "1000",
    status: "Ative",
  },
  {
    id: 5,
    categoryName: "Office expenses",
    from: "01.04.2023",
    to: "01.05.2023",
    amountAllocated: "1000",
    amountSpent: "1000",
    status: "Ative",
  },
  {
    id: 6,
    categoryName: "Employees",
    from: "01.04.2023",
    to: "01.05.2023",
    amountAllocated: "1000",
    amountSpent: "1000",
    status: "Ative",
  },
  {
    id: 7,
    categoryName: "Tax",
    from: "01.04.2023",
    to: "01.05.2023",
    amountAllocated: "1000",
    amountSpent: "1000",
    status: "Ative",
  },
];

export function BudgetPlanPanel() {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(INITIAL_BUDGET_DATA);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form states for New Budjet Modal
  const [formStatus, setFormStatus] = useState("Active");
  const [formAmount, setFormAmount] = useState("");
  const [formCategory, setFormCategory] = useState("");
  const [formFrom, setFormFrom] = useState("");
  const [formTo, setFormTo] = useState("");

  // Chart Date Filters
  const [chartFromDate, setChartFromDate] = useState("Jan 2023");
  const [chartToDate, setChartToDate] = useState("Dec 2023");
  const [tableStatus, setTableStatus] = useState("All status");
  const [tableDate, setTableDate] = useState("July 2023");

  const handleAddBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: BudgetItem = {
      id: Date.now(),
      categoryName: formCategory || "Marketing",
      from: formFrom || "01.04.2023",
      to: formTo || "01.05.2023",
      amountAllocated: formAmount || "1000",
      amountSpent: "0",
      status: "Ative",
    };
    setBudgetItems((prev) => [newItem, ...prev]);
    setIsModalOpen(false);
    // reset form
    setFormAmount("");
    setFormCategory("");
    setFormFrom("");
    setFormTo("");
  };

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

      {/* 2. Interactive Line Chart Card */}
      <div className="bg-slate-50/70 dark:bg-slate-900/40 rounded-2xl p-5 sm:p-6 border border-slate-200/70 dark:border-slate-800 space-y-4">
        {/* Chart Header Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Legends */}
          <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-800 dark:text-slate-200">Amount allocated</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-rose-500" />
              <span className="text-slate-800 dark:text-slate-200">Amount spent</span>
            </div>
          </div>

          {/* Date Range Inputs */}
          <div className="flex items-center gap-3">
            {/* From */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-slate-50 dark:bg-slate-900 px-1 text-[11px] font-medium text-slate-500 z-10">
                From
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={chartFromDate}
                  onChange={(e) => setChartFromDate(e.target.value)}
                  className="w-32 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none pr-8"
                />
                <Calendar className="absolute right-2.5 size-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* To */}
            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-slate-50 dark:bg-slate-900 px-1 text-[11px] font-medium text-slate-500 z-10">
                To
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={chartToDate}
                  onChange={(e) => setChartToDate(e.target.value)}
                  className="w-32 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none pr-8"
                />
                <Calendar className="absolute right-2.5 size-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* SVG Curve Line Chart matching image_74df6b.png */}
        <div className="relative w-full aspect-[21/9] min-h-[250px] max-h-[320px]">
          <svg
            viewBox="0 0 1000 300"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="allocatedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="spentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Lines (30000, 20000, 10000, 0) */}
            <g stroke="#e2e8f0" strokeDasharray="3 3" strokeWidth="1" className="dark:stroke-slate-800">
              <line x1="50" y1="40" x2="960" y2="40" />
              <line x1="50" y1="110" x2="960" y2="110" />
              <line x1="50" y1="180" x2="960" y2="180" />
              <line x1="50" y1="250" x2="960" y2="250" />
            </g>

            {/* Y Axis Text */}
            <g fill="#94a3b8" fontSize="11" textAnchor="end" className="dark:fill-slate-400">
              <text x="40" y="44">30000</text>
              <text x="40" y="114">20000</text>
              <text x="40" y="184">10000</text>
              <text x="40" y="254">0</text>
            </g>

            {/* X Axis Text (12 months from 60 to 950) */}
            <g fill="#64748b" fontSize="11" fontWeight="500" textAnchor="middle" className="dark:fill-slate-400">
              <text x="70" y="275">January</text>
              <text x="150" y="275">February</text>
              <text x="230" y="275">March</text>
              <text x="310" y="275">April</text>
              <text x="390" y="275" fontWeight="700" fill="#0f172a" className="dark:fill-slate-100">May</text>
              <text x="470" y="275">June</text>
              <text x="550" y="275">July</text>
              <text x="630" y="275">August</text>
              <text x="710" y="275">September</text>
              <text x="790" y="275">October</text>
              <text x="870" y="275">November</text>
              <text x="940" y="275">December</text>
            </g>

            {/* Allocated Curve (Green) */}
            <path
              d="M 70,240 C 120,210 170,180 230,175 C 290,170 330,220 390,210 C 450,200 480,150 550,110 C 620,115 670,140 710,140 C 760,140 800,80 870,170 C 910,210 930,180 950,175"
              fill="none"
              stroke="#22c55e"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Spent Curve (Red) */}
            <path
              d="M 70,150 C 120,165 170,210 230,195 C 290,180 330,190 390,75 C 450,120 480,130 550,140 C 620,160 670,190 710,190 C 760,180 800,140 870,175 C 910,200 930,210 950,215"
              fill="none"
              stroke="#ef4444"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* May Guideline (x=390) */}
            <line
              x1="390"
              y1="40"
              x2="390"
              y2="250"
              stroke="#94a3b8"
              strokeDasharray="4 4"
              strokeWidth="1.5"
            />

            {/* Node Points on May: Spent (390, 75) & Allocated (390, 210) */}
            <circle cx="390" cy="75" r="6.5" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="390" cy="210" r="6.5" fill="#22c55e" stroke="#ffffff" strokeWidth="2.5" />
          </svg>

          {/* Interactive May Tooltip Popup Overlay */}
          <div className="absolute top-[8%] left-[34%] sm:left-[35%] -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 text-slate-900 dark:text-slate-100 rounded-xl px-4 py-3 shadow-xl border border-slate-200 dark:border-slate-700 text-xs z-10 pointer-events-none min-w-[170px] backdrop-blur-md">
            <div className="font-semibold text-slate-500 dark:text-slate-400 pb-1 border-b border-slate-100 dark:border-slate-800 mb-2 text-[11px]">
              May
            </div>
            <div className="space-y-1.5 font-medium">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="size-2 rounded-full bg-emerald-500 inline-block" />
                  Amount Allocated:
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">22 000 s</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <span className="size-2 rounded-full bg-rose-500 inline-block" />
                  Amount Spent:
                </span>
                <span className="font-bold text-rose-500 dark:text-rose-400">15 000 s</span>
              </div>
            </div>
            <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 size-3 bg-white/95 dark:bg-slate-900/95 rotate-45 border-r border-b border-slate-200 dark:border-slate-700" />
          </div>
        </div>
      </div>

      {/* 3. Filters & Add Button Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex flex-wrap items-center gap-4">
          {/* Status Dropdown */}
          <div className="relative w-44">
            <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
              Status
            </label>
            <div className="relative flex items-center">
              <select
                value={tableStatus}
                onChange={(e) => setTableStatus(e.target.value)}
                className="w-full appearance-none px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8 cursor-pointer"
              >
                <option value="All status">All status</option>
                <option value="Ative">Ative</option>
              </select>
              <ChevronDown className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

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

        {/* + ADD NEW Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-indigo-600/20"
        >
          <Plus className="size-4 stroke-[3]" />
          <span>ADD NEW</span>
        </button>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm font-medium">
            {budgetItems.map((row) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. "New budjet" Modal Component (matching image_74dfa2.png) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-card rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                New budjet
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronDown className="size-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddBudget} className="space-y-5">
              {/* Top Row: Status & Amount */}
              <div className="grid grid-cols-2 gap-4">
                {/* Status */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                    Status
                  </label>
                  <div className="relative flex items-center">
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8 cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronDown className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Amount */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                    Amount
                  </label>
                  <input
                    type="text"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    placeholder="Amount"
                    className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Middle Row: Category */}
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                  Category
                </label>
                <div className="relative flex items-center">
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8 cursor-pointer"
                  >
                    <option value="">Choose category</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Office expenses">Office expenses</option>
                    <option value="Tax">Tax</option>
                    <option value="Employees">Employees</option>
                  </select>
                  <ChevronDown className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Bottom Row: From & To */}
              <div className="grid grid-cols-2 gap-4">
                {/* From */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                    From
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={formFrom}
                      onChange={(e) => setFormFrom(e.target.value)}
                      placeholder="mm.yyyy"
                      className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-9"
                    />
                    <Calendar className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* To */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                    To
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={formTo}
                      onChange={(e) => setFormTo(e.target.value)}
                      placeholder="mm.yyyy"
                      className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-9"
                    />
                    <Calendar className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-indigo-600/20"
                >
                  ADD
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 text-xs font-bold tracking-wider transition-all"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
