"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RoleForm } from "@/components/roles/role-form";

export default function NewRolePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/administration/roles" aria-label="Back" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Add role</h1>
      </div>
      <RoleForm />
    </div>
  );
}
