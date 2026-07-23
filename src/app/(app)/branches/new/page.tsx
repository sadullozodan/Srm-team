"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BranchForm } from "@/components/branches/branch-form";

export default function NewBranchPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/branches"
          aria-label="Back to branches"
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Add new branch
        </h1>
      </div>

      <BranchForm />
    </div>
  );
}
