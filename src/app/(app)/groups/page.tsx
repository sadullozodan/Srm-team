"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  LayoutGrid,
  List,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { coursesApi, groupsApi, queryKeys } from "@/lib/api/resources";
import type { GroupDto, GroupStatus } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

// GroupStatus is a string on the wire but the list filter takes its integer index.
const STATUS_ORDER: GroupStatus[] = ["New", "Started", "Finished", "Cancelled"];
const statusVariant: Record<GroupStatus, "muted" | "success" | "warning" | "destructive"> = {
  New: "muted",
  Started: "success",
  Finished: "warning",
  Cancelled: "destructive",
};

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

function duration(start: string, end: string): string {
  const s = new Date(start);
  const e = new Date(end);
  if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return "—";
  const months = Math.max(
    1,
    Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24 * 30))
  );
  if (months >= 12) {
    const years = Math.round(months / 12);
    return `${years} year${years > 1 ? "s" : ""}`;
  }
  return `${months} month${months > 1 ? "s" : ""}`;
}

function timeRange(start: string | null, end: string | null): string | null {
  if (!start && !end) return null;
  const fmt = (t: string | null) => (t ? t.slice(0, 5) : "");
  return `${fmt(start)} - ${fmt(end)}`;
}

export default function GroupsPage() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<GroupStatus | "">("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  const queryClient = useQueryClient();
  const statusParam = status ? STATUS_ORDER.indexOf(status) : undefined;

  const { data, isPending, isError, error, isPlaceholderData } = useQuery({
    queryKey: queryKeys.list("Groups", { page, pageSize: PAGE_SIZE, search, status: statusParam }),
    queryFn: () =>
      groupsApi.list({ page, pageSize: PAGE_SIZE, search, status: statusParam }),
    placeholderData: keepPreviousData,
  });

  const coursesQuery = useQuery({
    queryKey: queryKeys.list("Courses", { pageSize: 5 }),
    queryFn: () => coursesApi.list({ pageSize: 5 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => groupsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Groups"] }),
  });

  function handleDelete(group: GroupDto) {
    if (window.confirm(`Delete ${group.name ?? "this group"}? This can't be undone.`)) {
      deleteMutation.mutate(group.id);
    }
  }

  const groups = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Groups</h1>
        <Button size="lg" className="gap-1.5" render={<Link href="/groups/new" />}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

      {/* Course overview cards */}
      {coursesQuery.data?.items && coursesQuery.data.items.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {coursesQuery.data.items.map((course) => (
            <Card key={course.id}>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{course.groupsCount}</p>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {course.title ?? "Untitled"}
                </p>
              </CardContent>
            </Card>
          ))}
          <Link href="/courses" className="block">
            <Card className="flex h-full items-center justify-center transition-colors hover:border-primary/40">
              <CardContent className="flex flex-col items-center gap-1 p-4 text-primary">
                <ArrowRight className="size-5" />
                <span className="text-sm font-medium">See more</span>
              </CardContent>
            </Card>
          </Link>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search group"
            className="h-11 rounded-xl bg-card pl-9"
          />
        </div>

        <div className="w-44">
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as GroupStatus | "");
              setPage(1);
            }}
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

        <div className="flex overflow-hidden rounded-xl border border-border bg-card">
          <ViewToggle active={view === "grid"} onClick={() => setView("grid")} label="Grid view">
            <LayoutGrid className="size-4" />
          </ViewToggle>
          <ViewToggle active={view === "list"} onClick={() => setView("list")} label="List view">
            <List className="size-4" />
          </ViewToggle>
        </div>
      </div>

      {isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Couldn&apos;t load groups
            {error instanceof Error ? `: ${error.message}` : "."}
          </CardContent>
        </Card>
      ) : view === "list" ? (
        <ListView groups={groups} loading={isPending} onDelete={handleDelete} />
      ) : (
        <GridView groups={groups} loading={isPending} />
      )}

      {!isError && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={data?.totalCount ?? 0}
          disabled={isPlaceholderData}
          onPrev={() => setPage((p) => Math.max(1, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        />
      )}
    </div>
  );
}

function ListView({
  groups,
  loading,
  onDelete,
}: {
  groups: GroupDto[];
  loading: boolean;
  onDelete: (group: GroupDto) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Group</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Students</TableHead>
            <TableHead>Branch</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : groups.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                No groups found.
              </TableCell>
            </TableRow>
          ) : (
            groups.map((g) => (
              <TableRow key={g.id}>
                <TableCell>
                  <Link href={`/groups/${g.id}`} className="font-medium hover:text-primary">
                    {g.name ?? "—"}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {dateRange(g.startDate, g.endDate)}
                  </p>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {duration(g.startDate, g.endDate)}
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">
                    {g.enrolledCount}/{g.requiredStudents}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{g.branchName ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={statusVariant[g.status]}>{g.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Journal"
                      render={<Link href={`/progressbook/${g.id}`} />}
                    >
                      <ClipboardList className="size-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Edit"
                      render={<Link href={`/groups/${g.id}/edit`} />}
                    >
                      <Pencil className="size-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete"
                      onClick={() => onDelete(g)}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

function GridView({ groups, loading }: { groups: GroupDto[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-muted-foreground">
          No groups found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {groups.map((g) => {
        const time = timeRange(g.startTime, g.endTime);
        return (
          <Card key={g.id} className="transition-colors hover:border-primary/40">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <Link href={`/groups/${g.id}`} className="min-w-0">
                  <p className="truncate font-semibold hover:text-primary">
                    {g.name ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dateRange(g.startDate, g.endDate)}
                  </p>
                </Link>
                <Badge variant="success">
                  {g.enrolledCount}/{g.requiredStudents}
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground">
                {g.days && <p>{g.days}</p>}
                <p>
                  {duration(g.startDate, g.endDate)}
                  {time ? ` (${time})` : ""}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-1.5"
                  render={<Link href={`/progressbook/${g.id}`} />}
                >
                  <ClipboardList className="size-4" />
                  Journal
                </Button>
                <Badge variant={statusVariant[g.status]}>{g.status}</Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ViewToggle({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex size-11 items-center justify-center transition-colors",
        active ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  disabled,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  total: number;
  disabled: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>{total} total</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={onPrev} disabled={disabled || page <= 1} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-20 text-center">
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <Button variant="outline" size="icon" onClick={onNext} disabled={disabled || page >= totalPages} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
