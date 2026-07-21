"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Upload,
  Search,
  ChevronDown,
  Calendar,
  X,
  Plus,
  ArrowUp,
  SquarePen,
  Trash2,
  Check,
} from "lucide-react";

interface AvansRowData {
  id: number;
  fullName: string;
  month: string;
  amount: string;
  description: string;
  status: "Pending" | "Approved" | "Denied";
}

const INITIAL_AVANS_DATA: AvansRowData[] = [
  {
    id: 1,
    fullName: "Tojiev Olimjon",
    month: "April",
    amount: "1000",
    description: "I need money, give me my money, please)",
    status: "Pending",
  },
  {
    id: 2,
    fullName: "Tojiev Olimjon",
    month: "April",
    amount: "1000",
    description: "I need money, give me my money, please)",
    status: "Approved",
  },
  {
    id: 3,
    fullName: "Tojiev Olimjon",
    month: "April",
    amount: "1000",
    description: "I need money, give me my money, please)",
    status: "Approved",
  },
  {
    id: 4,
    fullName: "Tojiev Olimjon",
    month: "April",
    amount: "1000",
    description: "I need money, give me my money, please)",
    status: "Denied",
  },
  {
    id: 5,
    fullName: "Tojiev Olimjon",
    month: "April",
    amount: "1000",
    description: "I need money, give me my money, please)",
    status: "Approved",
  },
  {
    id: 6,
    fullName: "Tojiev Olimjon",
    month: "April",
    amount: "1000",
    description: "I need money, give me my money, please)",
    status: "Denied",
  },
  {
    id: 7,
    fullName: "Tojiev Olimjon",
    month: "April",
    amount: "1000",
    description: "I need money, give me my money, please)",
    status: "Approved",
  },
  {
    id: 8,
    fullName: "Tojiev Olimjon",
    month: "April",
    amount: "1000",
    description: "I need money, give me my money, please)",
    status: "Denied",
  },
  {
    id: 9,
    fullName: "Tojiev Olimjon",
    month: "April",
    amount: "1000",
    description: "I need money, give me my money, please)",
    status: "Denied",
  },
];

export function AvansPanel() {
  const [avansRows, setAvansRows] = useState<AvansRowData[]>(INITIAL_AVANS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All status");
  const [selectedDate, setSelectedDate] = useState("April 2024");

  // Overlays state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<"approve" | "deny" | null>(null);
  const [selectedRow, setSelectedRow] = useState<AvansRowData | null>(null);

  // Form states for modals
  const [modalAmount, setModalAmount] = useState("1000");
  const [modalDescription, setModalDescription] = useState("");

  // Drawer Toggle State
  const [showInactiveTransactions, setShowInactiveTransactions] = useState(true);

  const handleOpenApproveModal = (e: React.MouseEvent, row: AvansRowData) => {
    e.stopPropagation();
    setSelectedRow(row);
    setModalAmount(row.amount);
    setActiveModal("approve");
  };

  const handleOpenDenyModal = (e: React.MouseEvent, row: AvansRowData) => {
    e.stopPropagation();
    setSelectedRow(row);
    setModalAmount(row.amount);
    setModalDescription("");
    setActiveModal("deny");
  };

  const handleRowClick = (row: AvansRowData) => {
    setSelectedRow(row);
    setIsDrawerOpen(true);
  };

  const handleApproveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRow) {
      setAvansRows((prev) =>
        prev.map((r) => (r.id === selectedRow.id ? { ...r, status: "Approved" } : r))
      );
    }
    setActiveModal(null);
  };

  const handleDenySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRow) {
      setAvansRows((prev) =>
        prev.map((r) => (r.id === selectedRow.id ? { ...r, status: "Denied" } : r))
      );
    }
    setActiveModal(null);
  };

  return (
    <div className="w-full bg-white dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-6 font-sans relative">
      {/* 1. Main Page Header */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Avans
        </h1>

        {/* EXPORT Button */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50/70 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950/40 text-xs font-bold tracking-wider transition-all shadow-xs">
          <Upload className="size-4 stroke-[2.5]" />
          <span>EXPORT</span>
        </button>
      </div>

      {/* 2. Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 max-w-2xl">
        {/* Search */}
        <div className="relative">
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

        {/* Status */}
        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
            Status
          </label>
          <div className="relative flex items-center">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8 cursor-pointer"
            >
              <option value="All status">All status</option>
              <option value="Approved">Approved</option>
              <option value="Denied">Denied</option>
            </select>
            <ChevronDown className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

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

      {/* 3. Main Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">FULL NAME</th>
              <th className="py-3.5 px-4">MONTH</th>
              <th className="py-3.5 px-4">AMOUNT</th>
              <th className="py-3.5 px-4">DESCRIPTION</th>
              <th className="py-3.5 px-4 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm font-medium">
            {avansRows.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                {/* FULL NAME */}
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-slate-100">
                  {row.fullName}
                </td>

                {/* MONTH */}
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                  {row.month}
                </td>

                {/* AMOUNT */}
                <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                  {row.amount}
                </td>

                {/* DESCRIPTION */}
                <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                  {row.description}
                </td>

                {/* STATUS COLUMN */}
                <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                  {row.status === "Pending" ? (
                    <div className="flex items-center justify-center gap-2">
                      {/* Done / Approve Button */}
                      <button
                        onClick={(e) => handleOpenApproveModal(e, row)}
                        className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-sm"
                      >
                        Done
                      </button>
                      {/* Red X / Deny Button */}
                      <button
                        onClick={(e) => handleOpenDenyModal(e, row)}
                        className="p-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white transition-all shadow-sm"
                        title="Deny"
                      >
                        <X className="size-4 stroke-[3]" />
                      </button>
                    </div>
                  ) : row.status === "Approved" ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
                      <Check className="size-3.5 stroke-[3]" />
                      <span>Approved</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-500 dark:bg-rose-950/80 dark:text-rose-400">
                      <X className="size-3.5 stroke-[3]" />
                      <span>Denied</span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Action Modals (image_74ee8e.png) */}
      {/* Approve Modal */}
      {activeModal === "approve" && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white dark:bg-card rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {selectedRow ? selectedRow.fullName : "Tojiev Olimjon"}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleApproveSubmit} className="space-y-5">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                  Amount
                </label>
                <input
                  type="text"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-indigo-600/20"
                >
                  APPROVE
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 text-xs font-bold tracking-wider transition-all"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deny Modal */}
      {activeModal === "deny" && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-white dark:bg-card rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {selectedRow ? selectedRow.fullName : "Tojiev Olimjon"}
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleDenySubmit} className="space-y-4">
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                  Amount
                </label>
                <input
                  type="text"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={modalDescription}
                  onChange={(e) => setModalDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 resize-none"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-rose-500/20"
                >
                  <X className="size-4 stroke-[3]" />
                  <span>DENIED</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-5 py-2.5 rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-500 dark:text-indigo-400 text-xs font-bold tracking-wider transition-all"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Right-Side Detail Drawer (image_74eec5.png) */}
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
                {selectedRow ? selectedRow.fullName : "Tojiev Olimjon"}
              </h2>
            </div>

            {/* Card Controls */}
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

              {/* Row 2: Show inactive transactions toggle */}
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
                    <th className="py-3 px-4">DATE</th>
                    <th className="py-3 px-4">COMMENT</th>
                    <th className="py-3 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs sm:text-sm font-medium">
                  {/* Row 1 */}
                  <tr>
                    <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">1000 c</td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs">13.08.23, 16:50</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">-----</td>
                    <td className="py-3.5 px-4 text-right">
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
                    <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">200 c</td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs">20 June 2023</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">-----</td>
                    <td className="py-3.5 px-4 text-right pr-6">
                      <ArrowUp className="size-4 text-emerald-500 ml-auto stroke-[2.5]" />
                    </td>
                  </tr>
                  {/* Row 3 */}
                  <tr>
                    <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">300 c</td>
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs">16 June 2023</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">-----</td>
                    <td className="py-3.5 px-4 text-right">
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
        </div>
      )}
    </div>
  );
}
