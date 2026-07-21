"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  AtSign,
  Loader2,
  Pencil,
  Send,
  Trash2,
  UserRound,
} from "lucide-react";
import { enrollmentsApi, studentsApi, queryKeys } from "@/lib/api/resources";
import type {
  ContractStatus,
  EnrollmentDto,
  EnrollmentStatus,
  StudentDto,
  StudentStatus,
} from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const statusVariant: Record<StudentStatus, "success" | "muted" | "warning"> = {
  Active: "success",
  Inactive: "muted",
  Finished: "warning",
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

const contractVariant: Record<
  ContractStatus,
  "success" | "muted" | "warning" | "destructive"
> = {
  None: "muted",
  Active: "success",
  Expiring: "warning",
  Finished: "destructive",
};

function formatEndDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function fullName(s: StudentDto): string {
  return s.fullName ?? ([s.firstName, s.lastName].filter(Boolean).join(" ") || "—");
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function StudentProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.detail("Students", id),
    queryFn: () => studentsApi.get(id),
    enabled: !!id,
  });

  const enrollmentsQuery = useQuery({
    queryKey: ["Enrollments", "student", id],
    queryFn: () => enrollmentsApi.byStudent(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => studentsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Students"] });
      router.push("/students");
    },
  });

  function handleDelete() {
    if (window.confirm("Delete this student? This can't be undone.")) {
      deleteMutation.mutate();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/students"
          aria-label="Back to students"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Student info
        </h1>
      </div>

      {isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Couldn&apos;t load this student
            {error instanceof Error ? `: ${error.message}` : "."}
          </CardContent>
        </Card>
      ) : isPending ? (
        <ProfileSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-4">
                  {data.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.photoUrl}
                      alt={fullName(data)}
                      className="size-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <UserRound className="size-7" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold">{fullName(data)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Status:{" "}
                      <Badge variant={statusVariant[data.status]}>{data.status}</Badge>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="lg"
                    className="h-10 flex-1 gap-1.5"
                    render={<Link href={`/students/${id}/edit`} />}
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10"
                    aria-label="Delete student"
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
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-1 p-6">
                <InfoRow label="Branch" value={data.branchName ?? "—"} />
                <InfoRow label="Birth date" value={formatDate(data.birthDate)} />
                <InfoRow label="Address" value={data.address ?? "—"} />
                <InfoRow label="Phone number" value={data.phoneNumber ?? "—"} />
                {data.phones?.map((phone, i) => (
                  <InfoRow
                    key={i}
                    label={phone.label ?? "Phone"}
                    value={phone.number ?? "—"}
                  />
                ))}

                <div className="flex flex-wrap gap-2 pt-3">
                  {data.email && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm">
                      <AtSign className="size-4 text-primary" />
                      {data.email}
                    </span>
                  )}
                  {data.telegramUsername && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm">
                      <Send className="size-4 text-primary" />
                      {data.telegramUsername}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="h-fit">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-semibold">Groups</h2>
              <GroupsSection
                enrollments={enrollmentsQuery.data}
                loading={enrollmentsQuery.isPending}
                error={enrollmentsQuery.isError}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function GroupsSection({
  enrollments,
  loading,
  error,
}: {
  enrollments: EnrollmentDto[] | undefined;
  loading: boolean;
  error: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-sm text-destructive">Couldn&apos;t load groups.</p>;
  }

  if (!enrollments || enrollments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        This student isn&apos;t enrolled in any group yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {enrollments.map((e) => {
        const endDate = formatEndDate(e.contractEndDate);
        return (
          <div key={e.id} className="rounded-xl border border-border p-4">
            <div className="flex items-start justify-between gap-2">
              <span className="font-medium">{e.groupName ?? "—"}</span>
              <Badge variant={enrollmentVariant[e.status]}>{e.status}</Badge>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant={e.hasAccount ? "success" : "muted"}>
                {e.hasAccount ? "Has account" : "No account"}
              </Badge>
              <Badge variant={contractVariant[e.contract]}>
                Contract: {e.contract}
                {endDate ? ` · ${endDate}` : ""}
              </Badge>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="space-y-3 p-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
