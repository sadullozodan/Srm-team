"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { budgetsApi, queryKeys } from "@/lib/api/resources";
import { cashflowSeries, paymentSplit } from "@/lib/series";
import {
  BudgetPlanChart,
  IncomeExpenseChart,
  NetAreaChart,
  StudentsPaymentDonut,
} from "../charts";
import {
  ExportButton,
  Panel,
  PanelHeader,
  SectionTitle,
  Stepper,
  money,
  useLedgerSources,
} from "../parts";

const BUDGETS_PAGE = { pageSize: 50 };

export default function AccountantPage() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const { payments, expenses, isPending, isError } = useLedgerSources();

  const budgets = useQuery({
    queryKey: queryKeys.list("Budgets", BUDGETS_PAGE),
    queryFn: () => budgetsApi.list(BUDGETS_PAGE),
  });

  const cashflow = useMemo(
    () => cashflowSeries(payments, expenses, year),
    [payments, expenses, year],
  );

  const totals = cashflow.reduce(
    (sum, point) => ({
      income: sum.income + point.income,
      expense: sum.expense + point.expense,
    }),
    { income: 0, expense: 0 },
  );
  const net = totals.income - totals.expense;
  const split = paymentSplit(payments);

  if (isError) {
    return (
      <Panel>
        <PanelHeader title="Accountant" backHref="/accounting" />
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Couldn&apos;t load the accounting figures.
        </div>
      </Panel>
    );
  }

  return (
    <div className="space-y-6">
      <Panel>
        <PanelHeader title="Accountant" backHref="/accounting">
          <Stepper label={`${year} y`} onStep={(delta) => setYear(year + delta)} />
          <ExportButton />
        </PanelHeader>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Total income" value={money(totals.income)} loading={isPending} tone="text-emerald-600" />
          <Stat label="Total expense" value={money(totals.expense)} loading={isPending} tone="text-rose-500" />
          <Stat
            label="Net"
            value={money(net)}
            loading={isPending}
            tone={net < 0 ? "text-rose-500" : "text-emerald-600"}
          />
        </div>

        <SectionTitle>Net over {year}</SectionTitle>
        <NetAreaChart data={cashflow} />
      </Panel>

      <div className="grid gap-6 lg:grid-cols-12">
        <Panel className="lg:col-span-7">
          <SectionTitle>Income &amp; expense</SectionTitle>
          <IncomeExpenseChart data={cashflow} />
        </Panel>

        <Panel className="lg:col-span-5">
          <SectionTitle>Students payment</SectionTitle>
          <StudentsPaymentDonut split={split} />
        </Panel>
      </div>

      <Panel>
        <SectionTitle>Budget plan</SectionTitle>
        {budgets.data?.items?.length ? (
          <BudgetPlanChart data={budgets.data.items} />
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No budget categories yet.
          </p>
        )}
      </Panel>
    </div>
  );
}

function Stat({
  label,
  value,
  loading,
  tone,
}: {
  label: string;
  value: string;
  loading: boolean;
  tone?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/40 p-5">
      <p className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
        {label}
      </p>
      {loading ? (
        <span className="mt-2 block h-8 w-32 animate-pulse rounded bg-muted" />
      ) : (
        <p className={`mt-2 text-2xl font-black tracking-tight ${tone ?? ""}`}>{value}</p>
      )}
    </div>
  );
}
