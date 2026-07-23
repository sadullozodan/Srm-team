"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ScheduleForm } from "@/components/timetable/schedule-form";

export default function NewSchedulePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/timetable" aria-label="Back to timetable" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Add timetable entry</h1>
      </div>
      <ScheduleForm />
    </div>
  );
}
