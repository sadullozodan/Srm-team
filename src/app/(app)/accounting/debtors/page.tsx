"use client";

import { useState } from "react";
import Link from "next/link";
import { debtorsApi } from "@/lib/api/resources";
import type { DebtStatus } from "@/lib/api/types";
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

const STATUSES: readonly DebtStatus[] = ["InProgress", "Paid"];

export default function DebtorsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<DebtStatus | "">("");
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <div className="space-y-6">
      <PageHeader title="Debtors" />

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
        api={debtorsApi}
        search={search}
        page={page}
        onPageChange={setPage}
        params={{ status: statusIndex(STATUSES, status) }}
        emptyMessage="Nobody is in debt."
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
          <TableRow key={debtor.id}>
            <TableCell className="font-medium">
              <Link href={`/students/${debtor.studentId}`} className="hover:text-primary">
                {debtor.fullName ?? "—"}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">{shortDate(debtor.fromDate)}</TableCell>
            <TableCell className="text-muted-foreground">{shortDate(debtor.toDate)}</TableCell>
            <TableCell className="text-destructive">
              {money(debtor.totalDebtAmount)}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {money(debtor.paymentPerMonth)}
            </TableCell>
            <TableCell className="text-emerald-600">{money(debtor.totalPaidAmount)}</TableCell>
            <TableCell className="max-w-64 text-muted-foreground">
              <span className="line-clamp-2">{debtor.notes || "—"}</span>
            </TableCell>
            <TableCell>
              <Badge variant={debtor.status === "Paid" ? "success" : "warning"}>
                {debtor.status === "InProgress" ? "In progress" : "Paid"}
              </Badge>
            </TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}
