"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dashboardApi, queryKeys } from "@/lib/api/resources";
import { attendanceSeries, leftCoursesSeries, type MonthPoint } from "@/lib/series";
import { AttendanceChart, LeadsChart, LeftCoursesChart } from "./charts";
import { CardTitle, Panel, Stepper, useMonthPicker } from "../parts";

export function LeadsCard({ data }: { data: MonthPoint[] }) {
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <CardTitle>Leads</CardTitle>
        <Stepper label={`${year} y`} onStep={(delta) => setYear(year + delta)} />
      </div>
      <div className="mt-4">
        <LeadsChart data={data} />
      </div>
    </Panel>
  );
}

export function AttendanceCard() {
  const { year, month, label, step } = useMonthPicker();

  // The stepper actually filters here — this endpoint takes year and month.
  const { data } = useQuery({
    queryKey: queryKeys.dashboardAttendance(year, month + 1),
    queryFn: () => dashboardApi.attendance(year, month + 1),
  });

  return (
    <Panel className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <CardTitle>Attendance</CardTitle>
          <LegendDot color="#22c55e" label="Late" />
          <LegendDot color="#ef4444" label="Absent" />
        </div>
        <Stepper label={label} onStep={step} />
      </div>
      <div className="mt-4">
        <AttendanceChart data={attendanceSeries(data ?? [], year, month)} />
      </div>
    </Panel>
  );
}

export function LeftCoursesCard() {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data } = useQuery({
    queryKey: queryKeys.dashboardLeftCourses(year),
    queryFn: () => dashboardApi.leftCourses(year),
  });

  return (
    <Panel className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <CardTitle>Left courses</CardTitle>
        <div className="flex items-center gap-2">
          <Stepper label={`${year} y`} onStep={(delta) => setYear(year + delta)} />
          <Button variant="outline" className="gap-2 rounded-xl" render={<Link href="/students/left-courses" />}>
            <ListFilter className="size-4" />
            Show list
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <LeftCoursesChart data={leftCoursesSeries(data ?? [])} />
      </div>
    </Panel>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2 text-sm">
      <span className="size-3 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
