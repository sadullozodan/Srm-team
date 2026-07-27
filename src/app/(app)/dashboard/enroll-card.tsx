"use client";

import { useState } from "react";
import type { GroupDto } from "@/lib/api/types";
import { enrollSeries } from "@/lib/series";
import { EnrollChart } from "./charts";
import { CardTitle, Empty, Panel, SeeMore, Stepper, TableHead } from "../parts";

export type EnrollRow = {
  id: string;
  name: string;
  course: string;
  phone: string;
};

export function EnrollCard({ groups, rows }: { groups: GroupDto[]; rows: EnrollRow[] }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const data = enrollSeries(groups, year);
  const hasData = data.some((point) => point.value > 0);

  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <CardTitle>Enroll</CardTitle>
        <Stepper label={`${year} y`} onStep={(delta) => setYear(year + delta)} />
      </div>

      <div className="mt-4">
        <EnrollChart data={data} />
      </div>

      {hasData && (
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <TableHead columns={["Full name", "Course", "Phone"]} />
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={3}>
                  <Empty>No students yet</Empty>
                </td>
              </tr>
            )}

            {rows.map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                <td className="px-3 py-3 font-semibold">{row.name}</td>
                <td className="px-3 py-3">{row.course}</td>
                <td className="px-3 py-3 whitespace-nowrap">{row.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </Panel>
  );
}
