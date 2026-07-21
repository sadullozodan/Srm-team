"use client";

import { StudentForm } from "@/components/students/student-form";
import { PanelHeader } from "../../panels";

export default function NewStudentPage() {
  return (
    <div className="space-y-6">
      <PanelHeader title="Add new student" backHref="/students" />
      <StudentForm />
    </div>
  );
}
