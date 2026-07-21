"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, TriangleAlert, User } from "lucide-react";
import { NavIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getGraduates,
  getGroups,
  getLeads,
  getPayments,
  getStats,
  getStudents,
  type DashboardStats,
  type Graduate,
  type Student,
} from "@/lib/api";
import {
  sampleEnroll,
  sampleEnrollRows,
  sampleGraduates,
  sampleIncomeDelta,
  sampleLeads,
  sampleStats,
} from "@/lib/sample-dashboard";
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

type DashboardData = {
  stats: DashboardStats;
  graduates: Graduate[];
  leads: MonthPoint[];
  enroll: MonthPoint[];
  enrollRows: EnrollRow[];
  delta: number | null;
};

export default function DashboardPage() {
  const { data, isSample, retry } = useDashboard();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <DateField />
      </div>

      {isSample && <SampleNotice onRetry={retry} />}
      {data ? <Widgets data={data} /> : <LoadingSkeleton />}
    </div>
  );
}

/**
 * Loads every endpoint the dashboard has, in parallel. If the API is
 * unreachable — right now the shared account is dead — it falls back to sample
 * data so the page still renders, and says so.
 */
function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [stats, graduates, leads, students, payments, groups] = await Promise.all([
          getStats(),
          getGraduates(),
          getLeads(),
          getStudents(),
          getPayments(),
          getGroups(),
        ]);
        if (cancelled) return;

        setData({
          stats,
          graduates,
          leads: leadsSeries(leads),
          enroll: enrollSeries(groups),
          enrollRows: students.map(toEnrollRow),
          delta: incomeDelta(payments),
        });
        setIsSample(false);
      } catch {
        if (cancelled) return;

        setData({
          stats: sampleStats,
          graduates: sampleGraduates,
          leads: sampleLeads,
          enroll: sampleEnroll,
          enrollRows: sampleEnrollRows,
          delta: sampleIncomeDelta,
        });
        setIsSample(true);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  function retry() {
    setAttempt(attempt + 1);
  }

  return { data, isSample, retry };
}

function toEnrollRow(student: Student): EnrollRow {
  return {
    id: student.id,
    name: student.fullName ?? "—",
    course: student.groups?.[0] ?? "—",
    phone: student.phoneNumber ?? "—",
  };
}

function Widgets({ data }: { data: DashboardData }) {
  const { stats, graduates, leads, enroll, enrollRows, delta } = data;

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

/** Nobody should mistake the sample numbers below for real ones. */
function SampleNotice({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-600">
      <TriangleAlert className="size-4 shrink-0" />
      <span className="flex-1">
        Showing sample data — could not sign in to the API. Check the credentials
        in <code>.env.local</code>.
      </span>
      <Button size="sm" variant="outline" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
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
