"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Loader2,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { enrollmentsApi, groupsApi, queryKeys } from "@/lib/api/resources";
import type {
  EnrollmentDto,
  EnrollmentStatus,
  GroupDto,
  GroupStatus,
} from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusVariant: Record<GroupStatus, "muted" | "success" | "warning" | "destructive"> = {
  New: "muted",
  Started: "success",
  Finished: "warning",
  Cancelled: "destructive",
};

const enrollmentVariant: Record<
  EnrollmentStatus,
  "success" | "muted" | "warning" | "destructive"
> = {
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

export default function GroupDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const groupQuery = useQuery({
    queryKey: queryKeys.detail("Groups", id),
    queryFn: () => groupsApi.get(id),
    enabled: !!id,
  });

  const enrollmentsQuery = useQuery({
    queryKey: ["Enrollments", "group", id],
    queryFn: () => enrollmentsApi.byGroup(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => groupsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Groups"] });
      router.push("/groups");
    },
  });

  function handleDelete() {
    if (window.confirm("Delete this group? This can't be undone.")) {
      deleteMutation.mutate();
    }
  }

  const group = groupQuery.data;
  const roster = enrollmentsQuery.data?.filter((e) => e.status !== "Left") ?? [];
  const left = enrollmentsQuery.data?.filter((e) => e.status === "Left") ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/groups"
            aria-label="Back to groups"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-6" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {group?.name ?? "Group"}
          </h1>
          {group && <Badge variant={statusVariant[group.status]}>{group.status}</Badge>}
        </div>
        {group && (
          <div className="flex items-center gap-2">
            <Button
              size="lg"
              className="h-10 gap-1.5"
              render={<Link href={`/groups/${id}/edit`} />}
            >
              <Pencil className="size-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="icon"
              className="h-10 w-10"
              aria-label="Delete group"
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
        )}
      </div>

      {groupQuery.isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Couldn&apos;t load this group.
          </CardContent>
        </Card>
      ) : groupQuery.isPending || !group ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <InfoCard icon={<Users className="size-4" />} title="Overview">
            <p className="text-2xl font-bold">
              {group.enrolledCount}
              <span className="text-base font-medium text-muted-foreground">
                /{group.requiredStudents}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              {group.courseName ?? "—"}
              {group.branchName ? ` · ${group.branchName}` : ""}
            </p>
          </InfoCard>

          <InfoCard icon={<CalendarDays className="size-4" />} title="Journal">
            <p className="text-sm font-medium">{fmtDate(group.startDate)}</p>
            <p className="text-sm text-muted-foreground">{fmtDate(group.endDate)}</p>
          </InfoCard>

          <InfoCard icon={<Clock className="size-4" />} title="Schedule">
            <p className="text-sm font-medium">{group.days ?? "—"}</p>
            <p className="text-sm text-muted-foreground">
              {group.startTime && group.endTime
                ? `${group.startTime.slice(0, 5)} - ${group.endTime.slice(0, 5)}`
                : "—"}
              {group.room ? ` · ${group.room}` : ""}
            </p>
          </InfoCard>

          <InfoCard icon={<Users className="size-4" />} title="Mentors">
            {group.mentors && group.mentors.length > 0 ? (
              group.mentors.map((mentor, i) => (
                <p key={i} className="text-sm font-medium">
                  {mentor}
                </p>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No mentors</p>
            )}
          </InfoCard>
        </div>
      )}

      {/* Roster */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Students</h2>
        <EnrollmentTable
          rows={roster}
          loading={enrollmentsQuery.isPending}
          error={enrollmentsQuery.isError}
          emptyText="No students enrolled yet."
        />
      </div>

      {/* Left course */}
      {left.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">Left course</h2>
          <EnrollmentTable rows={left} loading={false} error={false} showReason />
        </div>
      )}
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
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

function EnrollmentTable({
  rows,
  loading,
  error,
  emptyText = "Nothing here.",
  showReason = false,
}: {
  rows: EnrollmentDto[];
  loading: boolean;
  error: boolean;
  emptyText?: string;
  showReason?: boolean;
}) {
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: showReason ? 5 : 4 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : error ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={showReason ? 5 : 4} className="py-8 text-center text-destructive">
                Couldn&apos;t load students.
              </TableCell>
            </TableRow>
          ) : rows.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={showReason ? 5 : 4} className="py-8 text-center text-muted-foreground">
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">
                  <Link href={`/students/${e.studentId}`} className="hover:text-primary">
                    {e.studentName ?? "—"}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {e.studentPhone ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={e.hasAccount ? "success" : "muted"}>
                    {e.hasAccount ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                {showReason && (
                  <TableCell className="text-muted-foreground">
                    {e.leftReason ?? "—"}
                  </TableCell>
                )}
                <TableCell>
                  <Badge variant={enrollmentVariant[e.status]}>{e.status}</Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}
