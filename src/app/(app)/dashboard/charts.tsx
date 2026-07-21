"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { DayPoint, LeftCoursesPoint, MonthPoint } from "@/lib/series";

const axis = { tickLine: false, axisLine: false, tickMargin: 8 } as const;
const grid = { vertical: false, strokeDasharray: "0" } as const;

// A soft top-to-bottom fill under each area, as in the Figma.
function Fade({ id, color }: { id: string; color: string }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={color} stopOpacity={0.45} />
      <stop offset="100%" stopColor={color} stopOpacity={0.02} />
    </linearGradient>
  );
}

const leadsConfig = {
  value: { label: "Leads", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function LeadsChart({ data }: { data: MonthPoint[] }) {
  return (
    <ChartContainer config={leadsConfig} className="aspect-auto h-55 w-full">
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <defs>
          <Fade id="fill-leads" color="var(--color-value)" />
        </defs>
        <CartesianGrid {...grid} />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} ticks={[0, 60, 80, 100, 120, 150]} domain={[0, 150]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="value"
          type="natural"
          stroke="var(--color-value)"
          strokeWidth={3}
          fill="url(#fill-leads)"
        />
      </AreaChart>
    </ChartContainer>
  );
}

const attendanceConfig = {
  late: { label: "Late", color: "#22c55e" },
  absent: { label: "Absent", color: "#ef4444" },
} satisfies ChartConfig;

export function AttendanceChart({ data }: { data: DayPoint[] }) {
  return (
    <ChartContainer config={attendanceConfig} className="aspect-auto h-65 w-full">
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <defs>
          <Fade id="fill-late" color="var(--color-late)" />
          <Fade id="fill-absent" color="var(--color-absent)" />
        </defs>
        <CartesianGrid {...grid} />
        <XAxis dataKey="day" {...axis} interval={0} />
        <YAxis {...axis} ticks={[0, 10, 20, 30, 40, 50]} domain={[0, 50]} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <Area
          dataKey="late"
          type="natural"
          stroke="var(--color-late)"
          strokeWidth={3}
          fill="url(#fill-late)"
        />
        <Area
          dataKey="absent"
          type="natural"
          stroke="var(--color-absent)"
          strokeWidth={3}
          fill="url(#fill-absent)"
        />
      </AreaChart>
    </ChartContainer>
  );
}

const enrollConfig = {
  value: { label: "Enrolled", color: "var(--chart-1)" },
} satisfies ChartConfig;

export function EnrollChart({ data }: { data: MonthPoint[] }) {
  return (
    <ChartContainer config={enrollConfig} className="aspect-auto h-55 w-full">
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fill-enroll" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.85} />
            <stop offset="100%" stopColor="var(--color-value)" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid {...grid} />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} ticks={[0, 10, 20, 30, 40, 50]} domain={[0, 50]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="value"
          type="natural"
          stroke="var(--color-value)"
          strokeWidth={3}
          fill="url(#fill-enroll)"
        />
      </AreaChart>
    </ChartContainer>
  );
}

const leftConfig = {
  left: { label: "Left courses", color: "#38bdf8" },
  returned: { label: "Returned", color: "#0ea5e9" },
} satisfies ChartConfig;

export function LeftCoursesChart({ data }: { data: LeftCoursesPoint[] }) {
  return (
    <ChartContainer config={leftConfig} className="aspect-auto h-50 w-full">
      <BarChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <Bar dataKey="left" fill="var(--color-left)" radius={[6, 6, 0, 0]} maxBarSize={14} />
        <Bar dataKey="returned" fill="var(--color-returned)" radius={[6, 6, 0, 0]} maxBarSize={14} />
      </BarChart>
    </ChartContainer>
  );
}
