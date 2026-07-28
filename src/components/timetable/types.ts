export type ViewMode = "day" | "week" | "month";

export interface ScheduleEvent {
  id: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  classroom: string;
  instructor: string;
  dayOfWeek: number; // 0: Mon, 1: Tue, 2: Wed, 3: Thu, 4: Fri, 5: Sat, 6: Sun
  dateDay: number; // e.g. 15, 19, 21
  dateStr: string; // e.g. "2023-02-15"
  category: "react" | "javascript" | "html" | "cpp" | "python" | "scratch" | "olympiad";
}

export function getEventCategoryStyle(category: ScheduleEvent["category"]): {
  bg: string;
  border: string;
  text: string;
  badgeBg: string;
  badgeText: string;
} {
  switch (category) {
    case "react":
    case "scratch":
    case "olympiad":
      return {
        bg: "bg-[#e0f2fe] dark:bg-sky-950/70",
        border: "border-[#38bdf8] dark:border-sky-600",
        text: "text-slate-900 dark:text-slate-100",
        badgeBg: "bg-white/80 dark:bg-sky-900/80",
        badgeText: "text-[#0284c7] dark:text-sky-300",
      };
    case "javascript":
      return {
        bg: "bg-[#fef3c7] dark:bg-amber-950/70",
        border: "border-[#f59e0b] dark:border-amber-600",
        text: "text-slate-900 dark:text-slate-100",
        badgeBg: "bg-white/80 dark:bg-amber-900/80",
        badgeText: "text-[#d97706] dark:text-amber-300",
      };
    case "html":
      return {
        bg: "bg-[#ffedd5] dark:bg-orange-950/70",
        border: "border-[#fb923c] dark:border-orange-600",
        text: "text-slate-900 dark:text-slate-100",
        badgeBg: "bg-white/80 dark:bg-orange-900/80",
        badgeText: "text-[#ea580c] dark:text-orange-300",
      };
    case "cpp":
      return {
        bg: "bg-[#f3e8ff] dark:bg-purple-950/70",
        border: "border-[#c084fc] dark:border-purple-600",
        text: "text-slate-900 dark:text-slate-100",
        badgeBg: "bg-white/80 dark:bg-purple-900/80",
        badgeText: "text-[#9333ea] dark:text-purple-300",
      };
    case "python":
      return {
        bg: "bg-[#dcfce7] dark:bg-emerald-950/70",
        border: "border-[#4ade80] dark:border-emerald-600",
        text: "text-slate-900 dark:text-slate-100",
        badgeBg: "bg-white/80 dark:bg-emerald-900/80",
        badgeText: "text-[#16a34a] dark:text-emerald-300",
      };
    default:
      return {
        bg: "bg-slate-100 dark:bg-slate-800",
        border: "border-slate-300 dark:border-slate-700",
        text: "text-slate-900 dark:text-slate-100",
        badgeBg: "bg-white dark:bg-slate-900",
        badgeText: "text-slate-700 dark:text-slate-300",
      };
  }
}

