"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { branchesApi, budgetsApi, queryKeys } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { ActivationStatus, BudgetDto, BudgetWriteDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/form-field";

const STATUSES: ActivationStatus[] = ["Active", "Inactive"];

export function BudgetForm({ budgetId, initial }: { budgetId?: string; initial?: BudgetDto }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [categoryName, setCategoryName] = useState(initial?.categoryName ?? "");
  const [branchId, setBranchId] = useState(initial?.branchId ?? "");
  const [fromDate, setFromDate] = useState(initial?.fromDate ? initial.fromDate.slice(0, 10) : "");
  const [toDate, setToDate] = useState(initial?.toDate ? initial.toDate.slice(0, 10) : "");
  const [amountAllocated, setAllocated] = useState(initial?.amountAllocated != null ? String(initial.amountAllocated) : "");
  const [amountSpent, setSpent] = useState(initial?.amountSpent != null ? String(initial.amountSpent) : "");
  const [status, setStatus] = useState<ActivationStatus>(initial?.status ?? "Active");
  const [error, setError] = useState<string | null>(null);

  const branches = useQuery({ queryKey: queryKeys.list("Branches", { pageSize: 100 }), queryFn: () => branchesApi.list({ pageSize: 100 }) });

  const mutation = useMutation({
    mutationFn: (body: BudgetWriteDto) => (budgetId ? budgetsApi.update(budgetId, body) : budgetsApi.create(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Budgets"] });
      router.push("/accounting/budget");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Couldn't save the budget."),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        mutation.mutate({
          categoryName: categoryName.trim(),
          branchId: branchId || null,
          fromDate: fromDate || new Date().toISOString().slice(0, 10),
          toDate: toDate || new Date().toISOString().slice(0, 10),
          amountAllocated: Number(amountAllocated) || 0,
          amountSpent: Number(amountSpent) || 0,
          status,
        });
      }}
      className="max-w-2xl space-y-6"
    >
      <Card>
        <CardContent className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">Budget details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" required>
              <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required className="h-10" placeholder="e.g. Marketing" />
            </Field>
            <Field label="Branch">
              <Select value={branchId} onChange={(e) => setBranchId(e.target.value)} disabled={branches.isPending}>
                <option value="">Select branch</option>
                {branches.data?.items?.map((b) => <option key={b.id} value={b.id}>{b.title ?? "—"}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Allocated">
              <Input type="number" min={0} value={amountAllocated} onChange={(e) => setAllocated(e.target.value)} className="h-10" placeholder="10000" />
            </Field>
            <Field label="Spent">
              <Input type="number" min={0} value={amountSpent} onChange={(e) => setSpent(e.target.value)} className="h-10" placeholder="0" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="From">
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-10" />
            </Field>
            <Field label="To">
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="h-10" />
            </Field>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value as ActivationStatus)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
          </div>
        </CardContent>
      </Card>

      {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" className="h-10" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Save budget
        </Button>
        <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
