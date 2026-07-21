"use client";

import { useState } from "react";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MonthPoint } from "@/lib/series";
import { AttendanceChart, LeadsChart, LeftCoursesChart } from "./charts";
import { CardTitle, Panel, Stepper, useMonthStepper } from "../parts";

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
  const { monthName, step } = useMonthStepper(1);

  return (
    <Panel className="p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-4">
          <CardTitle>Attendance</CardTitle>
          <LegendDot color="#22c55e" label="Late" />
          <LegendDot color="#ef4444" label="Absent" />
        </div>
        <Stepper label={`${monthName} 2024`} onStep={step} />
      </div>
      <div className="mt-4">
        <AttendanceChart />
      </div>
    </Panel>
  );
}

export function LeftCoursesCard() {
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <CardTitle>Left courses</CardTitle>
        <Button variant="outline" className="gap-2 rounded-xl">
          <ListFilter className="size-4" />
          Show list
        </Button>
      </div>
      <div className="mt-4">
        <LeftCoursesChart />
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
