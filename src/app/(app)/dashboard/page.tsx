"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, User } from "lucide-react";
import { NavIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import {
  dashboardApi,
  graduatesApi,
  groupsApi,
  leadsApi,
  paymentsApi,
  queryKeys,
  studentsApi,
} from "@/lib/api/resources";
import type {
  DashboardStatsDto,
  GraduateDto,
  ListParams,
  PagedResult,
  StudentDto,
} from "@/lib/api/types";
import {
  collectionRate,
  enrollSeries,
  incomeDelta,
  leadsSeries,
  type MonthPoint,
} from "@/lib/series";
import { AttendancePanel } from "./attendance-panel";
import { AttendanceCard, LeadsCard, LeftCoursesCard } from "./chart-cards";
import { EnrollCard, type EnrollRow } from "./enroll-card";
import { GraduatesCard } from "./graduates-card";
import { GroupsCard } from "./groups-card";
import { IncomeCard } from "./income-card";
import { Panel } from "../parts";

export default function DashboardPage() {
  const stats = useQuery({ queryKey: queryKeys.dashboard, queryFn: dashboardApi.stats });

  // Everything the stats endpoint does not cover. These fill in as they arrive
  // rather than holding up the whole page.
  const graduates = useList<GraduateDto>(graduatesApi, "Graduates", 5);
  // The six most recent, listed under the Enroll chart.
  const students = useList<StudentDto>(studentsApi, "Students", 20);
  const leads = useList(leadsApi, "Leads", 500);
  const payments = useList(paymentsApi, "Payments", 500);
  const groups = useList(groupsApi, "Groups", 200);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <DateField />
      </div>

      {stats.isError ? (
        <Panel className="p-6 text-sm text-destructive">
          Couldn&apos;t load dashboard data
          {stats.error instanceof Error ? `: ${stats.error.message}` : "."}
        </Panel>
      ) : stats.isPending ? (
        <LoadingSkeleton />
      ) : (
        <Widgets
          stats={stats.data}
          graduates={graduates}
          leads={leadsSeries(leads)}
          enroll={enrollSeries(groups)}
          enrollRows={students.slice(0, 6).map(toEnrollRow)}
          delta={incomeDelta(payments)}
        />
      )}
    </div>
  );
}

/** Every list endpoint shares one shape, so one hook covers all of them. */
function useList<T>(
  api: { list: (params: ListParams) => Promise<PagedResult<T>> },
  resource: string,
  pageSize: number,
) {
  const params = { pageSize };
  const query = useQuery({
    queryKey: queryKeys.list(resource, params),
    queryFn: () => api.list(params),
  });

  return query.data?.items ?? [];
}

function toEnrollRow(student: StudentDto): EnrollRow {
  return {
    id: student.id,
    name: student.fullName ?? "—",
    course: student.groups?.[0] ?? "—",
    phone: student.phoneNumber ?? "—",
  };
}

function Widgets({
  stats,
  graduates,
  leads,
  enroll,
  enrollRows,
  delta,
}: {
  stats: DashboardStatsDto;
  graduates: GraduateDto[];
  leads: MonthPoint[];
  enroll: MonthPoint[];
  enrollRows: EnrollRow[];
  delta: number | null;
}) {
  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-3">
            <Kpi
              value={stats.studentsCount}
              label="Students"
              icon={<NavIcon name="students" className="size-4" />}
            />
            <Kpi
              value={stats.usersCount}
              label="Users"
              icon={<User className="size-4" />}
            />
            <Kpi
              value={stats.employeesCount}
              label="Employees"
              icon={<NavIcon name="employees" className="size-4" />}
            />
          </div>

          <GroupsCard count={stats.groupsCount} groups={stats.groups ?? []} />
        </div>

        <AttendancePanel attendance={stats.attendance} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <LeadsCard data={leads} />
        <IncomeCard
          income={stats.incomeThisMonth}
          delta={delta}
          collected={collectionRate(stats)}
        />
      </div>

      <AttendanceCard />

      <div className="grid gap-5 lg:grid-cols-2">
        <EnrollCard data={enroll} rows={enrollRows} />
        <div className="space-y-5">
          <GraduatesCard count={stats.employedGraduatesCount} rows={graduates} />
          <LeftCoursesCard />
        </div>
      </div>
    </>
  );
}

function Kpi({
  value,
  label,
  icon,
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Panel className="px-4 py-5 text-center">
      <p className="text-4xl font-bold text-primary">{value}</p>
      <p className="mt-2 flex items-center justify-center gap-2 text-sm font-medium">
        {icon}
        {label}
      </p>
    </Panel>
  );
}

/**
 * ponytail: the native date input, styled to match the Figma — our own icon and
 * dd.mm.yyyy text on top, the real input invisible over it so the OS picker
 * still opens. No date-picker dependency.
 * Starts empty because no API endpoint accepts a date filter yet, and a
 * prefilled date would imply the page is filtered by it.
 */
function DateField() {
  const [date, setDate] = useState("");
  const input = useRef<HTMLInputElement>(null);

  return (
    <label
      onClick={() => input.current?.showPicker?.()}
      className="relative flex cursor-pointer items-center gap-3 rounded-xl border bg-card px-4 py-3 transition-colors hover:border-primary focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30"
    >
      <span className="absolute -top-2 left-3 bg-card px-1 text-xs text-muted-foreground">
        Date
      </span>

      <CalendarDays className="size-5 shrink-0 text-primary" />
      <span
        className={`min-w-24 text-base font-medium tabular-nums ${date ? "" : "text-muted-foreground"}`}
      >
        {date ? toDots(date) : "Select date"}
      </span>

      <input
        ref={input}
        type="date"
        value={date}
        aria-label="Date"
        onChange={(event) => setDate(event.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      />
    </label>
  );
}

function toDots(isoDate: string) {
  const [year, month, day] = isoDate.split("-");
  return `${day}.${month}.${year}`;
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {Array.from({ length: 4 }, (_, index) => (
        <Skeleton key={index} className="h-64 rounded-2xl" />
      ))}
    </div>
  );
}
