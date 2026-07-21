"use client";

import { EmployeeForm } from "@/components/employees/employee-form";
import { PanelHeader } from "../../panels";

export default function NewEmployeePage() {
  return (
    <div className="space-y-6">
      <PanelHeader title="Add new employee" backHref="/employees" />
      <EmployeeForm />
    </div>
  );
}
