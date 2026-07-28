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
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  LayoutGrid,
  List,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  BookOpen,
} from "lucide-react";
import { coursesApi, enrollmentsApi, groupsApi, queryKeys } from "@/lib/api/resources";
import type { EnrollmentDto, GroupDto, GroupStatus } from "@/lib/api/types";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;

const STATUS_ORDER: GroupStatus[] = ["New", "Started", "Finished", "Cancelled"];
const statusVariant: Record<GroupStatus, "muted" | "success" | "warning" | "destructive"> = {
  New: "muted",
  Started: "success",
  Finished: "warning",
  Cancelled: "destructive",
};

const enrollmentVariant: Record<string, "success" | "muted" | "warning" | "destructive"> = {
  Active: "success",
  Left: "destructive",
  Transferred: "warning",
  Graduated: "muted",
};

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function fmtDate(value: string): string {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? value : dateFmt.format(d);
}

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
  const [selectedId, setSelectedId] = useState<string | null>(null);

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

  const groupQuery = useQuery({
    queryKey: queryKeys.detail("Groups", selectedId!),
    queryFn: () => groupsApi.get(selectedId!),
    enabled: !!selectedId,
  });

  const enrollmentsQuery = useQuery({
    queryKey: ["Enrollments", "group", selectedId],
    queryFn: () => enrollmentsApi.byGroup(selectedId!),
    enabled: !!selectedId,
  });

  function handleDelete(group: GroupDto) {
    if (window.confirm(`Delete ${group.name ?? "this group"}? This can't be undone.`)) {
      deleteMutation.mutate(group.id);
    }
  }

  const groups = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const detail = groupQuery.data;
  const roster = enrollmentsQuery.data?.filter((e) => e.status !== "Left") ?? [];
  const left = enrollmentsQuery.data?.filter((e) => e.status === "Left") ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Groups</h1>
        <Button size="lg" className="gap-1.5" render={<Link href="/groups/new" />}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

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
        <ListView groups={groups} loading={isPending} onDelete={handleDelete} onSelect={setSelectedId} />
      ) : (
        <GridView groups={groups} loading={isPending} onSelect={setSelectedId} />
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

      <Sheet open={!!selectedId} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <SheetContent className="w-full sm:max-w-lg p-0 overflow-y-auto">
          <div className="p-6 space-y-6">
            {groupQuery.isError ? (
              <p className="text-sm text-destructive">Couldn&apos;t load group.</p>
            ) : groupQuery.isPending || !detail ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold">{detail.name ?? "Group"}</h1>
                    <Badge variant={statusVariant[detail.status]}>{detail.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="h-9 gap-1.5"
                      render={<Link href={`/groups/${selectedId}/edit`} />}
                    >
                      <Pencil className="size-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-9 w-9"
                      aria-label="Delete group"
                      onClick={() => {
                        if (window.confirm("Delete this group? This can't be undone.")) {
                          deleteMutation.mutate(selectedId!);
                          setSelectedId(null);
                        }
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoCard icon={<Users className="size-4" />} title="Overview">
                    <p className="text-2xl font-bold">
                      {detail.enrolledCount}
                      <span className="text-base font-medium text-muted-foreground">
                        /{detail.requiredStudents}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {detail.courseName ?? "—"}
                      {detail.branchName ? ` · ${detail.branchName}` : ""}
                    </p>
                  </InfoCard>

                  <InfoCard icon={<CalendarDays className="size-4" />} title="Journal">
                    <p className="text-sm font-medium">{fmtDate(detail.startDate)}</p>
                    <p className="text-sm text-muted-foreground">{fmtDate(detail.endDate)}</p>
                  </InfoCard>

                  <InfoCard icon={<Clock className="size-4" />} title="Schedule">
                    <p className="text-sm font-medium">{detail.days ?? "—"}</p>
                    <p className="text-sm text-muted-foreground">
                      {detail.startTime && detail.endTime
                        ? `${detail.startTime.slice(0, 5)} - ${detail.endTime.slice(0, 5)}`
                        : "—"}
                      {detail.room ? ` · ${detail.room}` : ""}
                    </p>
                  </InfoCard>

                  <InfoCard icon={<Users className="size-4" />} title="Mentors">
                    {detail.mentors && detail.mentors.length > 0 ? (
                      detail.mentors.map((mentor, i) => (
                        <p key={i} className="text-sm font-medium">{mentor}</p>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No mentors</p>
                    )}
                  </InfoCard>
                </div>

                <div>
                  <h2 className="mb-3 text-lg font-semibold">Students</h2>
                  <EnrollmentTable
                    rows={roster}
                    loading={enrollmentsQuery.isPending}
                    error={enrollmentsQuery.isError}
                    emptyText="No students enrolled yet."
                    groupId={selectedId}
                  />
                </div>

                {left.length > 0 && (
                  <div>
                    <h2 className="mb-3 text-lg font-semibold">Left course</h2>
                    <EnrollmentTable rows={left} loading={false} error={false} showReason groupId={selectedId} />
                  </div>
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function InfoCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="space-y-2 p-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          {icon}
          <span className="text-sm font-medium">{title}</span>
        </div>
        <div className="space-y-0.5">{children}</div>
      </CardContent>
    </Card>
  );
}

function ListView({
  groups,
  loading,
  onDelete,
  onSelect,
}: {
  groups: GroupDto[];
  loading: boolean;
  onDelete: (group: GroupDto) => void;
  onSelect: (id: string) => void;
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
              <TableRow key={g.id} className="cursor-pointer" onClick={() => onSelect(g.id)}>
                <TableCell>
                  <span className="font-medium hover:text-primary">{g.name ?? "—"}</span>
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
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ClipboardList className="size-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Edit"
                      render={<Link href={`/groups/${g.id}/edit`} />}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Pencil className="size-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete"
                      onClick={(e) => { e.stopPropagation(); onDelete(g); }}
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

function GridView({ groups, loading, onSelect }: { groups: GroupDto[]; loading: boolean; onSelect: (id: string) => void }) {
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
          <Card key={g.id} className="transition-colors hover:border-primary/40 cursor-pointer" onClick={() => onSelect(g.id)}>
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold hover:text-primary">
                    {g.name ?? "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {dateRange(g.startDate, g.endDate)}
                  </p>
                </div>
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
                  onClick={(e) => e.stopPropagation()}
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

function EnrollmentTable({
  rows,
  loading,
  error,
  emptyText = "Nothing here.",
  showReason = false,
  groupId,
}: {
  rows: EnrollmentDto[];
  loading: boolean;
  error: boolean;
  emptyText?: string;
  showReason?: boolean;
  groupId: string | null;
}) {
  const colCount = showReason ? 6 : 5;
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Full name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Account</TableHead>
            {showReason && <TableHead>Reason</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Journal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: colCount }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : error ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={colCount} className="py-8 text-center text-destructive">
                Couldn&apos;t load students.
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={colCount} className="py-8 text-center text-muted-foreground">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">{e.studentName ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">{e.studentPhone ?? "—"}</TableCell>
                <TableCell>
                  <Badge variant={e.hasAccount ? "success" : "muted"}>
                    {e.hasAccount ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                {showReason && (
                  <TableCell className="text-muted-foreground">{e.leftReason ?? "—"}</TableCell>
                )}
                <TableCell>
                  <Badge variant={enrollmentVariant[e.status]}>{e.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Journal"
                    render={<Link href={`/progressbook/${groupId}`} />}
                  >
                    <BookOpen className="size-4 text-primary" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
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
