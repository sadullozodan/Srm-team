"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { logsApi } from "@/lib/api/resources";
import { Filters, Panel, PanelHeader, Pill, SearchField, cellCls } from "../../panels";
import { ResourceTable, dateTime, useDebouncedSearch } from "../../resource-table";

export default function LogsPage() {
  const [page, setPage] = useState(1);
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <Panel>
      <PanelHeader title="Logs" />

      <Filters>
        <SearchField value={input} onChange={setInput} placeholder="Search action or actor" />
      </Filters>

      <ResourceTable
        api={logsApi}
        search={search}
        page={page}
        onPageChange={setPage}
        emptyMessage="No activity recorded yet."
        minWidth="min-w-[760px]"
        columns={["Time", "Actor", "Action", "Entity", "Result"]}
        row={(log) => (
          <tr key={log.id} className="transition-colors hover:bg-muted/40">
            <td className={`${cellCls} text-xs whitespace-nowrap text-muted-foreground`}>{dateTime(log.createdAt)}</td>
            <td className={`${cellCls} font-medium`}>{log.actorName ?? "—"}</td>
            <td className={cellCls}>
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{log.action ?? "—"}</code>
              {log.description && <div className="mt-0.5 text-[11px] text-muted-foreground">{log.description}</div>}
            </td>
            <td className={`${cellCls} text-muted-foreground`}>{log.entityType ?? "—"}</td>
            <td className={cellCls}>
              {log.success ? (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" /> Success
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-rose-500">
                  <XCircle className="size-4" /> Failed
                </span>
              )}
            </td>
          </tr>
        )}
      />
    </Panel>
  );
}
