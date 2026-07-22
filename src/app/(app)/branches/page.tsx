"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { branchesApi, queryKeys } from "@/lib/api/resources";
import type { ActivationStatus, BranchDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const statusVariant: Record<ActivationStatus, "success" | "muted"> = {
  Active: "success",
  Inactive: "muted",
};

export default function BranchesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Branches", { pageSize: 100, search }),
    queryFn: () => branchesApi.list({ pageSize: 100, search }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => branchesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Branches"] }),
  });

  function handleDelete(branch: BranchDto) {
    if (window.confirm(`Delete ${branch.title ?? "this branch"}? This can't be undone.`)) {
      deleteMutation.mutate(branch.id);
    }
  }

  const branches = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Branches</h1>
        <Button size="lg" className="gap-1.5" render={<Link href="/branches/new" />}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name"
          className="h-11 rounded-xl bg-card pl-9"
        />
      </div>

      {isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Couldn&apos;t load branches.
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Title</TableHead>
                <TableHead>City</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : branches.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No branches found.
                  </TableCell>
                </TableRow>
              ) : (
                branches.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.title ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{b.city ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{b.district ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{b.address ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Edit"
                          render={<Link href={`/branches/${b.id}/edit`} />}
                        >
                          <Pencil className="size-4 text-primary" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          aria-label="Delete"
                          onClick={() => handleDelete(b)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
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
