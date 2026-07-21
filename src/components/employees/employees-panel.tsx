"use client";

import { useState } from "react";
import Link from "next/link";
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

export interface Employee {
  id: number;
  fullName: string;
  phone: string;
  age: string;
  roles: Array<"Admin" | "Manager" | "Developer" | "Mentor">;
  status: "Active" | "Inactive";
  avatarUrl?: string;
  experience?: string;
  accountStatus?: "Registered" | "No have";
  birthDate?: string;
  address?: string;
  email?: string;
  telegram?: string;
  mentorLevel?: string;
  mentorHourRate?: string;
}

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 1,
    fullName: "Sulaymonov Nurullo",
    phone: "93 258 4147",
    age: "23 year",
    roles: ["Admin"],
    status: "Active",
    experience: "3 year",
    accountStatus: "Registered",
    birthDate: "23.08.1995",
    address: "-",
    email: "example@gmail.com",
    telegram: "@sulaymonov",
  },
  {
    id: 2,
    fullName: "Begimadov Masafi",
    phone: "93 258 4147",
    age: "23 year",
    roles: ["Admin"],
    status: "Active",
    experience: "3 year",
    accountStatus: "Registered",
    birthDate: "23.08.1995",
    address: "-",
    email: "example@gmail.com",
    telegram: "@masafi",
  },
  {
    id: 3,
    fullName: "Kabirov Zoirjon",
    phone: "93 258 4147",
    age: "23 year",
    roles: ["Admin", "Manager"],
    status: "Inactive",
    experience: "2 year",
    accountStatus: "No have",
    birthDate: "15.04.1998",
    address: "-",
    email: "zoirjon@gmail.com",
    telegram: "@zoirjon",
  },
  {
    id: 4,
    fullName: "Ashurzoda Kurbonali",
    phone: "93 258 4147",
    age: "23 year",
    roles: ["Manager"],
    status: "Active",
    experience: "4 year",
    accountStatus: "Registered",
    birthDate: "10.11.1996",
    address: "-",
    email: "ashurzoda@gmail.com",
    telegram: "@kurbonali",
  },
  {
    id: 5,
    fullName: "Soliev Salohiddin",
    phone: "93 258 4147",
    age: "23 year",
    roles: ["Manager"],
    status: "Active",
    experience: "5 year",
    accountStatus: "No have",
    birthDate: "23.08.1995",
    address: "-",
    email: "soliev@gmail.com",
    telegram: "@salohiddin",
  },
  {
    id: 6,
    fullName: "Rahimova Parinoz",
    phone: "93 258 4147",
    age: "23 year",
    roles: ["Manager"],
    status: "Inactive",
    experience: "1 year",
    accountStatus: "No have",
    birthDate: "05.02.2001",
    address: "-",
    email: "parinoz@gmail.com",
    telegram: "@parinoz",
  },
  {
    id: 7,
    fullName: "Abdulsamad Ahmad",
    phone: "93 435 4943",
    age: "23 year",
    roles: ["Developer"],
    status: "Active",
    experience: "1 year",
    accountStatus: "No have",
    birthDate: "23.08.1995",
    address: "-",
    email: "example@gmail.com",
    telegram: "@abdulsamad",
    mentorLevel: "Middle 2",
    mentorHourRate: "35 som",
  },
  {
    id: 8,
    fullName: "Tojiev Olimjon",
    phone: "93 258 4147",
    age: "23 year",
    roles: ["Developer"],
    status: "Inactive",
    experience: "2 year",
    accountStatus: "Registered",
    birthDate: "12.06.1997",
    address: "-",
    email: "tojiev@gmail.com",
    telegram: "@olimjon",
  },
  {
    id: 9,
    fullName: "Shamsuddinov Najibullo",
    phone: "93 258 4147",
    age: "23 year",
    roles: ["Developer", "Mentor"],
    status: "Active",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    experience: "2 year",
    accountStatus: "Registered",
    birthDate: "23.08.1995",
    address: "-",
    email: "example@gmail.com",
    telegram: "@najibullo",
    mentorLevel: "Middle 2",
    mentorHourRate: "35 som",
  },
  {
    id: 10,
    fullName: "Inoyatzoda Shodmon",
    phone: "93 258 4147",
    age: "23 year",
    roles: ["Developer"],
    status: "Active",
    experience: "2 year",
    accountStatus: "Registered",
    birthDate: "19.09.1999",
    address: "-",
    email: "shodmon@gmail.com",
    telegram: "@shodmon",
  },
  {
    id: 11,
    fullName: "Zabiri Alijon",
    phone: "93 258 4147",
    age: "23 year",
    roles: ["Developer", "Mentor"],
    status: "Active",
    experience: "3 year",
    accountStatus: "Registered",
    birthDate: "01.01.1996",
    address: "-",
    email: "alijon@gmail.com",
    telegram: "@alijon",
    mentorLevel: "Middle 1",
    mentorHourRate: "30 som",
  },
];

const INITIAL_POSITIONS = ["Developer", "Manager", "Mentor", "Director"];

export function EmployeesPanel() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [positions, setPositions] = useState<string[]>(INITIAL_POSITIONS);

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [positionFilter, setPositionFilter] = useState("All positions");
  const [statusFilter, setStatusFilter] = useState("All status");

  // Drawers
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isPositionDrawerOpen, setIsPositionDrawerOpen] = useState(false);

  // Expandable form inside Position Drawer
  const [isAddPositionExpanded, setIsAddPositionExpanded] = useState(false);
  const [newPositionName, setNewPositionName] = useState("");

  // Modals
  const [editingPosition, setEditingPosition] = useState<string | null>(null);
  const [editingPositionValue, setEditingPositionValue] = useState("");
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  // Mentor level inline edit inside Detail Drawer
  const [isMentorLevelEditing, setIsMentorLevelEditing] = useState(false);
  const [selectedMentorLevelOption, setSelectedMentorLevelOption] = useState("Middle 2 - 35 som");

  // Handlers
  const handleOpenDetail = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsDetailDrawerOpen(true);
    setIsMentorLevelEditing(false);
  };

  const handleCreatePosition = () => {
    if (newPositionName.trim() && !positions.includes(newPositionName.trim())) {
      setPositions([...positions, newPositionName.trim()]);
      setNewPositionName("");
      setIsAddPositionExpanded(false);
    }
  };

  const handleSavePositionEdit = () => {
    if (editingPosition && editingPositionValue.trim()) {
      setPositions(positions.map((p) => (p === editingPosition ? editingPositionValue.trim() : p)));
      setEditingPosition(null);
    }
  };

  const handleDeletePosition = (pos: string) => {
    setPositions(positions.filter((p) => p !== pos));
  };

  const handleConfirmDeleteEmployee = () => {
    if (deletingEmployee) {
      setEmployees(employees.filter((emp) => emp.id !== deletingEmployee.id));
      if (selectedEmployee?.id === deletingEmployee.id) {
        setIsDetailDrawerOpen(false);
        setSelectedEmployee(null);
      }
      setDeletingEmployee(null);
    }
  };

  // Filter logic
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.fullName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPosition =
      positionFilter === "All positions" || emp.roles.some((r) => r === positionFilter);
    const matchesStatus = statusFilter === "All status" || emp.status === statusFilter;
    return matchesSearch && matchesPosition && matchesStatus;
  });

  return (
    <div className="w-full bg-white dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-5 sm:p-7 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-6 font-sans relative">
      {/* 1. Main Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Employees
        </h1>

        {/* Header Right Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* < > Position Button */}
          <button
            onClick={() => setIsPositionDrawerOpen(true)}
            className="border border-indigo-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Code className="size-4 stroke-[2.5]" />
            <span>Position</span>
          </button>

          {/* ⭐ Mentor levels Button */}
          <Link
            href="/employees/mentor-levels"
            className="border border-indigo-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Star className="size-4 fill-indigo-400 text-indigo-500" />
            <span>Mentor levels</span>
          </Link>

          {/* + Add new Button */}
          <Link
            href="/employees/new"
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="size-4 stroke-[3]" />
            <span>Add new</span>
          </Link>
        </div>
      </div>

      {/* 2. Filters & View Toggles Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-1">
        {/* Inputs Group */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1 max-w-3xl">
          {/* Search Input */}
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

          {/* Position Dropdown */}
          <div className="relative flex items-center">
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8 cursor-pointer"
            >
              <option value="All positions">All positions</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Developer">Developer</option>
              <option value="Mentor">Mentor</option>
            </select>
            <ChevronDown className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative flex items-center">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 dark:text-slate-200 pr-8 cursor-pointer"
            >
              <option value="All status">All status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="absolute right-3 size-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* View Toggle Group */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/60 dark:border-slate-800 self-end lg:self-auto">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs"
                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>

      {/* 3. Grid View / List View Content */}
      {viewMode === "grid" ? (
        /* Grid View (image_c690d5.png) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {filteredEmployees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => handleOpenDetail(emp)}
              className="bg-white dark:bg-slate-800/80 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-500/50 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-4 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-tight">
                    {emp.fullName}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                    {emp.phone} | {emp.age}
                  </p>
                </div>
                {/* Circular Avatar */}
                <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                  {emp.avatarUrl ? (
                    <img src={emp.avatarUrl} alt={emp.fullName} className="size-full object-cover" />
                  ) : (
                    <UserCheck className="size-5" />
                  )}
                </div>
              </div>

              {/* Bottom Row: Role Badges & Edit Button */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/40">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {emp.roles.map((role) => (
                    <span
                      key={role}
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        role === "Admin"
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400"
                          : role === "Manager"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400"
                          : role === "Developer"
                          ? "bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400"
                          : "bg-amber-100/70 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                      }`}
                    >
                      {role}
                    </span>
                  ))}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenDetail(emp);
                  }}
                  className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <Edit2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View (image_c693c0.png) */
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
                  onClick={() => handleOpenDetail(emp)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 cursor-pointer transition-colors"
                >
                  {/* FULL NAME */}
                  <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900 dark:text-slate-100">
                    {emp.fullName}
                  </td>

                  {/* POSITION BADGES */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {emp.roles.map((role) => (
                        <span
                          key={role}
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                            role === "Admin"
                              ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400"
                              : role === "Manager"
                              ? "bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400"
                              : role === "Developer"
                              ? "bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400"
                              : "bg-amber-100/70 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                          }`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* PHONE */}
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono text-xs">
                    {emp.phone}
                  </td>

                  {/* STATUS */}
                  <td className="py-3.5 px-4">
                    {emp.status === "Active" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-500 dark:bg-rose-950/80 dark:text-rose-400">
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(emp);
                        }}
                        className="p-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletingEmployee(emp);
                        }}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors"
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
      )}

      {/* 4. Employee Detail Drawer (image_c69761.png & image_c6979b.png) */}
      {isDetailDrawerOpen && selectedEmployee && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end transition-opacity duration-300"
          onClick={() => setIsDetailDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md sm:max-w-xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full p-6 sm:p-7 shadow-2xl overflow-y-auto space-y-5 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
              <button
                onClick={() => setIsDetailDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="size-5" />
              </button>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                Employer
              </h2>
            </div>

            {/* Profile Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {selectedEmployee.fullName}
                </h3>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedEmployee.roles.map((r) => (
                    <span
                      key={r}
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        r === "Admin"
                          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400"
                          : r === "Manager"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400"
                          : r === "Developer"
                          ? "bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400"
                          : "bg-amber-100/70 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                      }`}
                    >
                      {r}
                    </span>
                  ))}
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <span>Status:</span>
                  <span className={selectedEmployee.status === "Active" ? "text-emerald-500 font-bold" : "text-rose-500 font-bold"}>
                    {selectedEmployee.status}
                  </span>
                </div>
              </div>

              {/* Avatar Circle */}
              <div className="size-16 sm:size-20 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-400 overflow-hidden shrink-0 shadow-sm border-2 border-white dark:border-slate-800">
                {selectedEmployee.avatarUrl ? (
                  <img src={selectedEmployee.avatarUrl} alt={selectedEmployee.fullName} className="size-full object-cover" />
                ) : (
                  <UserCheck className="size-8" />
                )}
              </div>
            </div>

            {/* Action Buttons (Row of 3) */}
            <div className="grid grid-cols-3 gap-3">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs">
                <Edit2 className="size-3.5" />
                <span>Edit</span>
              </button>
              <button className="border border-indigo-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all">
                <Lock className="size-3.5" />
                <span>Block</span>
              </button>
              <button
                onClick={() => setDeletingEmployee(selectedEmployee)}
                className="border border-rose-400 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <Trash2 className="size-3.5" />
                <span>Delete</span>
              </button>
            </div>

            {/* Details Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Experience:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedEmployee.experience || "1 year"}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Account:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedEmployee.accountStatus || "No have"}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Birth date:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {selectedEmployee.birthDate || "23.08.1995"}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Phone:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {selectedEmployee.phone}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span>Address:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {selectedEmployee.address || "-"}
                </span>
              </div>

              {/* Email & Telegram Pills */}
              <div className="flex items-center gap-2 pt-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                  <Mail className="size-3.5" />
                  <span>{selectedEmployee.email || "example@gmail.com"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400">
                  <Send className="size-3.5" />
                  <span>Telegram</span>
                </span>
              </div>
            </div>

            {/* Account Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
                <Shield className="size-4 text-indigo-600" />
                <span>Account</span>
              </div>
              {selectedEmployee.accountStatus === "Registered" ? (
                <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
                  <Lock className="size-3.5" />
                  <span>Reset password</span>
                </button>
              ) : (
                <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all">
                  <Plus className="size-3.5 stroke-[3]" />
                  <span>Invite</span>
                </button>
              )}
            </div>

            {/* Mentor Level Card (if Mentor or Developer) */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 block">
                    Mentor level
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                      {selectedEmployee.mentorLevel || "Middle 2"}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      hour: <span className="text-emerald-500 font-bold">{selectedEmployee.mentorHourRate || "35 som"}</span>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setIsMentorLevelEditing(!isMentorLevelEditing)}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
                >
                  <Edit2 className="size-3.5" />
                  <span>Change</span>
                </button>
              </div>

              {/* Inline Change Mentor Level Form */}
              {isMentorLevelEditing && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-3 animate-in fade-in duration-200">
                  <div className="relative flex-1">
                    <label className="absolute -top-2.5 left-3 bg-white dark:bg-slate-800 px-1 text-[10px] font-medium text-slate-500 z-10">
                      Change level
                    </label>
                    <select
                      value={selectedMentorLevelOption}
                      onChange={(e) => setSelectedMentorLevelOption(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200 appearance-none pr-8 cursor-pointer"
                    >
                      <option value="Junior 1 - 20 som">Junior 1 - 20 som</option>
                      <option value="Junior 2 - 25 som">Junior 2 - 25 som</option>
                      <option value="Middle 1 - 30 som">Middle 1 - 30 som</option>
                      <option value="Middle 2 - 35 som">Middle 2 - 35 som</option>
                      <option value="Senior 1 - 45 som">Senior 1 - 45 som</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 size-4 text-slate-400 pointer-events-none" />
                  </div>

                  <button
                    onClick={() => {
                      const [lvl, rate] = selectedMentorLevelOption.split(" - ");
                      setSelectedEmployee({
                        ...selectedEmployee,
                        mentorLevel: lvl,
                        mentorHourRate: rate,
                      });
                      setIsMentorLevelEditing(false);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs shrink-0"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {/* Groups Section (image_c69761.png) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                  Groups
                </h3>
                <button className="p-1 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors">
                  <Plus className="size-4 stroke-[2.5]" />
                </button>
              </div>

              {/* Class Cards */}
              <div className="space-y-3">
                {/* JavaScript August */}
                <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                        <span>JavaScript August</span>
                        <ChevronRight className="size-3.5 text-slate-400" />
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                        Aug 11, 2023 - Oct 10, 2023
                      </span>
                    </div>

                    <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all">
                      <BookOpen className="size-3.5" />
                      <span>Journal</span>
                    </button>
                  </div>

                  {/* Horizontal Scrollable Stats */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-center">
                    <div className="border border-amber-200 bg-amber-50/60 dark:bg-amber-950/40 rounded-xl p-2 min-w-[56px] shrink-0">
                      <div className="font-extrabold text-amber-700 dark:text-amber-400 text-xs">80</div>
                      <div className="text-[9px] font-semibold text-amber-600 dark:text-amber-500">Week 1</div>
                    </div>
                    <div className="border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl p-2 min-w-[56px] shrink-0">
                      <div className="font-extrabold text-emerald-700 dark:text-emerald-400 text-xs">95</div>
                      <div className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-500">Week 2</div>
                    </div>
                    <div className="border border-amber-200 bg-amber-50/60 dark:bg-amber-950/40 rounded-xl p-2 min-w-[56px] shrink-0">
                      <div className="font-extrabold text-amber-700 dark:text-amber-400 text-xs">85</div>
                      <div className="text-[9px] font-semibold text-amber-600 dark:text-amber-500">Week 3</div>
                    </div>
                    <div className="border border-rose-200 bg-rose-50/60 dark:bg-rose-950/40 rounded-xl p-2 min-w-[56px] shrink-0">
                      <div className="font-extrabold text-rose-700 dark:text-rose-400 text-xs">24</div>
                      <div className="text-[9px] font-semibold text-rose-600 dark:text-rose-500">Week 4</div>
                    </div>
                    <div className="border border-amber-200 bg-amber-50/60 dark:bg-amber-950/40 rounded-xl p-2 min-w-[56px] shrink-0">
                      <div className="font-extrabold text-amber-700 dark:text-amber-400 text-xs">85</div>
                      <div className="text-[9px] font-semibold text-amber-600 dark:text-amber-500">Week 5</div>
                    </div>
                    <div className="border border-slate-200 bg-slate-100 dark:bg-slate-700 rounded-xl p-2 min-w-[56px] shrink-0">
                      <div className="font-extrabold text-slate-800 dark:text-slate-100 text-xs">95</div>
                      <div className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">Average</div>
                    </div>
                  </div>
                </div>

                {/* C++ #2 May */}
                <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                        <span>C++ #2 May</span>
                        <ChevronRight className="size-3.5 text-slate-400" />
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                        May 9, 2023 - Aug 10, 2023
                      </span>
                    </div>

                    <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all">
                      <BookOpen className="size-3.5" />
                      <span>Journal</span>
                    </button>
                  </div>

                  {/* Horizontal Scrollable Stats */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none text-center">
                    <div className="border border-amber-200 bg-amber-50/60 dark:bg-amber-950/40 rounded-xl p-2 min-w-[56px] shrink-0">
                      <div className="font-extrabold text-amber-700 dark:text-amber-400 text-xs">80</div>
                      <div className="text-[9px] font-semibold text-amber-600 dark:text-amber-500">Week 1</div>
                    </div>
                    <div className="border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl p-2 min-w-[56px] shrink-0">
                      <div className="font-extrabold text-emerald-700 dark:text-emerald-400 text-xs">95</div>
                      <div className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-500">Week 2</div>
                    </div>
                    <div className="border border-amber-200 bg-amber-50/60 dark:bg-amber-950/40 rounded-xl p-2 min-w-[56px] shrink-0">
                      <div className="font-extrabold text-amber-700 dark:text-amber-400 text-xs">85</div>
                      <div className="text-[9px] font-semibold text-amber-600 dark:text-amber-500">Week 3</div>
                    </div>
                    <div className="border border-rose-200 bg-rose-50/60 dark:bg-rose-950/40 rounded-xl p-2 min-w-[56px] shrink-0">
                      <div className="font-extrabold text-rose-700 dark:text-rose-400 text-xs">24</div>
                      <div className="text-[9px] font-semibold text-rose-600 dark:text-rose-500">Week 4</div>
                    </div>
                    <div className="border border-slate-200 bg-slate-100 dark:bg-slate-700 rounded-xl p-2 min-w-[56px] shrink-0">
                      <div className="font-extrabold text-slate-800 dark:text-slate-100 text-xs">95</div>
                      <div className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">Average</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Position Drawer (image_c6981e.png & image_c6983f.png) */}
      {isPositionDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end transition-opacity duration-300"
          onClick={() => setIsPositionDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full p-6 sm:p-7 shadow-2xl overflow-y-auto space-y-5 animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800">
              <button
                onClick={() => setIsPositionDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="size-5" />
              </button>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100">
                Dev position
              </h2>
            </div>

            {/* Expandable Add New Block */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3 transition-all">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Add new
                </span>
                <button
                  onClick={() => setIsAddPositionExpanded(!isAddPositionExpanded)}
                  className={`p-1.5 rounded-xl transition-all ${
                    isAddPositionExpanded
                      ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                      : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 hover:bg-indigo-100"
                  }`}
                >
                  {isAddPositionExpanded ? <X className="size-4" /> : <Plus className="size-4 stroke-[3]" />}
                </button>
              </div>

              {isAddPositionExpanded && (
                <div className="space-y-3 pt-2 animate-in fade-in duration-200">
                  <input
                    type="text"
                    placeholder="Position"
                    value={newPositionName}
                    onChange={(e) => setNewPositionName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleCreatePosition}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                    >
                      Create
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* List of Positions */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs divide-y divide-slate-100 dark:divide-slate-700/60">
              {positions.map((pos) => (
                <div key={pos} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 block">Position</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{pos}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingPosition(pos);
                        setEditingPositionValue(pos);
                      }}
                      className="p-1.5 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Edit2 className="size-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePosition(pos)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. Position Edit Modal (image_c6983f.png bottom) */}
      {editingPosition && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setEditingPosition(null)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Edit</h3>
              <button
                onClick={() => setEditingPosition(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white dark:bg-slate-800 px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10">
                Position
              </label>
              <input
                type="text"
                value={editingPositionValue}
                onChange={(e) => setEditingPositionValue(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setEditingPosition(null)}
                className="border border-slate-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold text-xs px-4 py-2 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePositionEdit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2 rounded-xl transition-all shadow-xs"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Delete Confirmation Modal (image_c69385.png) */}
      {deletingEmployee && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 transition-opacity duration-300"
          onClick={() => setDeletingEmployee(null)}
        >
          <div
            className="w-full max-w-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-2xl p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base leading-snug max-w-[240px]">
                Do you really want to delete employer?
              </h3>
              <button
                onClick={() => setDeletingEmployee(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={handleConfirmDeleteEmployee}
                className="border border-rose-400 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
              >
                Yes, delete
              </button>
              <button
                onClick={() => setDeletingEmployee(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
