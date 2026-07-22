"use client";

import { useState } from "react";
import { MessageSquare, Users } from "lucide-react";
import { smsMailingsApi } from "@/lib/api/resources";
import { Filters, Panel, PanelHeader, Pill, SearchField, cellCls } from "../panels";
import { ResourceTable, dateTime, useDebouncedSearch } from "../resource-table";

export default function SmsMailingsPage() {
  const [page, setPage] = useState(1);
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <Panel>
      <PanelHeader title="SMS mailings" />

      <Filters>
        <SearchField value={input} onChange={setInput} placeholder="Search mailing" />
      </Filters>

      <ResourceTable
        api={smsMailingsApi}
        search={search}
        page={page}
        onPageChange={setPage}
        emptyMessage="No mailings sent yet."
        minWidth="min-w-[760px]"
        columns={["Mailing", "Audience", "Recipients", "Sent"]}
        row={(m) => (
          <tr key={m.id} className="align-top transition-colors hover:bg-muted/40">
            <td className={cellCls}>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <MessageSquare className="size-4" />
                </span>
                <div>
                  <div className="font-bold">{m.title ?? "—"}</div>
                  <div className="mt-0.5 line-clamp-2 max-w-md text-[11px] text-muted-foreground">{m.body}</div>
                </div>
              </div>
            </td>
            <td className={cellCls}>
              <Pill tone="brand">{m.targetType}</Pill>
            </td>
            <td className={cellCls}>
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <Users className="size-3.5 text-muted-foreground" />
                {m.recipientCount}
              </span>
            </td>
            <td className={`${cellCls} text-xs whitespace-nowrap text-muted-foreground`}>{dateTime(m.sentAt)}</td>
          </tr>
        )}
      />
    </Panel>
  );
}
