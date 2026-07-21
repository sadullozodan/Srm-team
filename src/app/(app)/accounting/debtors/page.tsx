"use client";

import { useState } from "react";
import { debtorsApi } from "@/lib/api/resources";
import type { DebtStatus } from "@/lib/api/types";
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

const STATUSES: readonly DebtStatus[] = ["InProgress", "Paid"];

export default function DebtorsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<DebtStatus | "">("");
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <Panel>
      <PanelHeader title="Debtors" backHref="/accounting">
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
        api={debtorsApi}
        search={search}
        page={page}
        onPageChange={setPage}
        params={{ status: statusIndex(STATUSES, status) }}
        emptyMessage="Nobody is in debt."
        minWidth="min-w-[900px]"
        columns={[
          "Full name",
          "From",
          "To",
          "Total debt",
          "Per month",
          "Total paid",
          "Notes",
          "Status",
        ]}
        row={(debtor) => (
          <tr key={debtor.id} className="transition-colors hover:bg-muted/40">
            <td className={cellCls}>
              <NameCell name={debtor.fullName ?? "—"} href={`/students/${debtor.studentId}`} />
            </td>
            <td className={`${cellCls} font-mono text-xs text-muted-foreground`}>
              {shortDate(debtor.fromDate)}
            </td>
            <td className={`${cellCls} font-mono text-xs text-muted-foreground`}>
              {shortDate(debtor.toDate)}
            </td>
            <td className={`${cellCls} font-semibold text-rose-500`}>
              {money(debtor.totalDebtAmount)}
            </td>
            <td className={`${cellCls} text-muted-foreground`}>
              {money(debtor.paymentPerMonth)}
            </td>
            <td className={`${cellCls} font-semibold text-emerald-600`}>
              {money(debtor.totalPaidAmount)}
            </td>
            <td className={`${cellCls} max-w-64 text-muted-foreground`}>
              <span className="line-clamp-2">{debtor.notes || "—"}</span>
            </td>
            <td className={cellCls}>
              <Pill tone={debtor.status === "Paid" ? "success" : "warning"}>
                {debtor.status === "InProgress" ? "In progress" : "Paid"}
              </Pill>
            </td>
          </tr>
        )}
      />
    </Panel>
  );
}
