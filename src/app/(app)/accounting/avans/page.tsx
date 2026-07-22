"use client";

import { useQuery } from "@tanstack/react-query";
import { advancesApi, queryKeys } from "@/lib/api/resources";
import type { AdvanceStatus } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const money = (v: number) => `${new Intl.NumberFormat("en-US").format(Math.round(v))} c.`;
const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const statusVariant: Record<AdvanceStatus, "success" | "muted" | "warning" | "destructive"> = {
  Pending: "warning",
  Approved: "success",
  Denied: "destructive",
  Done: "muted",
};

export default function AvansPage() {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Advances", { pageSize: 200 }),
    queryFn: () => advancesApi.list({ pageSize: 200 }),
  });
  const rows = data?.items ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Avans</h1>

      {isError ? (
        <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load advances.</CardContent></Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Employee</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">{Array.from({ length: 5 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>)}</TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow className="hover:bg-transparent"><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No advances found.</TableCell></TableRow>
              ) : (
                rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.employeeName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{MONTHS[a.month] ?? a.month} {a.year}</TableCell>
                    <TableCell>{money(a.amount)}</TableCell>
                    <TableCell className="text-muted-foreground">{a.description ?? "—"}</TableCell>
                    <TableCell><Badge variant={statusVariant[a.status]}>{a.status}</Badge></TableCell>
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
