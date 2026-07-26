export type RecipientTab = "group" | "students" | "mentors" | "leads" | "graduates";

export interface PhoneOption {
  type: "Student" | "Father" | "Mother";
  number: string;
}

export interface StudentRecipient {
  id: string;
  name: string;
  course: string;
  age: string;
  phones: PhoneOption[];
  selectedPhone: string;
  selected: boolean;
}

export interface GroupRecipient {
  id: string;
  name: string;
  dateRange: string;
  selectedCount: number;
  totalCount: number;
  students: StudentRecipient[];
  expanded?: boolean;
}

export interface MentorRecipient {
  id: string;
  name: string;
  level: string;
  age: string;
  phones: PhoneOption[];
  selectedPhone: string;
  selected: boolean;
}

export interface LeadRecipient {
  id: string;
  name: string;
  course: string;
  status: "Lead" | "Client";
  month: string;
  phones: PhoneOption[];
  selectedPhone: string;
  selected: boolean;
}

export interface GraduateRecipient {
  id: string;
  name: string;
  careerTag: string; // e.g. "#Freelancer", "#FurtherEducation", "#OpenToWork", "#Work", "Enterepneur"
  company: string;
  age: string;
  phones: PhoneOption[];
  selectedPhone: string;
  selected: boolean;
}

export interface SmsTemplate {
  id: string;
  title: string;
  description: string;
}

export interface SmsHistoryItem {
  id: string;
  title: string;
  date: string;
  description: string;
  groups: string[];
  recipients: string[];
}

export const INITIAL_TEMPLATES: SmsTemplate[] = [
  {
    id: "tpl-1",
    title: "Open day",
    description: "Dear students, you are invited to our Open Day event this Saturday at 14:00. Join us for live demos!",
  },
  {
    id: "tpl-2",
    title: "Changed the payment",
    description: "Hello friends! We would like to inform you that today is the last day to pay tuition fees for January. Please pay on time.",
  },
  {
    id: "tpl-3",
    title: "Qarzdoron",
    description: "Hello dear students! We would like to inform you that today is the last day to pay tuition fees for January. Please pay on time.",
  },
  {
    id: "tpl-4",
    title: "Warning",
    description: "Important notice: Please ensure all project assignments are submitted before the end of this week.",
  },
  {
    id: "tpl-5",
    title: "Congratulation!",
    description: "Congratulations on successfully completing your course module! Keep up the great work.",
  },
];

export const INITIAL_HISTORY: SmsHistoryItem[] = [
  {
    id: "hist-1",
    title: "Open day",
    date: "21.05.2024",
    description: "Dear students, you are invited to our Open Day event this Saturday at 14:00.",
    groups: ["C# 5 - Apr 9, 2023 - Aug 10, 2023"],
    recipients: ["Tojiev Olimjon", "Shodmon Inoyatzoda"],
  },
  {
    id: "hist-2",
    title: "Qarzdoron",
    date: "21.05.2024",
    description: "Hello dear students! We would like to inform you that today is the last day to pay tuition fees for January. Please pay on time.",
    groups: ["C# 5 - Apr 9, 2023 - Aug 10, 2023", "React - 4 - Apr 9, 2023 - Aug 10, 2023"],
    recipients: ["Tojiev Olimjon", "Shodmon Inoyatzoda", "Alijon Zabiri", "Faridun Dodarov"],
  },
  {
    id: "hist-3",
    title: "Changed the payment",
    date: "21.05.2024",
    description: "Hello friends! We would like to inform you that today is the last day to pay tuition fees for January.",
    groups: ["React - 4 - Apr 9, 2023 - Aug 10, 2023"],
    recipients: ["Najibullo Shamsuddinov", "Alijon Zabiri"],
  },
  {
    id: "hist-4",
    title: "Warning",
    date: "21.05.2024",
    description: "Important notice: Please ensure all project assignments are submitted before the end of this week.",
    groups: ["C# 5 - Apr 9, 2023 - Aug 10, 2023"],
    recipients: ["Tojiev Olimjon", "Nazarov Qurbonali"],
  },
  {
    id: "hist-5",
    title: "Congratulation!",
    date: "21.05.2024",
    description: "Congratulations on successfully completing your course module!",
    groups: ["Olympiad 2 - Apr 9, 2023 - Aug 10, 2023"],
    recipients: ["Muhammadjon Mirzoev", "Ahmad Abdulsamad"],
  },
];

export const MOCK_STUDENTS: StudentRecipient[] = [
  {
    id: "s-1",
    name: "Ahmad Abdulsamad",
    course: "JavaScript August",
    age: "23 year",
    phones: [
      { type: "Student", number: "93 800 22 74" },
      { type: "Father", number: "93 540 01 01" },
      { type: "Mother", number: "88 888 14 14" },
    ],
    selectedPhone: "93 800 22 74",
    selected: false,
  },
  {
    id: "s-2",
    name: "Tojiev Olimjon",
    course: "JavaScript August",
    age: "23 year",
    phones: [
      { type: "Student", number: "932584147" },
      { type: "Father", number: "935400101" },
      { type: "Mother", number: "888881414" },
    ],
    selectedPhone: "932584147",
    selected: true,
  },
  {
    id: "s-3",
    name: "Najibullo Shamsuddinov",
    course: "JavaScript August",
    age: "23 year",
    phones: [
      { type: "Student", number: "93 800 22 74" },
      { type: "Father", number: "93 540 01 01" },
      { type: "Mother", number: "88 888 14 14" },
    ],
    selectedPhone: "93 800 22 74",
    selected: false,
  },
  {
    id: "s-4",
    name: "Shodmon Inoyatzoda",
    course: "JavaScript August",
    age: "23 year",
    phones: [
      { type: "Student", number: "93 800 22 74" },
      { type: "Father", number: "93 540 01 01" },
      { type: "Mother", number: "88 888 14 14" },
    ],
    selectedPhone: "93 800 22 74",
    selected: true,
  },
  {
    id: "s-5",
    name: "Alijon Zabiri",
    course: "JavaScript August",
    age: "23 year",
    phones: [
      { type: "Student", number: "93 800 22 74" },
      { type: "Father", number: "93 540 01 01" },
      { type: "Mother", number: "88 888 14 14" },
    ],
    selectedPhone: "93 800 22 74",
    selected: true,
  },
  {
    id: "s-6",
    name: "Faridun Dodarov",
    course: "JavaScript August",
    age: "23 year",
    phones: [
      { type: "Student", number: "93 800 22 74" },
      { type: "Father", number: "93 540 01 01" },
      { type: "Mother", number: "88 888 14 14" },
    ],
    selectedPhone: "93 800 22 74",
    selected: true,
  },
  {
    id: "s-7",
    name: "Nazarov Qurbonali",
    course: "JavaScript August",
    age: "23 year",
    phones: [
      { type: "Student", number: "93 800 22 74" },
      { type: "Father", number: "93 540 01 01" },
      { type: "Mother", number: "88 888 14 14" },
    ],
    selectedPhone: "93 800 22 74",
    selected: false,
  },
  {
    id: "s-8",
    name: "Muhammadjon Mirzoev",
    course: "JavaScript August",
    age: "23 year",
    phones: [
      { type: "Student", number: "93 800 22 74" },
      { type: "Father", number: "93 540 01 01" },
      { type: "Mother", number: "88 888 14 14" },
    ],
    selectedPhone: "93 800 22 74",
    selected: false,
  },
];

export const MOCK_GROUPS: GroupRecipient[] = [
  {
    id: "grp-1",
    name: "C# 5",
    dateRange: "Apr 9, 2023 - Aug 10, 2023",
    selectedCount: 7,
    totalCount: 15,
    expanded: true,
    students: MOCK_STUDENTS,
  },
  {
    id: "grp-2",
    name: "React - 4",
    dateRange: "Apr 9, 2023 - Aug 10, 2023",
    selectedCount: 4,
    totalCount: 7,
    expanded: false,
    students: MOCK_STUDENTS.slice(0, 7),
  },
  {
    id: "grp-3",
    name: "C# 5",
    dateRange: "Apr 9, 2023 - Aug 10, 2023",
    selectedCount: 7,
    totalCount: 15,
    expanded: false,
    students: MOCK_STUDENTS,
  },
  {
    id: "grp-4",
    name: "Olympiad 2",
    dateRange: "Apr 9, 2023 - Aug 10, 2023",
    selectedCount: 14,
    totalCount: 15,
    expanded: false,
    students: MOCK_STUDENTS,
  },
  {
    id: "grp-5",
    name: "C# 1",
    dateRange: "Apr 9, 2023 - Aug 10, 2023",
    selectedCount: 7,
    totalCount: 15,
    expanded: false,
    students: MOCK_STUDENTS,
  },
];

export const MOCK_MENTORS: MentorRecipient[] = [
  {
    id: "m-1",
    name: "Alijon Zabirov",
    level: "Middle 2",
    age: "23 year",
    phones: [
      { type: "Student", number: "932584147" },
      { type: "Father", number: "935400101" },
    ],
    selectedPhone: "932584147",
    selected: false,
  },
  {
    id: "m-2",
    name: "Alijon Zabirov",
    level: "Middle 2",
    age: "23 year",
    phones: [
      { type: "Student", number: "932584147" },
      { type: "Father", number: "935400101" },
    ],
    selectedPhone: "932584147",
    selected: true,
  },
  {
    id: "m-3",
    name: "Alijon Zabirov",
    level: "Middle 2",
    age: "23 year",
    phones: [
      { type: "Student", number: "932584147" },
      { type: "Father", number: "935400101" },
    ],
    selectedPhone: "932584147",
    selected: true,
  },
  {
    id: "m-4",
    name: "Alijon Zabirov",
    level: "Middle 2",
    age: "23 year",
    phones: [
      { type: "Student", number: "932584147" },
      { type: "Father", number: "935400101" },
    ],
    selectedPhone: "932584147",
    selected: false,
  },
  {
    id: "m-5",
    name: "Alijon Zabirov",
    level: "Middle 2",
    age: "23 year",
    phones: [
      { type: "Student", number: "932584147" },
      { type: "Father", number: "935400101" },
    ],
    selectedPhone: "932584147",
    selected: true,
  },
];

export const MOCK_LEADS: LeadRecipient[] = [
  {
    id: "ld-1",
    name: "Tojiev Olimjon",
    course: "JavaScript August",
    status: "Lead",
    month: "March",
    phones: [{ type: "Student", number: "932584147" }],
    selectedPhone: "932584147",
    selected: false,
  },
  {
    id: "ld-2",
    name: "Tojiev Olimjon",
    course: "JavaScript August",
    status: "Client",
    month: "March",
    phones: [{ type: "Student", number: "932584147" }],
    selectedPhone: "932584147",
    selected: true,
  },
  {
    id: "ld-3",
    name: "Tojiev Olimjon",
    course: "JavaScript August",
    status: "Client",
    month: "March",
    phones: [{ type: "Student", number: "932584147" }],
    selectedPhone: "932584147",
    selected: true,
  },
  {
    id: "ld-4",
    name: "Tojiev Olimjon",
    course: "JavaScript August",
    status: "Lead",
    month: "March",
    phones: [{ type: "Student", number: "932584147" }],
    selectedPhone: "932584147",
    selected: false,
  },
  {
    id: "ld-5",
    name: "Tojiev Olimjon",
    course: "JavaScript August",
    status: "Client",
    month: "March",
    phones: [{ type: "Student", number: "932584147" }],
    selectedPhone: "932584147",
    selected: true,
  },
];

export const MOCK_GRADUATES: GraduateRecipient[] = [
  {
    id: "g-1",
    name: "Tojiev Olimjon",
    careerTag: "Enterepneur",
    company: "Alif bank",
    age: "23 year",
    phones: [{ type: "Student", number: "932584147" }],
    selectedPhone: "932584147",
    selected: false,
  },
  {
    id: "g-2",
    name: "Tojiev Olimjon",
    careerTag: "#Freelancer",
    company: "Alif bank",
    age: "23 year",
    phones: [{ type: "Student", number: "932584147" }],
    selectedPhone: "932584147",
    selected: true,
  },
  {
    id: "g-3",
    name: "Tojiev Olimjon",
    careerTag: "#FurtherEducation",
    company: "Alif bank",
    age: "23 year",
    phones: [{ type: "Student", number: "932584147" }],
    selectedPhone: "932584147",
    selected: true,
  },
  {
    id: "g-4",
    name: "Tojiev Olimjon",
    careerTag: "Enterepneur",
    company: "Alif bank",
    age: "23 year",
    phones: [{ type: "Student", number: "932584147" }],
    selectedPhone: "932584147",
    selected: false,
  },
  {
    id: "g-5",
    name: "Tojiev Olimjon",
    careerTag: "#OpenToWork",
    company: "Alif bank",
    age: "23 year",
    phones: [{ type: "Student", number: "932584147" }],
    selectedPhone: "932584147",
    selected: true,
  },
];
