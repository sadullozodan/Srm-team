"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import type { DashboardStatsDto, StudentDto } from "@/lib/api/types";
import { Empty, Panel, TableHead } from "../parts";
import { cn } from "@/lib/utils";

type Attendance = DashboardStatsDto["attendance"];

export function AttendancePanel({
  attendance,
  students,
}: {
  attendance: Attendance;
  students: StudentDto[];
}) {
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
            {students.length === 0 && (
              <tr>
                <td colSpan={3}>
                  <Empty>No students yet</Empty>
                </td>
              </tr>
            )}

            {students.map((student) => (
              <tr key={student.id} className="border-b align-top last:border-0">
                <td className="px-3 py-3">
                  <Link
                    href={`/students/${student.id}`}
                    className="font-semibold hover:underline"
                  >
                    {student.fullName ?? "—"}
                  </Link>
                  <p className="text-primary">{student.groups?.[0] ?? "No group"}</p>
                </td>

                <td className="px-3 py-3 whitespace-nowrap">
                  {phonesOf(student).map((phone) => (
                    <p key={phone}>{phone}</p>
                  ))}
                </td>

                {/* ponytail: nothing records an absence reason — the pencil is
                    where one would be written once the backend has it. */}
                <td className="px-3 py-3">
                  <Pencil className="size-4 text-primary" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}

function phonesOf(student: StudentDto) {
  const numbers = [student.phoneNumber, ...(student.phones ?? []).map((p) => p.number)];
  const listed = numbers.filter((number): number is string => !!number);
  return listed.length > 0 ? [...new Set(listed)] : ["—"];
}

function Pill({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className={cn("flex items-center justify-between rounded-xl px-4 py-4", tone)}>
      <span className="font-medium">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}
