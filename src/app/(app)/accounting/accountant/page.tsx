"use client";

import { useQuery } from "@tanstack/react-query";
import { advancesApi, expensesApi, paymentsApi, salariesApi, queryKeys } from "@/lib/api/resources";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const money = (v: number) => `${new Intl.NumberFormat("en-US").format(Math.round(v))} c.`;

export default function AccountantPage() {
  const payments = useQuery({ queryKey: queryKeys.list("Payments", { pageSize: 500 }), queryFn: () => paymentsApi.list({ pageSize: 500 }) });
  const expenses = useQuery({ queryKey: queryKeys.list("Expenses", { pageSize: 500 }), queryFn: () => expensesApi.list({ pageSize: 500 }) });
  const salaries = useQuery({ queryKey: queryKeys.list("Salaries", { pageSize: 500 }), queryFn: () => salariesApi.list({ pageSize: 500 }) });
  const advances = useQuery({ queryKey: queryKeys.list("Advances", { pageSize: 500 }), queryFn: () => advancesApi.list({ pageSize: 500 }) });

  const income = (payments.data?.items ?? []).reduce((s, p) => s + p.paid, 0);
  const spent = (expenses.data?.items ?? []).reduce((s, e) => s + e.amount, 0);
  const salaryPaid = (salaries.data?.items ?? []).reduce((s, x) => s + x.paid, 0);
  const advancePaid = (advances.data?.items ?? []).reduce((s, a) => s + a.amount, 0);
  const loading = payments.isPending || expenses.isPending || salaries.isPending || advances.isPending;

  const rows = [
    { label: "Income (payments)", value: income, tone: "text-emerald-600 dark:text-emerald-400" },
    { label: "Expenses", value: -spent, tone: "text-destructive" },
    { label: "Salaries paid", value: -salaryPaid, tone: "text-destructive" },
    { label: "Advances", value: -advancePaid, tone: "text-destructive" },
  ];
  const net = income - spent - salaryPaid - advancePaid;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Accountant</h1>

      {loading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <Card className="max-w-xl">
          <CardContent className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Financial summary</h2>
            <div className="divide-y divide-border">
              {rows.map((r) => (
                <div key={r.label} className="flex items-center justify-between py-3">
                  <span className="text-sm text-muted-foreground">{r.label}</span>
                  <span className={`font-medium ${r.tone}`}>{money(r.value)}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-3">
                <span className="font-semibold">Net</span>
                <span className={`text-lg font-bold ${net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                  {money(net)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
