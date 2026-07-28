"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Code,
  Star,
  Plus,
  Search,
  LayoutGrid,
  List,
  Edit2,
  Trash2,
  X,
  Lock,
  Mail,
  Send,
  Shield,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  BookOpen,
  UserCheck,
} from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import { employeesApi, positionsApi, queryKeys } from "@/lib/api/resources";
import type { EmployeeDto } from "@/lib/api/types";

const POSITIONS = ["All positions", "Admin", "Manager", "Developer", "Mentor"];

function roleColor(role: string) {
  switch (role) {
    case "Admin": return "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400";
    case "Manager": return "bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400";
    case "Developer": return "bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400";
    default: return "bg-amber-100/70 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300";
  }
}

export function EmployeesPanel() {
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Employees", { pageSize: 500 }),
    queryFn: () => employeesApi.list({ pageSize: 500 }),
  });
  const employees = data?.items ?? [];

  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Employees"] }),
  });

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("All positions");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDto | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<EmployeeDto | null>(null);
  const [isMentorLevelEditing, setIsMentorLevelEditing] = useState(false);
  const [selectedMentorLevelOption, setSelectedMentorLevelOption] = useState("Middle 2 - 35 som");

  const filteredEmployees = useMemo(() => employees.filter((emp) => {
    const name = emp.fullName ?? "";
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition = positionFilter === "All positions" || (emp.positions ?? []).some((r) => r === positionFilter);
    const matchesStatus = statusFilter === "All status" || emp.status === statusFilter;
    return matchesSearch && matchesPosition && matchesStatus;
  }), [employees, searchQuery, positionFilter, statusFilter]);

  function handleDelete() {
    if (deletingEmployee) {
      deleteMutation.mutate(deletingEmployee.id);
      if (selectedEmployee?.id === deletingEmployee.id) {
        setIsDetailDrawerOpen(false);
        setSelectedEmployee(null);
      }
      setDeletingEmployee(null);
    }
  }

  return (
    <div className="w-full bg-white dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-6 font-sans relative">
      {/* 1. Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Employees
        </h1>
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/employees/mentor-levels"
            className="border border-indigo-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Star className="size-4 fill-indigo-400 text-indigo-500" />
            <span>Mentor levels</span>
          </Link>
          <Link
            href="/employees/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="size-4 stroke-[3]" />
            <span>Add new</span>
          </Link>
        </div>
      </div>

      {/* 2. Filters & View Toggles */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-3xl">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search by name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200"
            />
            <Search className="absolute left-3 size-4 text-slate-400 pointer-events-none" />
          </div>
          <CustomSelect label="Position" value={positionFilter} onChange={setPositionFilter} options={POSITIONS} className="w-full" />
          <CustomSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={["All status", "Active", "Inactive"]} className="w-full" />
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800 self-end lg:self-auto">
          <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}>
            <LayoutGrid className="size-4" />
          </button>
          <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs" : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"}`}>
            <List className="size-4" />
          </button>
        </div>
      </div>

      {/* 3. Content */}
      {isPending ? (
        <div className="text-center py-10 text-sm text-slate-400">Loading...</div>
      ) : isError ? (
        <div className="text-center py-10 text-sm text-destructive">Couldn&apos;t load employees.</div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => { setSelectedEmployee(emp); setIsDetailDrawerOpen(true); setIsMentorLevelEditing(false); }}
              className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-500/50 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-4 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-tight">{emp.fullName}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{emp.phoneNumber ?? "—"} | {emp.experience ?? 0} year</p>
                </div>
                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                  {emp.photoUrl ? <img src={emp.photoUrl} alt={emp.fullName ?? ""} className="size-full object-cover" /> : <UserCheck className="size-5" />}
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/40">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(emp.positions ?? []).map((role) => (
                    <span key={role} className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${roleColor(role)}`}>{role}</span>
                  ))}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedEmployee(emp); setIsDetailDrawerOpen(true); setIsMentorLevelEditing(false); }}
                  className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Edit2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredEmployees.length === 0 && <p className="col-span-full py-10 text-center text-sm text-muted-foreground">No employees found.</p>}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left border-collapse min-w-[750px]">
            <thead>
              <tr className="bg-slate-100/70 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">FULL NAME</th>
                <th className="py-3.5 px-4">POSITION</th>
                <th className="py-3.5 px-4">PHONE</th>
                <th className="py-3.5 px-4">STATUS</th>
                <th className="py-3.5 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs sm:text-sm font-medium">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  onClick={() => { setSelectedEmployee(emp); setIsDetailDrawerOpen(true); setIsMentorLevelEditing(false); }}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-slate-100">{emp.fullName}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(emp.positions ?? []).map((role) => (
                        <span key={role} className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${roleColor(role)}`}>{role}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-xs">{emp.phoneNumber ?? "—"}</td>
                  <td className="py-3.5 px-4">
                    {emp.status === "Active" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">Active</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-500 dark:bg-rose-950/80 dark:text-rose-400">Inactive</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setSelectedEmployee(emp); setIsDetailDrawerOpen(true); setIsMentorLevelEditing(false); }} className="p-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors">
                        <Edit2 className="size-4" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setDeletingEmployee(emp); }} className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && <tr className="hover:bg-transparent"><td colSpan={5} className="py-10 text-center text-muted-foreground">No employees found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. Detail Drawer */}
      {isDetailDrawerOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end transition-opacity duration-300" onClick={() => setIsDetailDrawerOpen(false)}>
          <div className="w-full max-w-md sm:max-w-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full p-6 sm:p-7 shadow-2xl overflow-y-auto space-y-5 animate-in slide-in-from-right duration-300" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
              <button onClick={() => setIsDetailDrawerOpen(false)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                <X className="size-5" />
              </button>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">Employer</h2>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">{selectedEmployee.fullName}</h3>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(selectedEmployee.positions ?? []).map((r) => (
                    <span key={r} className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${roleColor(r)}`}>{r}</span>
                  ))}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span>Status:</span>
                  <span className={selectedEmployee.status === "Active" ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>{selectedEmployee.status}</span>
                </div>
              </div>
              <div className="size-16 sm:size-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 overflow-hidden shrink-0 shadow-sm border-2 border-white dark:border-slate-800">
                {selectedEmployee.photoUrl ? <img src={selectedEmployee.photoUrl} alt={selectedEmployee.fullName ?? ""} className="size-full object-cover" /> : <UserCheck className="size-8" />}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Link href={`/employees/${selectedEmployee.id}/edit`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs">
                <Edit2 className="size-3.5" />
                <span>Edit</span>
              </Link>
              <button className="border border-indigo-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all">
                <Lock className="size-3.5" />
                <span>Block</span>
              </button>
              <button onClick={() => setDeletingEmployee(selectedEmployee)} className="border border-rose-400 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all">
                <Trash2 className="size-3.5" />
                <span>Delete</span>
              </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Experience:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedEmployee.experience ?? 0} year</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Birth date:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{selectedEmployee.birthDate ? new Date(selectedEmployee.birthDate).toLocaleDateString() : "—"}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Phone:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{selectedEmployee.phoneNumber ?? "—"}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Address:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedEmployee.address ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                  <Mail className="size-3.5" />
                  <span>{selectedEmployee.email ?? "—"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                  <Send className="size-3.5" />
                  <span>Telegram</span>
                </span>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
                <Shield className="size-4 text-indigo-600" />
                <span>Account</span>
              </div>
              <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
                <Plus className="size-3.5 stroke-[3]" />
                <span>Invite</span>
              </button>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">Mentor level</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">—</span>
                    <span className="text-xs font-semibold text-slate-500">hour: <span className="text-emerald-500 font-bold">—</span></span>
                  </div>
                </div>
                <button onClick={() => setIsMentorLevelEditing(!isMentorLevelEditing)} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline">
                  <Edit2 className="size-3.5" />
                  <span>Change</span>
                </button>
              </div>
              {isMentorLevelEditing && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-in fade-in duration-200">
                  <CustomSelect label="Change level" value={selectedMentorLevelOption} onChange={setSelectedMentorLevelOption} options={["Junior 1 - 20 som", "Junior 2 - 25 som", "Middle 1 - 30 som", "Middle 2 - 35 som", "Senior 1 - 45 som"]} className="flex-1" />
                  <button onClick={() => setIsMentorLevelEditing(false)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs shrink-0">Save</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Delete Confirmation */}
      {deletingEmployee && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-300" onClick={() => setDeletingEmployee(null)}>
          <div className="w-full max-w-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug max-w-[240px]">Do you really want to delete employer?</h3>
              <button onClick={() => setDeletingEmployee(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"><X className="size-4" /></button>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={handleDelete} className="border border-rose-400 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs px-4 py-2.5 rounded-xl transition-all">Yes, delete</button>
              <button onClick={() => setDeletingEmployee(null)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
