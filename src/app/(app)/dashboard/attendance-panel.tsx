"use client";

import Link from "next/link";
import { ChevronRight, Pencil } from "lucide-react";
import type { DashboardStatsDto } from "@/lib/api/types";
import { absentRows } from "@/lib/mock-dashboard";
import { Panel, TableHead } from "../parts";
import { cn } from "@/lib/utils";

type Attendance = DashboardStatsDto["attendance"];

export function AttendancePanel({ attendance }: { attendance: Attendance }) {
  return (
    <Panel className="flex flex-col p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Pill label="Present" value={attendance.present} tone="bg-emerald-500/10 text-emerald-600" />
        <Pill label="Absent" value={attendance.absent} tone="bg-red-500/10 text-red-500" />
        <Pill label="Late" value={attendance.late} tone="bg-amber-500/10 text-amber-500" />
      </div>

      {/* ponytail: rows are mock — no endpoint returns today's absentees. */}
      <div className="mt-4 max-h-105 flex-1 overflow-auto">
        <table className="w-full text-sm">
          <TableHead columns={["Full name", "Phone", "Reason"]} />
          <tbody>
            {absentRows.map((row) => (
              <tr key={row.id} className="border-b align-top last:border-0">
                <td className="px-3 py-3">
                  <p className="font-semibold">{row.name}</p>
                  <Link
                    href="/groups"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    {row.group} <ChevronRight className="size-3.5" />
                  </Link>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  {row.phones.map((phone) => (
                    <p key={phone}>{phone}</p>
                  ))}
                </td>

                <td className="px-3 py-3">
                  <div className="flex gap-1.5 text-muted-foreground">
                    <Pencil className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="line-clamp-2">{row.reason}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function Pill({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={cn("flex items-center justify-between rounded-xl px-4 py-4", tone)}>
      <span className="font-medium">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}
