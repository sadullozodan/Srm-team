"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { mentorLevelsApi } from "@/lib/api/resources";
import type { MentorLevelType } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  PageHeader,
  ResourceList,
  SearchBox,
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
    <div className="space-y-6">
      <PageHeader title="Mentor levels">
        <Button variant="outline" render={<Link href="/employees" />}>
          <ArrowLeft className="size-4" />
          Employees
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBox value={input} onChange={setInput} placeholder="Search by mentor" />
      </div>

      <ResourceList
        api={mentorLevelsApi}
        search={search}
        page={page}
        onPageChange={setPage}
        emptyMessage="No mentor levels set."
        columns={["Full name", "Month", "Level", "Hour rate"]}
        row={(entry) => (
          <TableRow key={entry.id}>
            <TableCell className="font-medium">
              <Link href={`/employees/${entry.employeeId}`} className="hover:text-primary">
                {entry.employeeName ?? "—"}
              </Link>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {monthLabel(entry.year, entry.month)}
            </TableCell>
            <TableCell>
              <Badge>{levelLabel(entry.level)}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">{money(entry.hourRate)}</TableCell>
          </TableRow>
        )}
      />
    </div>
  );
}
