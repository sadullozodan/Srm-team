"use client";

import { useState } from "react";
import { advancesApi } from "@/lib/api/resources";
import type { AdvanceStatus } from "@/lib/api/types";
import {
  ExportButton,
  Filters,
  NameCell,
  Panel,
  PanelHeader,
  Pill,
  ResourceTable,
  SearchField,
  SelectField,
  cellCls,
  money,
  monthLabel,
  statusIndex,
  useDebouncedSearch,
  type Tone,
} from "../parts";

const STATUSES: readonly AdvanceStatus[] = ["Pending", "Approved", "Denied", "Done"];

const tone: Record<AdvanceStatus, Tone> = {
  Done: "success",
  Approved: "success",
  Pending: "warning",
  Denied: "danger",
};

export default function AvansPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<AdvanceStatus | "">("");
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <Panel>
      <PanelHeader title="Avans" backHref="/accounting">
        <ExportButton />
      </PanelHeader>

      <Filters>
        <SearchField value={input} onChange={setInput} />
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
        api={advancesApi}
        search={search}
        page={page}
        onPageChange={setPage}
        params={{ status: statusIndex(STATUSES, status) }}
        emptyMessage="No advances requested."
        minWidth="min-w-[640px]"
        columns={["Full name", "Month", "Amount", "Description", "Status"]}
        row={(advance) => (
          <tr key={advance.id} className="transition-colors hover:bg-muted/40">
            <td className={cellCls}>
              <NameCell
                name={advance.employeeName ?? "—"}
                href={`/employees/${advance.employeeId}`}
              />
            </td>
            <td className={`${cellCls} text-muted-foreground`}>
              {monthLabel(advance.year, advance.month)}
            </td>
            <td className={`${cellCls} font-semibold`}>{money(advance.amount)}</td>
            <td className={`${cellCls} max-w-72 text-muted-foreground`}>
              <span className="line-clamp-2">{advance.description || "—"}</span>
            </td>
            <td className={cellCls}>
              <Pill tone={tone[advance.status]}>{advance.status}</Pill>
            </td>
          </tr>
        )}
      />
    </Panel>
  );
}
