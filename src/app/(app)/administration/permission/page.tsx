"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { permissionsApi, rolesFullApi } from "@/lib/api/resources";
import type { PermissionDto, RoleDto } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { Panel, PanelHeader, PrimaryAction } from "../../panels";

export default function PermissionPage() {
  const queryClient = useQueryClient();
  const [roleId, setRoleId] = useState<string>("");
  const [enabled, setEnabled] = useState<Set<string>>(new Set());

  const roles = useQuery({
    queryKey: ["roles", "list"],
    queryFn: () => rolesFullApi.list({ pageSize: 50 }),
  });

  const permissions = useQuery({
    queryKey: ["permissions", "all"],
    queryFn: () => permissionsApi.list({ pageSize: 300 }),
  });

  // Default to the first role once loaded.
  useEffect(() => {
    if (!roleId && roles.data?.items?.length) setRoleId(roles.data.items[0].id);
  }, [roles.data, roleId]);

  const rolePerms = useQuery({
    queryKey: ["roles", roleId, "permissions"],
    queryFn: () => rolesFullApi.getPermissions(roleId),
    enabled: !!roleId,
  });

  useEffect(() => {
    if (rolePerms.data) setEnabled(new Set(rolePerms.data.permissionIds));
  }, [rolePerms.data]);

  const grouped = useMemo(() => {
    const map = new Map<string, PermissionDto[]>();
    for (const p of permissions.data?.items ?? []) {
      const key = p.group ?? "Other";
      (map.get(key) ?? map.set(key, []).get(key)!).push(p);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [permissions.data]);

  const save = useMutation({
    mutationFn: () => rolesFullApi.setPermissions(roleId, [...enabled]),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["roles", roleId, "permissions"] }),
  });

  const toggle = (id: string) =>
    setEnabled((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <Panel>
      <PanelHeader title="Permission">
        <PrimaryAction onClick={() => save.mutate()} disabled={!roleId || save.isPending}>
          {save.isPending ? "SAVING…" : "SAVE"}
        </PrimaryAction>
      </PanelHeader>

      {/* Role selector */}
      <div className="flex flex-wrap gap-2">
        {(roles.data?.items ?? []).map((role: RoleDto) => (
          <button
            key={role.id}
            type="button"
            onClick={() => setRoleId(role.id)}
            className={cn(
              "rounded-xl border px-4 py-2 text-xs font-bold transition-colors",
              role.id === roleId
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {role.name}
          </button>
        ))}
      </div>

      {save.isError && <p className="text-sm text-destructive">Couldn&apos;t save. Try again.</p>}

      {permissions.isPending || rolePerms.isPending ? (
        <div className="flex items-center gap-2 py-10 text-muted-foreground">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {grouped.map(([group, perms]) => (
            <div key={group} className="rounded-2xl border border-border p-4">
              <h3 className="mb-3 text-sm font-black tracking-tight">{group}</h3>
              <div className="space-y-1">
                {perms.map((p) => {
                  const on = enabled.has(p.id);
                  const action = (p.name ?? "").split(".").pop();
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggle(p.id)}
                      className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted"
                    >
                      <span className="text-xs font-medium">{action}</span>
                      <span
                        aria-pressed={on}
                        className={cn(
                          "relative h-5 w-9 rounded-full transition-colors",
                          on ? "bg-primary" : "bg-muted-foreground/30",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-0.5 size-4 rounded-full bg-white transition-all",
                            on ? "left-[18px]" : "left-0.5",
                          )}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}
