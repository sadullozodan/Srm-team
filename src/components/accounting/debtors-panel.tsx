"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Plus,
  Search,
  ChevronDown,
  Calendar,
  SquarePen,
  X,
} from "lucide-react";

interface DebtorRow {
  id: number;
  fullName: string;
  from: string;
  to: string;
  totalDebtAmount: string;
  paymentPerMonth: string;
  totalPaidAmount: string;
  notes: string;
  status: "Inprogress" | "Paid";
}

const DEBTORS_DATA: DebtorRow[] = [
  { id: 1, fullName: "1. Dilovar Karimov", from: "01.04.2023", to: "01.05.2023", totalDebtAmount: "1000", paymentPerMonth: "1000", totalPaidAmount: "1000", notes: "---------", status: "Inprogress" },
  { id: 2, fullName: "1. Dilovar Karimov", from: "01.04.2023", to: "01.05.2023", totalDebtAmount: "1000", paymentPerMonth: "1000", totalPaidAmount: "1000", notes: "---------", status: "Inprogress" },
  { id: 3, fullName: "1. Dilovar Karimov", from: "01.04.2023", to: "01.05.2023", totalDebtAmount: "1000", paymentPerMonth: "1000", totalPaidAmount: "1000", notes: "---------", status: "Inprogress" },
  { id: 4, fullName: "1. Dilovar Karimov", from: "01.04.2023", to: "01.05.2023", totalDebtAmount: "1000", paymentPerMonth: "1000", totalPaidAmount: "1000", notes: "---------", status: "Paid" },
  { id: 5, fullName: "1. Dilovar Karimov", from: "01.04.2023", to: "01.05.2023", totalDebtAmount: "1000", paymentPerMonth: "1000", totalPaidAmount: "1000", notes: "---------", status: "Inprogress" },
  { id: 6, fullName: "1. Dilovar Karimov", from: "01.04.2023", to: "01.05.2023", totalDebtAmount: "1000", paymentPerMonth: "1000", totalPaidAmount: "1000", notes: "---------", status: "Inprogress" },
  { id: 7, fullName: "1. Dilovar Karimov", from: "01.04.2023", to: "01.05.2023", totalDebtAmount: "1000", paymentPerMonth: "1000", totalPaidAmount: "1000", notes: "---------", status: "Paid" },
  { id: 8, fullName: "1. Dilovar Karimov", from: "01.04.2023", to: "01.05.2023", totalDebtAmount: "1000", paymentPerMonth: "1000", totalPaidAmount: "1000", notes: "---------", status: "Inprogress" },
  { id: 9, fullName: "1. Dilovar Karimov", from: "01.04.2023", to: "01.05.2023", totalDebtAmount: "1000", paymentPerMonth: "1000", totalPaidAmount: "1000", notes: "---------", status: "Paid" },
  { id: 10, fullName: "1. Dilovar Karimov", from: "01.04.2023", to: "01.05.2023", totalDebtAmount: "1000", paymentPerMonth: "1000", totalPaidAmount: "1000", notes: "---------", status: "Inprogress" },
  { id: 11, fullName: "1. Dilovar Karimov", from: "01.04.2023", to: "01.05.2023", totalDebtAmount: "1000", paymentPerMonth: "1000", totalPaidAmount: "1000", notes: "---------", status: "Inprogress" },
  { id: 12, fullName: "1. Dilovar Karimov", from: "01.04.2023", to: "01.05.2023", totalDebtAmount: "1000", paymentPerMonth: "1000", totalPaidAmount: "1000", notes: "---------", status: "Inprogress" },
];

interface DrawerTransaction {
  id: number;
  amount: string;
  type: string;
  date: string;
  comment: string;
}

const DRAWER_TRANSACTIONS: DrawerTransaction[] = [
  { id: 1, amount: "500 c", type: "Cash", date: "13.08.23, 16:50", comment: "-----" },
  { id: 2, amount: "300 c", type: "Cash", date: "16 june 2023", comment: "-----" },
  { id: 3, amount: "200 c", type: "Alif", date: "20 june 2023", comment: "-----" },
];

export function DebtorsPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All status");
  const [selectedDate, setSelectedDate] = useState("July 2023");

  // Overlay states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDebtorName, setSelectedDebtorName] = useState("Dilovar Karimov");
  const [isAddTransactionExpanded, setIsAddTransactionExpanded] = useState(false);

  // Modal Form states
  const [modalDebtor, setModalDebtor] = useState("");
  const [modalFromDate, setModalFromDate] = useState("");
  const [modalToDate, setModalToDate] = useState("");
  const [modalAmount, setModalAmount] = useState("");
  const [modalNotes, setModalNotes] = useState("");

  // Drawer Add Transaction states
  const [newTransAmount, setNewTransAmount] = useState("");
  const [newTransType, setNewTransType] = useState("");
  const [newTransComment, setNewTransComment] = useState("");

  const handleRowClick = (row: DebtorRow) => {
    setSelectedDebtorName(row.fullName.replace(/^\d+\.\s*/, ""));
    setIsDrawerOpen(true);
  };

  return (
    <div className="w-full bg-white dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-6 font-sans relative">
      {/* 1. Main Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Back arrow + Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/accounting"
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:opacity-70 transition-all"
          >
            <ArrowLeft className="size-5 stroke-[2.5]" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Debtors
          </h1>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          {/* EXPORT button */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50/70 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950/40 text-xs font-bold tracking-wider transition-all shadow-xs">
            <Upload className="size-4 stroke-[2.5]" />
            <span>EXPORT</span>
          </button>

          {/* + ADD NEW button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="size-4 stroke-[3]" />
            <span>ADD NEW</span>
          </button>
        </div>
      </div>

      {/* 2. Filters Bar with Integrated Floating Labels */}
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
              placeholder="Search payment"
              className="w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
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
              <option value="Inprogress">Inprogress</option>
              <option value="Paid">Paid</option>
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

      {/* 3. Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left border-collapse min-w-[850px]">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">FULL NAME</th>
              <th className="py-3.5 px-4">FROM</th>
              <th className="py-3.5 px-4">TO</th>
              <th className="py-3.5 px-4">TOTAL DEBT AMOUNT</th>
              <th className="py-3.5 px-4">PAYMENT PER MONTH</th>
              <th className="py-3.5 px-4">TOTAL PAID AMOUNT</th>
              <th className="py-3.5 px-4">NOTES</th>
              <th className="py-3.5 px-4 text-center">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm font-medium">
            {DEBTORS_DATA.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row)}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
              >
                {/* FULL NAME */}
                <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-slate-100">
                  {row.fullName}
                </td>

                {/* FROM */}
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                  {row.from}
                </td>

                {/* TO */}
                <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                  {row.to}
                </td>

                {/* TOTAL DEBT AMOUNT */}
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                  {row.totalDebtAmount}
                </td>

                {/* PAYMENT PER MONTH */}
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                  {row.paymentPerMonth}
                </td>

                {/* TOTAL PAID AMOUNT */}
                <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200">
                  {row.totalPaidAmount}
                </td>

                {/* NOTES */}
                <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">
                  {row.notes}
                </td>

                {/* STATUS: Inprogress (Blue) or Paid (Green) */}
                <td className="py-3.5 px-4 text-center">
                  {row.status === "Inprogress" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-600 dark:bg-sky-950/80 dark:text-sky-400">
                      Inprogress
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
                      Paid
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. "New deptors" Modal (image_755fa8.png) */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-card rounded-2xl w-full max-w-md p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                New deptors
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsModalOpen(false);
              }}
              className="space-y-4"
            >
              {/* Debtor Dropdown */}
              <div className="relative">
                <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                  Debtor
                </label>
                <div className="relative flex items-center">
                  <select
                    value={modalDebtor}
                    onChange={(e) => setModalDebtor(e.target.value)}
                    className="w-full appearance-none px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8 cursor-pointer"
                  >
                    <option value="">Choose debtor</option>
                    <option value="Dilovar Karimov">Dilovar Karimov</option>
                    <option value="Tojiev Olimjon">Tojiev Olimjon</option>
                  </select>
                  <ChevronDown className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Two-column row: From & To Date Pickers */}
              <div className="grid grid-cols-2 gap-4">
                {/* From */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                    From
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={modalFromDate}
                      onChange={(e) => setModalFromDate(e.target.value)}
                      placeholder="mm.yyyy"
                      className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-9 placeholder:text-slate-400"
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
                      value={modalToDate}
                      onChange={(e) => setModalToDate(e.target.value)}
                      placeholder="mm.yyyy"
                      className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-9 placeholder:text-slate-400"
                    />
                    <Calendar className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Amount Input */}
              <div className="relative">
                <input
                  type="text"
                  value={modalAmount}
                  onChange={(e) => setModalAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>

              {/* Notes Input */}
              <div className="relative">
                <input
                  type="text"
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="Notes"
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>

              {/* Footer */}
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

      {/* 5. Right-Side Interactive Drawer (image_755fc8.png & image_75628e.png) */}
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
                {selectedDebtorName}
              </h2>
            </div>

            {/* Expandable "Add transaction" Form Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-4 transition-all">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsAddTransactionExpanded((prev) => !prev)}
              >
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  Add transaction
                </span>
                <div className="size-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                  {isAddTransactionExpanded ? (
                    <X className="size-5 stroke-[2.5]" />
                  ) : (
                    <Plus className="size-5 stroke-[3]" />
                  )}
                </div>
              </div>

              {/* Form Content when Expanded (image_75628e.png) */}
              {isAddTransactionExpanded && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsAddTransactionExpanded(false);
                  }}
                  className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700/60 animate-in fade-in duration-200"
                >
                  {/* Row 1: Amount & Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Amount */}
                    <div className="relative">
                      <input
                        type="text"
                        value={newTransAmount}
                        onChange={(e) => setNewTransAmount(e.target.value)}
                        placeholder="Amount"
                        className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                      />
                    </div>

                    {/* Type */}
                    <div className="relative">
                      <label className="absolute -top-2.5 left-3 bg-white dark:bg-slate-800 px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                        Type
                      </label>
                      <div className="relative flex items-center">
                        <select
                          value={newTransType}
                          onChange={(e) => setNewTransType(e.target.value)}
                          className="w-full appearance-none px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8 cursor-pointer"
                        >
                          <option value="">Choose type</option>
                          <option value="Cash">Cash</option>
                          <option value="Alif">Alif</option>
                        </select>
                        <ChevronDown className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Comment */}
                  <div className="relative">
                    <input
                      type="text"
                      value={newTransComment}
                      onChange={(e) => setNewTransComment(e.target.value)}
                      placeholder="Comment"
                      className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Create Button */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-indigo-600/20"
                    >
                      CREATE
                    </button>
                  </div>
                </form>
              )}
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
                  {DRAWER_TRANSACTIONS.map((trans) => (
                    <tr key={trans.id}>
                      <td className="py-3.5 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                        {trans.amount}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                        {trans.type}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-xs">
                        {trans.date}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">
                        {trans.comment}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button className="p-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
                          <SquarePen className="size-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
