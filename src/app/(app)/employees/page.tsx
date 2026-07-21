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
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { employeesApi, queryKeys } from "@/lib/api/resources";
import type { ActivationStatus, EmployeeDto } from "@/lib/api/types";
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

// ActivationStatus is a string on the wire but the list filter takes its index.
const STATUS_ORDER: ActivationStatus[] = ["Inactive", "Active"];
const statusVariant: Record<ActivationStatus, "success" | "muted"> = {
  Active: "success",
  Inactive: "muted",
};

function fullName(e: EmployeeDto): string {
  return e.fullName ?? ([e.firstName, e.lastName].filter(Boolean).join(" ") || "—");
}

export default function EmployeesPage() {
  const [view, setView] = useState<"list" | "grid">("list");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ActivationStatus | "">("");
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
    queryKey: queryKeys.list("Employees", { page, pageSize: PAGE_SIZE, search, status: statusParam }),
    queryFn: () =>
      employeesApi.list({ page, pageSize: PAGE_SIZE, search, status: statusParam }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => employeesApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["Employees"] }),
  });

  function handleDelete(employee: EmployeeDto) {
    if (window.confirm(`Delete ${fullName(employee)}? This can't be undone.`)) {
      deleteMutation.mutate(employee.id);
    }
  }

  const employees = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Employees</h1>
        <Button size="lg" className="gap-1.5" render={<Link href="/employees/new" />}>
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

        <div className="w-44">
          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as ActivationStatus | "");
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
            Couldn&apos;t load employees
            {error instanceof Error ? `: ${error.message}` : "."}
          </CardContent>
        </Card>
      ) : view === "list" ? (
        <ListView employees={employees} loading={isPending} onDelete={handleDelete} />
      ) : (
        <GridView employees={employees} loading={isPending} />
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
  employees,
  loading,
  onDelete,
}: {
  employees: EmployeeDto[];
  loading: boolean;
  onDelete: (employee: EmployeeDto) => void;
}) {
  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Full name</TableHead>
            <TableHead>Positions</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Experience</TableHead>
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
          ) : employees.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                No employees found.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium">
                  <Link href={`/employees/${e.id}`} className="hover:text-primary">
                    {fullName(e)}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {e.positions && e.positions.length > 0 ? e.positions.join(", ") : "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {e.phoneNumber ?? "—"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {e.experience} yr
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[e.status]}>{e.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Edit"
                      render={<Link href={`/employees/${e.id}/edit`} />}
                    >
                      <Pencil className="size-4 text-primary" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete"
                      onClick={() => onDelete(e)}
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

function GridView({ employees, loading }: { employees: EmployeeDto[]; loading: boolean }) {
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

  if (employees.length === 0) {
    return (
      <Card>
        <CardContent className="p-10 text-center text-muted-foreground">
          No employees found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {employees.map((e) => (
        <Link key={e.id} href={`/employees/${e.id}`} className="block">
          <Card className="h-full transition-colors hover:border-primary/40">
            <CardContent className="space-y-3 p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold">{fullName(e)}</p>
                  <p className="text-sm text-muted-foreground">{e.phoneNumber ?? "—"}</p>
                </div>
                <Badge variant={statusVariant[e.status]}>{e.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {e.positions && e.positions.length > 0
                  ? e.positions.join(", ")
                  : "No positions"}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
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
