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
import { Calendar } from "lucide-react";

export interface IncomeExpenseItem {
  month: string;
  income: number;
  expense: number;
}

export const MOCK_INCOME_EXPENSE_DATA: IncomeExpenseItem[] = [
  { month: "Junuary", income: 0, expense: 14000 },
  { month: "February", income: 8000, expense: 8000 },
  { month: "March", income: 10000, expense: 23000 },
  { month: "April", income: 20000, expense: 19000 },
  { month: "May", income: 22000, expense: 15000 },
  { month: "June", income: 26000, expense: 10000 },
  { month: "July", income: 18000, expense: 6000 },
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

const IncomeExpenseCustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const incomeItem = payload.find((item) => item.dataKey === "income");
    const expenseItem = payload.find((item) => item.dataKey === "expense");

    return (
      <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl p-3 shadow-xl border border-slate-100 dark:border-slate-700 text-xs space-y-2 min-w-[150px] z-20">
        <p className="font-bold text-slate-700 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700/60 pb-1">
          {label}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#22c55e]" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Income:</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">
            {incomeItem?.value !== undefined
              ? `${incomeItem.value.toLocaleString()} s`
              : "0 s"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#ef4444]" />
            <span className="text-slate-600 dark:text-slate-300 font-medium">Expense:</span>
          </div>
          <span className="font-bold text-slate-900 dark:text-white">
            {expenseItem?.value !== undefined
              ? `${expenseItem.value.toLocaleString()} s`
              : "0 s"}
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export interface IncomeExpenseChartProps {
  data?: IncomeExpenseItem[];
}

export function IncomeExpenseChart({
  data = MOCK_INCOME_EXPENSE_DATA,
}: IncomeExpenseChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full bg-white dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#22c55e]" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#ef4444]" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Expense</span>
          </div>
        </div>

        {/* Year Dropdown matching screenshot */}
        <div className="relative">
          <span className="absolute -top-2.5 left-3 bg-white dark:bg-slate-900 px-1 text-[11px] font-medium text-slate-400 z-10">
            Year
          </span>
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-1.5 bg-white dark:bg-slate-800 flex items-center gap-3 shadow-2xs">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">2023</span>
            <Calendar className="size-4 text-slate-600 dark:text-slate-300" />
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[340px]">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
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
                content={<IncomeExpenseCustomTooltip />}
                cursor={{ stroke: "#94a3b8", strokeDasharray: "3 3" }}
              />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#22c55e"
                strokeWidth={3.5}
                dot={{ r: 4, fill: "#22c55e", stroke: "#ffffff", strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: "#22c55e", stroke: "#ffffff", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#ef4444"
                strokeWidth={3.5}
                dot={{ r: 4, fill: "#ef4444", stroke: "#ffffff", strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: "#ef4444", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
