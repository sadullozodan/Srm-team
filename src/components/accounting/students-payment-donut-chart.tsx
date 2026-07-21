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
    color: "#ff6b00", // Orange
  },
];

export interface StudentsPaymentDonutChartProps {
  data?: PaymentSegment[];
  totalLabel?: string;
  totalCount?: number;
}

export function StudentsPaymentDonutChart({
  data = MOCK_PAYMENT_DATA,
  totalLabel = "TOTAL",
  totalCount = 60,
}: StudentsPaymentDonutChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full bg-[#131422] rounded-2xl p-5 border border-[#23253b] text-white space-y-4">
      {/* Title */}
      <h3 className="text-base font-bold text-white">Students payment</h3>

      {/* Main Content Layout: Donut Chart + Right Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
        {/* Donut Chart Container with explicit dimensions */}
        <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
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
            <span className="text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              {totalLabel}
            </span>
            <span className="text-2xl font-black text-white leading-tight">
              {totalCount}
            </span>
          </div>
        </div>

        {/* Custom Legend Block */}
        <div className="flex flex-col gap-3 w-full max-w-[200px]">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-[#1a1b2e] rounded-xl p-3 border border-[#2a2c44] flex flex-col gap-1 shadow-xs"
            >
              <div className="flex items-center gap-2">
                <span
                  className="size-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs font-semibold text-slate-200">
                  {item.name}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-400 pl-4">
                {item.percentage} - {item.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
