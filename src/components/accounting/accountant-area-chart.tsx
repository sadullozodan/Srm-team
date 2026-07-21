"use client";

import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export interface ChartDataItem {
  month: string;
  income: number;
  expense: number;
}

export const MOCK_CHART_DATA: ChartDataItem[] = [
  { month: "January", income: 12000, expense: 5000 },
  { month: "February", income: 16000, expense: 8000 },
  { month: "March", income: 14000, expense: 6500 },
  { month: "April", income: 22000, expense: 12000 },
  { month: "May", income: 15000, expense: 6000 },
  { month: "June", income: 24000, expense: 14000 },
  { month: "July", income: 28000, expense: 11000 },
  { month: "August", income: 21000, expense: 9500 },
  { month: "September", income: 25000, expense: 13000 },
  { month: "October", income: 29000, expense: 15000 },
  { month: "November", income: 23000, expense: 10000 },
  { month: "December", income: 30000, expense: 16000 },
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

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const incomeItem = payload.find((item) => item.dataKey === "income");
    const expenseItem = payload.find((item) => item.dataKey === "expense");

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl p-3 shadow-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 min-w-[140px] z-20">
        <p className="font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700/60 pb-1">
          {label}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#22c55e]" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Income:</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100">
            {incomeItem?.value !== undefined ? incomeItem.value.toLocaleString() : 0}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#ef4444]" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Expense:</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-slate-100">
            {expenseItem?.value !== undefined ? expenseItem.value.toLocaleString() : 0}
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export interface AccountantAreaChartProps {
  data?: ChartDataItem[];
  height?: number;
}

export function AccountantAreaChart({
  data = MOCK_CHART_DATA,
  height = 300,
}: AccountantAreaChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradientIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="gradientExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 11 }}
              dy={5}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="income"
              name="Income"
              stroke="#22c55e"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#gradientIncome)"
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="Expense"
              stroke="#ef4444"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#gradientExpense)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
