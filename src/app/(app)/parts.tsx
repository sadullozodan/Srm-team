"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTHS } from "@/lib/series";
import { cn } from "@/lib/utils";

// Small pieces every dashboard card reuses. Nothing here holds page data.

export function money(amount: number) {
  const formatted = new Intl.NumberFormat("ru-RU").format(amount);
  return `${formatted} c`;
}

export function longDate(isoDate: string) {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function initials(fullName: string | null) {
  if (!fullName) return "?";
  const words = fullName.split(" ").slice(0, 2);
  return words.map((word) => word[0]).join("").toUpperCase();
}

/** Shared dashboard surface. */
export function Panel({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/70 bg-card/95 shadow-[0_14px_40px_rgb(31_37_60_/_0.06)] dark:shadow-[0_18px_48px_rgb(0_0_0_/_0.24)]",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="flex items-center gap-2 text-xl font-bold">{children}</h2>;
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-sm text-muted-foreground">{children}</p>;
}

export function SeeMore({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-1 text-sm font-medium text-primary">
      See more <ChevronRight className="size-4" />
    </Link>
  );
}

export function TableHead({ columns }: { columns: string[] }) {
  return (
    <thead>
      <tr className="bg-muted/50 text-xs tracking-wide text-muted-foreground uppercase">
        {columns.map((column) => (
          <th
            key={column}
            className="px-3 py-2 text-left font-medium first:rounded-l-lg last:rounded-r-lg"
          >
            {column}
          </th>
        ))}
      </tr>
    </thead>
  );
}

/** ‹ label › control used by the Leads, Income and Attendance cards. */
export function Stepper({
  label,
  onStep,
}: {
  label: string;
  onStep: (delta: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border/60 bg-muted/60 p-1 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.45)] dark:shadow-none">
      <StepButton label="Previous" onClick={() => onStep(-1)}>
        <ChevronLeft className="size-4" />
      </StepButton>
      {/* Labels are derived from today's date, which the prerender cannot know. */}
      <span suppressHydrationWarning className="min-w-20 text-center text-sm font-medium">
        {label}
      </span>
      <StepButton label="Next" onClick={() => onStep(1)}>
        <ChevronRight className="size-4" />
      </StepButton>
    </div>
  );
}

function StepButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-7 place-items-center rounded-full bg-primary text-primary-foreground transition-transform active:scale-95"
    >
      {children}
    </button>
  );
}

/**
 * Month + year state for a Stepper, starting at the current month. Stepping
 * past December rolls the year, so cards can query a real month.
 */
export function useMonthPicker() {
  const [date, setDate] = useState(() => new Date());
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-11

  return {
    year,
    month,
    monthName: MONTHS[month],
    label: `${MONTHS[month]} ${year}`,
    step: (delta: number) =>
      setDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1)),
  };
}
