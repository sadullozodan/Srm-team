"use client";

import { useState } from "react";
import { usersApi } from "@/lib/api/resources";
import { Filters, NameCell, Panel, PanelHeader, Pill, SearchField, cellCls } from "../../panels";
import { ResourceTable, dateTime, useDebouncedSearch } from "../../resource-table";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <Panel>
      <PanelHeader title="Users" />

      <Filters>
        <SearchField value={input} onChange={setInput} placeholder="Search by name or phone" />
      </Filters>

      <ResourceTable
        api={usersApi}
        search={search}
        page={page}
        onPageChange={setPage}
        emptyMessage="No users found."
        minWidth="min-w-[820px]"
        columns={["User", "Login", "Type", "Roles", "Last login", "Status"]}
        row={(user) => (
          <tr key={user.id} className="transition-colors hover:bg-muted/40">
            <td className={cellCls}>
              <NameCell name={user.fullName ?? "—"} />
            </td>
            <td className={`${cellCls} font-mono text-xs text-muted-foreground`}>{user.userName ?? "—"}</td>
            <td className={`${cellCls} text-muted-foreground`}>{user.type ?? "—"}</td>
            <td className={cellCls}>
              <div className="flex flex-wrap gap-1">
                {(user.roles ?? []).length === 0 ? (
                  <span className="text-muted-foreground">—</span>
                ) : (
                  (user.roles ?? []).map((role) => (
                    <Pill key={role} tone="brand">
                      {role}
                    </Pill>
                  ))
                )}
              </div>
            </td>
            <td className={`${cellCls} text-xs text-muted-foreground`}>{dateTime(user.lastLoginAt)}</td>
            <td className={cellCls}>
              <Pill tone={user.status === "Active" ? "success" : "neutral"}>{user.status}</Pill>
            </td>
          </tr>
        )}
      />
    </Panel>
  );
}
