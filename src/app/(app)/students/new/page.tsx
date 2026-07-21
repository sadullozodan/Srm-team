"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StudentForm } from "@/components/students/student-form";

export default function NewStudentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/students"
          aria-label="Back to students"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Add new student
        </h1>
      </div>

      <StudentForm />
    </div>
  );
}
