"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Loader2, Pencil, Trash2 } from "lucide-react";
import { coursesApi, groupsApi, queryKeys } from "@/lib/api/resources";
import type { GroupStatus } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const numberFmt = new Intl.NumberFormat("en-US");
const money = (v: number) => `${numberFmt.format(Math.round(v))} c.`;

const statusVariant: Record<GroupStatus, "muted" | "success" | "warning" | "destructive"> = {
  New: "muted",
  Started: "success",
  Finished: "warning",
  Cancelled: "destructive",
};

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.detail("Courses", id),
    queryFn: () => coursesApi.get(id),
    enabled: !!id,
  });

  // No "groups by course" endpoint, so pull the group list and filter locally.
  const groupsQuery = useQuery({
    queryKey: queryKeys.list("Groups", { pageSize: 100 }),
    queryFn: () => groupsApi.list({ pageSize: 100 }),
  });
  const courseGroups = (groupsQuery.data?.items ?? []).filter((g) => g.courseId === id);

  const deleteMutation = useMutation({
    mutationFn: () => coursesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Courses"] });
      router.push("/courses");
    },
  });

  function handleDelete() {
    if (window.confirm("Delete this course? This can't be undone.")) {
      deleteMutation.mutate();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/courses"
          aria-label="Back to courses"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Course info</h1>
      </div>

      {isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Couldn&apos;t load this course.
          </CardContent>
        </Card>
      ) : isPending || !data ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <Card className="h-fit">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-4">
                {data.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.logoUrl}
                    alt={data.title ?? "Course"}
                    className="size-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="flex size-16 items-center justify-center rounded-xl bg-secondary text-primary">
                    <BookOpen className="size-7" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold">{data.title ?? "Untitled"}</p>
                  <p className="text-sm text-muted-foreground">
                    {money(data.fee)} · {data.durationMonths} months
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="lg"
                  className="h-10 flex-1 gap-1.5"
                  render={<Link href={`/courses/${id}/edit`} />}
                >
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-10 w-10"
                  aria-label="Delete course"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>

              {data.description && (
                <p className="border-t border-border pt-4 text-sm text-muted-foreground">
                  {data.description}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">
                Groups <span className="text-muted-foreground">({data.groupsCount})</span>
              </h2>
              {groupsQuery.isPending ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-xl" />
                  ))}
                </div>
              ) : courseGroups.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No groups run this course yet.
                </p>
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
        </div>
      )}
    </div>
  );
}
