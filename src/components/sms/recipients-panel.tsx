"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { RecipientTab, GroupRecipient, StudentRecipient, MentorRecipient, LeadRecipient, GraduateRecipient } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

export interface RecipientsPanelProps {
  students: StudentRecipient[];
  groups: GroupRecipient[];
  mentors: MentorRecipient[];
  leads: LeadRecipient[];
  graduates: GraduateRecipient[];
  isLoading: boolean;
  onSelectedChange: (ids: string[], targetType: string) => void;
}

export function RecipientsPanel({ students: initialStudents, groups: initialGroups, mentors: initialMentors, leads: initialLeads, graduates: initialGraduates, isLoading, onSelectedChange }: RecipientsPanelProps) {
  const [activeTab, setActiveTab] = useState<RecipientTab>("group");
  const [searchQuery, setSearchQuery] = useState("");

  const [groups, setGroups] = useState<GroupRecipient[]>(() =>
    initialGroups.map((g) => ({ ...g, expanded: false })),
  );
  const [students, setStudents] = useState<StudentRecipient[]>(initialStudents);
  const [mentors, setMentors] = useState<MentorRecipient[]>(initialMentors);
  const [leads, setLeads] = useState<LeadRecipient[]>(initialLeads);
  const [graduates, setGraduates] = useState<GraduateRecipient[]>(initialGraduates);

  const [openPhoneMenuId, setOpenPhoneMenuId] = useState<string | null>(null);

  useEffect(() => {
    setGroups(initialGroups.map((g) => ({ ...g, expanded: false })));
  }, [initialGroups]);

  useEffect(() => {
    setStudents(initialStudents);
  }, [initialStudents]);

  useEffect(() => {
    setMentors(initialMentors);
  }, [initialMentors]);

  useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  useEffect(() => {
    setGraduates(initialGraduates);
  }, [initialGraduates]);

  const getSelected = useCallback(() => {
    if (activeTab === "group") {
      const ids: string[] = [];
      groups.forEach((g) => {
        g.students.filter((s) => s.selected).forEach((s) => ids.push(s.id));
      });
      return { ids, targetType: "Group" };
    }
    if (activeTab === "students") {
      return { ids: students.filter((s) => s.selected).map((s) => s.id), targetType: "Students" };
    }
    if (activeTab === "mentors") {
      return { ids: mentors.filter((m) => m.selected).map((m) => m.id), targetType: "Mentors" };
    }
    if (activeTab === "leads") {
      return { ids: leads.filter((l) => l.selected).map((l) => l.id), targetType: "Leads" };
    }
    if (activeTab === "graduates") {
      return { ids: graduates.filter((g) => g.selected).map((g) => g.id), targetType: "Graduates" };
    }
    return { ids: [], targetType: "" };
  }, [activeTab, groups, students, mentors, leads, graduates]);

  const selectedInfo = getSelected();

  useEffect(() => {
    onSelectedChange(selectedInfo.ids, selectedInfo.targetType);
  }, [selectedInfo.ids, selectedInfo.targetType, onSelectedChange]);

  const selectedCount = selectedInfo.ids.length;

  const toggleGroupExpand = (groupId: string) => {
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, expanded: !g.expanded } : g)),
    );
  };

  const toggleGroupStudent = (groupId: string, studentId: string) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const updatedStudents = g.students.map((s) =>
          s.id === studentId ? { ...s, selected: !s.selected } : s,
        );
        const selCount = updatedStudents.filter((s) => s.selected).length;
        return { ...g, students: updatedStudents, selectedCount: selCount };
      }),
    );
  };

  const toggleGroupAll = (groupId: string, selectAll: boolean) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id !== groupId) return g;
        const updatedStudents = g.students.map((s) => ({ ...s, selected: selectAll }));
        return {
          ...g,
          students: updatedStudents,
          selectedCount: selectAll ? updatedStudents.length : 0,
        };
      }),
    );
  };

  const toggleStudentItem = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s)),
    );
  };

  const toggleMentorItem = (id: string) => {
    setMentors((prev) =>
      prev.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m)),
    );
  };

  const toggleLeadItem = (id: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, selected: !l.selected } : l)),
    );
  };

  const toggleGraduateItem = (id: string) => {
    setGraduates((prev) =>
      prev.map((g) => (g.id === id ? { ...g, selected: !g.selected } : g)),
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-card rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
        <Skeleton className="h-10 w-full rounded-xl" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-card rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="bg-slate-100/80 dark:bg-slate-800 p-1 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => setActiveTab("group")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "group"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Group
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "students"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab("mentors")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "mentors"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Mentors
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "leads"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Leads
          </button>
          <button
            onClick={() => setActiveTab("graduates")}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "graduates"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            Graduates
          </button>
        </div>
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 pr-1">
          Selected <span className="text-slate-800 dark:text-slate-200 font-extrabold">{selectedCount}</span>
        </span>
      </div>

      {activeTab !== "group" && (
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200"
            />
          </div>
          <button className="px-5 py-2.5 bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold tracking-wider rounded-xl transition-all">
            SEARCH
          </button>
        </div>
      )}

      {activeTab === "group" && (
        <div className="space-y-4">
          {groups.map((grp) => (
            <div
              key={grp.id}
              className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/20"
            >
              <div
                onClick={() => toggleGroupExpand(grp.id)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
              >
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                    {grp.name}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                    {grp.dateRange}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        grp.selectedCount >= 10
                          ? "bg-emerald-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {grp.selectedCount}/{grp.totalCount}
                    </span>
                    <span className="block text-[9px] font-semibold text-slate-400 mt-0.5">
                      students
                    </span>
                  </div>
                  {grp.expanded ? (
                    <ChevronUp className="size-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                  ) : (
                    <ChevronDown className="size-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                  )}
                </div>
              </div>

              {grp.expanded && (
                <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-3 px-3 w-10">
                            <input
                              type="checkbox"
                              checked={grp.selectedCount === grp.students.length && grp.students.length > 0}
                              onChange={(e) => toggleGroupAll(grp.id, e.target.checked)}
                              className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                          </th>
                          <th className="py-3 px-3">FULL NAME</th>
                          <th className="py-3 px-3 text-right">PHONE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-semibold">
                        {grp.students.map((st) => (
                          <tr
                            key={st.id}
                            className={`transition-colors ${
                              st.selected
                                ? "bg-indigo-50/70 dark:bg-indigo-950/40 text-slate-900 dark:text-slate-100"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/30 text-slate-700 dark:text-slate-300"
                            }`}
                          >
                            <td className="py-3 px-3">
                              <input
                                type="checkbox"
                                checked={st.selected}
                                onChange={() => toggleGroupStudent(grp.id, st.id)}
                                className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                              />
                            </td>
                            <td className="py-3 px-3 font-semibold">{st.name}</td>
                            <td className="py-3 px-3 text-right font-mono text-slate-500 dark:text-slate-400">
                              {st.selectedPhone}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === "students" && (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {students
            .filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((st) => (
              <div
                key={st.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  st.selected
                    ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800"
                    : "bg-white dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                    {st.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {st.name}
                      </h4>
                      {st.phones.length > 1 && (
                        <>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenPhoneMenuId(openPhoneMenuId === st.id ? null : st.id)
                              }
                              className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-colors"
                            >
                              <span>{st.selectedPhone}</span>
                              <ChevronDown className="size-3" />
                            </button>
                            {openPhoneMenuId === st.id && (
                              <div className="absolute top-full left-0 mt-1 z-30 bg-white dark:bg-slate-800 rounded-xl p-2 shadow-xl border border-slate-200 dark:border-slate-700 min-w-[140px] space-y-1">
                                {st.phones.map((p, idx) => (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      setStudents((prev) =>
                                        prev.map((item) =>
                                          item.id === st.id
                                            ? { ...item, selectedPhone: p.number }
                                            : item,
                                        ),
                                      );
                                      setOpenPhoneMenuId(null);
                                    }}
                                    className="w-full text-left p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-[11px] space-y-0.5"
                                  >
                                    <span className="block text-[10px] text-slate-400 font-semibold">
                                      {p.type}
                                    </span>
                                    <span className="block font-mono font-bold text-slate-800 dark:text-slate-200">
                                      {p.number}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                      {st.course || "\u00A0"}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={st.selected}
                  onChange={() => toggleStudentItem(st.id)}
                  className="size-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            ))}
        </div>
      )}

      {activeTab === "mentors" && (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {mentors
            .filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((m) => (
              <div
                key={m.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  m.selected
                    ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800"
                    : "bg-white dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {m.name}
                      </h4>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {m.selectedPhone}
                      </span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                      Level:{" "}
                      <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                        {m.level || "—"}
                      </span>
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={m.selected}
                  onChange={() => toggleMentorItem(m.id)}
                  className="size-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            ))}
        </div>
      )}

      {activeTab === "leads" && (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {leads
            .filter((l) => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((l) => (
              <div
                key={l.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  l.selected
                    ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800"
                    : "bg-white dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                    {l.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {l.name}
                      </h4>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {l.selectedPhone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {l.course || (l.month || "")}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span
                        className={`text-[11px] font-bold ${
                          l.status === "Lead"
                            ? "text-orange-500 dark:text-orange-400"
                            : "text-indigo-600 dark:text-indigo-400"
                        }`}
                      >
                        {l.status}
                      </span>
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={l.selected}
                  onChange={() => toggleLeadItem(l.id)}
                  className="size-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            ))}
        </div>
      )}

      {activeTab === "graduates" && (
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {graduates
            .filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .map((g) => (
              <div
                key={g.id}
                className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  g.selected
                    ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800"
                    : "bg-white dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                    {g.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {g.name}
                      </h4>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {g.selectedPhone}
                      </span>
                      {g.age && (
                        <>
                          <span className="text-slate-300 dark:text-slate-600">|</span>
                          <span className="text-[11px] font-medium text-slate-400">{g.age}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] font-semibold">
                      <span
                        className={
                          g.careerTag.includes("Freelancer")
                            ? "text-purple-600 dark:text-purple-400 font-bold"
                            : g.careerTag.includes("FurtherEducation")
                            ? "text-orange-500 dark:text-orange-400 font-bold"
                            : g.careerTag.includes("OpenToWork")
                            ? "text-blue-600 dark:text-blue-400 font-bold"
                            : g.careerTag.includes("Work")
                            ? "text-emerald-600 dark:text-emerald-400 font-bold"
                            : "text-amber-600 dark:text-amber-400 font-bold"
                        }
                      >
                        {g.careerTag}
                      </span>
                      {g.company && (
                        <>
                          <span className="text-slate-300 dark:text-slate-600">•</span>
                          <span className="text-slate-500 dark:text-slate-400">{g.company}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={g.selected}
                  onChange={() => toggleGraduateItem(g.id)}
                  className="size-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
