import type {
  DailyAttendanceDto,
  DashboardStatsDto,
  GroupDto,
  LeadDto,
  LeftCoursesPointDto,
  PaymentDto,
} from "./api/types";

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type MonthPoint = { month: string; value: number };

const emptyYear = (): MonthPoint[] => MONTHS.map((month) => ({ month, value: 0 }));

/**
 * `LeadDto.registerMonth` is a free-text string, so it arrives as anything from
 * "2024-06-01" to "June" to "Jun". Returns 0-11, or null if it is unreadable.
 */
export function monthIndex(value: string | null | undefined): number | null {
  if (!value) return null;

  // yyyy-MM… read straight off the string: Date would shift it by timezone.
  const iso = value.match(/^(\d{4})-(\d{2})/);
  if (iso) return Number(iso[2]) - 1;

  const parsed = new Date(value);
  if (!isNaN(parsed.getTime())) return parsed.getMonth();

  const prefix = value.trim().slice(0, 3).toLowerCase();
  const found = MONTHS.findIndex((month) => month.toLowerCase() === prefix);
  return found === -1 ? null : found;
}

/** Leads per month, from GET /api/Leads. */
export function leadsSeries(leads: LeadDto[]): MonthPoint[] {
  const year = emptyYear();

  for (const lead of leads) {
    const index = monthIndex(lead.registerMonth);
    if (index !== null) year[index].value++;
  }

  return year;
}

/**
 * Students enrolled per month, from GET /api/Groups — a group's enrolledCount
 * counted in the month the group starts.
 * ponytail: the closest real signal available. EnrollmentDto has no enrolled-at
 * date, so a true per-enrollment series needs the backend (see BACKEND-GAPS.md).
 */
export function enrollSeries(groups: GroupDto[]): MonthPoint[] {
  const year = emptyYear();

  for (const group of groups) {
    const index = monthIndex(group.startDate);
    if (index !== null) year[index].value += group.enrolledCount;
  }

  return year;
}

/** Percent change in money collected, this month against last. */
export function incomeDelta(payments: PaymentDto[], today = new Date()): number | null {
  const totalFor = (year: number, month: number) =>
    payments
      .filter((payment) => {
        const date = new Date(payment.date);
        return date.getFullYear() === year && date.getMonth() === month;
      })
      .reduce((total, payment) => total + payment.paid, 0);

  const thisMonth = totalFor(today.getFullYear(), today.getMonth());

  const previous = new Date(today.getFullYear(), today.getMonth() - 1);
  const lastMonth = totalFor(previous.getFullYear(), previous.getMonth());

  if (lastMonth === 0) return null; // no baseline — a percentage would be a lie
  return Math.round(((thisMonth - lastMonth) / lastMonth) * 100);
}

export type DayPoint = { day: string; late: number; absent: number };

/**
 * Late/absent per day, from GET /api/Dashboard/attendance. The API only returns
 * days that have records, so the month is laid out in full and missing days
 * read zero — a quiet month is a flat line, not a short chart.
 */
export function attendanceSeries(
  points: DailyAttendanceDto[],
  year: number,
  month: number,
): DayPoint[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const byDay = new Map(points.map((point) => [point.day, point]));

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const point = byDay.get(day);

    return {
      day: String(day).padStart(2, "0"),
      late: point?.late ?? 0,
      absent: point?.absent ?? 0,
    };
  });
}

export type LeftCoursesPoint = { month: string; left: number; returned: number };

/**
 * Students who left or came back, per month, from GET /api/Dashboard/left-courses.
 * Same treatment as the attendance series: the year is laid out in full so a
 * month with no departures reads zero instead of being missing from the axis.
 */
export function leftCoursesSeries(points: LeftCoursesPointDto[]): LeftCoursesPoint[] {
  const byMonth = new Map(points.map((point) => [point.month, point]));

  return MONTHS.map((month, index) => {
    const point = byMonth.get(index + 1);
    return {
      month,
      left: point?.left ?? 0,
      returned: point?.returned ?? 0,
    };
  });
}

/** Share of billable money actually collected: income vs income + debt. */
export function collectionRate(stats: DashboardStatsDto): number {
  const billed = stats.incomeThisMonth + stats.totalDebt;
  if (billed === 0) return 0;
  return Math.round((stats.incomeThisMonth / billed) * 100);
}
