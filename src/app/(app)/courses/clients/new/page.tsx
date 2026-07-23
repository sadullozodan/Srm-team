"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LeadForm } from "@/components/leads/lead-form";

export default function NewLeadPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/courses/clients" aria-label="Back to clients" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Add new lead</h1>
      </div>
      <LeadForm />
    </div>
  );
}
