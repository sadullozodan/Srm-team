"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PermissionForm } from "@/components/permissions/permission-form";

export default function NewPermissionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/administration/permission" aria-label="Back" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Add permission</h1>
      </div>
      <PermissionForm />
    </div>
  );
}
