"use client";

import { useState } from "react";
import { paymentsApi } from "@/lib/api/resources";
import type { PaymentStatus } from "@/lib/api/types";
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
  type Tone,
} from "../parts";

const STATUSES: readonly PaymentStatus[] = ["NotPaid", "Active", "Prepayment", "Paid"];

const tone: Record<PaymentStatus, Tone> = {
  Paid: "success",
  Active: "success",
  Prepayment: "neutral",
  NotPaid: "danger",
};

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <Panel>
      <PanelHeader title="Payments" backHref="/accounting">
        <ExportButton />
      </PanelHeader>

      <Filters>
        <SearchField value={input} onChange={setInput} placeholder="Search payment" />
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
        api={paymentsApi}
        search={search}
        page={page}
        onPageChange={setPage}
        params={{ status: statusIndex(STATUSES, status) }}
        emptyMessage="No payments found."
        minWidth="min-w-[820px]"
        columns={["Full name", "Amount", "Paid", "Date", "Groups", "Branch", "Status"]}
        row={(payment) => {
          const owed = payment.amount - payment.paid;
          return (
            <tr key={payment.id} className="transition-colors hover:bg-muted/40">
              <td className={cellCls}>
                <NameCell
                  name={payment.studentName ?? "—"}
                  sub={payment.groupName}
                  href={`/students/${payment.studentId}`}
                />
              </td>

              <td className={cellCls}>
                <div className="flex items-center gap-2">
                  {/* Red when the student still owes on this invoice. */}
                  <span className={owed > 0 ? "font-semibold text-rose-500" : "font-semibold"}>
                    {money(payment.amount)}
                  </span>
                  {payment.discount > 0 && <Pill tone="warning">-{money(payment.discount)}</Pill>}
                </div>
              </td>

              <td className={cellCls}>{money(payment.paid)}</td>
              <td className={`${cellCls} font-mono text-xs text-muted-foreground`}>
                {shortDate(payment.date)}
              </td>
              <td className={`${cellCls} text-muted-foreground`}>{payment.groupName ?? "—"}</td>
              <td className={`${cellCls} text-muted-foreground`}>{payment.branchName ?? "—"}</td>
              <td className={cellCls}>
                <Pill tone={tone[payment.status]}>{payment.status}</Pill>
              </td>
            </tr>
          );
        }}
      />
    </Panel>
  );
}
