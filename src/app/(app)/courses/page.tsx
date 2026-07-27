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
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { coursesApi, groupsApi, queryKeys } from "@/lib/api/resources";
import type { CourseDto, GroupStatus } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const PAGE_SIZE = 12;
const numberFmt = new Intl.NumberFormat("en-US");
const money = (v: number) => `${numberFmt.format(Math.round(v))} c.`;

const statusVariant: Record<GroupStatus, "muted" | "success" | "warning" | "destructive"> = {
  New: "muted",
  Started: "success",
  Finished: "warning",
  Cancelled: "destructive",
};

export default function CoursesPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
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
  const { data, isPending, isError, error, isPlaceholderData } = useQuery({
    queryKey: queryKeys.list("Courses", { page, pageSize: PAGE_SIZE, search }),
    queryFn: () => coursesApi.list({ page, pageSize: PAGE_SIZE, search }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => coursesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Courses"] }),
  });

  const courseQuery = useQuery({
    queryKey: queryKeys.detail("Courses", selectedId!),
    queryFn: () => coursesApi.get(selectedId!),
    enabled: !!selectedId,
  });

  const groupsQuery = useQuery({
    queryKey: queryKeys.list("Groups", { pageSize: 100 }),
    queryFn: () => groupsApi.list({ pageSize: 100 }),
    enabled: !!selectedId,
  });

  function handleDelete(course: CourseDto) {
    if (window.confirm(`Delete ${course.title ?? "this course"}? This can't be undone.`)) {
      deleteMutation.mutate(course.id);
    }
  }

  const courses = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;
  const detail = courseQuery.data;
  const courseGroups = (groupsQuery.data?.items ?? []).filter((g) => g.courseId === selectedId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Courses</h1>
        <Button size="lg" className="gap-1.5" render={<Link href="/courses/new" />}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search course"
          className="h-11 rounded-xl bg-card pl-9"
        />
      </div>

      {isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Couldn&apos;t load courses
            {error instanceof Error ? `: ${error.message}` : "."}
          </CardContent>
        </Card>
      ) : isPending ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-3 p-5">
                <Skeleton className="size-12 rounded-xl" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <Card>
          <CardContent className="p-10 text-center text-muted-foreground">
            No courses found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((c) => (
            <Card key={c.id} className="transition-colors hover:border-primary/40 cursor-pointer" onClick={() => setSelectedId(c.id)}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {c.logoUrl ? (
                    <img
                      src={c.logoUrl}
                      alt={c.title ?? "Course"}
                      className="size-12 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                      <BookOpen className="size-6" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-semibold hover:text-primary">
                      {c.title ?? "Untitled"}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {money(c.fee)} · {c.durationMonths} mo
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="muted">{c.groupsCount} groups</Badge>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Edit"
                      render={<Link href={`/courses/${c.id}/edit`} />}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Pencil className="size-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete"
                      onClick={(e) => { e.stopPropagation(); handleDelete(c); }}
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isError && (
        <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span>{data?.totalCount ?? 0} total</span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={isPlaceholderData || page <= 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-20 text-center">
              Page {page} of {Math.max(totalPages, 1)}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={isPlaceholderData || page >= totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      <Sheet open={!!selectedId} onOpenChange={(open) => { if (!open) setSelectedId(null); }}>
        <SheetContent className="w-full sm:max-w-lg p-0 overflow-y-auto">
          <div className="p-6 space-y-6">
            {courseQuery.isError ? (
              <p className="text-sm text-destructive">Couldn&apos;t load course.</p>
            ) : courseQuery.isPending || !detail ? (
              <div className="space-y-4">
                <Skeleton className="size-16 rounded-xl" />
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  {detail.logoUrl ? (
                    <img
                      src={detail.logoUrl}
                      alt={detail.title ?? "Course"}
                      className="size-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex size-16 items-center justify-center rounded-xl bg-secondary text-primary">
                      <BookOpen className="size-7" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold">{detail.title ?? "Untitled"}</p>
                    <p className="text-sm text-muted-foreground">
                      {money(detail.fee)} · {detail.durationMonths} months
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="lg"
                    className="h-10 flex-1 gap-1.5"
                    render={<Link href={`/courses/${selectedId}/edit`} />}
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10"
                    aria-label="Delete course"
                    onClick={() => {
                      if (window.confirm("Delete this course? This can't be undone.")) {
                        deleteMutation.mutate(selectedId!);
                        setSelectedId(null);
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                {detail.description && (
                  <p className="text-sm text-muted-foreground">{detail.description}</p>
                )}

                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">
                      Groups <span className="text-muted-foreground">({detail.groupsCount})</span>
                    </h2>
                    {groupsQuery.isPending ? (
                      <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="h-12 w-full rounded-xl" />
                        ))}
                      </div>
                    ) : courseGroups.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No groups run this course yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {courseGroups.map((g) => (
                          <Link
                            key={g.id}
                            href={`/groups/${g.id}`}
                            className="flex items-center justify-between rounded-xl border border-border px-4 py-3 transition-colors hover:border-primary/40"
                          >
                            <span className="font-medium">{g.name ?? "—"}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-muted-foreground">
                                {g.enrolledCount}/{g.requiredStudents}
                              </span>
                              <Badge variant={statusVariant[g.status]}>{g.status}</Badge>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
