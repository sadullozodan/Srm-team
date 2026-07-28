"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BudgetForm } from "@/components/accounting/budget-form";

export default function NewBudgetPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/accounting/budget" aria-label="Back" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="size-6" /></Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Add budget</h1>
      </div>
      <BudgetForm />
    </div>
  );
}
