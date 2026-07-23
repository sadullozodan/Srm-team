import type { IconName } from "@/components/icons";

export type NavChild = { label: string; href: string };
export type NavItem = {
  label: string;
  icon: IconName;
  href?: string;
  children?: NavChild[];
};

// Mirrors the OMUZ reference sidebar exactly, top to bottom.
export const NAV: NavItem[] = [
  { label: "Dashboard", icon: "home", href: "/dashboard" },
  {
    label: "Students",
    icon: "students",
    children: [
      { label: "All students", href: "/students" },
      { label: "Graduates", href: "/students/graduates" },
      { label: "Left courses", href: "/students/left-courses" },
    ],
  },
  { label: "Groups", icon: "groups", href: "/groups" },
  { label: "Employees", icon: "employees", href: "/employees" },
  { label: "Progressbook", icon: "progressbook", href: "/progressbook" },
  { label: "Timetable", icon: "timetable", href: "/timetable" },
  {
    label: "Courses",
    icon: "courses",
    children: [
      { label: "All courses", href: "/courses" },
      { label: "Clients", href: "/courses/clients" },
    ],
  },
  {
    label: "Administration",
    icon: "administration",
    children: [
      { label: "Users", href: "/administration/users" },
      { label: "Permission", href: "/administration/permission" },
      { label: "Logs", href: "/administration/logs" },
    ],
  },
  {
    label: "Accounting",
    icon: "accounting",
    children: [
      { label: "Overview", href: "/accounting" },
      { label: "Budget", href: "/accounting/budget" },
      { label: "Salary", href: "/accounting/salary" },
      { label: "Avans", href: "/accounting/avans" },
    ],
  },
  { label: "Branches", icon: "branches", href: "/branches" },
  { label: "Jobs", icon: "jobs", href: "/jobs" },
  { label: "SMS mailings", icon: "sms", href: "/sms" },
];

// Resolve the display title for a pathname from the nav config.
export function titleForPath(pathname: string): string {
  for (const item of NAV) {
    if (item.href === pathname) return item.label;
    for (const child of item.children ?? []) {
      if (child.href === pathname) return child.label;
    }
  }
  const seg = pathname.split("/").filter(Boolean).pop();
  if (!seg) return "Dashboard";
  return seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, " ");
}
