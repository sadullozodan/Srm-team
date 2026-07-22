"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { rolesFullApi } from "@/lib/api/resources";
import { Filters, NameCell, OutlineAction, Panel, PanelHeader, Pill, SearchField, cellCls } from "../../panels";
import { ResourceTable, useDebouncedSearch } from "../../resource-table";

export default function RolesPage() {
  const [page, setPage] = useState(1);
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <Panel>
      <PanelHeader title="Roles">
        <OutlineAction href="/administration/permission">
          <ShieldCheck className="size-4" />
          MANAGE PERMISSIONS
        </OutlineAction>
      </PanelHeader>

      <Filters>
        <SearchField value={input} onChange={setInput} placeholder="Search role" />
      </Filters>

      <ResourceTable
        api={rolesFullApi}
        search={search}
        page={page}
        onPageChange={setPage}
        emptyMessage="No roles."
        minWidth="min-w-[640px]"
        columns={["Role", "Type", "Description"]}
        row={(role) => (
          <tr key={role.id} className="transition-colors hover:bg-muted/40">
            <td className={cellCls}>
              <span className="inline-flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck className="size-4" />
                </span>
                <NameCell name={role.name ?? "—"} />
              </span>
            </td>
            <td className={cellCls}>
              <Pill tone="brand">{role.type}</Pill>
            </td>
            <td className={`${cellCls} text-muted-foreground`}>{role.description ?? "—"}</td>
          </tr>
        )}
      />
    </Panel>
  );
}
