"use client";

import { useState } from "react";
import { mentorLevelsApi } from "@/lib/api/resources";
import type { MentorLevelType } from "@/lib/api/types";
import {
  ExportButton,
  Filters,
  NameCell,
  Panel,
  PanelHeader,
  Pill,
  ResourceTable,
  SearchField,
  cellCls,
  money,
  monthLabel,
  useDebouncedSearch,
} from "../../accounting/parts";

// "Junior2" on the wire is "Junior 2" on screen.
function levelLabel(level: MentorLevelType) {
  return level.replace(/(\d)$/, " $1");
}

export default function MentorLevelsPage() {
  const [page, setPage] = useState(1);
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <Panel>
      <PanelHeader title="Mentor levels" backHref="/employees">
        <ExportButton />
      </PanelHeader>

      <Filters>
        <SearchField value={input} onChange={setInput} placeholder="Search by mentor" />
      </Filters>

      <ResourceTable
        api={mentorLevelsApi}
        search={search}
        page={page}
        onPageChange={setPage}
        emptyMessage="No mentor levels set."
        minWidth="min-w-[560px]"
        columns={["Full name", "Month", "Level", "Hour rate"]}
        row={(entry) => (
          <tr key={entry.id} className="transition-colors hover:bg-muted/40">
            <td className={cellCls}>
              <NameCell
                name={entry.employeeName ?? "—"}
                href={`/employees/${entry.employeeId}`}
              />
            </td>
            <td className={`${cellCls} text-muted-foreground`}>
              {monthLabel(entry.year, entry.month)}
            </td>
            <td className={cellCls}>
              <Pill tone="brand">{levelLabel(entry.level)}</Pill>
            </td>
            <td className={`${cellCls} font-semibold`}>{money(entry.hourRate)}</td>
          </tr>
        )}
      />
    </Panel>
  );
}
