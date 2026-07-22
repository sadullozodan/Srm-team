"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { paymentsApi, queryKeys } from "@/lib/api/resources";
import type { PaymentStatus } from "@/lib/api/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const money = (v: number) => `${new Intl.NumberFormat("en-US").format(Math.round(v))} c.`;
const STATUS_ORDER: PaymentStatus[] = ["NotPaid", "Active", "Prepayment", "Paid"];
const statusVariant: Record<PaymentStatus, "success" | "muted" | "warning" | "destructive"> = {
  NotPaid: "destructive",
  Active: "warning",
  Prepayment: "muted",
  Paid: "success",
};

export default function PaymentsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<PaymentStatus | "">("");
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  const statusParam = status ? STATUS_ORDER.indexOf(status) : undefined;
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Payments", { pageSize: 200, search, status: statusParam }),
    queryFn: () => paymentsApi.list({ pageSize: 200, search, status: statusParam }),
    placeholderData: keepPreviousData,
  });
  const rows = data?.items ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Payments</h1>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by student" className="h-11 rounded-xl bg-card pl-9" />
        </div>
        <div className="w-44">
          <Select value={status} onChange={(e) => setStatus(e.target.value as PaymentStatus | "")} className="h-11 rounded-xl bg-card">
            <option value="">All statuses</option>
            {STATUS_ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </div>
      </div>

      {isError ? (
        <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load payments.</CardContent></Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Student</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">{Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>)}</TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow className="hover:bg-transparent"><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No payments found.</TableCell></TableRow>
              ) : (
                rows.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.studentName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{p.groupName ?? "—"}</TableCell>
                    <TableCell>{money(p.amount)}</TableCell>
                    <TableCell className="text-muted-foreground">{money(p.paid)}</TableCell>
                    <TableCell className="text-muted-foreground">{p.discount ? money(p.discount) : "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{new Date(p.date).toLocaleDateString("en-GB")}</TableCell>
                    <TableCell><Badge variant={statusVariant[p.status]}>{p.status}</Badge></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
