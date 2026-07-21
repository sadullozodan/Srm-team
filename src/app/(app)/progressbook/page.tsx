"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronRight, ClipboardList, Search } from "lucide-react";
import { groupsApi, queryKeys } from "@/lib/api/resources";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function dateRange(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "—";
  return `${dateFmt.format(s)} - ${dateFmt.format(e)}`;
}

// Journal is per-group, so Progressbook starts by picking a group.
export default function ProgressbookPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Groups", { pageSize: 30, search }),
    queryFn: () => groupsApi.list({ pageSize: 30, search }),
    placeholderData: keepPreviousData,
  });

  const groups = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Progressbook</h1>
        <p className="mt-1 text-muted-foreground">Pick a group to open its journal.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search group"
          className="h-11 rounded-xl bg-card pl-9"
        />
      </div>

      {isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Couldn&apos;t load groups.
          </CardContent>
        </Card>
      ) : isPending ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            No groups found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((g) => (
            <Link key={g.id} href={`/progressbook/${g.id}`} className="block">
              <Card className="h-full transition-colors hover:border-primary/40">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                    <ClipboardList className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{g.name ?? "—"}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {dateRange(g.startDate, g.endDate)}
                    </p>
                  </div>
                  <Badge variant="muted">{g.enrolledCount} students</Badge>
                  <ChevronRight className="size-4 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
