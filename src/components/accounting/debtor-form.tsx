"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { debtorsApi, studentsApi, queryKeys } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { DebtStatus, DebtorDto, DebtorWriteDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/form-field";

const STATUSES: DebtStatus[] = ["InProgress", "Paid"];

export function DebtorForm({ debtorId, initial }: { debtorId?: string; initial?: DebtorDto }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [studentId, setStudentId] = useState(initial?.studentId ?? "");
  const [fullName, setFullName] = useState(initial?.fullName ?? "");
  const [fromDate, setFromDate] = useState(initial?.fromDate ? initial.fromDate.slice(0, 10) : "");
  const [toDate, setToDate] = useState(initial?.toDate ? initial.toDate.slice(0, 10) : "");
  const [totalDebtAmount, setTotal] = useState(initial?.totalDebtAmount != null ? String(initial.totalDebtAmount) : "");
  const [paymentPerMonth, setPerMonth] = useState(initial?.paymentPerMonth != null ? String(initial.paymentPerMonth) : "");
  const [totalPaidAmount, setPaid] = useState(initial?.totalPaidAmount != null ? String(initial.totalPaidAmount) : "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [status, setStatus] = useState<DebtStatus>(initial?.status ?? "InProgress");
  const [error, setError] = useState<string | null>(null);

  const students = useQuery({ queryKey: queryKeys.list("Students", { pageSize: 200 }), queryFn: () => studentsApi.list({ pageSize: 200 }) });

  const mutation = useMutation({
    mutationFn: (body: DebtorWriteDto) => (debtorId ? debtorsApi.update(debtorId, body) : debtorsApi.create(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Debtors"] });
      router.push("/accounting/debtors");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Couldn't save the debtor."),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        mutation.mutate({
          studentId: studentId || null,
          fullName: fullName.trim(),
          fromDate: fromDate || new Date().toISOString().slice(0, 10),
          toDate: toDate || new Date().toISOString().slice(0, 10),
          totalDebtAmount: Number(totalDebtAmount) || 0,
          paymentPerMonth: Number(paymentPerMonth) || 0,
          totalPaidAmount: Number(totalPaidAmount) || 0,
          notes: notes.trim() || null,
          status,
        });
      }}
      className="max-w-2xl space-y-6"
    >
      <Card>
        <CardContent className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">Debtor details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Student">
              <Select
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  const s = students.data?.items?.find((x) => x.id === e.target.value);
                  if (s && !fullName) setFullName(s.fullName ?? "");
                }}
                disabled={students.isPending}
              >
                <option value="">Select student</option>
                {students.data?.items?.map((s) => <option key={s.id} value={s.id}>{s.fullName ?? "—"}</option>)}
              </Select>
            </Field>
            <Field label="Full name" required>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-10" placeholder="Full name" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Total debt">
              <Input type="number" min={0} value={totalDebtAmount} onChange={(e) => setTotal(e.target.value)} className="h-10" placeholder="1000" />
            </Field>
            <Field label="Per month">
              <Input type="number" min={0} value={paymentPerMonth} onChange={(e) => setPerMonth(e.target.value)} className="h-10" placeholder="200" />
            </Field>
            <Field label="Paid">
              <Input type="number" min={0} value={totalPaidAmount} onChange={(e) => setPaid(e.target.value)} className="h-10" placeholder="0" />
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
              <Select value={status} onChange={(e) => setStatus(e.target.value as DebtStatus)}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
            </Field>
          </div>
          <Field label="Notes">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30" placeholder="Notes" />
          </Field>
        </CardContent>
      </Card>

      {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" className="h-10" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Save debtor
        </Button>
        <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
