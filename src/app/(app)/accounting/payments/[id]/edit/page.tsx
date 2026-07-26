"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { paymentsApi, queryKeys } from "@/lib/api/resources";
import { PaymentForm } from "@/components/accounting/payment-form";
import { Card, CardContent } from "@/components/ui/card";

export default function EditPaymentPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isPending, isError } = useQuery({ queryKey: queryKeys.detail("Payments", id), queryFn: () => paymentsApi.get(id), enabled: !!id });
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/accounting/payments" aria-label="Back" className="text-muted-foreground hover:text-foreground"><ArrowLeft className="size-6" /></Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit payment</h1>
      </div>
      {isError ? <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load.</CardContent></Card>
        : isPending ? <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>
        : <PaymentForm paymentId={id} initial={data} />}
    </div>
  );
}
