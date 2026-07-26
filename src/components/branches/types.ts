export interface BranchGroup {
  id: string;
  name: string;
  startDate: string;
  scheduleDays: string;
  classTime: string;
}

export interface BranchItem {
  id: string;
  title: string;
  city: string;
  district: string;
  address: string;
  phone: string;
  groupsCount: number;
  studentsCount: number;
  status: "Active" | "Inactive";
  groupsList: BranchGroup[];
}

export interface ChartMonthData {
  month: string;
  Sadbarg: number;
  Profsous: number;
}

export const MOCK_BRANCH_GROUPS: BranchGroup[] = [
  {
    id: "g-1",
    name: "JavaScript 1",
    startDate: "Started: 15 oct 2022",
    scheduleDays: "Mn, Tu, Wd, Th, Fr, Sa",
    classTime: "18:00 - 20:00",
  },
  {
    id: "g-2",
    name: "C# 5",
    startDate: "Started: 15 oct 2022",
    scheduleDays: "Mn, Tu, Wd, Th, Fr, Sa",
    classTime: "16:00 - 18:00",
  },
  {
    id: "g-3",
    name: "React",
    startDate: "Started: 15 oct 2022",
    scheduleDays: "Mn, Tu, Wd, Th, Fr, Sa",
    classTime: "16:00 - 18:00",
  },
  {
    id: "g-4",
    name: "C++",
    startDate: "Started: 15 oct 2022",
    scheduleDays: "Mn, Tu, Wd, Th, Fr, Sa",
    classTime: "09:00 - 12:00",
  },
  {
    id: "g-5",
    name: "HTML & CSS",
    startDate: "Started: 15 oct 2022",
    scheduleDays: "Mn, Tu, Wd, Th, Fr, Sa",
    classTime: "09:00 - 12:00",
  },
  {
    id: "g-6",
    name: "Olympiad 1",
    startDate: "Started: 15 oct 2022",
    scheduleDays: "Mn, Tu, Wd, Th, Fr, Sa",
    classTime: "18:00 - 20:00",
  },
];

export const INITIAL_BRANCHES: BranchItem[] = [
  {
    id: "b-1",
    title: "Sadbarg",
    city: "Dushanbe",
    district: "Shohmansur",
    address: "Ayni street 46",
    phone: "93 435 4943",
    groupsCount: 6,
    studentsCount: 55,
    status: "Active",
    groupsList: MOCK_BRANCH_GROUPS,
  },
  {
    id: "b-2",
    title: "Profsous",
    city: "Dushanbe",
    district: "Shohmansur",
    address: "Ayni street 46",
    phone: "93 435 4944",
    groupsCount: 6,
    studentsCount: 55,
    status: "Active",
    groupsList: MOCK_BRANCH_GROUPS,
  },
];

export const MOCK_CHART_DATA: ChartMonthData[] = [
  { month: "Junuary", Sadbarg: 10, Profsous: 55 },
  { month: "February", Sadbarg: 45, Profsous: 20 },
  { month: "March", Sadbarg: 20, Profsous: 100 },
  { month: "April", Sadbarg: 110, Profsous: 75 },
  { month: "May", Sadbarg: 40, Profsous: 108 },
  { month: "June", Sadbarg: 180, Profsous: 50 },
  { month: "July", Sadbarg: 90, Profsous: 15 },
];
