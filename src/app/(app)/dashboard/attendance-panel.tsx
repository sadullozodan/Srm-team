"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi, queryKeys } from "@/lib/api/resources";
import type { DashboardStatsDto } from "@/lib/api/types";
import { Empty, Panel, TableHead } from "../parts";
import { cn } from "@/lib/utils";

type Attendance = DashboardStatsDto["attendance"];

/** yyyy-mm-dd in local time — `toISOString` would shift the day near midnight. */
function today() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function AttendancePanel({ attendance }: { attendance: Attendance }) {
  const date = today();

  const { data, isPending } = useQuery({
    queryKey: queryKeys.dashboardAbsentees(date),
    queryFn: () => dashboardApi.absentees(date),
  });

  const absentees = data ?? [];

  return (
    <Panel className="flex flex-col p-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <Pill label="Present" value={attendance.present} tone="bg-emerald-500/10 text-emerald-600" />
        <Pill label="Absent" value={attendance.absent} tone="bg-red-500/10 text-red-500" />
        <Pill label="Late" value={attendance.late} tone="bg-amber-500/10 text-amber-500" />
      </div>

      <div className="mt-4 max-h-105 flex-1 overflow-auto">
        <table className="w-full text-sm">
          <TableHead columns={["Full name", "Phone", "Reason"]} />
          <tbody>
            {!isPending && absentees.length === 0 && (
              <tr>
                <td colSpan={3}>
                  <Empty>Everyone is in today</Empty>
                </td>
              </tr>
            )}

            {absentees.map((absentee) => (
              <tr key={absentee.studentId} className="border-b align-top last:border-0">
                <td className="px-3 py-3">
                  <Link
                    href={`/students/${absentee.studentId}`}
                    className="font-semibold hover:underline"
                  >
                    {absentee.studentName ?? "—"}
                  </Link>
                  <p className="text-primary">{absentee.groupName ?? "No group"}</p>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  {(absentee.phones ?? []).length === 0
                    ? "—"
                    : absentee.phones!.map((phone) => <p key={phone}>{phone}</p>)}
                </td>

                <td className="px-3 py-3 text-muted-foreground">
                  <span className="line-clamp-2">{absentee.reason || "—"}</span>
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
