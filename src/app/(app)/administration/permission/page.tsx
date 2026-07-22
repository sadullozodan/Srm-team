"use client";

import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { permissionsApi, queryKeys } from "@/lib/api/resources";
import type { PermissionDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function PermissionsPage() {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Permissions", { pageSize: 200 }),
    queryFn: () => permissionsApi.list({ pageSize: 200 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => permissionsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Permissions"] }),
  });

  function handleDelete(p: PermissionDto) {
    if (window.confirm(`Delete ${p.name ?? "this permission"}?`)) deleteMutation.mutate(p.id);
  }

  const permissions = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Permissions</h1>
        <Button size="lg" className="gap-1.5" render={<Link href="/administration/permission/new" />}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

      {isError ? (
        <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load permissions.</CardContent></Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Group</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">{Array.from({ length: 3 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>)}</TableRow>
                ))
              ) : permissions.length === 0 ? (
                <TableRow className="hover:bg-transparent"><TableCell colSpan={3} className="py-10 text-center text-muted-foreground">No permissions found.</TableCell></TableRow>
              ) : (
                permissions.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name ?? "—"}</TableCell>
                    <TableCell>{p.group ? <Badge variant="muted">{p.group}</Badge> : "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" aria-label="Edit" render={<Link href={`/administration/permission/${p.id}/edit`} />}><Pencil className="size-4 text-primary" /></Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => handleDelete(p)}><Trash2 className="size-4 text-destructive" /></Button>
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
