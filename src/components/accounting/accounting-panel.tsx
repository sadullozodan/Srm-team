"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DollarSign,
  PiggyBank,
  Frown,
  Smile,
  Wallet,
  ChevronRight,
  TrendingDown,
} from "lucide-react";
import { CustomSelect } from "@/components/ui/custom-select";
import {
  branchesApi,
  expensesApi,
  paymentsApi,
  queryKeys,
} from "@/lib/api/resources";
import { IncomeExpenseChart } from "./income-expense-chart";
import { StudentsPaymentDonutChart } from "./students-payment-donut-chart";
import {
  activeYears,
  donutSummary,
  expenseTotal,
  groupBreakdown,
  incomeExpenseSeries,
  paymentTotals,
} from "./aggregate";

// The overview reads two lists in full — Payments and Expenses — and derives
// every number, chart and table on this page from them. A big page size stands
// in for a "give me everything" endpoint the backend doesn't offer.
const FETCH_ALL = { page: 1, pageSize: 1000 };

function money(amount: number) {
  return `${new Intl.NumberFormat("ru-RU").format(Math.round(amount))} s`;
}

export function AccountingPanel() {
  const [branchId, setBranchId] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const branchesQuery = useQuery({
    queryKey: queryKeys.list(branchesApi.key, FETCH_ALL),
    queryFn: () => branchesApi.list(FETCH_ALL),
  });
  const paymentsQuery = useQuery({
    queryKey: queryKeys.list(paymentsApi.key, FETCH_ALL),
    queryFn: () => paymentsApi.list(FETCH_ALL),
  });
  const expensesQuery = useQuery({
    queryKey: queryKeys.list(expensesApi.key, FETCH_ALL),
    queryFn: () => expensesApi.list(FETCH_ALL),
  });

  const branches = branchesQuery.data?.items ?? [];

  // Everything below is filtered by the chosen branch. "All branches" = no filter.
  const payments = useMemo(() => {
    const all = paymentsQuery.data?.items ?? [];
    return branchId ? all.filter((payment) => payment.branchId === branchId) : all;
  }, [paymentsQuery.data, branchId]);

  const expenses = useMemo(() => {
    const all = expensesQuery.data?.items ?? [];
    return branchId ? all.filter((expense) => expense.branchId === branchId) : all;
  }, [expensesQuery.data, branchId]);

  const totals = useMemo(() => paymentTotals(payments), [payments]);
  const spent = useMemo(() => expenseTotal(expenses), [expenses]);
  const donut = useMemo(() => donutSummary(payments), [payments]);
  const groups = useMemo(() => groupBreakdown(payments), [payments]);

  const years = useMemo(
    () => activeYears(paymentsQuery.data?.items ?? [], expensesQuery.data?.items ?? []),
    [paymentsQuery.data, expensesQuery.data],
  );
  const [year, setYear] = useState<number | null>(null);
  const activeYear = year ?? years[0];
  const chartData = useMemo(
    () => incomeExpenseSeries(payments, expenses, activeYear),
    [payments, expenses, activeYear],
  );

  const loading = paymentsQuery.isPending || expensesQuery.isPending;
  const net = totals.paid - spent;

  const toggleGroup = (name: string) =>
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="w-full bg-slate-50/50 dark:bg-card text-foreground rounded-2xl md:rounded-3xl p-4 sm:p-6 lg:p-7 space-y-6 font-sans">
      {/* 1. Top Header Row */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          Accounting
        </h1>

        {/* Custom Styled Branch Selector — real branches from /api/Branches. */}
        <CustomSelect
          label="Branch"
          value={branchId}
          onChange={setBranchId}
          options={[
            { label: "All branches", value: "" },
            ...branches.map((branch) => ({
              label: branch.title ?? "—",
              value: branch.id,
            })),
          ]}
          className="w-40"
        />
      </div>

      {/* 2. KPI Gradient Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total payment"
          value={money(totals.amount)}
          loading={loading}
          icon={DollarSign}
          gradient="from-[#2ecc71] via-[#22c55e] to-[#10b981]"
          labelClass="text-emerald-100"
          shadowClass="hover:shadow-emerald-500/20"
        />
        <KpiCard
          label="Paid amount"
          value={money(totals.paid)}
          loading={loading}
          icon={PiggyBank}
          gradient="from-[#a855f7] via-[#9333ea] to-[#8b5cf6]"
          labelClass="text-purple-100"
          shadowClass="hover:shadow-purple-500/20"
        />
        <KpiCard
          label="Not paid"
          value={money(totals.notPaid)}
          loading={loading}
          icon={Frown}
          gradient="from-[#f97316] via-[#ff7043] to-[#fb923c]"
          labelClass="text-orange-100"
          shadowClass="hover:shadow-orange-500/20"
        />
        <KpiCard
          label="Net"
          value={money(net)}
          loading={loading}
          icon={Smile}
          gradient="from-[#38bdf8] via-[#0284c7] to-[#60a5fa]"
          labelClass="text-sky-100"
          shadowClass="hover:shadow-sky-500/20"
          href="/accounting/net"
        />
      </div>

      {/* 3. Action Buttons Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Payments", icon: DollarSign, href: "/accounting/payments" },
          { label: "Expenses", icon: TrendingDown, href: "/accounting/expenses" },
          { label: "Debtors", icon: Frown, href: "/accounting/debtors" },
          { label: "Salary", icon: Wallet, href: "/accounting/salary" },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.label}
              href={action.href}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-2xs hover:shadow-md hover:-translate-y-0.5 hover:border-indigo-500/40 dark:hover:border-indigo-500/50 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-full bg-[#5842f4] text-white flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-600 transition-all duration-200">
                  <Icon className="size-4 stroke-[2.5]" />
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {action.label}
                </span>
              </div>
              <ChevronRight className="size-4 text-[#5842f4] group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          );
        })}
      </div>

      {/* 4. Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <IncomeExpenseChart
            data={chartData}
            year={activeYear}
            years={years}
            onYearChange={setYear}
          />
        </div>
        <div className="lg:col-span-4">
          <StudentsPaymentDonutChart
            data={[
              {
                name: "Paid amount",
                value: donut.paidCount,
                percentage: percent(donut.paidCount, donut.total),
                count: donut.paidCount,
                color: "#a855f7",
              },
              {
                name: "Not paid",
                value: donut.notPaidCount,
                percentage: percent(donut.notPaidCount, donut.total),
                count: donut.notPaidCount,
                color: "#ff7043",
              },
            ]}
            totalCount={donut.total}
          />
        </div>
      </div>

      {/* 5. Summary Banner + 6. Accordion */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Students payment
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#e8f5e9] dark:bg-emerald-950/50 rounded-xl px-5 py-2.5 flex items-center justify-between gap-6 min-w-[200px]">
              <span className="text-xs font-semibold text-[#2e7d32] dark:text-emerald-400">
                Total payment
              </span>
              <span className="text-lg font-black text-[#2e7d32] dark:text-emerald-300">
                {donut.paidCount} / {money(donut.paidAmount)}
              </span>
            </div>

            <div className="bg-[#ffebee] dark:bg-rose-950/50 rounded-xl px-5 py-2.5 flex items-center justify-between gap-6 min-w-[200px]">
              <span className="text-xs font-semibold text-[#c62828] dark:text-rose-400">
                Not paid
              </span>
              <span className="text-lg font-black text-[#c62828] dark:text-rose-300">
                {donut.notPaidCount} / {money(donut.notPaidAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {/* Table Header */}
          <div className="grid grid-cols-12 px-4 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">GROUP</div>
            <div className="col-span-2 text-center">STUDENTS</div>
            <div className="col-span-2 text-center">NOT PAID</div>
            <div className="col-span-2 text-center">TOTAL (SOMONI)</div>
            <div className="col-span-2 text-right">NOT PAID (SOMONI)</div>
          </div>

          {loading ? (
            <div className="px-4 py-10 text-center text-sm text-slate-400">Loading…</div>
          ) : groups.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-slate-400">
              No payments yet.
            </div>
          ) : (
            groups.map((group) => (
              <div
                key={group.group}
                className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xs"
              >
                <button
                  onClick={() => toggleGroup(group.group)}
                  className={`w-full grid grid-cols-12 px-4 py-3.5 text-xs font-bold text-slate-800 dark:text-slate-200 items-center hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                    expanded[group.group]
                      ? "border-b border-slate-100 dark:border-slate-800"
                      : ""
                  }`}
                >
                  <div className="col-span-4 flex items-center gap-2 text-left">
                    <ChevronRight
                      className={`size-4 shrink-0 text-[#5842f4] transition-transform duration-200 ${
                        expanded[group.group] ? "rotate-90" : ""
                      }`}
                    />
                    <span className="truncate">{group.group}</span>
                  </div>
                  <div className="col-span-2 text-center text-slate-500">{group.students}</div>
                  <div className="col-span-2 text-center text-slate-500">{group.notPaid}</div>
                  <div className="col-span-2 text-center text-slate-700 dark:text-slate-300 font-semibold">
                    {money(group.total)}
                  </div>
                  <div className="col-span-2 text-right text-slate-700 dark:text-slate-300 font-semibold">
                    {money(group.notPaidTotal)}
                  </div>
                </button>

                {expanded[group.group] && (
                  <div className="p-3 bg-slate-50/50 dark:bg-slate-900/40">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-x-auto">
                      <table className="w-full min-w-[420px] text-left text-xs font-medium">
                        <thead>
                          <tr className="bg-slate-50/70 dark:bg-slate-800/60 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                            <th className="py-2.5 px-4">FULL NAME</th>
                            <th className="py-2.5 px-4">PAID</th>
                            <th className="py-2.5 px-4 text-center">STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {group.rows.map((row) => (
                            <tr key={row.id}>
                              <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold">
                                {row.name}
                              </td>
                              <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-bold">
                                {money(row.paid)}
                              </td>
                              <td className="py-3 px-4 text-center">
                                {row.paidInFull ? (
                                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                    Paid
                                  </span>
                                ) : (
                                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-500 dark:bg-rose-950/60 dark:text-rose-400">
                                    Not paid
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function percent(part: number, total: number) {
  if (total === 0) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

interface KpiCardProps {
  label: string;
  value: string;
  loading: boolean;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  labelClass: string;
  /** Per-card coloured hover glow, e.g. "hover:shadow-emerald-500/20". */
  shadowClass: string;
  href?: string;
}

function KpiCard({ label, value, loading, icon: Icon, gradient, labelClass, shadowClass, href }: KpiCardProps) {
  const body = (
    <>
      <div className={`text-xs font-medium opacity-90 group-hover:opacity-100 transition-opacity ${labelClass}`}>
        {label}
      </div>
      {loading ? (
        <div className="mt-2 h-8 w-24 rounded bg-white/30 animate-pulse" />
      ) : (
        <div className="mt-2 text-2xl sm:text-3xl font-black tracking-tight">{value}</div>
      )}
      {/* Watermark Icon (Subtle Translucent) */}
      <div className="absolute top-1/2 -translate-y-1/2 right-3.5 size-12 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center pointer-events-none group-hover:scale-115 group-hover:rotate-6 transition-transform duration-300">
        <Icon className="size-6 text-white opacity-40 group-hover:opacity-70 transition-opacity" />
      </div>
    </>
  );

  const className = `group relative overflow-hidden rounded-2xl p-5 bg-gradient-to-r ${gradient} text-white shadow-xs hover:shadow-lg ${shadowClass} hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer`;

  if (href) {
    return (
      <Link href={href} className={`${className} block`}>
        {body}
      </Link>
    );
  }

  return <div className={className}>{body}</div>;
}
