"use client";

import { useState, Fragment } from "react";
import Link from "next/link";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  ArrowLeft,
  Upload,
  ChevronDown,
  ChevronRight,
  Calendar,
  X,
  Plus,
  ArrowUp,
  SquarePen,
  Trash2,
  ChevronLeft,
} from "lucide-react";

interface ChildExpense {
  id: number;
  fullName: string;
  totalPayment: string;
  recipient: string;
  branch: string;
  status: "Active" | "Inactive";
}

interface ParentExpense {
  id: number;
  fullName: string;
  totalPayment: string;
  recipient: string;
  branch: string;
  status: "Active" | "Inactive";
  children?: ChildExpense[];
}

const EXPENSES_DATA: ParentExpense[] = [
  {
    id: 1,
    fullName: "Tax",
    totalPayment: "1000",
    recipient: "Student",
    branch: "Sadbarg",
    status: "Active",
    children: [
      {
        id: 11,
        fullName: "Income tax",
        totalPayment: "300",
        recipient: "Student",
        branch: "Sadbarg",
        status: "Active",
      },
      {
        id: 12,
        fullName: "VAT (value added tax)",
        totalPayment: "200",
        recipient: "Student",
        branch: "Sadbarg",
        status: "Active",
      },
      {
        id: 13,
        fullName: "Property tax",
        totalPayment: "200",
        recipient: "Student",
        branch: "Sadbarg",
        status: "Active",
      },
      {
        id: 14,
        fullName: "Social taxes (on wages, etc.)",
        totalPayment: "300",
        recipient: "Student",
        branch: "Sadbarg",
        status: "Active",
      },
    ],
  },
  {
    id: 2,
    fullName: "Office expenses",
    totalPayment: "1000",
    recipient: "Student",
    branch: "Sadbarg",
    status: "Active",
    children: [
      {
        id: 21,
        fullName: "Stationery & Supplies",
        totalPayment: "500",
        recipient: "Student",
        branch: "Sadbarg",
        status: "Active",
      },
      {
        id: 22,
        fullName: "Internet & Utilities",
        totalPayment: "500",
        recipient: "Student",
        branch: "Sadbarg",
        status: "Active",
      },
    ],
  },
  {
    id: 3,
    fullName: "Marketing",
    totalPayment: "1000",
    recipient: "Student",
    branch: "Profsous",
    status: "Inactive",
    children: [
      {
        id: 31,
        fullName: "SMM & Target ads",
        totalPayment: "600",
        recipient: "Student",
        branch: "Profsous",
        status: "Inactive",
      },
      {
        id: 32,
        fullName: "Outdoor Banners",
        totalPayment: "400",
        recipient: "Student",
        branch: "Profsous",
        status: "Inactive",
      },
    ],
  },
  {
    id: 4,
    fullName: "Employees",
    totalPayment: "1000",
    recipient: "Student",
    branch: "Profsous",
    status: "Active",
    children: [
      {
        id: 41,
        fullName: "Team building",
        totalPayment: "1000",
        recipient: "Student",
        branch: "Profsous",
        status: "Active",
      },
    ],
  },
];

interface TransactionRow {
  id: number;
  amount: string;
  type: string;
  date: string;
  comment: string;
  actionType: "edit_delete" | "arrow_up";
}

const TRANSACTIONS_DATA: TransactionRow[] = [
  { id: 1, amount: "500 c", type: "Cash", date: "13.08.23, 16:50", comment: "-----", actionType: "edit_delete" },
  { id: 2, amount: "500 c", type: "Cash", date: "13.08.23, 16:50", comment: "-----", actionType: "edit_delete" },
  { id: 3, amount: "500 c", type: "Cash", date: "13.08.23, 16:50", comment: "-----", actionType: "edit_delete" },
  { id: 4, amount: "500 c", type: "Cash", date: "13.08.23, 16:50", comment: "-----", actionType: "edit_delete" },
  { id: 5, amount: "500 c", type: "Cash", date: "13.08.23, 16:50", comment: "-----", actionType: "edit_delete" },
  { id: 6, amount: "500 c", type: "Cash", date: "13.08.23, 16:50", comment: "-----", actionType: "edit_delete" },
  { id: 7, amount: "500 c", type: "Cash", date: "13.08.23, 16:50", comment: "-----", actionType: "edit_delete" },
  { id: 8, amount: "500 c", type: "Cash", date: "13.08.23, 16:50", comment: "-----", actionType: "edit_delete" },
  { id: 9, amount: "200 c", type: "Alif", date: "20 June 2023", comment: "-----", actionType: "arrow_up" },
  { id: 10, amount: "300 c", type: "Cash", date: "16 June 2023", comment: "-----", actionType: "edit_delete" },
];

export function ExpensesPanel() {
  const [selectedCategory, setSelectedCategory] = useState("All category");
  const [selectedBranch, setSelectedBranch] = useState("All branches");
  const [selectedDate, setSelectedDate] = useState("July 2023");

  // Local state for parent expandable rows (Tax expanded by default as in image_75451e.png)
  const [expandedParents, setExpandedParents] = useState<Record<number, boolean>>({
    1: true, // Tax expanded
  });

  // Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedChildTitle, setSelectedChildTitle] = useState("Income tax");
  const [showInactiveTransactions, setShowInactiveTransactions] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleParent = (parentId: number) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

  const handleChildClick = (childName: string) => {
    setSelectedChildTitle(childName);
    setIsDrawerOpen(true);
  };

  return (
    <div className="w-full bg-white dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-6 font-sans relative">
      {/* 1. Main Page Header */}
      <div className="flex items-center justify-between gap-4">
        {/* Left: Back Arrow + Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/accounting"
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:opacity-70 transition-all"
          >
            <ArrowLeft className="size-5 stroke-[2.5]" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Expenses
          </h1>
        </div>

        {/* Right: EXPORT Button */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50/70 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950/40 text-xs font-bold tracking-wider transition-all shadow-xs">
          <Upload className="size-4 stroke-[2.5]" />
          <span>EXPORT</span>
        </button>
      </div>

      {/* 2. Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 max-w-2xl">
        {/* Category */}
        <CustomSelect
          label="Category"
          value={selectedCategory}
          onChange={setSelectedCategory}
          options={["All category", "Tax", "Office expenses", "Marketing", "Employees"]}
        />

        {/* Branch */}
        <CustomSelect
          label="Branch"
          value={selectedBranch}
          onChange={setSelectedBranch}
          options={["All branches", "Sadbarg", "Profsous"]}
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

      {/* 3. Data Table (Expandable / Accordion Logic) */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">FULL NAME</th>
              <th className="py-3.5 px-4">TOTAL PAYMENT</th>
              <th className="py-3.5 px-4">RECIPIENT</th>
              <th className="py-3.5 px-4">BRANCH</th>
              <th className="py-3.5 px-4 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm font-medium">
            {EXPENSES_DATA.map((parent) => {
              const isExpanded = !!expandedParents[parent.id];
              return (
                <Fragment key={parent.id}>
                  {/* Parent Row */}
                  <tr
                    onClick={() => toggleParent(parent.id)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                  >
                    {/* FULL NAME with Chevron */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <ChevronDown
                          className={`size-4 text-slate-600 transition-transform duration-200 ${
                            isExpanded ? "rotate-0" : "-rotate-90"
                          }`}
                        />
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {parent.fullName}
                        </span>
                      </div>
                    </td>

                    {/* TOTAL PAYMENT */}
                    <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                      {parent.totalPayment}
                    </td>

                    {/* RECIPIENT */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {parent.recipient}
                    </td>

                    {/* BRANCH */}
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                      {parent.branch}
                    </td>

                    {/* STATUS */}
                    <td className="py-3.5 px-4 text-center">
                      {parent.status === "Active" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          Inactive
                        </span>
                      )}
                    </td>
                  </tr>

                  {/* Render Child Rows if Expanded */}
                  {isExpanded &&
                    parent.children?.map((child) => (
                      <tr
                        key={child.id}
                        onClick={() => handleChildClick(child.fullName)}
                        className="bg-slate-50/40 dark:bg-slate-900/20 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 cursor-pointer transition-colors border-t border-slate-100 dark:border-slate-800/60"
                      >
                        {/* Indented Child Name */}
                        <td className="py-3.5 px-4 sm:px-6 pl-12 sm:pl-14 font-medium text-slate-700 dark:text-slate-300">
                          {child.fullName}
                        </td>

                        {/* TOTAL PAYMENT */}
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                          {child.totalPayment}
                        </td>

                        {/* RECIPIENT */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                          {child.recipient}
                        </td>

                        {/* BRANCH */}
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                          {child.branch}
                        </td>

                        {/* STATUS */}
                        <td className="py-3.5 px-4 text-center">
                          {child.status === "Active" ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                              Inactive
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Right-Side Expenses Detail Drawer (image_754540.png) */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end transition-opacity duration-300"
          onClick={() => setIsDrawerOpen(false)}
        >
          <div
            className="w-full max-w-xl lg:max-w-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full p-6 sm:p-8 shadow-2xl overflow-y-auto flex flex-col justify-between space-y-6 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="size-5" />
                </button>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100">
                  {selectedChildTitle}
                </h2>
              </div>

              {/* Control Cards */}
              <div className="space-y-3">
                {/* Row 1: Add transaction */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:shadow-md transition-all">
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                    Add transaction
                  </span>
                  <div className="size-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                    <Plus className="size-5 stroke-[3]" />
                  </div>
                </div>

                {/* Row 2: Show inactive transactions */}
                <div className="bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between border border-slate-200/80 dark:border-slate-800">
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                    Show inactive transactions
                  </span>
                  {/* Purple Toggle Switch */}
                  <button
                    onClick={() => setShowInactiveTransactions((prev) => !prev)}
                    className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                      showInactiveTransactions ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`size-5 rounded-full bg-white absolute top-0.5 transition-transform duration-200 shadow-xs ${
                        showInactiveTransactions ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/60">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/70 dark:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200/60 dark:border-slate-800">
                      <th className="py-3 px-4">AMOUNT</th>
                      <th className="py-3 px-4">TYPE</th>
                      <th className="py-3 px-4">DATE</th>
                      <th className="py-3 px-4">COMMENT</th>
                      <th className="py-3 px-4 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm font-medium">
                    {TRANSACTIONS_DATA.map((row) => (
                      <tr key={row.id}>
                        <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                          {row.amount}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          {row.type}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs">
                          {row.date}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">
                          {row.comment}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {row.actionType === "edit_delete" ? (
                            <div className="flex items-center justify-end gap-2">
                              <button className="p-1 text-indigo-500 hover:text-indigo-700">
                                <SquarePen className="size-4" />
                              </button>
                              <button className="p-1 text-rose-500 hover:text-rose-700">
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                          ) : (
                            <ArrowUp className="size-4 text-emerald-500 ml-auto stroke-[2.5]" />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls at Bottom Right */}
            <div className="flex items-center justify-end gap-1.5 pt-4 pb-2">
              {/* Prev */}
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="size-3.5" />
              </button>

              {/* Page 1 (Active) */}
              <button
                onClick={() => setCurrentPage(1)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  currentPage === 1
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                1
              </button>

              {/* Page 2 */}
              <button
                onClick={() => setCurrentPage(2)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  currentPage === 2
                    ? "bg-indigo-600 text-white font-bold shadow-xs"
                    : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                2
              </button>

              {/* Page 3 */}
              <button
                onClick={() => setCurrentPage(3)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  currentPage === 3
                    ? "bg-indigo-600 text-white font-bold shadow-xs"
                    : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                3
              </button>

              {/* Ellipsis */}
              <span className="border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400">
                ...
              </span>

              {/* Page 7 */}
              <button
                onClick={() => setCurrentPage(7)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  currentPage === 7
                    ? "bg-indigo-600 text-white font-bold shadow-xs"
                    : "border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                7
              </button>

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(7, p + 1))}
                className="border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
