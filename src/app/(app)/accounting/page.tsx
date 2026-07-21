"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { dashboardApi, queryKeys } from "@/lib/api/resources";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader, money } from "./parts";

// The hub is a menu, not a report: the numbers come from the one dashboard
// endpoint that already totals them, and each card links to the real list.

const SECTIONS = [
  { href: "/accounting/payments", label: "Payment's", blurb: "What students owe and have paid" },
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
    <div className="space-y-6">
      <PageHeader title="Accounting" />

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="Income this month" value={data && money(data.incomeThisMonth)} loading={isPending} />
        <Stat label="Total debt" value={data && money(data.totalDebt)} loading={isPending} tone="text-destructive" />
        <Stat label="Debtors" value={data && String(data.debtorsCount)} loading={isPending} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SECTIONS.map((section) => (
          <Link key={section.href} href={section.href} className="block">
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div className="space-y-1">
                  <p className="font-semibold">{section.label}</p>
                  <p className="text-sm text-muted-foreground">{section.blurb}</p>
                </div>
                <ChevronRight className="mt-0.5 size-5 shrink-0 text-primary" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
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
  value: string | undefined;
  loading: boolean;
  tone?: string;
}) {
  return (
    <Card>
      <CardContent className="space-y-2 p-5">
        <p className="text-sm text-muted-foreground">{label}</p>
        {loading ? (
          <Skeleton className="h-8 w-32" />
        ) : (
          <p className={`text-2xl font-bold ${tone ?? ""}`}>{value ?? "—"}</p>
        )}
      </CardContent>
    </Card>
  );
}
