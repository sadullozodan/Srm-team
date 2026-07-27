"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Plus, Power, Search, Trash2 } from "lucide-react";
import { rolesApi, usersApi, queryKeys } from "@/lib/api/resources";
import type { ActivationStatus, RoleDto, UserDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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

  const { data: usersData, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Users", { pageSize: 100, search }),
    queryFn: () => usersApi.list({ pageSize: 100, search }),
    placeholderData: keepPreviousData,
  });

  const { data: allRoles } = useQuery({
    queryKey: queryKeys.list("Roles", { pageSize: 100 }),
    queryFn: () => rolesApi.list({ pageSize: 100 }),
  });

  const roleByType = useMemo(() => {
    const map = new Map<string, RoleDto>();
    for (const r of allRoles?.items ?? []) {
      if (r.type) map.set(r.type, r);
    }
    return map;
  }, [allRoles]);

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
  const rolesMutation = useMutation({
    mutationFn: (vars: { id: string; roleType: string }) => {
      const role = roleByType.get(vars.roleType);
      if (!role) throw new Error(`Unknown role type: ${vars.roleType}`);
      return usersApi.setRoles(vars.id, [role.id]);
    },
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

  const users = usersData?.items ?? [];
  const roleTypes = Array.from(roleByType.keys());

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Users</h1>
        <Button size="lg" className="gap-1.5" render={<Link href="/administration/users/new" />}>
          <Plus className="size-4" />
          Create user
        </Button>
      </div>

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
                users.map((u) => {
                  const currentType = u.roles?.[0] ? (roleByType.get(u.roles[0]) ? u.roles[0] : null) : null;
                  return (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.fullName ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{u.userName ?? "—"}</TableCell>
                      <TableCell>
                        <Select
                          value={currentType ?? ""}
                          onChange={(e) => rolesMutation.mutate({ id: u.id, roleType: e.target.value })}
                          className="h-8 w-36"
                        >
                          <option value="" disabled>Set role…</option>
                          {roleTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                        </Select>
                      </TableCell>
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
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
