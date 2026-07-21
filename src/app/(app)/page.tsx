"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Banknote,
  GraduationCap,
  Layers,
  TriangleAlert,
  UserRound,
  Users,
} from "lucide-react";
import { dashboardApi, queryKeys } from "@/lib/api/resources";
import type { DashboardStatsDto } from "@/lib/api/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const numberFmt = new Intl.NumberFormat("en-US");
const money = (value: number) => `${numberFmt.format(Math.round(value))} c.`;

export default function DashboardPage() {
  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: dashboardApi.stats,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Dashboard
      </h1>

      {isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Couldn&apos;t load dashboard data
            {error instanceof Error ? `: ${error.message}` : "."}
          </CardContent>
        </Card>
      ) : isPending ? (
        <StatGridSkeleton />
      ) : (
        <StatsView data={data} />
      )}
    </div>
  );
}

function StatsView({ data }: { data: DashboardStatsDto }) {
  const tiles = [
    { label: "Students", value: numberFmt.format(data.studentsCount), icon: Users },
    { label: "Groups", value: numberFmt.format(data.groupsCount), icon: Layers },
    { label: "Employees", value: numberFmt.format(data.employeesCount), icon: UserRound },
    { label: "Leads", value: numberFmt.format(data.leadsCount), icon: UserRound },
    { label: "Graduates", value: numberFmt.format(data.graduatesCount), icon: GraduationCap },
    { label: "Income this month", value: money(data.incomeThisMonth), icon: Banknote },
    { label: "Debtors", value: numberFmt.format(data.debtorsCount), icon: TriangleAlert },
    { label: "Total debt", value: money(data.totalDebt), icon: TriangleAlert },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <StatTile key={tile.label} {...tile} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="p-5">
            <h2 className="mb-4 font-semibold">Attendance today</h2>
            <div className="grid grid-cols-3 gap-3 text-center">
              <AttendanceStat label="Present" value={data.attendance.present} tone="text-emerald-600 dark:text-emerald-400" />
              <AttendanceStat label="Late" value={data.attendance.late} tone="text-amber-600 dark:text-amber-400" />
              <AttendanceStat label="Absent" value={data.attendance.absent} tone="text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <h2 className="mb-4 font-semibold">Groups</h2>
            {data.groups && data.groups.length > 0 ? (
              <div className="divide-y divide-border">
                {data.groups.map((group) => (
                  <div
                    key={group.id}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <span className="font-medium">{group.name ?? "—"}</span>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Absent: {group.absent}</span>
                      <span>Late: {group.late}</span>
                      <span className="font-medium text-foreground">
                        {money(group.income)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No groups to show.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function AttendanceStat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="rounded-xl bg-muted/50 py-4">
      <p className={`text-2xl font-bold ${tone}`}>{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function StatGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="flex items-center gap-4 p-5">
            <Skeleton className="size-11 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-14" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
