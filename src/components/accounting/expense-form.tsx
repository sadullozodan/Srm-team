"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { branchesApi, expensesApi, queryKeys } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { ActivationStatus, ExpenseCategory, ExpenseDto, ExpenseWriteDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/form-field";

const CATEGORIES: ExpenseCategory[] = ["Tax", "OfficeExpenses", "Marketing", "Employees", "Other"];
const STATUSES: ActivationStatus[] = ["Active", "Inactive"];

export function ExpenseForm({ expenseId, initial }: { expenseId?: string; initial?: ExpenseDto }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<ExpenseCategory>(initial?.category ?? "Other");
  const [amount, setAmount] = useState(initial?.amount != null ? String(initial.amount) : "");
  const [recipient, setRecipient] = useState(initial?.recipient ?? "");
  const [branchId, setBranchId] = useState(initial?.branchId ?? "");
  const [date, setDate] = useState(initial?.date ? initial.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<ActivationStatus>(initial?.status ?? "Active");
  const [error, setError] = useState<string | null>(null);

  const branches = useQuery({ queryKey: queryKeys.list("Branches", { pageSize: 100 }), queryFn: () => branchesApi.list({ pageSize: 100 }) });

  const mutation = useMutation({
    mutationFn: (body: ExpenseWriteDto) => (expenseId ? expensesApi.update(expenseId, body) : expensesApi.create(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Expenses"] });
      router.push("/accounting/expenses");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Couldn't save the expense."),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        mutation.mutate({
          name: name.trim(),
          category,
          amount: Number(amount) || 0,
          recipient: recipient.trim() || null,
          branchId: branchId || null,
          date: `${date}T00:00:00`,
          status,
        });
      }}
      className="max-w-2xl space-y-6"
    >
      <Card>
        <CardContent className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">Expense details</h2>
          <Field label="Name" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="h-10" placeholder="e.g. Office rent" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <Select value={category} onChange={(e) => setCategory(e.target.value as ExpenseCategory)}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </Field>
            <Field label="Amount">
              <Input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} className="h-10" placeholder="1000" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Recipient">
              <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} className="h-10" placeholder="Recipient" />
            </Field>
            <Field label="Branch">
              <Select value={branchId} onChange={(e) => setBranchId(e.target.value)} disabled={branches.isPending}>
                <option value="">Select branch</option>
                {branches.data?.items?.map((b) => <option key={b.id} value={b.id}>{b.title ?? "—"}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-10" />
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
          Save expense
        </Button>
        <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
