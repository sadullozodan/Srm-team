"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { branchesApi } from "@/lib/api/resources";
import type { ActivationStatus } from "@/lib/api/types";
import { Filters, NameCell, Panel, PanelHeader, Pill, SearchField, SelectField, cellCls } from "../panels";
import { ResourceTable, statusIndex, useDebouncedSearch } from "../resource-table";

const STATUSES: readonly ActivationStatus[] = ["Active", "Inactive"];

export default function BranchesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ActivationStatus | "">("");
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <Panel>
      <PanelHeader title="Branches" />

      <Filters>
        <SearchField value={input} onChange={setInput} placeholder="Search branch" />
        <SelectField
          label="Status"
          value={status}
          options={STATUSES}
          allLabel="All status"
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />
      </Filters>

      <ResourceTable
        api={branchesApi}
        search={search}
        page={page}
        onPageChange={setPage}
        params={{ status: statusIndex(STATUSES, status) }}
        emptyMessage="No branches found."
        columns={["Branch", "City", "District", "Address", "Status"]}
        row={(branch) => (
          <tr key={branch.id} className="transition-colors hover:bg-muted/40">
            <td className={cellCls}>
              <NameCell name={branch.title ?? "—"} sub={branch.city} />
            </td>
            <td className={`${cellCls} text-muted-foreground`}>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                {branch.city ?? "—"}
              </span>
            </td>
            <td className={`${cellCls} text-muted-foreground`}>{branch.district ?? "—"}</td>
            <td className={`${cellCls} text-muted-foreground`}>{branch.address ?? "—"}</td>
            <td className={cellCls}>
              <Pill tone={branch.status === "Active" ? "success" : "neutral"}>{branch.status}</Pill>
            </td>
          </tr>
        )}
      />
    </Panel>
  );
}
