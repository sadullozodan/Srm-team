"use client";

import { useState } from "react";
import { Award } from "lucide-react";
import { graduatesFullApi } from "@/lib/api/resources";
import type { GraduateStatus } from "@/lib/api/types";
import { Filters, NameCell, Panel, PanelHeader, Pill, SearchField, cellCls, type Tone } from "../../panels";
import { ResourceTable, shortDate, useDebouncedSearch } from "../../resource-table";

const tone: Record<GraduateStatus, Tone> = {
  Work: "success",
  OpenToWork: "brand",
  Freelancer: "warning",
  Entrepreneur: "neutral",
  FurtherEducation: "neutral",
};

const label: Record<GraduateStatus, string> = {
  Work: "Working",
  OpenToWork: "Open to work",
  Freelancer: "Freelancer",
  Entrepreneur: "Entrepreneur",
  FurtherEducation: "Studying further",
};

export default function GraduatesPage() {
  const [page, setPage] = useState(1);
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <Panel>
      <PanelHeader title="Graduates" backHref="/students" />

      <Filters>
        <SearchField value={input} onChange={setInput} placeholder="Search graduate" />
      </Filters>

      <ResourceTable
        api={graduatesFullApi}
        search={search}
        page={page}
        onPageChange={setPage}
        emptyMessage="No graduates yet."
        minWidth="min-w-[760px]"
        columns={["Graduate", "Group", "Certificate", "Workplace", "Status"]}
        row={(g) => (
          <tr key={g.id} className="transition-colors hover:bg-muted/40">
            <td className={cellCls}>
              <NameCell name={g.studentName ?? "—"} sub={g.serialNumber} />
            </td>
            <td className={`${cellCls} text-muted-foreground`}>{g.groupName ?? "—"}</td>
            <td className={cellCls}>
              <span className="inline-flex items-center gap-1.5">
                <Award className={g.certificateIssued ? "size-4 text-primary" : "size-4 text-muted-foreground"} />
                <span className="font-mono text-xs text-muted-foreground">{shortDate(g.dateOfIssue)}</span>
              </span>
            </td>
            <td className={`${cellCls} text-muted-foreground`}>{g.workPlace ?? "—"}</td>
            <td className={cellCls}>
              <Pill tone={tone[g.status]}>{label[g.status]}</Pill>
            </td>
          </tr>
        )}
      />
    </Panel>
  );
}
