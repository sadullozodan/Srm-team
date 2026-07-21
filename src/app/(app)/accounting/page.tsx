"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { dashboardApi, queryKeys } from "@/lib/api/resources";
import { ExportButton, Panel, PanelHeader, money } from "./parts";

// The hub is a menu, not a report: the numbers come from the one dashboard
// endpoint that already totals them, and each card links to the real list.

const SECTIONS = [
  { href: "/accounting/payments", label: "Payments", blurb: "What students owe and have paid" },
  { href: "/accounting/debtors", label: "Debtors", blurb: "Outstanding balances by student" },
  { href: "/accounting/budget", label: "Budget plan", blurb: "Allocated against spent, by category" },
  { href: "/accounting/expenses", label: "Expenses", blurb: "Tax, office, marketing and payroll" },
  { href: "/accounting/salary", label: "Salary", blurb: "Monthly payroll per employee" },
  { href: "/accounting/avans", label: "Avans", blurb: "Advance requests and their approval" },
];

export default function AccountingPage() {
  const { data, isPending } = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: dashboardApi.stats,
  });

  return (
    <Panel>
      <PanelHeader title="Accounting">
        <ExportButton />
      </PanelHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Income this month"
          value={data && money(data.incomeThisMonth)}
          loading={isPending}
          tone="text-emerald-600"
        />
        <Stat
          label="Total debt"
          value={data && money(data.totalDebt)}
          loading={isPending}
          tone="text-rose-500"
        />
        <Stat label="Debtors" value={data && String(data.debtorsCount)} loading={isPending} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="group flex items-start justify-between gap-3 rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:border-primary/40 hover:shadow-md"
          >
            <div className="space-y-1">
              <p className="font-bold">{section.label}</p>
              <p className="text-xs text-muted-foreground">{section.blurb}</p>
            </div>
            <ChevronRight className="mt-0.5 size-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </Panel>
  );
}

function Stat({
  label,
  value,
  loading,
  tone,
}: {
  label: string;
  value: string | undefined;
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
        <p className={`mt-2 text-2xl font-black tracking-tight ${tone ?? ""}`}>{value ?? "—"}</p>
      )}
    </div>
  );
}
