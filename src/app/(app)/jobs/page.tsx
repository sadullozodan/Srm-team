"use client";

import { useState } from "react";
import { Briefcase, MapPin } from "lucide-react";
import { jobsApi } from "@/lib/api/resources";
import type { JobStatus } from "@/lib/api/types";
import { Filters, NameCell, Panel, PanelHeader, Pill, SearchField, SelectField, cellCls } from "../panels";
import { ResourceTable, money, statusIndex, useDebouncedSearch } from "../resource-table";

const STATUSES: readonly JobStatus[] = ["Open", "Closed"];

export default function JobsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<JobStatus | "">("");
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  return (
    <Panel>
      <PanelHeader title="Jobs" />

      <Filters>
        <SearchField value={input} onChange={setInput} placeholder="Search vacancy" />
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
        api={jobsApi}
        search={search}
        page={page}
        onPageChange={setPage}
        params={{ status: statusIndex(STATUSES, status) }}
        emptyMessage="No vacancies yet."
        minWidth="min-w-[780px]"
        columns={["Position", "Company", "Location", "Salary", "Hired", "Status"]}
        row={(job) => (
          <tr key={job.id} className="transition-colors hover:bg-muted/40">
            <td className={cellCls}>
              <span className="inline-flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Briefcase className="size-4" />
                </span>
                <NameCell name={job.title ?? "—"} />
              </span>
            </td>
            <td className={`${cellCls} font-medium`}>{job.company ?? "—"}</td>
            <td className={`${cellCls} text-muted-foreground`}>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {job.location ?? "—"}
              </span>
            </td>
            <td className={cellCls}>{job.salary != null ? money(job.salary) : "—"}</td>
            <td className={`${cellCls} text-muted-foreground`}>{job.graduateName ?? "—"}</td>
            <td className={cellCls}>
              <Pill tone={job.status === "Open" ? "brand" : "neutral"}>{job.status}</Pill>
            </td>
          </tr>
        )}
      />
    </Panel>
  );
}
