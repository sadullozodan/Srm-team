"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight, Search, Upload } from "lucide-react";
import type { CrudApi } from "@/lib/api/resources";
import { queryKeys } from "@/lib/api/resources";
import type { ListParams } from "@/lib/api/types";
import { MONTHS } from "@/lib/series";
import { cn } from "@/lib/utils";

// The accounting screens follow the Figma the team designed to: one bordered
// card per page, a black-weight title, outlined EXPORT action, filters with
// floating labels, and a dense uppercase table with pill statuses.
//
// The Figma's indigo is this app's --primary and its slates are the card/muted/
// border tokens, so everything below is written in tokens: same look, and it
// survives the dark theme instead of pinning white backgrounds.

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

/** The bordered card the whole page sits on. */
export function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "w-full space-y-6 rounded-2xl border border-border bg-card p-5 text-foreground shadow-xs sm:p-7 md:rounded-3xl",
        className
      )}
      {...props}
    />
  );
}

export function PanelHeader({
  title,
  backHref,
  children,
}: {
  title: string;
  /** Shows the Figma's back arrow. Omit on a top-level page. */
  backHref?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3">
        {backHref && (
          <Link
            href={backHref}
            aria-label="Back"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-5 stroke-[2.5]" />
          </Link>
        )}
        <h1 className="text-xl font-black tracking-tight sm:text-2xl">{title}</h1>
      </div>

      {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
    </div>
  );
}

// Both actions render as a link when given an href and a button otherwise —
// the Figma uses the same pill for "go to Mentor levels" and for "EXPORT".
const actionBase =
  "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold tracking-wider transition-all";

function Action({
  className,
  href,
  children,
  ...props
}: React.ComponentProps<"button"> & { href?: string }) {
  if (href) {
    return (
      <Link href={href} className={cn(actionBase, className)}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={cn(actionBase, className)} {...props}>
      {children}
    </button>
  );
}

/** Outlined uppercase action, the Figma's EXPORT treatment. */
export function OutlineAction(props: React.ComponentProps<"button"> & { href?: string }) {
  return (
    <Action
      {...props}
      className="border-2 border-primary text-primary shadow-xs hover:bg-primary/10"
    />
  );
}

export function PrimaryAction(props: React.ComponentProps<"button"> & { href?: string }) {
  return (
    <Action
      {...props}
      className="bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:opacity-90"
    />
  );
}

export function ExportButton() {
  return (
    <OutlineAction>
      <Upload className="size-4 stroke-[2.5]" />
      <span>EXPORT</span>
    </OutlineAction>
  );
}

const fieldCls =
  "w-full rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs font-medium text-foreground transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";

/** Input or select with the Figma's small label notched into the top border. */
export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <span className="absolute -top-2.5 left-3 z-10 bg-card px-1 text-[11px] font-medium text-muted-foreground">
        {label}
      </span>
      <div className="relative flex items-center">{children}</div>
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  label = "Search",
  placeholder = "Search by name",
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}) {
  return (
    <Field label={label}>
      <Search className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(fieldCls, "pl-9")}
      />
    </Field>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  allLabel,
}: {
  label: string;
  value: T | "";
  options: readonly T[];
  onChange: (value: T | "") => void;
  allLabel: string;
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T | "")}
        className={cn(fieldCls, "cursor-pointer appearance-none pr-8")}
      >
        <option value="">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 size-4 text-muted-foreground" />
    </Field>
  );
}

/** The row of filters under the header. */
export function Filters({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3.5 pt-1 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}

const TONES = {
  success: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300",
  danger: "bg-rose-100 text-rose-500 dark:bg-rose-950/80 dark:text-rose-400",
  neutral: "bg-muted text-muted-foreground",
  brand: "bg-primary/10 text-primary",
} as const;

export type Tone = keyof typeof TONES;

/** The Figma's rounded status pill. */
export function Pill({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap",
        TONES[tone]
      )}
    >
      {children}
    </span>
  );
}

/** Bold name over a small muted line, as every Figma table's first column. */
export function NameCell({
  name,
  sub,
  href,
}: {
  name: string;
  sub?: string | null;
  href?: string;
}) {
  return (
    <>
      {href ? (
        <Link href={href} className="font-bold hover:text-primary hover:underline">
          {name}
        </Link>
      ) : (
        <span className="font-bold">{name}</span>
      )}
      {sub && <div className="mt-0.5 text-[11px] text-muted-foreground">{sub}</div>}
    </>
  );
}

export const cellCls = "px-4 py-3 sm:px-6";

export interface ResourceTableProps<TDto> {
  api: CrudApi<TDto, unknown>;
  columns: string[];
  /** Extra list params on top of page/pageSize/search, e.g. a status index. */
  params?: ListParams;
  search: string;
  page: number;
  onPageChange: (page: number) => void;
  row: (item: TDto) => React.ReactNode;
  emptyMessage?: string;
  minWidth?: string;
}

/**
 * Every accounting endpoint is the same paged list controller, so the pages
 * differ only in their columns. This owns fetching, paging and the
 * loading/empty/error states; a page supplies the columns and a row renderer.
 */
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
  const listParams: ListParams = { page, pageSize: PAGE_SIZE, search, ...params };

  const { data, isPending, isError, error, isPlaceholderData } = useQuery({
    queryKey: queryKeys.list(api.key, listParams),
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
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
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
        <PageButton
          label="Previous page"
          disabled={disabled || page <= 1}
          onClick={() => onChange(Math.max(1, page - 1))}
        >
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
