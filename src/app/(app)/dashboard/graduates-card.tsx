"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Graduate } from "@/lib/api";
import { CardTitle, Empty, Panel, SeeMore, TableHead, initials, longDate } from "../parts";

export function GraduatesCard({ count, rows }: { count: number; rows: Graduate[] }) {
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <CardTitle>Employed graduates ({count})</CardTitle>
        <SeeMore href="/students/graduates" />
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <TableHead columns={["Full name", "Course", "Date of issue", "Work"]} />
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={4}>
                  <Empty>No graduates yet</Empty>
                </td>
              </tr>
            )}

            {rows.map((graduate) => (
              <tr key={graduate.id} className="border-b last:border-0">
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-9">
                      <AvatarFallback>{initials(graduate.studentName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{graduate.studentName}</p>
                      <p className="text-xs text-primary">{graduate.age} year</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">{graduate.groupName}</td>
                <td className="px-3 py-3 whitespace-nowrap">{longDate(graduate.dateOfIssue)}</td>
                <td className="px-3 py-3 font-semibold">{graduate.workPlace}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
