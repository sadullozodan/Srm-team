"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { GroupForm } from "@/components/groups/group-form";

export default function NewGroupPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/groups"
          aria-label="Back to groups"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Add new group
        </h1>
      </div>

      <GroupForm />
    </div>
  );
}
