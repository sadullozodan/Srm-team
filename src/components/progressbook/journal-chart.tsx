"use client";

// "Exam graphics" — one line per student, weekly Sum across the term plus a final
// Average column (mirrors the Figma). Identity is carried by the legend + hover
// tooltip (names), never colour alone, so the CVD-validated categorical palette
// can cycle for large rosters. Table view = the journal grid rendered below it.

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import type { JournalWeekDto } from "@/lib/api/types";

// CVD-safe categorical palette (validated via the dataviz skill), fixed order.
const PALETTE_LIGHT = [
  "#2a78d6", "#008300", "#e87ba4", "#eda100",
  "#1baf7a", "#eb6834", "#4a3aa7", "#e34948",
];
const PALETTE_DARK = [
  "#3987e5", "#008300", "#d55181", "#c98500",
  "#199e70", "#d95926", "#9085e9", "#e66767",
];

interface Student {
  id: string;
  name: string;
}

const W = 960;
const H = 360;
const PAD = { top: 20, right: 44, bottom: 34, left: 40 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;
const Y_TICKS = [0, 25, 50, 75, 100];

export function JournalChart({
  weeks,
  students,
}: {
  weeks: JournalWeekDto[];
  students: Student[];
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  useEffect(() => setMounted(true), []);

  const palette = mounted && resolvedTheme === "dark" ? PALETTE_DARK : PALETTE_LIGHT;

  const ordered = [...weeks].sort((a, b) => a.weekNumber - b.weekNumber);

  // columns: one per week, then a final "Avg" column.
  const columns = [...ordered.map((w) => `W${w.weekNumber}`), "Avg"];
  const colCount = columns.length;

  const series = students.map((student, idx) => {
    const weekly = ordered.map((w) => {
      const r = (w.results ?? []).find((x) => x.studentId === student.id);
      return r ? r.sum : null;
    });
    const present = weekly.filter((v): v is number => v !== null);
    const avg = present.length
      ? Math.round(present.reduce((a, b) => a + b, 0) / present.length)
      : null;
    return {
      student,
      values: [...weekly, avg] as (number | null)[],
      color: palette[idx % palette.length],
    };
  });

  // Only worth drawing once at least one score exists.
  const hasData = series.some((s) => s.values.some((v) => v !== null));
  if (!hasData) return null;

  const xFor = (col: number) =>
    colCount === 1 ? PAD.left + PLOT_W / 2 : PAD.left + (col / (colCount - 1)) * PLOT_W;
  const yFor = (value: number) => PAD.top + PLOT_H - (value / 100) * PLOT_H;

  // Build a path, breaking into sub-paths across missing weeks.
  function linePath(values: (number | null)[]): string {
    let d = "";
    let pen = false;
    values.forEach((v, i) => {
      if (v === null) {
        pen = false;
        return;
      }
      d += `${pen ? "L" : "M"}${xFor(i).toFixed(1)},${yFor(v).toFixed(1)} `;
      pen = true;
    });
    return d.trim();
  }

  return (
    <div className="relative w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Student weekly scores"
        onMouseLeave={() => setHover(null)}
      >
        {/* Gridlines + y labels */}
        {Y_TICKS.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={yFor(t)}
              y2={yFor(t)}
              style={{ stroke: "var(--border)" }}
              strokeWidth={1}
            />
            <text
              x={PAD.left - 8}
              y={yFor(t)}
              textAnchor="end"
              dominantBaseline="middle"
              style={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            >
              {t}
            </text>
          </g>
        ))}

        {/* x labels */}
        {columns.map((label, i) => (
          <text
            key={label + i}
            x={xFor(i)}
            y={H - 10}
            textAnchor="middle"
            style={{
              fill: i === colCount - 1 ? "var(--primary)" : "var(--muted-foreground)",
              fontSize: 11,
              fontWeight: i === colCount - 1 ? 600 : 400,
            }}
          >
            {label === "Avg" ? "Average" : `Week ${label.slice(1)}`}
          </text>
        ))}

        {/* Hover crosshair */}
        {hover !== null && (
          <line
            x1={xFor(hover)}
            x2={xFor(hover)}
            y1={PAD.top}
            y2={PAD.top + PLOT_H}
            style={{ stroke: "var(--border)" }}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        )}

        {/* Series lines + markers */}
        {series.map((s) => (
          <g key={s.student.id}>
            <path
              d={linePath(s.values)}
              fill="none"
              stroke={s.color}
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {s.values.map((v, i) =>
              v === null ? null : (
                <circle
                  key={i}
                  cx={xFor(i)}
                  cy={yFor(v)}
                  r={hover === i ? 4.5 : 3.5}
                  fill={s.color}
                  style={{ stroke: "var(--card)" }}
                  strokeWidth={1.5}
                />
              )
            )}
          </g>
        ))}

        {/* Invisible hover targets, one per column */}
        {columns.map((_, i) => {
          const bandW = PLOT_W / Math.max(colCount - 1, 1);
          return (
            <rect
              key={i}
              x={xFor(i) - bandW / 2}
              y={PAD.top}
              width={bandW}
              height={PLOT_H}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
          );
        })}
      </svg>

      {/* Tooltip */}
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md"
          style={{ left: `${(xFor(hover) / W) * 100}%`, maxWidth: 180 }}
        >
          <p className="mb-1 font-semibold">
            {hover === colCount - 1 ? "Average" : `Week ${columns[hover].slice(1)}`}
          </p>
          <div className="space-y-0.5">
            {series
              .map((s) => ({ name: s.student.name, value: s.values[hover], color: s.color }))
              .filter((r) => r.value !== null)
              .sort((a, b) => (b.value as number) - (a.value as number))
              .slice(0, 12)
              .map((r, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ backgroundColor: r.color }}
                    />
                    <span className="truncate">{r.name}</span>
                  </span>
                  <span className="font-medium tabular-nums">{r.value}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Legend — identity by name, never colour alone */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {series.map((s) => (
          <span key={s.student.id} className="flex items-center gap-1.5 text-xs">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-muted-foreground">{s.student.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
