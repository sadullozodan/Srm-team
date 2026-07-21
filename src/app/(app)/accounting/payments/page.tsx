"use client";

import { useState } from "react";
import { paymentsApi } from "@/lib/api/resources";
import type { PaymentStatus } from "@/lib/api/types";
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

const STATUSES: readonly PaymentStatus[] = ["NotPaid", "Active", "Prepayment", "Paid"];

const tone: Record<PaymentStatus, "success" | "warning" | "destructive" | "muted"> = {
  Paid: "success",
  Prepayment: "warning",
  Active: "muted",
  NotPaid: "destructive",
};

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<PaymentStatus | "">("");
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <div className="space-y-6">
      <PageHeader title="Payment's" />

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
        api={paymentsApi}
        search={search}
        page={page}
        onPageChange={setPage}
        params={{ status: statusIndex(STATUSES, status) }}
        emptyMessage="No payments found."
        columns={[
          "Full name",
          "Amount",
          "Paid",
          "Discount",
          "Date",
          "Group",
          "Branch",
          "Status",
        ]}
        row={(payment) => (
          <TableRow key={payment.id}>
            <TableCell className="font-medium">{payment.studentName ?? "—"}</TableCell>
            <TableCell>{money(payment.amount)}</TableCell>
            <TableCell className="text-muted-foreground">{money(payment.paid)}</TableCell>
            <TableCell className="text-muted-foreground">
              {payment.discount > 0 ? money(payment.discount) : "—"}
            </TableCell>
            <TableCell className="text-muted-foreground">{shortDate(payment.date)}</TableCell>
            <TableCell className="text-muted-foreground">{payment.groupName ?? "—"}</TableCell>
            <TableCell className="text-muted-foreground">{payment.branchName ?? "—"}</TableCell>
            <TableCell>
              <Badge variant={tone[payment.status]}>{payment.status}</Badge>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}
