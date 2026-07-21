"use client";

import { useState } from "react";
import { expensesApi } from "@/lib/api/resources";
import type { ActivationStatus, ExpenseCategory } from "@/lib/api/types";
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
  shortDate,
  statusIndex,
  useDebouncedSearch,
} from "../parts";

const STATUSES: readonly ActivationStatus[] = ["Inactive", "Active"];

// The API spells the categories in PascalCase; only one needs splitting.
const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  Tax: "Tax",
  OfficeExpenses: "Office expenses",
  Marketing: "Marketing",
  Employees: "Employees",
  Other: "Other",
};

export default function ExpensesPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ActivationStatus | "">("");
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <Panel>
      <PanelHeader title="Expenses" backHref="/accounting">
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
        api={expensesApi}
        search={search}
        page={page}
        onPageChange={setPage}
        params={{ status: statusIndex(STATUSES, status) }}
        emptyMessage="No expenses recorded."
        minWidth="min-w-[820px]"
        columns={["Full name", "Category", "Total payment", "Recipient", "Branch", "Date", "Status"]}
        row={(expense) => (
          <tr key={expense.id} className="transition-colors hover:bg-muted/40">
            <td className={cellCls}>
              <NameCell name={expense.name ?? "—"} sub={expense.recipient} />
            </td>
            <td className={cellCls}>
              <Pill tone="brand">{CATEGORY_LABELS[expense.category] ?? expense.category}</Pill>
            </td>
            <td className={`${cellCls} font-semibold text-rose-500`}>{money(expense.amount)}</td>
            <td className={`${cellCls} text-muted-foreground`}>{expense.recipient ?? "—"}</td>
            <td className={`${cellCls} text-muted-foreground`}>{expense.branchName ?? "—"}</td>
            <td className={`${cellCls} font-mono text-xs text-muted-foreground`}>
              {shortDate(expense.date)}
            </td>
            <td className={cellCls}>
              <Pill tone={expense.status === "Active" ? "success" : "neutral"}>
                {expense.status}
              </Pill>
            </td>
          </tr>
        )}
      />
    </Panel>
  );
}
