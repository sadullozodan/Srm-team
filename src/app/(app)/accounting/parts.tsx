"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { CrudApi } from "@/lib/api/resources";
import { queryKeys } from "@/lib/api/resources";
import type { ListParams } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
import { MONTHS } from "@/lib/series";

// Every accounting endpoint is the same paged list controller, so the pages
// differ only in their columns. `ResourceList` owns the search box, the status
// filter, paging and the loading/empty/error states; a page supplies the
// columns and a row renderer.

const PAGE_SIZE = 15;

export function money(amount: number) {
  return `${new Intl.NumberFormat("ru-RU").format(amount)} c`;
}

export function shortDate(iso: string | null) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB");
}

/** The API stores a period as separate year and month (1-12) columns. */
export function monthLabel(year: number, month: number) {
  const name = MONTHS[month - 1];
  return name ? `${name} ${year}` : "—";
}

/**
 * Turns a status name into the integer the list endpoints filter on — they
 * take the enum's index, not its name.
 */
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
    // `onChange` only ever resets the page, so it is not a dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input]);

  return { input, setInput, search };
}

export function PageHeader({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
    </div>
  );
}

export function SearchBox({
  value,
  onChange,
  placeholder = "Search by name",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative min-w-56 flex-1">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-xl bg-card pl-9"
      />
    </div>
  );
}

export function StatusFilter<T extends string>({
  value,
  options,
  onChange,
  allLabel = "All statuses",
}: {
  value: T | "";
  options: readonly T[];
  onChange: (value: T | "") => void;
  allLabel?: string;
}) {
  return (
    <div className="w-44">
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as T | "")}
        className="h-11 rounded-xl bg-card"
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Select>
    </div>
  );
}

export interface ResourceListProps<TDto> {
  /** The resource this list reads, e.g. `paymentsApi`. */
  api: CrudApi<TDto, unknown>;
  columns: string[];
  /** Extra list params on top of page/pageSize/search, e.g. a status index. */
  params?: ListParams;
  search: string;
  page: number;
  onPageChange: (page: number) => void;
  row: (item: TDto) => React.ReactNode;
  emptyMessage?: string;
}

export function ResourceList<TDto extends { id: string }>({
  api,
  columns,
  params,
  search,
  page,
  onPageChange,
  row,
  emptyMessage = "Nothing here yet.",
}: ResourceListProps<TDto>) {
  const listParams: ListParams = { page, pageSize: PAGE_SIZE, search, ...params };

  const { data, isPending, isError, error, isPlaceholderData } = useQuery({
    queryKey: queryKeys.list(api.key, listParams),
    queryFn: () => api.list(listParams),
    placeholderData: keepPreviousData,
  });

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-destructive">
          Couldn&apos;t load {api.key.toLowerCase()}
          {error instanceof Error ? `: ${error.message}` : "."}
        </CardContent>
      </Card>
    );
  }

  const items = data?.items ?? [];
  const totalPages = Math.max(data?.totalPages ?? 1, 1);

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columns.map((column) => (
                  <TableHead key={column}>{column}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending ? (
                <LoadingRows columns={columns.length} />
              ) : items.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columns.length}
                    className="py-10 text-center text-muted-foreground"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => row(item))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

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

function LoadingRows({ columns }: { columns: number }) {
  return (
    <>
      {Array.from({ length: 8 }).map((_, rowIndex) => (
        <TableRow key={rowIndex} className="hover:bg-transparent">
          {Array.from({ length: columns }).map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-4 w-24" />
            </TableCell>
          ))}
        </TableRow>
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
    <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
      <span>{total} total</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous page"
          disabled={disabled || page <= 1}
          onClick={() => onChange(Math.max(1, page - 1))}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <span className="min-w-20 text-center">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next page"
          disabled={disabled || page >= totalPages}
          onClick={() => onChange(Math.min(totalPages, page + 1))}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
