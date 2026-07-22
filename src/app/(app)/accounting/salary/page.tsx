"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { salariesApi, queryKeys } from "@/lib/api/resources";
import type { ActivationStatus, SalaryDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const money = (v: number) => `${new Intl.NumberFormat("en-US").format(Math.round(v))} c.`;
const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const statusVariant: Record<ActivationStatus, "success" | "muted"> = { Active: "success", Inactive: "muted" };

export default function SalaryPage() {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Salaries", { pageSize: 200 }),
    queryFn: () => salariesApi.list({ pageSize: 200 }),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => salariesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Salaries"] }),
  });
  function handleDelete(s: SalaryDto) {
    if (window.confirm(`Delete salary for ${s.employeeName ?? "employee"}?`)) deleteMutation.mutate(s.id);
  }
  const rows = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Salary</h1>
        <Button size="lg" className="gap-1.5" render={<Link href="/accounting/salary/new" />}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

      {isError ? (
        <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load salaries.</CardContent></Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Employee</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Prepaid</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">{Array.from({ length: 8 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>)}</TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow className="hover:bg-transparent"><TableCell colSpan={8} className="py-10 text-center text-muted-foreground">No salaries found.</TableCell></TableRow>
              ) : (
                rows.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.employeeName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{MONTHS[s.month] ?? s.month} {s.year}</TableCell>
                    <TableCell>{money(s.total)}</TableCell>
                    <TableCell className="text-muted-foreground">{money(s.prepaid)}</TableCell>
                    <TableCell className="text-muted-foreground">{money(s.paid)}</TableCell>
                    <TableCell className="text-muted-foreground">{money(s.remaining)}</TableCell>
                    <TableCell><Badge variant={statusVariant[s.status]}>{s.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" aria-label="Edit" render={<Link href={`/accounting/salary/${s.id}/edit`} />}><Pencil className="size-4 text-primary" /></Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => handleDelete(s)}><Trash2 className="size-4 text-destructive" /></Button>
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
