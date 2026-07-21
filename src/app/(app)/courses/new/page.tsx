"use client";

import { CourseForm } from "@/components/courses/course-form";
import { PanelHeader } from "../../panels";

export default function NewCoursePage() {
  return (
    <div className="space-y-6">
      <PanelHeader title="Add new course" backHref="/courses" />
      <CourseForm />
    </div>
  );
}
