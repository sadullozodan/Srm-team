"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { reportsApi } from "@/lib/api/resources";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function formatCurrency(n: number): string {
  return new Intl.NumberFormat("en-US", { style: "decimal" }).format(n);
}

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

const IncomeTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const val = payload.find((i) => i.dataKey === "income")?.value;
    return (
      <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl p-3 shadow-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-2 z-20">
        <p className="font-bold text-slate-700 dark:text-slate-200">{label}</p>
        <p className="text-indigo-500 font-semibold">{val != null ? `${formatCurrency(val)} sum` : "—"}</p>
      </div>
    );
  }
  return null;
};

const BranchTotalTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const val = payload[0]?.value;
    return (
      <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl p-3 shadow-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-2 z-20">
        <p className="font-bold text-slate-700 dark:text-slate-200">{label}</p>
        <p className="text-cyan-500 font-semibold">{val != null ? `${formatCurrency(val)} sum` : "—"}</p>
      </div>
    );
  }
  return null;
};

export interface BranchChartProps {
  year: number;
}

export function BranchChart({ year }: BranchChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const monthlyQuery = useQuery({
    queryKey: ["reports", "income-by-month", year],
    queryFn: () => reportsApi.incomeByMonth(year),
  });

  const branchQuery = useQuery({
    queryKey: ["reports", "income-by-branch"],
    queryFn: () => reportsApi.incomeByBranch(),
  });

  const monthlyData = (monthlyQuery.data ?? []).map((d) => ({
    month: MONTH_NAMES[d.month - 1] ?? `M${d.month}`,
    income: d.total,
  }));

  const branchData = (branchQuery.data ?? [])
    .filter((b) => b.branchName)
    .map((b) => ({
      name: b.branchName!,
      total: b.total,
    }));

  const maxMonthly = Math.max(...monthlyData.map((d) => d.income), 1);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="w-full bg-white dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Monthly Income</h3>
          <span className="text-xs text-slate-400">{year}</span>
        </div>
        <div className="w-full h-[260px]">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} dy={6} />
                <YAxis domain={[0, Math.ceil(maxMonthly * 1.15)]} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={formatCurrency} />
                <Tooltip content={<IncomeTooltip />} cursor={{ stroke: "#94a3b8", strokeDasharray: "3 3" }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#6366f1" strokeWidth={3} dot={false} activeDot={{ r: 5, fill: "#6366f1", stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="w-full bg-white dark:bg-slate-900/60 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Income by Branch</h3>
        <div className="w-full h-[260px]">
          {mounted && branchData.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} dy={6} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} tickFormatter={formatCurrency} />
                <Tooltip content={<BranchTotalTooltip />} cursor={{ fill: "rgba(99,102,241,0.06)" }} />
                <Bar dataKey="total" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
          {mounted && branchData.length === 0 && (
            <div className="flex items-center justify-center h-full text-sm text-slate-400">
              {branchQuery.isPending ? "Loading…" : "No branch data"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
