"use client";

import { useState } from "react";
import { advancesApi } from "@/lib/api/resources";
import type { AdvanceStatus } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  PageHeader,
  ResourceList,
  SearchBox,
  StatusFilter,
  money,
  monthLabel,
  statusIndex,
  useDebouncedSearch,
} from "../parts";

const STATUSES: readonly AdvanceStatus[] = ["Pending", "Approved", "Denied", "Done"];

const tone: Record<AdvanceStatus, "success" | "warning" | "destructive" | "muted"> = {
  Done: "success",
  Approved: "success",
  Pending: "warning",
  Denied: "destructive",
};

export default function AvansPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<AdvanceStatus | "">("");
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <div className="space-y-6">
      <PageHeader title="Avans" />

      <div className="flex flex-wrap items-center gap-3">
        <SearchBox value={input} onChange={setInput} />
        <StatusFilter
          value={status}
          options={STATUSES}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
        />
      </div>

      <ResourceList
        api={advancesApi}
        search={search}
        page={page}
        onPageChange={setPage}
        params={{ status: statusIndex(STATUSES, status) }}
        emptyMessage="No advances requested."
        columns={["Full name", "Month", "Amount", "Description", "Status"]}
        row={(advance) => (
          <TableRow key={advance.id}>
            <TableCell className="font-medium">{advance.employeeName ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground">
              {monthLabel(advance.year, advance.month)}
            </TableCell>
            <TableCell>{money(advance.amount)}</TableCell>
            <TableCell className="max-w-72 text-muted-foreground">
              <span className="line-clamp-2">{advance.description || "—"}</span>
            </TableCell>
            <TableCell>
              <Badge variant={tone[advance.status]}>{advance.status}</Badge>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}
