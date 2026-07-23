"use client";

import { CardTitle, Panel, Stepper, money, useMonthPicker } from "../parts";

export function IncomeCard({
  income,
  delta,
  collected,
}: {
  income: number;
  delta: number | null;
  collected: number;
}) {
  const { monthName, step } = useMonthPicker();

  return (
    <Panel className="flex flex-wrap items-center justify-between gap-6 p-6">
      <div>
        <CardTitle>Income In this month</CardTitle>
        <p className="mt-3 text-4xl font-bold text-primary">{money(income)}</p>

        {delta === null ? (
          <p className="mt-2 text-sm text-muted-foreground">No payments last month</p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            {Math.abs(delta)}% {delta < 0 ? "less" : "more"} than last month
          </p>
        )}

        <div className="mt-4">
          <Stepper label={monthName} onStep={step} />
        </div>
      </div>

      <Donut percent={collected} label="collected" />
    </Panel>
  );
}

/** ponytail: a ring is a conic-gradient — no chart library involved. */
function Donut({ percent, label }: { percent: number; label: string }) {
  const filled = "var(--primary)";
  const empty = "color-mix(in srgb, var(--primary) 20%, transparent)";

  return (
    <div
      className="grid size-40 shrink-0 place-items-center rounded-full"
      style={{ background: `conic-gradient(${filled} ${percent}%, ${empty} 0)` }}
      title={`${percent}% of billed money ${label}`}
    >
      <div className="grid size-28 place-items-center rounded-full bg-card">
        <span className="text-3xl font-bold">{percent}%</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
