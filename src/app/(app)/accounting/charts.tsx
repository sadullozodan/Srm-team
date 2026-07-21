"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { BudgetDto } from "@/lib/api/types";
import type { CashflowPoint, PaymentSplit } from "@/lib/series";

// The accounting charts from the team's Figma, drawn on the same recharts
// wrapper the dashboard uses so tooltips, theming and the dark mode match.

const axis = { tickLine: false, axisLine: false, tickMargin: 8 } as const;
const grid = { vertical: false, strokeDasharray: "0" } as const;

const cashflowConfig = {
  income: { label: "Income", color: "#22c55e" },
  expense: { label: "Expense", color: "#ef4444" },
} satisfies ChartConfig;

/** Income against expense, month by month. */
export function IncomeExpenseChart({ data }: { data: CashflowPoint[] }) {
  return (
    <ChartContainer config={cashflowConfig} className="aspect-auto h-64 w-full">
      <LineChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <Line
          dataKey="income"
          type="natural"
          stroke="var(--color-income)"
          strokeWidth={3}
          dot={false}
        />
        <Line
          dataKey="expense"
          type="natural"
          stroke="var(--color-expense)"
          strokeWidth={3}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

const netConfig = {
  net: { label: "Net", color: "var(--chart-3)" },
} satisfies ChartConfig;

/** Running net per month — the Accountant screen's headline chart. */
export function NetAreaChart({ data }: { data: CashflowPoint[] }) {
  return (
    <ChartContainer config={netConfig} className="aspect-auto h-64 w-full">
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="fill-net" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-net)" stopOpacity={0.45} />
            <stop offset="100%" stopColor="var(--color-net)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid {...grid} />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          dataKey="net"
          type="natural"
          stroke="var(--color-net)"
          strokeWidth={3}
          fill="url(#fill-net)"
        />
      </AreaChart>
    </ChartContainer>
  );
}

const budgetConfig = {
  amountAllocated: { label: "Allocated", color: "var(--chart-1)" },
  amountSpent: { label: "Spent", color: "#f59e0b" },
} satisfies ChartConfig;

/** Allocated against spent, per budget category. */
export function BudgetPlanChart({ data }: { data: BudgetDto[] }) {
  const bars = data.map((budget) => ({
    category: budget.categoryName ?? "—",
    amountAllocated: budget.amountAllocated,
    amountSpent: budget.amountSpent,
  }));

  return (
    <ChartContainer config={budgetConfig} className="aspect-auto h-64 w-full">
      <BarChart data={bars} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid {...grid} />
        <XAxis dataKey="category" {...axis} />
        <YAxis {...axis} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <Bar
          dataKey="amountAllocated"
          fill="var(--color-amountAllocated)"
          radius={[6, 6, 0, 0]}
          maxBarSize={22}
        />
        <Bar
          dataKey="amountSpent"
          fill="var(--color-amountSpent)"
          radius={[6, 6, 0, 0]}
          maxBarSize={22}
        />
      </BarChart>
    </ChartContainer>
  );
}

const SPLIT_COLOURS = { paid: "#a855f7", notPaid: "#ff7043" };

const splitConfig = {
  paid: { label: "Paid amount", color: SPLIT_COLOURS.paid },
  notPaid: { label: "Not paid", color: SPLIT_COLOURS.notPaid },
} satisfies ChartConfig;

/** Paid against outstanding invoices, with the total in the hole. */
export function StudentsPaymentDonut({ split }: { split: PaymentSplit }) {
  const slices = [
    { key: "paid", label: "Paid amount", value: split.paid, fill: SPLIT_COLOURS.paid },
    { key: "notPaid", label: "Not paid", value: split.notPaid, fill: SPLIT_COLOURS.notPaid },
  ];

  const percent = (value: number) =>
    split.total === 0 ? "0%" : `${Math.round((value / split.total) * 100)}%`;

  return (
    <div className="space-y-4">
      <div className="relative">
        <ChartContainer config={splitConfig} className="aspect-square h-56 w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              strokeWidth={0}
            >
              {slices.map((slice) => (
                <Cell key={slice.key} fill={slice.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] font-medium text-muted-foreground">Total</span>
          <span className="text-2xl font-black">{split.total}</span>
        </div>
      </div>

      <ul className="space-y-2">
        {slices.map((slice) => (
          <li key={slice.key} className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-2 font-medium">
              <span
                className="size-2.5 rounded-full"
                style={{ background: slice.fill }}
              />
              {slice.label}
            </span>
            <span className="font-bold">
              {slice.value}
              <span className="ml-1.5 font-medium text-muted-foreground">
                {percent(slice.value)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
