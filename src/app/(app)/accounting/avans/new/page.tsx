"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdvanceForm } from "@/components/accounting/advance-form";

export default function NewAdvancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/accounting/avans" aria-label="Back" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="size-6" /></Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Add advance</h1>
      </div>
      <AdvanceForm />
    </div>
  );
}
