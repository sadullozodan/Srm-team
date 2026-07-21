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
  Trash2,
  X,
  Download,
} from "lucide-react";

interface PaymentRowData {
  id: number;
  fullName: string;
  phone: string;
  amount: string;
  discountBadge?: string;
  isAmountRed?: boolean;
  paid: string;
  date: string;
  group: string;
  branch: string;
  status: "Ative" | "Active" | "Prepayment";
}

const PAYMENTS_DATA: PaymentRowData[] = [
  {
    id: 1,
    fullName: "Dilovar Karimov",
    phone: "93 258 4147",
    amount: "1000",
    paid: "1000",
    date: "30.01.2024",
    group: "C# 5 June",
    branch: "Sadbarg",
    status: "Ative",
  },
  {
    id: 2,
    fullName: "Dilovar Karimov",
    phone: "93 258 4147",
    amount: "1000",
    paid: "1000",
    date: "30.01.2024",
    group: "C# 5 June",
    branch: "Sadbarg",
    status: "Prepayment",
  },
  {
    id: 3,
    fullName: "Dilovar Karimov",
    phone: "93 258 4147",
    amount: "1000",
    paid: "1000",
    date: "30.01.2024",
    group: "C# 5 June",
    branch: "Sadbarg",
    status: "Active",
  },
  {
    id: 4,
    fullName: "Dilovar Karimov",
    phone: "93 258 4147",
    amount: "1000",
    paid: "1000",
    date: "30.01.2024",
    group: "C# 5 June",
    branch: "Sadbarg",
    status: "Ative",
  },
  {
    id: 5,
    fullName: "Dilovar Karimov",
    phone: "93 258 4147",
    amount: "1000",
    isAmountRed: true,
    discountBadge: "- 400",
    paid: "1000",
    date: "30.01.2024",
    group: "C# 5 June",
    branch: "Profsous",
    status: "Ative",
  },
  {
    id: 6,
    fullName: "Dilovar Karimov",
    phone: "93 258 4147",
    amount: "1000",
    paid: "1000",
    date: "30.01.2024",
    group: "C# 5 June",
    branch: "Sadbarg",
    status: "Prepayment",
  },
  {
    id: 7,
    fullName: "Dilovar Karimov",
    phone: "93 258 4147",
    amount: "1000",
    paid: "1000",
    date: "30.01.2024",
    group: "C# 5 June",
    branch: "Profsous",
    status: "Prepayment",
  },
  {
    id: 8,
    fullName: "Dilovar Karimov",
    phone: "93 258 4147",
    amount: "800",
    isAmountRed: true,
    discountBadge: "- 200",
    paid: "1000",
    date: "30.01.2024",
    group: "C# 5 June",
    branch: "Profsous",
    status: "Ative",
  },
  {
    id: 9,
    fullName: "Dilovar Karimov",
    phone: "93 258 4147",
    amount: "1000",
    paid: "1000",
    date: "30.01.2024",
    group: "C# 5 June",
    branch: "Sadbarg",
    status: "Ative",
  },
  {
    id: 10,
    fullName: "Dilovar Karimov",
    phone: "93 258 4147",
    amount: "1000",
    paid: "1000",
    date: "30.01.2024",
    group: "C# 5 June",
    branch: "Sadbarg",
    status: "Ative",
  },
  {
    id: 11,
    fullName: "Dilovar Karimov",
    phone: "93 258 4147",
    amount: "1000",
    paid: "1000",
    date: "30.01.2024",
    group: "C# 5 June",
    branch: "Sadbarg",
    status: "Ative",
  },
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
  { id: 2, amount: "300 c", type: "Cash", date: "16 June 2023", comment: "-----" },
  { id: 3, amount: "200 c", type: "Alif", date: "20 June 2023", comment: "-----" },
];

export function PaymentsListPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("All groups");
  const [selectedBranch, setSelectedBranch] = useState("All branches");
  const [selectedStatus, setSelectedStatus] = useState("All status");
  const [selectedDate, setSelectedDate] = useState("July 2023");

  // Overlay states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStudentName, setSelectedStudentName] = useState("Dilovar Karimov");
  const [isAddTransactionExpanded, setIsAddTransactionExpanded] = useState(false);
  const [openDownloadPopoverId, setOpenDownloadPopoverId] = useState<number | null>(null);

  // Modals state
  const [activeModal, setActiveModal] = useState<"amount" | "prepayment" | null>(null);
  const [prepaymentTab, setPrepaymentTab] = useState<"current" | "new">("current");

  // Form states
  const [amountInputVal, setAmountInputVal] = useState("1000");
  const [amountUpdateReason, setAmountUpdateReason] = useState("");
  const [discountAmountVal, setDiscountAmountVal] = useState("");
  const [amountDiscountToggle, setAmountDiscountToggle] = useState(true);

  // Prepayment Form states
  const [prepaymentStudent, setPrepaymentStudent] = useState("");
  const [prepaymentCourse, setPrepaymentCourse] = useState("");
  const [prepaymentBranch, setPrepaymentBranch] = useState("");
  const [prepaymentPaidAmount, setPrepaymentPaidAmount] = useState("");
  const [prepaymentDiscountAmount, setPrepaymentDiscountAmount] = useState("");
  const [prepaymentDiscountToggle, setPrepaymentDiscountToggle] = useState(true);

  // New Student Prepayment Form states (image_75628b.png)
  const [newStudentFirstName, setNewStudentFirstName] = useState("");
  const [newStudentLastName, setNewStudentLastName] = useState("");
  const [newStudentDob, setNewStudentDob] = useState("");
  const [newStudentPhone, setNewStudentPhone] = useState("");

  // Drawer Add Transaction states
  const [newTransAmount, setNewTransAmount] = useState("");
  const [newTransType, setNewTransType] = useState("");
  const [newTransComment, setNewTransComment] = useState("");

  const handleRowClick = (row: PaymentRowData) => {
    setSelectedStudentName(row.fullName);
    setIsDrawerOpen(true);
  };

  const handleAmountClick = (e: React.MouseEvent, row: PaymentRowData) => {
    e.stopPropagation();
    setSelectedStudentName(row.fullName);
    setAmountInputVal(row.amount);
    setActiveModal("amount");
  };

  return (
    <div className="w-full bg-white dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-6 font-sans relative">
      {/* 1. Panel Header */}
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
            Payments
          </h1>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-3">
          {/* EXPORT button */}
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50/70 dark:border-indigo-500 dark:text-indigo-400 dark:hover:bg-indigo-950/40 text-xs font-bold tracking-wider transition-all shadow-xs">
            <Upload className="size-4 stroke-[2.5]" />
            <span>EXPORT</span>
          </button>

          {/* + PREPAYMENT button */}
          <button
            onClick={() => setActiveModal("prepayment")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="size-4 stroke-[3]" />
            <span>PREPAYMENT</span>
          </button>
        </div>
      </div>

      {/* 2. Filters Bar with Small Top-Left Floating Labels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-1">
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
              className="w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Groups */}
        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
            Groups
          </label>
          <div className="relative flex items-center">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8 cursor-pointer"
            >
              <option value="All groups">All groups</option>
              <option value="C# 5 June">C# 5 June</option>
              <option value="React">React</option>
            </select>
            <ChevronDown className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Branch */}
        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
            Branch
          </label>
          <div className="relative flex items-center">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8 cursor-pointer"
            >
              <option value="All branches">All branches</option>
              <option value="Sadbarg">Sadbarg</option>
              <option value="Profsous">Profsous</option>
            </select>
            <ChevronDown className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
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
              <option value="Ative">Ative</option>
              <option value="Prepayment">Prepayment</option>
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
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6">FULL NAME</th>
              <th className="py-3 px-4">AMOUNT</th>
              <th className="py-3 px-4">PAID</th>
              <th className="py-3 px-4">DATE</th>
              <th className="py-3 px-4">GROUPS</th>
              <th className="py-3 px-4">BRANCH</th>
              <th className="py-3 px-4 text-center">STATUS</th>
              <th className="py-3 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm font-medium">
            {PAYMENTS_DATA.map((row) => (
              <tr
                key={row.id}
                onClick={() => handleRowClick(row)}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
              >
                {/* FULL NAME: Two lines */}
                <td className="py-3 px-4 sm:px-6">
                  <div className="font-bold text-slate-900 dark:text-slate-100">
                    {row.fullName}
                  </div>
                  <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {row.phone}
                  </div>
                </td>

                {/* AMOUNT: Clickable to open Amount Modal */}
                <td
                  className="py-3 px-4"
                  onClick={(e) => handleAmountClick(e, row)}
                >
                  <div className="flex items-center gap-2 cursor-pointer group">
                    <span
                      className={`font-semibold group-hover:underline ${
                        row.isAmountRed
                          ? "text-rose-500 dark:text-rose-400"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {row.amount}
                    </span>
                    {row.discountBadge && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300">
                        {row.discountBadge}
                      </span>
                    )}
                  </div>
                </td>

                {/* PAID */}
                <td className="py-3 px-4 text-slate-800 dark:text-slate-200">
                  {row.paid}
                </td>

                {/* DATE */}
                <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-mono text-xs">
                  {row.date}
                </td>

                {/* GROUPS */}
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                  {row.group}
                </td>

                {/* BRANCH */}
                <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                  {row.branch}
                </td>

                {/* STATUS: Pill Badges */}
                <td className="py-3 px-4 text-center">
                  {row.status === "Prepayment" ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      Prepayment
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
                      {row.status}
                    </span>
                  )}
                </td>

                {/* ACTION: Edit (Blue) & Delete (Red) */}
                <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
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

      {/* 4. Right-Side Payments Detail Drawer (image_755403.png & image_755465.png) */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end transition-opacity duration-300"
          onClick={() => {
            setIsDrawerOpen(false);
            setOpenDownloadPopoverId(null);
          }}
        >
          <div
            className="w-full max-w-xl lg:max-w-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full p-6 sm:p-8 shadow-2xl overflow-y-auto space-y-6 animate-in slide-in-from-right duration-300"
            onClick={(e) => {
              e.stopPropagation();
              setOpenDownloadPopoverId(null);
            }}
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
                {selectedStudentName}
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
                <div
                  className={`size-8 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                    isAddTransactionExpanded
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-600 text-white"
                  }`}
                >
                  {isAddTransactionExpanded ? (
                    <X className="size-5 stroke-[2.5]" />
                  ) : (
                    <Plus className="size-5 stroke-[3]" />
                  )}
                </div>
              </div>

              {/* Form Content when Expanded (image_755465.png Left) */}
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
                      <label className="absolute -top-2.5 left-3 bg-white dark:bg-slate-800 px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                        Amount
                      </label>
                      <input
                        type="text"
                        value={newTransAmount}
                        onChange={(e) => setNewTransAmount(e.target.value)}
                        placeholder="Amount"
                        className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
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
                    <label className="absolute -top-2.5 left-3 bg-white dark:bg-slate-800 px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                      Comment
                    </label>
                    <input
                      type="text"
                      value={newTransComment}
                      onChange={(e) => setNewTransComment(e.target.value)}
                      placeholder="Comment"
                      className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
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
                    <tr key={trans.id} className="relative">
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
                      <td className="py-3.5 px-4 text-right relative">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1 text-indigo-500 hover:text-indigo-700">
                            <SquarePen className="size-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDownloadPopoverId(
                                openDownloadPopoverId === trans.id ? null : trans.id
                              );
                            }}
                            className="p-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400"
                            title="Download options"
                          >
                            <Download className="size-4" />
                          </button>
                        </div>

                        {/* Download Dropdown Popover (image_755465.png Right) */}
                        {openDownloadPopoverId === trans.id && (
                          <div className="absolute right-4 top-10 z-30 w-36 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 space-y-1 text-xs text-left animate-in fade-in zoom-in-95 duration-150">
                            <button
                              onClick={() => setOpenDownloadPopoverId(null)}
                              className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                            >
                              Download PDF
                            </button>
                            <button
                              onClick={() => setOpenDownloadPopoverId(null)}
                              className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium transition-colors"
                            >
                              Download Word
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. "Amount" Modal (image_755484.png) */}
      {activeModal === "amount" && (
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
                Amount
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Form Grid */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setActiveModal(null);
              }}
              className="space-y-4"
            >
              {/* Row 1: Amount & Update reason */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                    Amount
                  </label>
                  <input
                    type="text"
                    value={amountInputVal}
                    onChange={(e) => setAmountInputVal(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
                  />
                </div>

                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                    Update reason
                  </label>
                  <input
                    type="text"
                    value={amountUpdateReason}
                    onChange={(e) => setAmountUpdateReason(e.target.value)}
                    placeholder="Update reason"
                    className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Row 2: Discount block & Discount amount */}
              <div className="grid grid-cols-2 gap-4">
                {/* Discount block with Toggle Switch */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Discount
                  </span>
                  <button
                    type="button"
                    onClick={() => setAmountDiscountToggle((prev) => !prev)}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                      amountDiscountToggle ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`size-4 rounded-full bg-white absolute top-0.5 transition-transform duration-200 shadow-xs ${
                        amountDiscountToggle ? "translate-x-4.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>

                {/* Discount amount */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                    Discount amount
                  </label>
                  <input
                    type="text"
                    value={discountAmountVal}
                    onChange={(e) => setDiscountAmountVal(e.target.value)}
                    placeholder="Discount amount"
                    className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
                  />
                </div>
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

      {/* 6. "Prepayment" Modal (image_755747.png) */}
      {activeModal === "prepayment" && (
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
                Prepayment
              </h2>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="bg-slate-100/80 dark:bg-slate-800 p-1 rounded-xl flex items-center">
              <button
                onClick={() => setPrepaymentTab("current")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
                  prepaymentTab === "current"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                }`}
              >
                Current student
              </button>
              <button
                onClick={() => setPrepaymentTab("new")}
                className={`flex-1 py-1.5 rounded-lg text-xs transition-all text-center ${
                  prepaymentTab === "new"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium"
                }`}
              >
                New student
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setActiveModal(null);
              }}
              className="space-y-4"
            >
              {prepaymentTab === "current" ? (
                /* Current Student Form */
                <>
                  {/* Student Dropdown */}
                  <div className="relative">
                    <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                      Student
                    </label>
                    <div className="relative flex items-center">
                      <select
                        value={prepaymentStudent}
                        onChange={(e) => setPrepaymentStudent(e.target.value)}
                        className="w-full appearance-none px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8 cursor-pointer"
                      >
                        <option value="">Choose student</option>
                        <option value="Dilovar Karimov">Dilovar Karimov</option>
                        <option value="Tojiev Olimjon">Tojiev Olimjon</option>
                      </select>
                      <ChevronDown className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </>
              ) : (
                /* New Student Form (image_75628b.png) */
                <>
                  {/* First name */}
                  <div className="relative">
                    <input
                      type="text"
                      value={newStudentFirstName}
                      onChange={(e) => setNewStudentFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Last name */}
                  <div className="relative">
                    <input
                      type="text"
                      value={newStudentLastName}
                      onChange={(e) => setNewStudentLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                    />
                  </div>

                  {/* Date of birthday & Phone number */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Date of birthday */}
                    <div className="relative">
                      <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                        Date of birthday
                      </label>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={newStudentDob}
                          onChange={(e) => setNewStudentDob(e.target.value)}
                          placeholder="dd.mm.yyyy"
                          className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-9 placeholder:text-slate-400"
                        />
                        <Calendar className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Phone number */}
                    <div className="relative">
                      <input
                        type="text"
                        value={newStudentPhone}
                        onChange={(e) => setNewStudentPhone(e.target.value)}
                        placeholder="Phone number"
                        className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Course & Branch Row (Common to both) */}
              <div className="grid grid-cols-2 gap-4">
                {/* Course */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                    Course
                  </label>
                  <div className="relative flex items-center">
                    <select
                      value={prepaymentCourse}
                      onChange={(e) => setPrepaymentCourse(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8 cursor-pointer"
                    >
                      <option value="">Choose course</option>
                      <option value="C# 5 June">C# 5 June</option>
                      <option value="React">React</option>
                    </select>
                    <ChevronDown className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Branch */}
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                    Branch
                  </label>
                  <div className="relative flex items-center">
                    <select
                      value={prepaymentBranch}
                      onChange={(e) => setPrepaymentBranch(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8 cursor-pointer"
                    >
                      <option value="">Choose branch</option>
                      <option value="Sadbarg">Sadbarg</option>
                      <option value="Profsous">Profsous</option>
                    </select>
                    <ChevronDown className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Paid amount */}
              <div className="relative">
                <input
                  type="text"
                  value={prepaymentPaidAmount}
                  onChange={(e) => setPrepaymentPaidAmount(e.target.value)}
                  placeholder="Paid amount"
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                />
              </div>

              {/* Bottom Row: Discount amount & Discount Block */}
              <div className="grid grid-cols-2 gap-4">
                {/* Discount amount */}
                <div className="relative">
                  <input
                    type="text"
                    value={prepaymentDiscountAmount}
                    onChange={(e) => setPrepaymentDiscountAmount(e.target.value)}
                    placeholder="Discount amount"
                    className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
                  />
                </div>

                {/* Discount Block */}
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 flex items-center justify-between bg-slate-50/60 dark:bg-slate-900/40">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Discount
                  </span>
                  <button
                    type="button"
                    onClick={() => setPrepaymentDiscountToggle((prev) => !prev)}
                    className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${
                      prepaymentDiscountToggle ? "bg-indigo-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span
                      className={`size-4 rounded-full bg-white absolute top-0.5 transition-transform duration-200 shadow-xs ${
                        prepaymentDiscountToggle ? "translate-x-4.5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
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
    </div>
  );
}
