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
import { employeesApi, queryKeys } from "@/lib/api/resources";
import type { ActivationStatus, EmployeeDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const statusVariant: Record<ActivationStatus, "success" | "muted"> = {
  Active: "success",
  Inactive: "muted",
};

function fullName(e: EmployeeDto): string {
  return e.fullName ?? ([e.firstName, e.lastName].filter(Boolean).join(" ") || "—");
}

function formatDate(value: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function EmployeeProfilePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.detail("Employees", id),
    queryFn: () => employeesApi.get(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => employeesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Employees"] });
      router.push("/employees");
    },
  });

  function handleDelete() {
    if (window.confirm("Delete this employee? This can't be undone.")) {
      deleteMutation.mutate();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/employees"
          aria-label="Back to employees"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Employee info
        </h1>
      </div>

      {isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Couldn&apos;t load this employee
            {error instanceof Error ? `: ${error.message}` : "."}
          </CardContent>
        </Card>
      ) : isPending ? (
        <ProfileSkeleton />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          <Card className="h-fit">
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
                  <div className="mt-1 flex items-center gap-2">
                    <Badge variant={statusVariant[data.status]}>{data.status}</Badge>
                  </div>
                </div>
              </div>

              {data.positions && data.positions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.positions.map((position, i) => (
                    <Badge key={i} variant="default">
                      {position}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  size="lg"
                  className="h-10 flex-1 gap-1.5"
                  render={<Link href={`/employees/${id}/edit`} />}
                >
                  <Pencil className="size-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-10 w-10"
                  aria-label="Delete employee"
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

          <Card className="h-fit">
            <CardContent className="space-y-1 p-6">
              <InfoRow label="Branch" value={data.branchName ?? "—"} />
              <InfoRow label="Birth date" value={formatDate(data.birthDate)} />
              <InfoRow label="Address" value={data.address ?? "—"} />
              <InfoRow label="Phone number" value={data.phoneNumber ?? "—"} />
              <InfoRow label="Experience" value={`${data.experience} year(s)`} />
              <InfoRow
                label="Hour rate"
                value={data.hourRate != null ? `${data.hourRate} som` : "—"}
              />

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

              {data.description && (
                <p className="pt-3 text-sm text-muted-foreground">{data.description}</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
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
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-5 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
