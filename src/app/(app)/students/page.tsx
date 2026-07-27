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
  AtSign,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Pencil,
  Plus,
  Search,
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
import { Input } from "@/components/ui/input";
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

const statusVariant: Record<StudentStatus, "success" | "muted" | "warning"> = {
  Active: "success",
  Inactive: "muted",
  Finished: "warning",
};

const enrollmentVariant: Record<EnrollmentStatus, "success" | "muted" | "warning" | "destructive"> = {
  Active: "success",
  Left: "destructive",
  Transferred: "warning",
  Graduated: "muted",
};

const contractVariant: Record<ContractStatus, "success" | "muted" | "warning" | "destructive"> = {
  None: "muted",
  Active: "success",
  Expiring: "warning",
  Finished: "destructive",
};

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

function formatEndDate(value: string | null): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export default function StudentsPage() {
  const [view, setView] = useState<"list" | "grid">("list");
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
    queryKey: queryKeys.list("Students", { page, pageSize: PAGE_SIZE, search }),
    queryFn: () => studentsApi.list({ page, pageSize: PAGE_SIZE, search }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => studentsApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Students"] }),
  });

  const studentQuery = useQuery({
    queryKey: queryKeys.detail("Students", selectedId!),
    queryFn: () => studentsApi.get(selectedId!),
    enabled: !!selectedId,
  });

  const enrollmentsQuery = useQuery({
    queryKey: ["Enrollments", "student", selectedId],
    queryFn: () => enrollmentsApi.byStudent(selectedId!),
    enabled: !!selectedId,
  });

  function handleDelete(student: StudentDto) {
    if (window.confirm(`Delete ${fullName(student)}? This can't be undone.`)) {
      deleteMutation.mutate(student.id);
    }
  }

  const students = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Students
        </h1>
        <Button size="lg" className="gap-1.5" render={<Link href="/students/new" />}>
          <Plus className="size-4" />
          Add new
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name"
            className="h-11 rounded-xl bg-card pl-9"
          />
        </div>

        <div className="flex overflow-hidden rounded-xl border border-border bg-card">
          <ViewToggle
            active={view === "grid"}
            onClick={() => setView("grid")}
            label="Grid view"
          >
            <LayoutGrid className="size-4" />
          </ViewToggle>
          <ViewToggle
            active={view === "list"}
            onClick={() => setView("list")}
            label="List view"
          >
            <List className="size-4" />
          </ViewToggle>
        </div>
      </div>

      {isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Couldn&apos;t load students
            {error instanceof Error ? `: ${error.message}` : "."}
          </CardContent>
        </Card>
      ) : view === "list" ? (
        <ListView students={students} loading={isPending} onDelete={handleDelete} onSelect={setSelectedId} />
      ) : (
        <GridView students={students} loading={isPending} onSelect={setSelectedId} />
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
            {studentQuery.isError ? (
              <p className="text-sm text-destructive">Couldn&apos;t load student.</p>
            ) : studentQuery.isPending || !studentQuery.data ? (
              <div className="space-y-4">
                <Skeleton className="size-16 rounded-full" />
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  {studentQuery.data.photoUrl ? (
                    <img
                      src={studentQuery.data.photoUrl}
                      alt={fullName(studentQuery.data)}
                      className="size-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
                      <UserRound className="size-7" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-lg font-bold">{fullName(studentQuery.data)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Status:{" "}
                      <Badge variant={statusVariant[studentQuery.data.status]}>{studentQuery.data.status}</Badge>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="lg"
                    className="h-10 flex-1 gap-1.5"
                    render={<Link href={`/students/${selectedId}/edit`} />}
                  >
                    <Pencil className="size-4" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10"
                    aria-label="Delete student"
                    onClick={() => {
                      if (window.confirm("Delete this student? This can't be undone.")) {
                        deleteMutation.mutate(selectedId!);
                        setSelectedId(null);
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <Card>
                  <CardContent className="space-y-1 p-6">
                    <InfoRow label="Branch" value={studentQuery.data.branchName ?? "—"} />
                    <InfoRow label="Birth date" value={formatDate(studentQuery.data.birthDate)} />
                    <InfoRow label="Address" value={studentQuery.data.address ?? "—"} />
                    <InfoRow label="Phone number" value={studentQuery.data.phoneNumber ?? "—"} />
                    {studentQuery.data.phones?.map((phone, i) => (
                      <InfoRow key={i} label={phone.label ?? "Phone"} value={phone.number ?? "—"} />
                    ))}
                    <div className="flex flex-wrap gap-2 pt-3">
                      {studentQuery.data.email && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm">
                          <AtSign className="size-4 text-primary" />
                          {studentQuery.data.email}
                        </span>
                      )}
                      {studentQuery.data.telegramUsername && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm">
                          <Send className="size-4 text-primary" />
                          {studentQuery.data.telegramUsername}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h2 className="mb-4 text-lg font-semibold">Groups</h2>
                    <GroupsSection
                      enrollments={enrollmentsQuery.data}
                      loading={enrollmentsQuery.isPending}
                      error={enrollmentsQuery.isError}
                    />
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

function ListView({
  students,
  loading,
  onDelete,
  onSelect,
}: {
  students: StudentDto[];
  loading: boolean;
  onDelete: (student: StudentDto) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Full name</TableHead>
            <TableHead>Groups</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                {Array.from({ length: 5 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : students.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                No students found.
              </TableCell>
            </TableRow>
          ) : (
            students.map((s) => (
              <TableRow key={s.id} className="cursor-pointer" onClick={() => onSelect(s.id)}>
                <TableCell className="font-medium hover:text-primary">
                  {fullName(s)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {s.groups && s.groups.length > 0 ? s.groups.join(", ") : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {s.phoneNumber ?? "—"}
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Edit"
                      render={<Link href={`/students/${s.id}/edit`} />}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Pencil className="size-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete"
                      onClick={(e) => { e.stopPropagation(); onDelete(s); }}
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

function GridView({ students, loading, onSelect }: { students: StudentDto[]; loading: boolean; onSelect: (id: string) => void }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="space-y-3 p-5">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-muted-foreground">
          No students found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {students.map((s) => (
        <Card key={s.id} className="h-full transition-colors hover:border-primary/40 cursor-pointer" onClick={() => onSelect(s.id)}>
          <CardContent className="space-y-3 p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold">{fullName(s)}</p>
                <p className="text-sm text-muted-foreground">
                  {s.phoneNumber ?? "—"}
                </p>
              </div>
              <Badge variant={statusVariant[s.status]}>{s.status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {s.groups && s.groups.length > 0 ? s.groups.join(", ") : "No groups"}
            </p>
          </CardContent>
        </Card>
      ))}
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
        <Button
          variant="outline"
          size="icon"
          onClick={onPrev}
          disabled={disabled || page <= 1}
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
          onClick={onNext}
          disabled={disabled || page >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
