"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { debtorsApi, queryKeys } from "@/lib/api/resources";
import type { DebtStatus, DebtorDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const money = (v: number) => `${new Intl.NumberFormat("en-US").format(Math.round(v))} c.`;
const statusVariant: Record<DebtStatus, "success" | "warning"> = { InProgress: "warning", Paid: "success" };

export default function DebtorsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Debtors", { pageSize: 200, search }),
    queryFn: () => debtorsApi.list({ pageSize: 200, search }),
    placeholderData: keepPreviousData,
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => debtorsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Debtors"] }),
  });
  function handleDelete(d: DebtorDto) {
    if (window.confirm(`Delete ${d.fullName ?? "this debtor"}?`)) deleteMutation.mutate(d.id);
  }
  const rows = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Debtors</h1>
        <Button size="lg" className="gap-1.5" render={<Link href="/accounting/debtors/new" />}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by name" className="h-11 rounded-xl bg-card pl-9" />
      </div>

      {isError ? (
        <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load debtors.</CardContent></Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Full name</TableHead>
                <TableHead>Total debt</TableHead>
                <TableHead>Per month</TableHead>
                <TableHead>Paid</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">{Array.from({ length: 7 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>)}</TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow className="hover:bg-transparent"><TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No debtors found.</TableCell></TableRow>
              ) : (
                rows.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.fullName ?? "—"}</TableCell>
                    <TableCell className="text-destructive">{money(d.totalDebtAmount)}</TableCell>
                    <TableCell className="text-muted-foreground">{money(d.paymentPerMonth)}</TableCell>
                    <TableCell className="text-muted-foreground">{money(d.totalPaidAmount)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(d.fromDate).toLocaleDateString("en-GB")} – {new Date(d.toDate).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell><Badge variant={statusVariant[d.status]}>{d.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" aria-label="Edit" render={<Link href={`/accounting/debtors/${d.id}/edit`} />}><Pencil className="size-4 text-primary" /></Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => handleDelete(d)}><Trash2 className="size-4 text-destructive" /></Button>
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
