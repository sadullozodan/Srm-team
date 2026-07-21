"use client";

import React, { useState, useEffect } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export interface PaymentSegment {
  name: string;
  value: number;
  percentage: string;
  count: number;
  color: string;
}

export const MOCK_PAYMENT_DATA: PaymentSegment[] = [
  {
    name: "Paid amount",
    value: 22,
    percentage: "20%",
    count: 22,
    color: "#a855f7", // Purple
  },
  {
    name: "Not paid",
    value: 48,
    percentage: "80%",
    count: 48,
    color: "#ff7043", // Orange
  },
];

export interface StudentsPaymentDonutChartProps {
  data?: PaymentSegment[];
  totalLabel?: string;
  totalCount?: number;
}

export function StudentsPaymentDonutChart({
  data = MOCK_PAYMENT_DATA,
  totalLabel = "Total",
  totalCount = 60,
}: StudentsPaymentDonutChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full bg-white dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
      {/* Title */}
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Students payment</h3>

      {/* Main Content Layout: Donut Chart + Right Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
        {/* Donut Chart Container */}
        <div className="relative size-40 sm:size-44 flex items-center justify-center shrink-0">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}

          {/* Center Overlay Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="text-[11px] font-semibold text-slate-400">
              {totalLabel}
            </span>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {totalCount}
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex flex-col gap-2.5 w-full sm:w-auto">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4 text-xs font-semibold">
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
              </div>
              <span className="text-slate-900 dark:text-slate-100 font-bold">
                {item.percentage} - {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
