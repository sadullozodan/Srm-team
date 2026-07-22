"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { queryKeys } from "@/lib/api/resources";
import type { ListParams, PagedResult } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { cellCls } from "./panels";

// A generic, app-wide list table: owns fetching, paging and the
// loading/empty/error states. A page supplies a list-capable api, columns and a
// row renderer. Accepts any object exposing { key, list } — CRUD or read-only.

const PAGE_SIZE = 15;

export interface ListApi<TDto> {
  key: string;
  list: (params: ListParams & Record<string, unknown>) => Promise<PagedResult<TDto>>;
}

export function statusIndex<T extends string>(options: readonly T[], value: T | "") {
  return value ? options.indexOf(value) : undefined;
}

export function useDebouncedSearch(onChange: () => void) {
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(input.trim());
      onChange();
    }, 350);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return { input, setInput, search };
}

export interface ResourceTableProps<TDto> {
  api: ListApi<TDto>;
  columns: string[];
  params?: Record<string, unknown>;
  search: string;
  page: number;
  onPageChange: (page: number) => void;
  row: (item: TDto) => React.ReactNode;
  emptyMessage?: string;
  minWidth?: string;
}

export function ResourceTable<TDto extends { id: string }>({
  api,
  columns,
  params,
  search,
  page,
  onPageChange,
  row,
  emptyMessage = "Nothing here yet.",
  minWidth = "min-w-[700px]",
}: ResourceTableProps<TDto>) {
  const listParams = { page, pageSize: PAGE_SIZE, search, ...params };

  const { data, isPending, isError, error, isPlaceholderData } = useQuery({
    queryKey: queryKeys.list(api.key, listParams as ListParams),
    queryFn: () => api.list(listParams),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
        Couldn&apos;t load {api.key.toLowerCase()}
        {error instanceof Error ? `: ${error.message}` : "."}
      </div>
    );
  }

  const items = data?.items ?? [];
  const totalPages = Math.max(data?.totalPages ?? 1, 1);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className={cn("w-full border-collapse text-left", minWidth)}>
          <thead>
            <tr className="bg-muted/70 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
              {columns.map((column) => (
                <th key={column} className={cellCls}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs font-medium sm:text-sm">
            {isPending ? (
              <SkeletonRows columns={columns.length} />
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10 text-center text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              items.map((item) => row(item))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        total={data?.totalCount ?? 0}
        disabled={isPlaceholderData}
        onChange={onPageChange}
      />
    </div>
  );
}

function SkeletonRows({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 8 }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, cellIndex) => (
            <td key={cellIndex} className={cellCls}>
              <span className="block h-4 w-24 animate-pulse rounded bg-muted" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

function Pagination({
  page,
  totalPages,
  total,
  disabled,
  onChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  disabled: boolean;
  onChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs font-medium text-muted-foreground">
      <span>{total} total</span>
      <div className="flex items-center gap-2">
        <PageButton label="Previous page" disabled={disabled || page <= 1} onClick={() => onChange(Math.max(1, page - 1))}>
          <ChevronLeft className="size-4" />
        </PageButton>
        <span className="min-w-20 text-center">
          Page {page} of {totalPages}
        </span>
        <PageButton
          label="Next page"
          disabled={disabled || page >= totalPages}
          onClick={() => onChange(Math.min(totalPages, page + 1))}
        >
          <ChevronRight className="size-4" />
        </PageButton>
      </div>
    </div>
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

export function money(amount: number) {
  return `${new Intl.NumberFormat("ru-RU").format(amount)} c`;
}

export function shortDate(iso: string | null) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB");
}

export function dateTime(iso: string | null) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", { dateStyle: "short", timeStyle: "short" });
}
