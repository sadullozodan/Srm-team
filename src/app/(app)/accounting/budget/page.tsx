"use client";

import { useState } from "react";
import { budgetsApi } from "@/lib/api/resources";
import type { ActivationStatus } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  PageHeader,
  ResourceList,
  SearchBox,
  StatusFilter,
  money,
  shortDate,
  statusIndex,
  useDebouncedSearch,
} from "../parts";

const STATUSES: readonly ActivationStatus[] = ["Inactive", "Active"];

export default function BudgetPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ActivationStatus | "">("");
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <div className="space-y-6">
      <PageHeader title="Budget plan" />

      <div className="flex flex-wrap items-center gap-3">
        <SearchBox value={input} onChange={setInput} placeholder="Search by category" />
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
        api={budgetsApi}
        search={search}
        page={page}
        onPageChange={setPage}
        params={{ status: statusIndex(STATUSES, status) }}
        emptyMessage="No budget lines found."
        columns={[
          "Category name",
          "From",
          "To",
          "Amount allocated",
          "Amount spent",
          "Remaining",
          "Branch",
          "Status",
        ]}
        row={(budget) => {
          const remaining = budget.amountAllocated - budget.amountSpent;
          return (
            <TableRow key={budget.id}>
              <TableCell className="font-medium">{budget.categoryName ?? "—"}</TableCell>
              <TableCell className="text-muted-foreground">
                {shortDate(budget.fromDate)}
              </TableCell>
              <TableCell className="text-muted-foreground">{shortDate(budget.toDate)}</TableCell>
              <TableCell>{money(budget.amountAllocated)}</TableCell>
              <TableCell className="text-muted-foreground">
                {money(budget.amountSpent)}
              </TableCell>
              {/* Overspend is the number an accountant is looking for, so colour it. */}
              <TableCell className={remaining < 0 ? "text-destructive" : "text-emerald-600"}>
                {money(remaining)}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {budget.branchName ?? "—"}
              </TableCell>
              <TableCell>
                <Badge variant={budget.status === "Active" ? "success" : "muted"}>
                  {budget.status}
                </Badge>
              </TableCell>
            </TableRow>
          );
        }}
      />
    </div>
  );
}
