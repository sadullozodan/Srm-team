"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { budgetsApi, queryKeys } from "@/lib/api/resources";
import { BudgetForm } from "@/components/accounting/budget-form";
import { Card, CardContent } from "@/components/ui/card";

export default function EditBudgetPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, isError } = useQuery({ queryKey: queryKeys.detail("Budgets", id), queryFn: () => budgetsApi.get(id), enabled: !!id });
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/accounting/budget" aria-label="Back" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="size-6" /></Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit budget</h1>
      </div>
      {isError ? <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load.</CardContent></Card>
        : isPending ? <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>
        : <BudgetForm budgetId={id} initial={data} />}
    </div>
  );
}
