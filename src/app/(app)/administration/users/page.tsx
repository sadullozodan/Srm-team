"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Power, Search, Trash2 } from "lucide-react";
import { usersApi, queryKeys } from "@/lib/api/resources";
import type { ActivationStatus, UserDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const statusVariant: Record<ActivationStatus, "success" | "muted"> = { Active: "success", Inactive: "muted" };

export default function UsersPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["Users"] });

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Users", { pageSize: 100, search }),
    queryFn: () => usersApi.list({ pageSize: 100, search }),
    placeholderData: keepPreviousData,
  });

  const statusMutation = useMutation({
    mutationFn: (vars: { id: string; status: ActivationStatus }) => usersApi.setStatus(vars.id, vars.status),
    onSuccess: invalidate,
  });
  const resetMutation = useMutation({
    mutationFn: (vars: { id: string; password: string }) => usersApi.resetPassword(vars.id, vars.password),
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: invalidate,
  });

  function toggleStatus(u: UserDto) {
    statusMutation.mutate({ id: u.id, status: u.status === "Active" ? "Inactive" : "Active" });
  }
  function resetPassword(u: UserDto) {
    const password = window.prompt(`New password for ${u.userName ?? "user"}:`);
    if (password) resetMutation.mutate({ id: u.id, password });
  }
  function handleDelete(u: UserDto) {
    if (window.confirm(`Delete ${u.fullName ?? u.userName ?? "this user"}?`)) deleteMutation.mutate(u.id);
  }

  const users = data?.items ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Users</h1>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search by name" className="h-11 rounded-xl bg-card pl-9" />
      </div>

      {isError ? (
        <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load users.</CardContent></Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Full name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">{Array.from({ length: 5 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>)}</TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow className="hover:bg-transparent"><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No users found.</TableCell></TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.fullName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{u.userName ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{u.roles?.join(", ") || "—"}</TableCell>
                    <TableCell><Badge variant={statusVariant[u.status]}>{u.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" aria-label="Toggle status" title="Toggle status" onClick={() => toggleStatus(u)}>
                          <Power className="size-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Reset password" title="Reset password" onClick={() => resetPassword(u)}>
                          <KeyRound className="size-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => handleDelete(u)}>
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
