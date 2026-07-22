"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { advancesApi, queryKeys } from "@/lib/api/resources";
import type { AdvanceDto, AdvanceStatus } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
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
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Advances", { pageSize: 200 }),
    queryFn: () => advancesApi.list({ pageSize: 200 }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => advancesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Advances"] }),
  });
  function handleDelete(a: AdvanceDto) {
    if (window.confirm(`Delete advance for ${a.employeeName ?? "employee"}?`)) deleteMutation.mutate(a.id);
  }
  const rows = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Avans</h1>
        <Button size="lg" className="gap-1.5" render={<Link href="/accounting/avans/new" />}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

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
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">{Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>)}</TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow className="hover:bg-transparent"><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No advances found.</TableCell></TableRow>
              ) : (
                rows.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.employeeName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{MONTHS[a.month] ?? a.month} {a.year}</TableCell>
                    <TableCell>{money(a.amount)}</TableCell>
                    <TableCell className="text-muted-foreground">{a.description ?? "—"}</TableCell>
                    <TableCell><Badge variant={statusVariant[a.status]}>{a.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" aria-label="Edit" render={<Link href={`/accounting/avans/${a.id}/edit`} />}><Pencil className="size-4 text-primary" /></Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => handleDelete(a)}><Trash2 className="size-4 text-destructive" /></Button>
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
