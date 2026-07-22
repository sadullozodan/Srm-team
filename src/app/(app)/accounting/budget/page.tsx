"use client";

import { useQuery } from "@tanstack/react-query";
import { budgetsApi, queryKeys } from "@/lib/api/resources";
import type { ActivationStatus } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const money = (v: number) => `${new Intl.NumberFormat("en-US").format(Math.round(v))} c.`;
const statusVariant: Record<ActivationStatus, "success" | "muted"> = { Active: "success", Inactive: "muted" };

export default function BudgetPage() {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Budgets", { pageSize: 200 }),
    queryFn: () => budgetsApi.list({ pageSize: 200 }),
  });
  const rows = data?.items ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Budget</h1>

      {isError ? (
        <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load budgets.</CardContent></Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Category</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Allocated</TableHead>
                <TableHead>Spent</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">{Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>)}</TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow className="hover:bg-transparent"><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No budgets found.</TableCell></TableRow>
              ) : (
                rows.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.categoryName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{b.branchName ?? "—"}</TableCell>
                    <TableCell>{money(b.amountAllocated)}</TableCell>
                    <TableCell className="text-muted-foreground">{money(b.amountSpent)}</TableCell>
                    <TableCell className="text-muted-foreground">{money(b.amountAllocated - b.amountSpent)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(b.fromDate).toLocaleDateString("en-GB")} – {new Date(b.toDate).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell><Badge variant={statusVariant[b.status]}>{b.status}</Badge></TableCell>
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
