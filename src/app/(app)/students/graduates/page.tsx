"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { graduatesApi, queryKeys } from "@/lib/api/resources";
import type { GraduateDto, GraduateStatus } from "@/lib/api/types";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_ORDER: GraduateStatus[] = [
  "OpenToWork",
  "Work",
  "Freelancer",
  "Entrepreneur",
  "FurtherEducation",
];

const statusColor: Record<GraduateStatus, string> = {
  OpenToWork: "text-primary",
  Work: "text-emerald-600 dark:text-emerald-400",
  Freelancer: "text-purple-600 dark:text-purple-400",
  Entrepreneur: "text-amber-600 dark:text-amber-400",
  FurtherEducation: "text-cyan-600 dark:text-cyan-400",
};

const dateFmt = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function fmtDate(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : dateFmt.format(d);
}

export default function GraduatesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<GraduateStatus | "">("");

  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Graduates", { pageSize: 500, search }),
    queryFn: () => graduatesApi.list({ pageSize: 500, search }),
    placeholderData: keepPreviousData,
  });

  const all = useMemo(() => data?.items ?? [], [data]);

  const counts = useMemo(() => {
    const c: Record<GraduateStatus, number> = {
      OpenToWork: 0,
      Work: 0,
      Freelancer: 0,
      Entrepreneur: 0,
      FurtherEducation: 0,
    };
    for (const g of all) c[g.status] = (c[g.status] ?? 0) + 1;
    return c;
  }, [all]);

  const rows = status ? all.filter((g) => g.status === status) : all;

  const tiles = [
    { label: "Graduates", value: data?.totalCount ?? all.length },
    { label: "Employed", value: counts.Work },
    { label: "Open to work", value: counts.OpenToWork },
    { label: "Freelancer", value: counts.Freelancer },
    { label: "Further edu", value: counts.FurtherEducation },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Graduates</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map((t) => (
          <Card key={t.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">
                {isPending ? "—" : t.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{t.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, serial"
            className="h-11 rounded-xl bg-card pl-9"
          />
        </div>
        <div className="w-52">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as GraduateStatus | "")}
            className="h-11 rounded-xl bg-card"
          >
            <option value="">All statuses</option>
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Couldn&apos;t load graduates.
          </CardContent>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Full name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Work place</TableHead>
                <TableHead>Date of issue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                    No graduates found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((g: GraduateDto) => (
                  <TableRow key={g.id}>
                    <TableCell>
                      <Link
                        href={`/students/${g.studentId}`}
                        className="font-medium hover:text-primary"
                      >
                        {g.studentName ?? "—"}
                      </Link>
                      <p className={`text-xs font-medium ${statusColor[g.status]}`}>
                        #{g.status}
                      </p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{g.age ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {g.groupName ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {g.serialNumber ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {g.workPlace ?? "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {fmtDate(g.dateOfIssue)}
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
