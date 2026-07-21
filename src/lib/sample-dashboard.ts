import type { DashboardStats, Graduate } from "./api";
import { MONTHS, type MonthPoint } from "./series";

// Stand-ins for endpoints that DO exist, used only when the API cannot be
// reached — right now the shared account returns 401. The page renders the
// Figma's numbers instead of an empty screen, and says so in a banner.
// ponytail: delete this file once there are working credentials.

export const sampleStats: DashboardStats = {
  studentsCount: 88,
  usersCount: 10,
  employeesCount: 15,
  groupsCount: 14,
  leadsCount: 96,
  graduatesCount: 215,
  employedGraduatesCount: 215,
  incomeThisMonth: 12580,
  debtorsCount: 12,
  totalDebt: 1398,
  attendance: { present: 60, absent: 24, late: 4 },
  groups: ["C++ May", "C# 2 August", "React", "Olympiad 4", "HTML June"].map(
    (name, i) => ({ id: `g${i}`, name, absent: 4, late: 2, income: 8250 }),
  ),
};

export const sampleGraduates: Graduate[] = [
  ["JavaScript", "Softclub"],
  ["React", "Alif bank"],
  ["HTML & CSS", "Humo"],
  ["UX/UI design", "Megafon"],
  ["Graf design", "Humo"],
].map(([groupName, workPlace], i) => ({
  id: `gr${i}`,
  studentName: "Huseinov Hasan",
  groupName,
  age: 18,
  dateOfIssue: "2023-01-11",
  workPlace,
}));

export const sampleLeads: MonthPoint[] = [
  62, 60, 84, 80, 108, 100, 96, 104, 118, 96, 88, 100,
].map((value, i) => ({ month: MONTHS[i], value }));

export const sampleEnroll: MonthPoint[] = [
  8, 11, 15, 19, 20, 26, 32, 34, 30, 28, 32, 36,
].map((value, i) => ({ month: MONTHS[i], value }));

export const sampleEnrollRows = [
  { id: "e1", name: "Ahmad Abdulsamad", course: "Javascript", phone: "93 800 22 74" },
  { id: "e2", name: "Tojiev Olimjon", course: "React", phone: "93 800 22 74" },
  { id: "e3", name: "Najibullo Shamsuddinov", course: "Olympiad", phone: "93 800 22 74" },
  { id: "e4", name: "Alijon Zabiri", course: "HTML & CSS", phone: "93 800 22 74" },
  { id: "e5", name: "Shodmon Inoyatzoda", course: "C# (.net)", phone: "93 800 22 74" },
  { id: "e6", name: "Nazarov Qurbonali", course: "UX/UI design", phone: "93 800 22 74" },
];

export const sampleIncomeDelta = -1200;
