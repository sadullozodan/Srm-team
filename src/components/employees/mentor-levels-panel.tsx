"use client";

import { useState } from "react";
import Link from "next/link";
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

interface MentorRow {
  id: number;
  fullName: string;
  months: {
    JAN?: string;
    FEB?: string;
    MAR?: string;
    APR?: string;
    MAY?: string;
    JUNE?: string;
    JULY?: string;
    AUG?: string;
    SEP?: string;
    OCT?: string;
    NOV?: string;
    DEC?: string;
  };
}

interface LevelItem {
  id: number;
  level: string;
  salary: string;
}

const INITIAL_MENTOR_ROWS: MentorRow[] = [
  {
    id: 1,
    fullName: "Nurullo Sulaymonov",
    months: {
      JAN: "Intern",
      FEB: "Intern",
      MAR: "Junior 1",
      APR: "Junior 2",
      MAY: "Junior 2",
      JUNE: "Junior 3",
      JULY: "Middle 1",
      AUG: "Senior 1",
      SEP: "Senior 2",
      OCT: "Senior 3",
      NOV: "Senior 3",
      DEC: "Senior 3",
    },
  },
  {
    id: 2,
    fullName: "Muhammadjon Mirzoev",
    months: {
      JAN: "Intern",
      FEB: "Intern",
      APR: "Junior 2",
      JUNE: "Junior 3",
      JULY: "Middle 1",
      AUG: "Senior 1",
      SEP: "Senior 2",
      OCT: "Senior 3",
      NOV: "Senior 3",
      DEC: "Senior 3",
    },
  },
  {
    id: 3,
    fullName: "Alijon Zabirov",
    months: {
      JAN: "Intern",
      FEB: "Intern",
      MAR: "Junior 1",
      APR: "Junior 2",
      MAY: "Junior 2",
      JULY: "Middle 1",
      NOV: "Senior 3",
      DEC: "Senior 3",
    },
  },
  {
    id: 4,
    fullName: "Mehriddin Saidov",
    months: {
      JAN: "Intern",
      FEB: "Intern",
      MAR: "Junior 1",
      MAY: "Junior 2",
      JULY: "Middle 1",
      AUG: "Senior 1",
      NOV: "Senior 3",
      DEC: "Senior 3",
    },
  },
  {
    id: 5,
    fullName: "Najibullo Shamsuddinov",
    months: {
      FEB: "Intern",
      MAR: "Junior 1",
      APR: "Junior 2",
      MAY: "Junior 2",
      JUNE: "Junior 3",
      JULY: "Middle 1",
      AUG: "Senior 1",
      SEP: "Senior 2",
      OCT: "Senior 3",
      NOV: "Senior 3",
      DEC: "Senior 3",
    },
  },
  {
    id: 6,
    fullName: "Tojiev Olimjon",
    months: {
      JAN: "Intern",
      MAR: "Junior 1",
      APR: "Junior 2",
      MAY: "Junior 2",
      JULY: "Middle 1",
      AUG: "Senior 1",
      NOV: "Senior 3",
      DEC: "Senior 3",
    },
  },
  {
    id: 7,
    fullName: "Alijon Rasulov",
    months: {
      JAN: "Intern",
      FEB: "Intern",
      MAR: "Junior 1",
      MAY: "Junior 2",
      JUNE: "Junior 3",
      JULY: "Middle 1",
      AUG: "Senior 1",
      SEP: "Senior 2",
      OCT: "Senior 3",
      NOV: "Senior 3",
      DEC: "Senior 3",
    },
  },
  {
    id: 8,
    fullName: "Hasan Huseinov",
    months: {
      MAR: "Junior 1",
      APR: "Junior 2",
      MAY: "Junior 2",
      JULY: "Middle 1",
      SEP: "Senior 2",
      OCT: "Senior 3",
      NOV: "Senior 3",
      DEC: "Senior 3",
    },
  },
  {
    id: 9,
    fullName: "Olimjon Sharifov",
    months: {
      JAN: "Intern",
      MAR: "Junior 1",
      APR: "Junior 2",
      JUNE: "Junior 3",
      JULY: "Middle 1",
      AUG: "Senior 1",
      SEP: "Senior 2",
      NOV: "Senior 3",
      DEC: "Senior 3",
    },
  },
  {
    id: 10,
    fullName: "Kurbonali Nazarov",
    months: {
      JAN: "Intern",
      MAR: "Junior 1",
      MAY: "Junior 2",
      JUNE: "Junior 3",
      JULY: "Middle 1",
      AUG: "Senior 1",
      OCT: "Senior 3",
    },
  },
];

const INITIAL_LEVELS: LevelItem[] = [
  { id: 1, level: "Intern", salary: "10 s" },
  { id: 2, level: "Junior 1", salary: "20 s" },
  { id: 3, level: "Junior 2", salary: "25 s" },
  { id: 4, level: "Junior 3", salary: "35 s" },
  { id: 5, level: "Middle 1", salary: "40 s" },
  { id: 6, level: "Middle 2", salary: "45 s" },
  { id: 7, level: "Middle 3", salary: "50 s" },
  { id: 8, level: "Senior 1", salary: "60 s" },
  { id: 9, level: "Senior 2", salary: "65 s" },
  { id: 10, level: "Senior 3", salary: "75 s" },
];

function getLevelTextColor(level?: string) {
  if (!level) return "";
  if (level.startsWith("Intern")) return "text-emerald-500 font-bold";
  if (level.startsWith("Junior")) return "text-sky-500 font-bold";
  if (level.startsWith("Middle")) return "text-amber-500 font-bold";
  if (level.startsWith("Senior")) return "text-indigo-600 font-bold";
  return "text-slate-700 dark:text-slate-300 font-bold";
}

export function MentorLevelsPanel() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [isLevelsDrawerOpen, setIsLevelsDrawerOpen] = useState(false);

  // Drawer level management state
  const [levelsList, setLevelsList] = useState<LevelItem[]>(INITIAL_LEVELS);
  const [isAddLevelExpanded, setIsAddLevelExpanded] = useState(false);
  const [newLevelName, setNewLevelName] = useState("");
  const [newLevelSalary, setNewLevelSalary] = useState<number>(0);

  const handleCreateLevel = () => {
    if (newLevelName.trim()) {
      const newItem: LevelItem = {
        id: Date.now(),
        level: newLevelName.trim(),
        salary: `${newLevelSalary} s`,
      };
      setLevelsList([...levelsList, newItem]);
      setNewLevelName("");
      setNewLevelSalary(0);
      setIsAddLevelExpanded(false);
    }
  };

  const handleDeleteLevel = (id: number) => {
    setLevelsList(levelsList.filter((lvl) => lvl.id !== id));
  };

  const monthsKeys: Array<keyof MentorRow["months"]> = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUNE",
    "JULY",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  return (
    <div className="w-full bg-white dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-6 font-sans relative">
      {/* 1. Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/employees"
            className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:opacity-70 transition-all"
          >
            <ArrowLeft className="size-5 stroke-[2.5]" />
          </Link>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Mentor levels
          </h1>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Year Selector */}
          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 shadow-xs">
            <button
              onClick={() => setSelectedYear((y) => y - 1)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span>{selectedYear} year</span>
            <button
              onClick={() => setSelectedYear((y) => y + 1)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>

          {/* ⭐ Levels Button */}
          <button
            onClick={() => setIsLevelsDrawerOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Star className="size-4 fill-white text-white" />
            <span>Levels</span>
          </button>
        </div>
      </div>

      {/* 2. Data Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-slate-800/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 sm:px-6">FULL NAME</th>
              {monthsKeys.map((m) => (
                <th key={m} className="py-3.5 px-3 text-center">
                  {m}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs font-medium">
            {INITIAL_MENTOR_ROWS.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                {/* FULL NAME */}
                <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                  {row.fullName}
                </td>

                {/* MONTHS */}
                {monthsKeys.map((m) => {
                  const lvl = row.months[m];
                  return (
                    <td key={m} className="py-3.5 px-2 text-center whitespace-nowrap text-[11px]">
                      {lvl ? (
                        <span className={getLevelTextColor(lvl)}>{lvl}</span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Mentor Levels Management Drawer (image_c70115.png & image_c70158.png) */}
      {isLevelsDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end transition-opacity duration-300"
          onClick={() => setIsLevelsDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full p-6 sm:p-7 shadow-2xl overflow-y-auto space-y-5 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
              <button
                onClick={() => setIsLevelsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="size-5" />
              </button>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                Mentor levels
              </h2>
            </div>

            {/* Expandable "Add new" Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Add new
                </span>
                <button
                  onClick={() => setIsAddLevelExpanded(!isAddLevelExpanded)}
                  className={`p-1.5 rounded-xl transition-all ${
                    isAddLevelExpanded
                      ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                      : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 hover:bg-indigo-100"
                  }`}
                >
                  {isAddLevelExpanded ? <X className="size-4" /> : <Plus className="size-4 stroke-[3]" />}
                </button>
              </div>

              {/* Form inside Expanded Add New */}
              {isAddLevelExpanded && (
                <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-3">
                    {/* Level Input */}
                    <div className="relative">
                      {newLevelName && (
                        <label className="absolute -top-2.5 left-3 bg-white dark:bg-slate-800 px-1 text-[10px] font-medium text-slate-500 z-10">
                          Level
                        </label>
                      )}
                      <input
                        type="text"
                        placeholder={newLevelName ? "" : "Level"}
                        value={newLevelName}
                        onChange={(e) => setNewLevelName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs font-medium bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200"
                      />
                    </div>

                    {/* Salary Input */}
                    <div className="relative">
                      {newLevelSalary > 0 && (
                        <label className="absolute -top-2.5 left-3 bg-white dark:bg-slate-800 px-1 text-[10px] font-medium text-slate-500 z-10">
                          Salary
                        </label>
                      )}
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          placeholder={newLevelSalary > 0 ? "" : "Salary"}
                          value={newLevelSalary || ""}
                          onChange={(e) => setNewLevelSalary(parseInt(e.target.value) || 0)}
                          className="w-full px-3.5 py-2.5 text-xs font-bold bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200 pr-8"
                        />
                        <div className="absolute right-2 flex flex-col">
                          <button
                            type="button"
                            onClick={() => setNewLevelSalary((v) => v + 5)}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
                          >
                            <ChevronUp className="size-3 stroke-[2.5]" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setNewLevelSalary((v) => Math.max(0, v - 5))}
                            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5"
                          >
                            <ChevronDown className="size-3 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleCreateLevel}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* List of Levels */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs divide-y divide-slate-100 dark:divide-slate-700/60">
              {levelsList.map((item) => (
                <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 block">Level</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{item.level}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Salary Badge */}
                    <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs px-3 py-1 rounded-full">
                      {item.salary}
                    </span>

                    {/* Action Icons */}
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors">
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteLevel(item.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
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
