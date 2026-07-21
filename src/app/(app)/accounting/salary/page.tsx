"use client";

import { useState } from "react";
import { salariesApi } from "@/lib/api/resources";
import type { ActivationStatus } from "@/lib/api/types";
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

const STATUSES: readonly ActivationStatus[] = ["Inactive", "Active"];

export default function SalaryPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ActivationStatus | "">("");
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <div className="space-y-6">
      <PageHeader title="Salary" />

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
        api={salariesApi}
        search={search}
        page={page}
        onPageChange={setPage}
        params={{ status: statusIndex(STATUSES, status) }}
        emptyMessage="No salaries found."
        columns={["Full name", "Month", "Total", "Prepaid", "Paid", "Remaining", "Status"]}
        row={(salary) => (
          <TableRow key={salary.id}>
            <TableCell className="font-medium">{salary.employeeName ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground">
              {monthLabel(salary.year, salary.month)}
            </TableCell>
            <TableCell>{money(salary.total)}</TableCell>
            <TableCell className="text-muted-foreground">{money(salary.prepaid)}</TableCell>
            <TableCell className="text-muted-foreground">{money(salary.paid)}</TableCell>
            <TableCell className={salary.remaining > 0 ? "text-amber-600" : "text-emerald-600"}>
              {money(salary.remaining)}
            </TableCell>
            <TableCell>
              <Badge variant={salary.status === "Active" ? "success" : "muted"}>
                {salary.status}
              </Badge>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}
