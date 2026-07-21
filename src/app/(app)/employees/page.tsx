"use client";

import { useState } from "react";
import Link from "next/link";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Braces,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
  SquarePen,
  Star,
  Trash2,
  UserCheck,
} from "lucide-react";
import { employeesApi, queryKeys } from "@/lib/api/resources";
import type { ActivationStatus, EmployeeDto } from "@/lib/api/types";
import {
  Filters,
  NameCell,
  OutlineAction,
  Panel,
  PanelHeader,
  Pill,
  PrimaryAction,
  SearchField,
  SelectField,
  cellCls,
  statusIndex,
  useDebouncedSearch,
  type Tone,
} from "../accounting/parts";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 12;
const STATUSES: readonly ActivationStatus[] = ["Inactive", "Active"];

// The Figma colours each job title differently; positions are free text on the
// backend, so the well-known ones get their colour and the rest fall back.
const POSITION_TONES: Record<string, Tone> = {
  Admin: "brand",
  Manager: "warning",
  Developer: "brand",
  Mentor: "warning",
};

function fullName(employee: EmployeeDto): string {
  return (
    employee.fullName ??
    ([employee.firstName, employee.lastName].filter(Boolean).join(" ") || "—")
  );
}

function positionsOf(employee: EmployeeDto): string[] {
  return employee.positions ?? [];
}

export default function EmployeesPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [status, setStatus] = useState<ActivationStatus | "">("");
  const [page, setPage] = useState(1);
  const { input, setInput, search } = useDebouncedSearch(() => setPage(1));

  const queryClient = useQueryClient();
  const params = {
    page,
    pageSize: PAGE_SIZE,
    search,
    status: statusIndex(STATUSES, status),
  };

  const { data, isPending, isError, error, isPlaceholderData } = useQuery({
    queryKey: queryKeys.list("Employees", params),
    queryFn: () => employeesApi.list(params),
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
  const totalPages = Math.max(data?.totalPages ?? 1, 1);

  return (
    <Panel>
      <PanelHeader title="Employees">
        <OutlineAction href="/employees/positions">
          <Braces className="size-4 stroke-[2.5]" />
          <span>POSITION</span>
        </OutlineAction>
        <OutlineAction href="/employees/mentor-levels">
          <Star className="size-4 fill-current" />
          <span>MENTOR LEVELS</span>
        </OutlineAction>
        <PrimaryAction href="/employees/new">
          <Plus className="size-4 stroke-3" />
          <span>ADD NEW</span>
        </PrimaryAction>
      </PanelHeader>

      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex-1">
          <Filters>
            <SearchField value={input} onChange={setInput} />
            <SelectField
              label="Status"
              value={status}
              options={STATUSES}
              allLabel="All status"
              onChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            />
          </Filters>
        </div>

        <div className="flex items-center gap-1 self-end rounded-xl border border-border bg-muted p-1">
          <ViewToggle active={view === "grid"} onClick={() => setView("grid")} label="Grid view">
            <LayoutGrid className="size-4" />
          </ViewToggle>
          <ViewToggle active={view === "list"} onClick={() => setView("list")} label="List view">
            <List className="size-4" />
          </ViewToggle>
        </div>
      </div>

      {isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Couldn&apos;t load employees
          {error instanceof Error ? `: ${error.message}` : "."}
        </div>
      ) : isPending ? (
        <LoadingState view={view} />
      ) : employees.length === 0 ? (
        <p className="rounded-xl border border-border py-10 text-center text-sm text-muted-foreground">
          No employees found.
        </p>
      ) : view === "grid" ? (
        <GridView employees={employees} onDelete={handleDelete} />
      ) : (
        <ListView employees={employees} onDelete={handleDelete} />
      )}

      <div className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
        <span>{data?.totalCount ?? 0} total</span>
        <div className="flex items-center gap-2">
          <PageButton
            label="Previous page"
            disabled={isPlaceholderData || page <= 1}
            onClick={() => setPage(Math.max(1, page - 1))}
          >
            <ChevronLeft className="size-4" />
          </PageButton>
          <span className="min-w-20 text-center">
            Page {page} of {totalPages}
          </span>
          <PageButton
            label="Next page"
            disabled={isPlaceholderData || page >= totalPages}
            onClick={() => setPage(Math.min(totalPages, page + 1))}
          >
            <ChevronRight className="size-4" />
          </PageButton>
        </div>
      </div>
    </Panel>
  );
}

function PositionPills({ positions }: { positions: string[] }) {
  if (positions.length === 0) {
    return <span className="text-xs text-muted-foreground">No positions</span>;
  }
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {positions.map((position) => (
        <Pill key={position} tone={POSITION_TONES[position] ?? "neutral"}>
          {position}
        </Pill>
      ))}
    </div>
  );
}

function GridView({
  employees,
  onDelete,
}: {
  employees: EmployeeDto[];
  onDelete: (employee: EmployeeDto) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {employees.map((employee) => (
        <div
          key={employee.id}
          className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs transition-all hover:border-primary/40 hover:shadow-md sm:p-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <Link
                href={`/employees/${employee.id}`}
                className="block truncate leading-tight font-bold hover:text-primary"
              >
                {fullName(employee)}
              </Link>
              <p className="text-xs font-medium text-muted-foreground">
                {employee.phoneNumber ?? "—"}
                {employee.experience > 0 && ` | ${employee.experience} year`}
              </p>
            </div>
            <div className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-muted text-muted-foreground">
              <UserCheck className="size-5" />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
            <PositionPills positions={positionsOf(employee)} />
            <RowActions employee={employee} onDelete={onDelete} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ListView({
  employees,
  onDelete,
}: {
  employees: EmployeeDto[];
  onDelete: (employee: EmployeeDto) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[750px] border-collapse text-left">
        <thead>
          <tr className="bg-muted/70 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            <th className={cellCls}>Full name</th>
            <th className={cellCls}>Position</th>
            <th className={cellCls}>Phone</th>
            <th className={cellCls}>Status</th>
            <th className={`${cellCls} text-right`}>Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-xs font-medium sm:text-sm">
          {employees.map((employee) => (
            <tr key={employee.id} className="transition-colors hover:bg-muted/40">
              <td className={cellCls}>
                <NameCell
                  name={fullName(employee)}
                  sub={employee.branchName}
                  href={`/employees/${employee.id}`}
                />
              </td>
              <td className={cellCls}>
                <PositionPills positions={positionsOf(employee)} />
              </td>
              <td className={`${cellCls} font-mono text-xs text-muted-foreground`}>
                {employee.phoneNumber ?? "—"}
              </td>
              <td className={cellCls}>
                <Pill tone={employee.status === "Active" ? "success" : "danger"}>
                  {employee.status}
                </Pill>
              </td>
              <td className={`${cellCls} text-right`}>
                <div className="flex items-center justify-end">
                  <RowActions employee={employee} onDelete={onDelete} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RowActions({
  employee,
  onDelete,
}: {
  employee: EmployeeDto;
  onDelete: (employee: EmployeeDto) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/employees/${employee.id}/edit`}
        title="Edit"
        className="rounded p-1 text-primary transition-colors hover:bg-primary/10"
      >
        <SquarePen className="size-4" />
      </Link>
      <button
        type="button"
        title="Delete"
        onClick={() => onDelete(employee)}
        className="rounded p-1 text-rose-500 transition-colors hover:bg-rose-500/10"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}

function LoadingState({ view }: { view: "grid" | "list" }) {
  const count = view === "grid" ? 6 : 8;
  return (
    <div
      className={
        view === "grid"
          ? "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
          : "space-y-2 rounded-xl border border-border p-4"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={
            view === "grid"
              ? "space-y-3 rounded-2xl border border-border p-5"
              : undefined
          }
        >
          <span className="block h-5 w-40 animate-pulse rounded bg-muted" />
          <span className="mt-2 block h-4 w-28 animate-pulse rounded bg-muted" />
        </div>
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
        "rounded-lg p-2 transition-all",
        active
          ? "bg-card text-foreground shadow-xs"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function PageButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted disabled:opacity-40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
