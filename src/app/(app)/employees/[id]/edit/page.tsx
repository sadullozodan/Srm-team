import { EmployeeForm } from "@/components/employees/employee-form";

export default function EditEmployeePage({ params }: { params: { id: string } }) {
  return <EmployeeForm employeeId={params.id} />;
}