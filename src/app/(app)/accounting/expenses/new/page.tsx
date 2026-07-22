"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ExpenseForm } from "@/components/accounting/expense-form";

export default function NewExpensePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/accounting/expenses" aria-label="Back" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="size-6" /></Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Add expense</h1>
      </div>
      <ExpenseForm />
    </div>
  );
}
