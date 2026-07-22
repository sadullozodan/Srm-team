"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { budgetsApi, queryKeys } from "@/lib/api/resources";
import type { ActivationStatus, BudgetDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const money = (v: number) => `${new Intl.NumberFormat("en-US").format(Math.round(v))} c.`;
const statusVariant: Record<ActivationStatus, "success" | "muted"> = { Active: "success", Inactive: "muted" };

export default function BudgetPage() {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Budgets", { pageSize: 200 }),
    queryFn: () => budgetsApi.list({ pageSize: 200 }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => budgetsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Budgets"] }),
  });
  function handleDelete(b: BudgetDto) {
    if (window.confirm(`Delete ${b.categoryName ?? "this budget"}?`)) deleteMutation.mutate(b.id);
  }
  const rows = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Budget</h1>
        <Button size="lg" className="gap-1.5" render={<Link href="/accounting/budget/new" />}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

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
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">{Array.from({ length: 8 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>)}</TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow className="hover:bg-transparent"><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">No budgets found.</TableCell></TableRow>
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
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" aria-label="Edit" render={<Link href={`/accounting/budget/${b.id}/edit`} />}><Pencil className="size-4 text-primary" /></Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => handleDelete(b)}><Trash2 className="size-4 text-destructive" /></Button>
                      </div>
                    </TableCell>
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
