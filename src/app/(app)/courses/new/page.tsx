"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CourseForm } from "@/components/courses/course-form";

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/courses"
          aria-label="Back to courses"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Add new course
        </h1>
      </div>

      <CourseForm />
    </div>
  );
}
