"use client";

import { useState } from "react";
import { expensesApi } from "@/lib/api/resources";
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

// The API spells the categories in PascalCase; only one needs splitting.
const CATEGORY_LABELS: Record<string, string> = {
  OfficeExpenses: "Office expenses",
};

export default function ExpensesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ActivationStatus | "">("");
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <div className="space-y-6">
      <PageHeader title="Expenses" />

      <div className="flex flex-wrap items-center gap-3">
        <SearchBox value={input} onChange={setInput} placeholder="Search by name" />
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
        api={expensesApi}
        search={search}
        page={page}
        onPageChange={setPage}
        params={{ status: statusIndex(STATUSES, status) }}
        emptyMessage="No expenses recorded."
        columns={["Name", "Category", "Amount", "Recipient", "Branch", "Date", "Status"]}
        row={(expense) => (
          <TableRow key={expense.id}>
            <TableCell className="font-medium">{expense.name ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground">
              {CATEGORY_LABELS[expense.category] ?? expense.category}
            </TableCell>
            <TableCell className="text-destructive">{money(expense.amount)}</TableCell>
            <TableCell className="text-muted-foreground">{expense.recipient ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground">{expense.branchName ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground">{shortDate(expense.date)}</TableCell>
            <TableCell>
              <Badge variant={expense.status === "Active" ? "success" : "muted"}>
                {expense.status}
              </Badge>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}
