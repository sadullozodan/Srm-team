"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { employeesApi, queryKeys } from "@/lib/api/resources";
import { EmployeeForm } from "@/components/employees/employee-form";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="flex items-center gap-3">
        <Link
          href={`/employees/${id}`}
          aria-label="Back to employee"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Edit employee
        </h1>
      </div>

      {isError ? (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Couldn&apos;t load this employee
            {error instanceof Error ? `: ${error.message}` : "."}
          </CardContent>
        </Card>
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
