"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Banknote, CreditCard, PiggyBank, Receipt, TrendingUp, UserRound, Users, Wallet } from "lucide-react";
import { debtorsApi, expensesApi, paymentsApi, queryKeys } from "@/lib/api/resources";
import { Card, CardContent } from "@/components/ui/card";

const money = (v: number) => `${new Intl.NumberFormat("en-US").format(Math.round(v))} c.`;

const SECTIONS = [
  { href: "/accounting/payments", label: "Payments", icon: CreditCard },
  { href: "/accounting/debtors", label: "Debtors", icon: UserRound },
  { href: "/accounting/budget", label: "Budget", icon: PiggyBank },
  { href: "/accounting/expenses", label: "Expenses", icon: Receipt },
  { href: "/accounting/salary", label: "Salary", icon: Wallet },
  { href: "/accounting/avans", label: "Avans", icon: Banknote },
  { href: "/accounting/accountant", label: "Accountant", icon: Users },
  { href: "/accounting/net", label: "Net", icon: TrendingUp },
];

export default function AccountingPage() {
  const payments = useQuery({ queryKey: queryKeys.list("Payments", { pageSize: 500 }), queryFn: () => paymentsApi.list({ pageSize: 500 }) });
  const expenses = useQuery({ queryKey: queryKeys.list("Expenses", { pageSize: 500 }), queryFn: () => expensesApi.list({ pageSize: 500 }) });
  const debtors = useQuery({ queryKey: queryKeys.list("Debtors", { pageSize: 500 }), queryFn: () => debtorsApi.list({ pageSize: 500 }) });

  const income = (payments.data?.items ?? []).reduce((s, p) => s + p.paid, 0);
  const spent = (expenses.data?.items ?? []).reduce((s, e) => s + e.amount, 0);
  const net = income - spent;
  const debtTotal = (debtors.data?.items ?? []).reduce((s, d) => s + (d.totalDebtAmount - d.totalPaidAmount), 0);

  const loading = payments.isPending || expenses.isPending;

  const tiles = [
    { label: "Income", value: loading ? "—" : money(income), tone: "text-emerald-600 dark:text-emerald-400" },
    { label: "Expenses", value: loading ? "—" : money(spent), tone: "text-destructive" },
    { label: "Net", value: loading ? "—" : money(net), tone: net >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive" },
    { label: "Outstanding debt", value: debtors.isPending ? "—" : money(debtTotal), tone: "text-amber-600 dark:text-amber-400" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Accounting</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((t) => (
          <Card key={t.label}>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground">{t.label}</p>
              <p className={`mt-1 text-2xl font-bold ${t.tone}`}>{t.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href} className="block">
            <Card className="h-full transition-colors hover:border-primary/40">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <s.icon className="size-5" />
                </div>
                <span className="font-medium">{s.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
