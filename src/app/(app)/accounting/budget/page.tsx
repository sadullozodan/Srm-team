"use client";

import { useState } from "react";
import { budgetsApi } from "@/lib/api/resources";
import type { ActivationStatus } from "@/lib/api/types";
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

export default function BudgetPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ActivationStatus | "">("");
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <Panel>
      <PanelHeader title="Budget plan" backHref="/accounting">
        <ExportButton />
      </PanelHeader>

      <Filters>
        <SearchField value={input} onChange={setInput} placeholder="Search by category" />
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
        api={budgetsApi}
        search={search}
        page={page}
        onPageChange={setPage}
        params={{ status: statusIndex(STATUSES, status) }}
        emptyMessage="No budget lines found."
        minWidth="min-w-[880px]"
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
            <tr key={budget.id} className="transition-colors hover:bg-muted/40">
              <td className={cellCls}>
                <NameCell name={budget.categoryName ?? "—"} sub={budget.branchName} />
              </td>
              <td className={`${cellCls} font-mono text-xs text-muted-foreground`}>
                {shortDate(budget.fromDate)}
              </td>
              <td className={`${cellCls} font-mono text-xs text-muted-foreground`}>
                {shortDate(budget.toDate)}
              </td>
              <td className={`${cellCls} font-semibold`}>{money(budget.amountAllocated)}</td>
              <td className={`${cellCls} text-muted-foreground`}>{money(budget.amountSpent)}</td>
              {/* Overspend is the number an accountant is looking for. */}
              <td className={cellCls}>
                <Pill tone={remaining < 0 ? "danger" : "success"}>{money(remaining)}</Pill>
              </td>
              <td className={`${cellCls} text-muted-foreground`}>{budget.branchName ?? "—"}</td>
              <td className={cellCls}>
                <Pill tone={budget.status === "Active" ? "success" : "neutral"}>
                  {budget.status}
                </Pill>
              </td>
            </tr>
          );
        }}
      />
    </Panel>
  );
}
