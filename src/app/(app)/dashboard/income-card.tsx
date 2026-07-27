"use client";

import type { PaymentDto } from "@/lib/api/types";
import { useT } from "@/lib/i18n";
import { incomeDelta } from "@/lib/series";
import { CardTitle, Panel, Stepper, money, useMonthPicker } from "../parts";

export function IncomeCard({ payments, totalDebt }: { payments: PaymentDto[]; totalDebt: number }) {
  const t = useT();
  const { year, month, monthName, label, step } = useMonthPicker();

  const income = payments
    .filter((p) => {
      const d = new Date(p.date);
      return d.getFullYear() === year && d.getMonth() === month;
    })
    .reduce((sum, p) => sum + p.paid, 0);

  const delta = incomeDelta(payments, new Date(year, month, 1));
  const billed = income + totalDebt;
  const collected = billed === 0 ? 0 : Math.round((income / billed) * 100);

  return (
    <Panel className="flex flex-wrap items-center justify-between gap-6 p-6">
      <div>
        <CardTitle>{t("Income")}</CardTitle>
        <p key={income} className="mt-3 text-4xl font-bold text-primary" style={{ animation: 'fadeScaleIn 0.3s ease-out' }}>{money(income)}</p>

        {delta === null ? (
          <p className="mt-2 text-sm text-muted-foreground">{t("No payments the month before")}</p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            {Math.abs(delta)}% {delta < 0 ? t("less") : t("more")} {t("than the month before")}
          </p>
        )}

        <div className="mt-4">
          <Stepper label={label} onStep={step} />
        </div>
      </div>

      <Donut percent={collected} label={t("collected")} />
    </Panel>
  );
}

/** ponytail: conic-gradient ring with CSS-registered property for smooth morph. */
function Donut({ percent, label }: { percent: number; label: string }) {
  return (
    <>
      <style>{`@property --donut-pct { syntax: '<percentage>'; inherits: true; initial-value: 0%; }`}</style>
      <div
        className="grid size-40 shrink-0 place-items-center rounded-full"
        style={{
          background: `conic-gradient(var(--primary) var(--donut-pct), color-mix(in srgb, var(--primary) 20%, transparent) 0)`,
          '--donut-pct': `${percent}%`,
          transition: '--donut-pct 0.6s ease-out',
        } as React.CSSProperties}
        title={`${percent}% of billed money ${label}`}
      >
        <div className="grid size-28 place-items-center rounded-full bg-card">
          <span
            key={percent}
            className="text-3xl font-bold"
            style={{ animation: 'fadeScaleIn 0.3s ease-out' }}
          >
            {percent}%
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      </div>
    </>
  );
}
