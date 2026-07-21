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
import { BudgetPlanChart } from "./budget-plan-chart";

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

      {/* 2. Recharts Line Chart Component */}
      <BudgetPlanChart />

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
