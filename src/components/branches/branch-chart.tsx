"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ChartMonthData, MOCK_CHART_DATA } from "./types";

export interface CustomTooltipPayloadItem {
  dataKey?: string | number;
  name?: string;
  value?: number;
  color?: string;
}

export interface CustomTooltipProps {
  active?: boolean;
  payload?: CustomTooltipPayloadItem[];
  label?: string;
}

const BranchCustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const sadbargVal = payload.find((i) => i.dataKey === "Sadbarg")?.value;
    const profsousVal = payload.find((i) => i.dataKey === "Profsous")?.value;

    return (
      <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl p-3 shadow-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-2 min-w-[140px] z-20">
        <p className="font-bold text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700/60 pb-1">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#06b6d4]" />
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Sadbarg - {sadbargVal ?? 0}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#eab308]" />
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            Profsous - {profsousVal ?? 0}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

export interface BranchChartProps {
  data?: ChartMonthData[];
}

export function BranchChart({ data = MOCK_CHART_DATA }: BranchChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full bg-white dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center gap-6 text-xs font-bold text-slate-700 dark:text-slate-200">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#06b6d4]" />
          <span>Sadbarg</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#eab308]" />
          <span>Profsous</span>
        </div>
      </div>

      <div className="w-full h-[280px]">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e2e8f0"
                className="dark:stroke-slate-800"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                dy={8}
              />
              <YAxis
                domain={[0, 200]}
                ticks={[0, 50, 100, 200]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <Tooltip
                content={<BranchCustomTooltip />}
                cursor={{ stroke: "#94a3b8", strokeDasharray: "3 3" }}
              />
              <Line
                type="monotone"
                dataKey="Sadbarg"
                name="Sadbarg"
                stroke="#06b6d4"
                strokeWidth={3.5}
                dot={false}
                activeDot={{ r: 6, fill: "#06b6d4", stroke: "#ffffff", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="Profsous"
                name="Profsous"
                stroke="#eab308"
                strokeWidth={3.5}
                dot={false}
                activeDot={{ r: 6, fill: "#eab308", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
