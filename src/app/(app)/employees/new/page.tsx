"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EmployeeForm } from "@/components/employees/employee-form";

export default function NewEmployeePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/employees"
          aria-label="Back to employees"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Add new employee
        </h1>
      </div>

      <EmployeeForm />
    </div>
  );
}
