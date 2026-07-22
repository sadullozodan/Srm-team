"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { leadsApi, queryKeys } from "@/lib/api/resources";
import type { LeadDto, LeadType } from "@/lib/api/types";
import { Filters, NameCell, Panel, PanelHeader, Pill, SearchField, Segmented, cellCls, type Tone } from "../../panels";

const tone: Record<LeadType, Tone> = { Client: "success", Lead: "brand" };
const VIEWS = ["Clients", "Leads", "All"] as const;
type View = (typeof VIEWS)[number];

export default function ClientsPage() {
  const [view, setView] = useState<View>("Clients");
  const [search, setSearch] = useState("");

  const params = { pageSize: 300 };
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Leads", params),
    queryFn: () => leadsApi.list(params),
  });

  const rows = useMemo(() => {
    const all = data?.items ?? [];
    const byView = all.filter((l) => (view === "All" ? true : view === "Clients" ? l.type === "Client" : l.type === "Lead"));
    const q = search.trim().toLowerCase();
    return q
      ? byView.filter((l) => (l.fullName ?? "").toLowerCase().includes(q) || (l.phone ?? "").includes(q))
      : byView;
  }, [data, view, search]);

  return (
    <Panel>
      <PanelHeader title="Clients" backHref="/courses" />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Segmented options={VIEWS} value={view} onChange={setView} />
      </div>

      <Filters>
        <SearchField value={search} onChange={setSearch} placeholder="Search by name or phone" />
      </Filters>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="bg-muted/70 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              {["Name", "Phone", "Course", "Source", "Occupation", "Type"].map((c) => (
                <th key={c} className={cellCls}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs font-medium sm:text-sm">
            {isError ? (
              <RowMessage>Couldn&apos;t load clients.</RowMessage>
            ) : isPending ? (
              <RowMessage>Loading…</RowMessage>
            ) : rows.length === 0 ? (
              <RowMessage>Nothing here.</RowMessage>
            ) : (
              rows.map((lead: LeadDto) => (
                <tr key={lead.id} className="transition-colors hover:bg-muted/40">
                  <td className={cellCls}>
                    <NameCell name={lead.fullName ?? "—"} sub={lead.registerMonth} />
                  </td>
                  <td className={`${cellCls} font-mono text-xs text-muted-foreground`}>{lead.phone ?? "—"}</td>
                  <td className={`${cellCls} text-muted-foreground`}>{lead.courseName ?? "—"}</td>
                  <td className={`${cellCls} text-muted-foreground`}>{lead.utmSource ?? "—"}</td>
                  <td className={`${cellCls} text-muted-foreground`}>{lead.occupation ?? "—"}</td>
                  <td className={cellCls}>
                    <Pill tone={tone[lead.type]}>{lead.type}</Pill>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function RowMessage({ children }: { children: React.ReactNode }) {
  return (
    <tr>
      <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}
