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

export interface BudgetChartItem {
  month: string;
  allocated: number;
  spent: number;
}

export const MOCK_BUDGET_DATA: BudgetChartItem[] = [
  { month: "January", allocated: 6000, spent: 14000 },
  { month: "February", allocated: 10000, spent: 8000 },
  { month: "March", allocated: 11000, spent: 9000 },
  { month: "April", allocated: 8000, spent: 11000 },
  { month: "May", allocated: 5000, spent: 19000 },
  { month: "June", allocated: 12000, spent: 17000 },
  { month: "July", allocated: 20000, spent: 16000 },
  { month: "August", allocated: 18000, spent: 11000 },
  { month: "September", allocated: 16000, spent: 9000 },
  { month: "October", allocated: 18000, spent: 12000 },
  { month: "November", allocated: 13000, spent: 10000 },
  { month: "December", allocated: 8000, spent: 5000 },
];

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

const BudgetCustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const allocatedItem = payload.find((item) => item.dataKey === "allocated");
    const spentItem = payload.find((item) => item.dataKey === "spent");

    return (
      <div className="bg-[#181928] text-white rounded-xl p-3 shadow-2xl border border-[#2e3048] text-xs space-y-2 min-w-[170px] z-20">
        <p className="font-bold text-slate-200 border-b border-[#2e3048] pb-1">
          {label}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#22c55e]" />
            <span className="text-slate-300 font-medium">Amount Allocated:</span>
          </div>
          <span className="font-bold text-[#22c55e]">
            {allocatedItem?.value !== undefined
              ? `${allocatedItem.value.toLocaleString()} s`
              : "0 s"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#ef4444]" />
            <span className="text-slate-300 font-medium">Amount Spent:</span>
          </div>
          <span className="font-bold text-[#ef4444]">
            {spentItem?.value !== undefined
              ? `${spentItem.value.toLocaleString()} s`
              : "0 s"}
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export interface BudgetPlanChartProps {
  data?: BudgetChartItem[];
}

export function BudgetPlanChart({
  data = MOCK_BUDGET_DATA,
}: BudgetPlanChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full bg-[#131422] rounded-2xl p-5 border border-[#23253b] text-white">
      {/* Top Header Legend */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-6 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#22c55e]" />
            <span className="text-slate-300">Amount allocated</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#ef4444]" />
            <span className="text-slate-300">Amount spent</span>
          </div>
        </div>
      </div>

      {/* Explicit Parent Height Container for ResponsiveContainer */}
      <div className="w-full h-[300px]">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 20, right: 15, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#25273c" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                dy={8}
              />
              <YAxis
                domain={[0, 30000]}
                ticks={[0, 10000, 20000, 30000]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />
              <Tooltip
                content={<BudgetCustomTooltip />}
                cursor={{ stroke: "#475569", strokeDasharray: "3 3" }}
              />
              <Line
                type="monotone"
                dataKey="allocated"
                name="Amount allocated"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#22c55e", stroke: "#ffffff", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="spent"
                name="Amount spent"
                stroke="#ef4444"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, fill: "#ef4444", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
