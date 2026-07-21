"use client";

import { useMemo, useState } from "react";
import { ledgerEntries } from "@/lib/series";
import {
  ExportButton,
  Filters,
  NameCell,
  Panel,
  PanelHeader,
  Pill,
  SelectField,
  cellCls,
  money,
  shortDate,
  useLedgerSources,
} from "../parts";

// Payments and expenses on one dated ledger. Merged here rather than by the
// API — there is no combined endpoint (see BACKEND-GAPS.md).

const CATEGORIES = ["Student", "Tax", "OfficeExpenses", "Marketing", "Employees", "Other"] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_LABELS: Record<string, string> = {
  OfficeExpenses: "Office expenses",
};

export default function NetPage() {
  const [category, setCategory] = useState<Category | "">("");
  const { payments, expenses, isPending, isError } = useLedgerSources();

  const rows = useMemo(() => {
    const all = ledgerEntries(payments, expenses);
    return category ? all.filter((entry) => entry.category === category) : all;
  }, [payments, expenses, category]);

  const net = rows.reduce(
    (total, entry) => total + (entry.direction === "in" ? entry.amount : -entry.amount),
    0,
  );

  return (
    <Panel>
      <PanelHeader title="Net" backHref="/accounting">
        <ExportButton />
      </PanelHeader>

      <Filters>
        <SelectField
          label="Category"
          value={category}
          options={CATEGORIES}
          allLabel="All category"
          onChange={setCategory}
        />
      </Filters>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-muted/40 px-4 py-3">
        <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
          Net over {rows.length} {rows.length === 1 ? "entry" : "entries"}
        </span>
        <span
          className={`text-xl font-black ${net < 0 ? "text-rose-500" : "text-emerald-600"}`}
        >
          {money(net)}
        </span>
      </div>

      {isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Couldn&apos;t load the ledger.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full min-w-[600px] border-collapse text-left">
            <thead>
              <tr className="bg-muted/70 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                <th className={cellCls}>Full name</th>
                <th className={cellCls}>Category</th>
                <th className={cellCls}>Date</th>
                <th className={`${cellCls} text-right`}>Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs font-medium sm:text-sm">
              {isPending ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <td key={j} className={cellCls}>
                        <span className="block h-4 w-24 animate-pulse rounded bg-muted" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    Nothing recorded yet.
                  </td>
                </tr>
              ) : (
                rows.map((entry) => (
                  <tr key={entry.id} className="transition-colors hover:bg-muted/40">
                    <td className={cellCls}>
                      <NameCell name={entry.name} />
                    </td>
                    <td className={`${cellCls} text-muted-foreground`}>
                      {CATEGORY_LABELS[entry.category] ?? entry.category}
                    </td>
                    <td className={`${cellCls} font-mono text-xs text-muted-foreground`}>
                      {shortDate(entry.date)}
                    </td>
                    <td className={`${cellCls} text-right`}>
                      <Pill tone={entry.direction === "in" ? "success" : "danger"}>
                        {entry.direction === "in" ? "+" : "−"} {money(entry.amount)}
                      </Pill>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
