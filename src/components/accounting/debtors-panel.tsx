"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Upload, Plus, Search, Calendar, SquarePen, Trash2, X } from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  debtorsApi,
  queryKeys,
} from "@/lib/api/resources";
import type { DebtorDto } from "@/lib/api/types";
import { Toast } from "@/components/ui/toast";

const FETCH_ALL = { page: 1, pageSize: 1000 };

export function DebtorsPanel() {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All status");
  const [selectedDate, setSelectedDate] = useState("July 2023");

  const debtorsQuery = useQuery({
    queryKey: queryKeys.list(debtorsApi.key, FETCH_ALL),
    queryFn: () => debtorsApi.list(FETCH_ALL),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => debtorsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.list(debtorsApi.key, FETCH_ALL) });
      setToast("Debtor deleted");
    },
  });

  const debtors = useMemo(() => {
    const items = debtorsQuery.data?.items ?? [];
    return items.map((d) => ({
      id: d.id,
      fullName: d.fullName ?? "—",
      from: d.fromDate ? new Date(d.fromDate).toLocaleDateString("ru-RU") : "—",
      to: d.toDate ? new Date(d.toDate).toLocaleDateString("ru-RU") : "—",
      totalDebtAmount: String(d.totalDebtAmount),
      paymentPerMonth: String(d.paymentPerMonth),
      totalPaidAmount: String(d.totalPaidAmount),
      notes: d.notes ?? "—",
      status: d.status === "Paid" ? "Paid" as const : "Inprogress" as const,
    }));
  }, [debtorsQuery.data]);

  const filteredDebtors = useMemo(() => {
    return debtors.filter((d) => {
      if (searchQuery && !d.fullName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedStatus !== "All status" && d.status !== selectedStatus) return false;
      return true;
    });
  }, [debtors, searchQuery, selectedStatus]);

  // Overlay states
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDebtorName, setSelectedDebtorName] = useState("");
  const [isAddTransactionExpanded, setIsAddTransactionExpanded] = useState(false);

  // Drawer Add Transaction states
  const [newTransAmount, setNewTransAmount] = useState("");
  const [newTransType, setNewTransType] = useState("");
  const [newTransComment, setNewTransComment] = useState("");

  const DRAWER_TRANSACTIONS: { id: number; amount: string; type: string; date: string; comment: string }[] = [];

  const handleRowClick = (row: { id: string; fullName: string }) => {
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
          <Link
            href="/accounting/debtors/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wider transition-all shadow-md shadow-indigo-600/20"
          >
            <Plus className="size-4 stroke-[3]" />
            <span>ADD NEW</span>
          </Link>
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
        <CustomSelect
          label="Status"
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={["All status", "Inprogress", "Paid"]}
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
              <th className="py-3.5 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm font-medium">
            {filteredDebtors.map((row) => (
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
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/accounting/debtors/${row.id}/edit`} onClick={(e) => e.stopPropagation()} className="p-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
                      <SquarePen className="size-4" />
                    </Link>
                    <button onClick={(e) => { e.stopPropagation(); if (confirm("Delete this debtor?")) deleteMutation.mutate(row.id); }} className="p-1 text-rose-500 hover:text-rose-700">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 4. Right-Side Interactive Drawer (image_755fc8.png & image_75628e.png) */}
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
                    <CustomSelect
                      label="Type"
                      value={newTransType || "Choose type"}
                      onChange={(val) => setNewTransType(val === "Choose type" ? "" : val)}
                      options={["Choose type", "Cash", "Alif"]}
                      className="w-full"
                    />
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
                        <Link href={`/accounting/debtors/${trans.id}/edit`} onClick={(e) => e.stopPropagation()} className="p-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
                          <SquarePen className="size-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
