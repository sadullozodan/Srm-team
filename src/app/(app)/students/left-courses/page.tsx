"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQueries, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { enrollmentsApi, groupsApi, queryKeys } from "@/lib/api/resources";
import type { EnrollmentDto } from "@/lib/api/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type LeftRow = EnrollmentDto & { groupLabel: string };

// The API has no global "left enrollments" list, so we fan out over every group
// and keep the ones whose status is "Left".
export default function LeftCoursesPage() {
  const [tab, setTab] = useState<"students" | "groups">("students");
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("");

  const groupsQuery = useQuery({
    queryKey: queryKeys.list("Groups", { pageSize: 100 }),
    queryFn: () => groupsApi.list({ pageSize: 100 }),
  });
  const groups = useMemo(() => groupsQuery.data?.items ?? [], [groupsQuery.data]);

  const enrollmentQueries = useQueries({
    queries: groups.map((g) => ({
      queryKey: ["Enrollments", "group", g.id],
      queryFn: () => enrollmentsApi.byGroup(g.id),
    })),
  });

  const loading =
    groupsQuery.isPending || enrollmentQueries.some((q) => q.isPending);

  const leftRows: LeftRow[] = useMemo(() => {
    const rows: LeftRow[] = [];
    enrollmentQueries.forEach((q, i) => {
      const group = groups[i];
      for (const e of q.data ?? []) {
        if (e.status === "Left") {
          rows.push({ ...e, groupLabel: e.groupName ?? group?.name ?? "—" });
        }
      }
    });
    return rows;
  }, [enrollmentQueries, groups]);

  const filtered = leftRows.filter((r) => {
    const matchesSearch = (r.studentName ?? "")
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    const matchesGroup = !groupFilter || r.groupId === groupFilter;
    return matchesSearch && matchesGroup;
  });

  // "Groups" tab: left counts per group.
  const byGroup = useMemo(() => {
    const map = new Map<string, { label: string; count: number }>();
    for (const r of leftRows) {
      const entry = map.get(r.groupId) ?? { label: r.groupLabel, count: 0 };
      entry.count += 1;
      map.set(r.groupId, entry);
    }
    return [...map.entries()].sort((a, b) => b[1].count - a[1].count);
  }, [leftRows]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Left courses
        </h1>
        <div className="flex overflow-hidden rounded-xl border border-border bg-card">
          <TabButton active={tab === "students"} onClick={() => setTab("students")}>
            Students
          </TabButton>
          <TabButton active={tab === "groups"} onClick={() => setTab("groups")}>
            Groups
          </TabButton>
        </div>
      </div>

      {tab === "students" ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-56 flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name"
                className="h-11 rounded-xl bg-card pl-9"
              />
            </div>
            <div className="w-56">
              <Select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="h-11 rounded-xl bg-card"
              >
                <option value="">All groups</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name ?? "—"}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Full name</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i} className="hover:bg-transparent">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : filtered.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      No students have left a course.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">
                        <Link href={`/students/${r.studentId}`} className="hover:text-primary">
                          {r.studentName ?? "—"}
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{r.groupLabel}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.studentPhone ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.leftReason ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="destructive">Left</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Group</TableHead>
                <TableHead className="text-right">Left students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-4 w-10" />
                    </TableCell>
                  </TableRow>
                ))
              ) : byGroup.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={2} className="py-10 text-center text-muted-foreground">
                    No students have left a course.
                  </TableCell>
                </TableRow>
              ) : (
                byGroup.map(([groupId, { label, count }]) => (
                  <TableRow key={groupId}>
                    <TableCell className="font-medium">
                      <Link href={`/groups/${groupId}`} className="hover:text-primary">
                        {label}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{count}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 px-5 text-sm font-medium transition-colors",
        active ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}
