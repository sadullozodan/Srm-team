"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { leadsApi, queryKeys } from "@/lib/api/resources";
import type { LeadDto, LeadType } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const typeVariant: Record<LeadType, "default" | "success"> = { Lead: "default", Client: "success" };

export default function ClientsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<LeadType | "">("");
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Leads", { pageSize: 200, search }),
    queryFn: () => leadsApi.list({ pageSize: 200, search }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => leadsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Leads"] }),
  });

  function handleDelete(lead: LeadDto) {
    if (window.confirm(`Delete ${lead.fullName ?? "this lead"}?`)) deleteMutation.mutate(lead.id);
  }

  const all = data?.items ?? [];
  const rows = type ? all.filter((l) => l.type === type) : all;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Clients &amp; Leads</h1>
        <Button size="lg" className="gap-1.5" render={<Link href="/courses/clients/new" />}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by name" className="h-11 rounded-xl bg-card pl-9" />
        </div>
        <div className="w-44">
          <Select value={type} onChange={(e) => setType(e.target.value as LeadType | "")} className="h-11 rounded-xl bg-card">
            <option value="">All</option>
            <option value="Lead">Lead</option>
            <option value="Client">Client</option>
          </Select>
        </div>
      </div>

      {isError ? (
        <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load leads.</CardContent></Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Full name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Occupation</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">{Array.from({ length: 6 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-20" /></TableCell>)}</TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow className="hover:bg-transparent"><TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No leads found.</TableCell></TableRow>
              ) : (
                rows.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell className="font-medium">{l.fullName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{l.phone ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{l.courseName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{l.occupation}</TableCell>
                    <TableCell><Badge variant={typeVariant[l.type]}>{l.type}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" aria-label="Edit" render={<Link href={`/courses/clients/${l.id}/edit`} />}><Pencil className="size-4 text-primary" /></Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => handleDelete(l)}><Trash2 className="size-4 text-destructive" /></Button>
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
