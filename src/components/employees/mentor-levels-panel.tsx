"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Star,
  X,
  Plus,
  Edit2,
  Trash2,
} from "lucide-react";
import { mentorLevelsApi, queryKeys } from "@/lib/api/resources";
import type { MentorLevelDto } from "@/lib/api/types";

const MONTH_KEYS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUNE", "JULY", "AUG", "SEP", "OCT", "NOV", "DEC"] as const;
const MONTH_NUM: Record<string, number> = { JAN: 1, FEB: 2, MAR: 3, APR: 4, MAY: 5, JUNE: 6, JULY: 7, AUG: 8, SEP: 9, OCT: 10, NOV: 11, DEC: 12 };

function levelColor(level?: string) {
  if (!level) return "";
  if (level.startsWith("Intern")) return "text-emerald-500 font-bold";
  if (level.startsWith("Junior")) return "text-sky-500 font-bold";
  if (level.startsWith("Middle")) return "text-amber-500 font-bold";
  if (level.startsWith("Senior")) return "text-indigo-600 font-bold";
  return "text-slate-700 dark:text-slate-300 font-bold";
}

export function MentorLevelsPanel() {
  const queryClient = useQueryClient();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isLevelsDrawerOpen, setIsLevelsDrawerOpen] = useState(false);

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("MentorLevels", { pageSize: 1000 }),
    queryFn: () => mentorLevelsApi.list({ pageSize: 1000 }),
  });
  const allLevels = data?.items ?? [];

  const yearLevels = useMemo(() => allLevels.filter((l) => l.year === selectedYear), [allLevels, selectedYear]);

  const rows = useMemo(() => {
    const map = new Map<string, MentorLevelDto[]>();
    for (const l of yearLevels) {
      const key = l.employeeId;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(l);
    }
    return Array.from(map.entries()).map(([employeeId, entries]) => {
      const months: Record<string, string> = {};
      for (const e of entries) {
        const mk = MONTH_KEYS[e.month - 1];
        if (mk) months[mk] = e.level;
      }
      return { employeeId, employeeName: entries[0].employeeName ?? "—", months };
    });
  }, [yearLevels]);

  const [isAddLevelExpanded, setIsAddLevelExpanded] = useState(false);
  const [newLevelName, setNewLevelName] = useState("");
  const [newLevelSalary, setNewLevelSalary] = useState<number>(0);

  // ponytail: level definitions drawer uses local state; no API endpoint for global level scale exists.
  const [levelsList, setLevelsList] = useState(() =>
    ["Intern", "Junior1", "Junior2", "Junior3", "Middle1", "Middle2", "Middle3", "Senior1", "Senior2", "Senior3"]
      .map((level, i) => ({ id: i + 1, level, salary: `${(i + 1) * 10} s` })),
  );

  const handleCreateLevel = () => {
    if (newLevelName.trim()) {
      setLevelsList([...levelsList, { id: Date.now(), level: newLevelName.trim(), salary: `${newLevelSalary} s` }]);
      setNewLevelName("");
      setNewLevelSalary(0);
      setIsAddLevelExpanded(false);
    }
  };

  const handleDeleteLevel = (id: number) => setLevelsList(levelsList.filter((lvl) => lvl.id !== id));

  return (
    <div className="w-full bg-white dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-6 font-sans relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/employees" className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:opacity-70 transition-all">
            <ArrowLeft className="size-5 stroke-[2.5]" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Mentor levels</h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 shadow-xs">
            <button onClick={() => setSelectedYear((y) => y - 1)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><ChevronLeft className="size-3.5" /></button>
            <span>{selectedYear} year</span>
            <button onClick={() => setSelectedYear((y) => y + 1)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"><ChevronRight className="size-3.5" /></button>
          </div>
          <button onClick={() => setIsLevelsDrawerOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-all">
            <Star className="size-4 fill-white text-white" /><span>Levels</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-800/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">FULL NAME</th>
              {MONTH_KEYS.map((m) => <th key={m} className="py-3.5 px-3 text-center">{m}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-medium">
            {isPending ? (
              <tr><td colSpan={13} className="py-10 text-center text-sm text-slate-400">Loading...</td></tr>
            ) : isError ? (
              <tr><td colSpan={13} className="py-10 text-center text-sm text-destructive">Couldn&apos;t load mentor levels.</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={13} className="py-10 text-center text-sm text-muted-foreground">No data for {selectedYear}.</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row.employeeId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">{row.employeeName}</td>
                  {MONTH_KEYS.map((m) => {
                    const lvl = row.months[m];
                    return (
                      <td key={m} className="py-3.5 px-2 text-center whitespace-nowrap text-[11px]">
                        {lvl ? <span className={levelColor(lvl)}>{lvl}</span> : <span className="text-slate-300 dark:text-slate-600">-</span>}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isLevelsDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end transition-opacity duration-300" onClick={() => setIsLevelsDrawerOpen(false)}>
          <div className="w-full max-w-md bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full p-6 sm:p-7 shadow-2xl overflow-y-auto space-y-5 animate-in slide-in-from-right duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
              <button onClick={() => setIsLevelsDrawerOpen(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"><X className="size-5" /></button>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">Mentor levels</h2>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">Add new</span>
                <button onClick={() => setIsAddLevelExpanded(!isAddLevelExpanded)} className={`p-1.5 rounded-xl transition-all ${isAddLevelExpanded ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400" : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 hover:bg-indigo-100"}`}>
                  {isAddLevelExpanded ? <X className="size-4" /> : <Plus className="size-4 stroke-[3]" />}
                </button>
              </div>
              {isAddLevelExpanded && (
                <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Level" value={newLevelName} onChange={(e) => setNewLevelName(e.target.value)} className="w-full px-3.5 py-2.5 text-xs font-medium bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200" />
                    <div className="relative flex items-center">
                      <input type="number" placeholder="Salary" value={newLevelSalary || ""} onChange={(e) => setNewLevelSalary(parseInt(e.target.value) || 0)} className="w-full px-3.5 py-2.5 text-xs font-bold bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200 pr-8" />
                      <div className="absolute right-2 flex flex-col">
                        <button type="button" onClick={() => setNewLevelSalary((v) => v + 5)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"><ChevronUp className="size-3 stroke-[2.5]" /></button>
                        <button type="button" onClick={() => setNewLevelSalary((v) => Math.max(0, v - 5))} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"><ChevronDown className="size-3 stroke-[2.5]" /></button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button onClick={handleCreateLevel} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs">Create</button>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs divide-y divide-slate-100 dark:divide-slate-700/60">
              {levelsList.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 block">Level</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.level}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs px-3 py-1 rounded-full">{item.salary}</span>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"><Edit2 className="size-4" /></button>
                      <button onClick={() => handleDeleteLevel(item.id)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors"><Trash2 className="size-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}