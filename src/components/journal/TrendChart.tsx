"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { cn } from "@/lib/utils";
import { ChartDataPoint } from "@/lib/types";
import { STUDENTS, SERIES_COLORS } from "@/lib/mockData";

interface TrendChartProps {
  data: ChartDataPoint[];
}

const tickStyle = { fontSize: 12, fill: "#9ca3af" };

function AverageTick({ x, y, payload }: any) {
  const isAverage = payload.value === "Average";
  return (
    <text
      x={x}
      y={y + 4}
      textAnchor="middle"
      className={cn(isAverage ? "fill-brand font-medium" : "fill-gray-400 dark:fill-gray-500")}
      fontSize={12}
    >
      {payload.value}
    </text>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg dark:border-white/10 dark:bg-surface-dark">
      <p className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
      <div className="space-y-1">
        {payload.map((entry: any, i: number) => {
          const student = STUDENTS.find((s) => s.id === entry.dataKey);
          const color = entry.color;
          return (
            <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
              <span
                className="inline-block size-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>{student?.name ?? entry.dataKey}</span>
              <span className="ml-auto font-medium">{entry.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <div className="rounded-2xl border border-dashed border-indigo-200 bg-surface p-5 dark:border-white/5 dark:bg-surface-dark">
      <h3 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Exam graphics
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-white/5" />
          <XAxis
            dataKey="week"
            tick={<AverageTick />}
            axisLine={false}
            tickLine={false}
            padding={{ left: 20, right: 20 }}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 70, 80, 100]}
            tick={tickStyle}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />

          {STUDENTS.map((s, i) => (
            <Line
              key={s.id}
              type="monotone"
              dataKey={s.id}
              stroke={SERIES_COLORS[i % SERIES_COLORS.length]}
              strokeWidth={2}
              dot={{ r: 4, fill: SERIES_COLORS[i % SERIES_COLORS.length] }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-4 flex flex-wrap gap-4">
        {STUDENTS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1.5">
            <span
              className="inline-block size-2 rounded-full"
              style={{ backgroundColor: SERIES_COLORS[i % SERIES_COLORS.length] }}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400">{s.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
