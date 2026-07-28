"use client";

import { ArrowLeft, Plus } from "lucide-react";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const students = [
  { name: "Dostoni", color: "#f2555a" },
  { name: "Ibrahim", color: "#3ddc84" },
  { name: "Abdulhamid", color: "#b06cf5" },
  { name: "Abdullo", color: "#f5a524" },
  { name: "Abdullo", color: "#3aa0ff" },
  { name: "Abdullo", color: "#22d3ee" },
];

const chartData = [
  { week: "Week 1", s0: 88, s1: 30, s2: 52, s3: 62, s4: 45, s5: 58 },
  { week: "Week 2", s0: 62, s1: 42, s2: 70, s3: 40, s4: 60, s5: 34 },
  { week: "Week 3", s0: 55, s1: 60, s2: 44, s3: 28, s4: 78, s5: 48 },
  { week: "Week 4", s0: 68, s1: 78, s2: 30, s3: 55, s4: 84, s5: 62 },
  { week: "Average", s0: 46, s1: 92, s2: 24, s3: 74, s4: 66, s5: 40 },
];

const days = ["01.11.22", "01.11.22", "01.11.22", "01.11.22", "01.11.22"];

const rows = [
  { name: "L. Tojiev Olimjon", scores: ["5", "5", "5", "5", "5"], bonus: "5", exam: "72" },
  { name: "L. Tojiev Olimjon", scores: ["5", "5", "5", "5", "5"], bonus: "5", exam: "72" },
  { name: "L. Tojiev Olimjon", scores: ["5", "5", "5", "5", "5"], bonus: "5", exam: "70" },
  { name: "L. Tojiev Olimjon", scores: ["5", "5", "5", "5", "5"], bonus: "5", exam: "72" },
  { name: "L. Tojiev Olimjon", scores: ["6", "6", "4", "4", "6"], bonus: "5", exam: "72" },
];

function ScoreSelect({ value }: { value: string }) {
  return (
    <Select defaultValue={value}>
      <SelectTrigger className="h-7 w-14 rounded-md border-border bg-secondary px-2 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {["1", "2", "3", "4", "5", "6"].map((n) => (
          <SelectItem key={n} value={n} className="text-xs">
            {n}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function WeekTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] border-separate border-spacing-0 text-xs">
        <thead>
          <tr className="text-muted-foreground">
            <th rowSpan={2} className="border-b border-border px-3 py-3 text-left font-medium">
              Students
            </th>
            {days.map((d, i) => (
              <th key={i} className="border-b border-border px-3 py-2 font-medium">
                <span className="mr-1">{d}</span>
                <span className="text-primary">✎</span>
              </th>
            ))}
            <th colSpan={3} className="border-b border-border px-3 py-2 font-medium">
              End of week
            </th>
          </tr>
          <tr className="text-muted-foreground">
            {days.map((_, i) => (
              <th key={i} className="border-b border-border px-3 pb-2 font-normal">
                <div className="flex items-center justify-center gap-3">
                  <span>Att</span>
                  <span>Score</span>
                </div>
              </th>
            ))}
            <th className="border-b border-border px-3 pb-2 font-normal">Bonus</th>
            <th className="border-b border-border px-3 pb-2 font-normal">Exam</th>
            <th className="border-b border-border px-3 pb-2 font-normal">Sum</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="text-foreground/90">
              <td className="whitespace-nowrap border-b border-border px-3 py-2">{row.name}</td>
              {row.scores.map((s, ci) => (
                <td key={ci} className="border-b border-border px-3 py-2">
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex gap-1">
                      <Checkbox className="size-4 rounded-[4px] border-border" />
                      <Checkbox className="size-4 rounded-[4px] border-border" />
                    </div>
                    <ScoreSelect value={s} />
                  </div>
                </td>
              ))}
              <td className="border-b border-border px-3 py-2 text-center">
                <ScoreSelect value={row.bonus} />
              </td>
              <td className="border-b border-border px-3 py-2 text-center">{row.exam}</td>
              <td className="border-b border-border px-3 py-2 text-center">
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-score-badge text-[11px] font-semibold text-score-badge-foreground">
                  90
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function JournalPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-5">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowLeft className="size-5 text-foreground" />
            <h1 className="text-lg font-semibold text-foreground">Journal</h1>
          </div>
          <Button className="h-9 rounded-lg text-xs font-medium">
            <Plus className="size-4" /> NEW WEEK
          </Button>
        </header>

        <section className="rounded-2xl bg-card p-4 sm:p-6">
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: -20 }}>
                <CartesianGrid
                  stroke="#3a4460"
                  strokeDasharray="3 4"
                  vertical
                />
                <XAxis
                  dataKey="week"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#8a93a8", fontSize: 10 }}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#8a93a8", fontSize: 10 }}
                />
                {students.map((s, i) => (
                  <Line
                    key={i}
                    type="monotone"
                    dataKey={`s${i}`}
                    stroke={s.color}
                    strokeWidth={2}
                    isAnimationActive={false}
                    dot={{ r: 3, fill: s.color, strokeWidth: 0 }}
                    activeDot={{ r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {students.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: s.color }}
                />
                {s.name}
              </li>
            ))}
          </ul>
        </section>

        <Accordion type="single" collapsible defaultValue="week-4" className="space-y-4">
          {[4, 3, 2, 1].map((w) => (
            <AccordionItem
              key={w}
              value={`week-${w}`}
              className="overflow-hidden rounded-2xl border-none bg-card"
            >
              <AccordionTrigger className="px-5 py-4 text-sm font-semibold hover:no-underline">
                Week {w}
              </AccordionTrigger>
              <AccordionContent className="px-5 pb-5">
                <WeekTable />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </main>
  );
}
