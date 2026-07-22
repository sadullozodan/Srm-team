"use client";

import { useQuery } from "@tanstack/react-query";
import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { expensesApi, paymentsApi, queryKeys } from "@/lib/api/resources";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const money = (v: number) => `${new Intl.NumberFormat("en-US").format(Math.round(v))} c.`;

export default function NetPage() {
  const payments = useQuery({ queryKey: queryKeys.list("Payments", { pageSize: 500 }), queryFn: () => paymentsApi.list({ pageSize: 500 }) });
  const expenses = useQuery({ queryKey: queryKeys.list("Expenses", { pageSize: 500 }), queryFn: () => expensesApi.list({ pageSize: 500 }) });

  const income = (payments.data?.items ?? []).reduce((s, p) => s + p.paid, 0);
  const spent = (expenses.data?.items ?? []).reduce((s, e) => s + e.amount, 0);
  const net = income - spent;
  const loading = payments.isPending || expenses.isPending;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Net</h1>

      {loading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <ArrowUpRight className="size-5" />
                <span className="text-sm font-medium">Income</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{money(income)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-destructive">
                <ArrowDownRight className="size-5" />
                <span className="text-sm font-medium">Expenses</span>
              </div>
              <p className="mt-2 text-3xl font-bold">{money(spent)}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className={`flex items-center gap-2 ${net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                <TrendingUp className="size-5" />
                <span className="text-sm font-medium">Net profit</span>
              </div>
              <p className={`mt-2 text-3xl font-bold ${net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}`}>
                {money(net)}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
