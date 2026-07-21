"use client";

import { useState } from "react";
import { salariesApi } from "@/lib/api/resources";
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
    <Panel>
      <PanelHeader title="Salary" backHref="/accounting">
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
        api={salariesApi}
        search={search}
        page={page}
        onPageChange={setPage}
        params={{ status: statusIndex(STATUSES, status) }}
        emptyMessage="No salaries found."
        columns={["Full name", "Total", "Prepaid", "Remaining", "Paid", "Month", "Status"]}
        row={(salary) => (
          <tr key={salary.id} className="transition-colors hover:bg-muted/40">
            <td className={cellCls}>
              <NameCell
                name={salary.employeeName ?? "—"}
                href={`/employees/${salary.employeeId}`}
              />
            </td>
            <td className={`${cellCls} font-semibold`}>{money(salary.total)}</td>
            <td className={`${cellCls} text-muted-foreground`}>{money(salary.prepaid)}</td>
            <td className={cellCls}>
              <Pill tone={salary.remaining > 0 ? "warning" : "success"}>
                {money(salary.remaining)}
              </Pill>
            </td>
            <td className={`${cellCls} text-muted-foreground`}>{money(salary.paid)}</td>
            <td className={`${cellCls} text-muted-foreground`}>
              {monthLabel(salary.year, salary.month)}
            </td>
            <td className={cellCls}>
              <Pill tone={salary.status === "Active" ? "success" : "neutral"}>
                {salary.status}
              </Pill>
            </td>
          </tr>
        )}
      />
    </Panel>
  );
}
