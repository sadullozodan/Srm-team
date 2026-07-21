"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { employeesApi, queryKeys } from "@/lib/api/resources";
import { EmployeeForm } from "@/components/employees/employee-form";
import { PanelHeader } from "../../../panels";

export default function EditEmployeePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.detail("Employees", id),
    queryFn: () => employeesApi.get(id),
    enabled: !!id,
  });

  return (
    <div className="space-y-6">
      <PanelHeader title="Edit employee" backHref={`/employees/${id}`} />

      {isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Couldn&apos;t load this employee
          {error instanceof Error ? `: ${error.message}` : "."}
        </div>
      ) : isPending ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (
        <EmployeeForm employeeId={id} initial={data} />
      )}
    </div>
  );
}
