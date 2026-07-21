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

export interface IncomeExpenseItem {
  month: string;
  income: number;
  expense: number;
}

export const MOCK_INCOME_EXPENSE_DATA: IncomeExpenseItem[] = [
  { month: "Jan", income: 7000, expense: 3000 },
  { month: "Feb", income: 15000, expense: 7000 },
  { month: "Mar", income: 14000, expense: 9000 },
  { month: "Apr", income: 20000, expense: 12000 },
  { month: "May", income: 22000, expense: 15000 },
  { month: "Jun", income: 18000, expense: 9000 },
  { month: "Jul", income: 25000, expense: 5000 },
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
      <div className="bg-[#181928] text-white rounded-xl p-3 shadow-2xl border border-[#2e3048] text-xs space-y-2 min-w-[150px] z-20">
        <p className="font-bold text-slate-200 border-b border-[#2e3048] pb-1 uppercase tracking-wider">
          {label}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#22c55e]" />
            <span className="text-slate-300 font-medium">Income:</span>
          </div>
          <span className="font-bold text-[#22c55e]">
            {incomeItem?.value !== undefined
              ? `${incomeItem.value.toLocaleString()} s`
              : "0 s"}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-[#ef4444]" />
            <span className="text-slate-300 font-medium">Expense:</span>
          </div>
          <span className="font-bold text-[#ef4444]">
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
    <div className="w-full bg-[#131422] rounded-2xl p-5 border border-[#23253b] text-white space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-white">Income / Expense</h3>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#22c55e]" />
              <span className="text-slate-300">Income</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ef4444]" />
              <span className="text-slate-300">Expense</span>
            </div>
          </div>
        </div>
        <div className="border border-[#2a2c42] rounded-lg px-2.5 py-1 text-xs font-medium text-slate-300 bg-[#181928]">
          Year 2023 ▾
        </div>
      </div>

      {/* Explicit Parent Height Container for ResponsiveContainer */}
      <div className="w-full h-[260px]">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 15, right: 15, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#25273c" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                dy={8}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickFormatter={(val) => (val === 0 ? "0" : `${val / 1000}k`)}
              />
              <Tooltip
                content={<IncomeExpenseCustomTooltip />}
                cursor={{ stroke: "#475569", strokeDasharray: "3 3" }}
              />
              <Line
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 4, fill: "#22c55e", stroke: "#131422", strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: "#22c55e", stroke: "#ffffff", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                name="Expense"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4, fill: "#ef4444", stroke: "#131422", strokeWidth: 1.5 }}
                activeDot={{ r: 6, fill: "#ef4444", stroke: "#ffffff", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
