"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { branchesApi, groupsApi, paymentsApi, studentsApi, queryKeys } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { PaymentDto, PaymentStatus, PaymentWriteDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/form-field";

const STATUSES: PaymentStatus[] = ["NotPaid", "Active", "Prepayment", "Paid"];

export function PaymentForm({ paymentId, initial }: { paymentId?: string; initial?: PaymentDto }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [studentId, setStudentId] = useState(initial?.studentId ?? "");
  const [groupId, setGroupId] = useState(initial?.groupId ?? "");
  const [branchId, setBranchId] = useState(initial?.branchId ?? "");
  const [amount, setAmount] = useState(initial?.amount != null ? String(initial.amount) : "");
  const [paid, setPaid] = useState(initial?.paid != null ? String(initial.paid) : "");
  const [discount, setDiscount] = useState(initial?.discount != null ? String(initial.discount) : "");
  const [date, setDate] = useState(initial?.date ? initial.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<PaymentStatus>(initial?.status ?? "Active");
  const [error, setError] = useState<string | null>(null);

  const students = useQuery({ queryKey: queryKeys.list("Students", { pageSize: 200 }), queryFn: () => studentsApi.list({ pageSize: 200 }) });
  const groups = useQuery({ queryKey: queryKeys.list("Groups", { pageSize: 100 }), queryFn: () => groupsApi.list({ pageSize: 100 }) });
  const branches = useQuery({ queryKey: queryKeys.list("Branches", { pageSize: 100 }), queryFn: () => branchesApi.list({ pageSize: 100 }) });

  const mutation = useMutation({
    mutationFn: (body: PaymentWriteDto) => (paymentId ? paymentsApi.update(paymentId, body) : paymentsApi.create(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Payments"] });
      router.push("/accounting/payments");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Couldn't save the payment."),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        mutation.mutate({
          studentId,
          groupId: groupId || null,
          branchId: branchId || null,
          amount: Number(amount) || 0,
          paid: Number(paid) || 0,
          discount: Number(discount) || 0,
          date: `${date}T00:00:00`,
          status,
        });
      }}
      className="max-w-2xl space-y-6"
    >
      <Card>
        <CardContent className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">Payment details</h2>
          <Field label="Student" required>
            <Select value={studentId} onChange={(e) => setStudentId(e.target.value)} required disabled={students.isPending}>
              <option value="">Select student</option>
              {students.data?.items?.map((s) => <option key={s.id} value={s.id}>{s.fullName ?? "—"}</option>)}
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Group">
              <Select value={groupId} onChange={(e) => setGroupId(e.target.value)} disabled={groups.isPending}>
                <option value="">Select group</option>
                {groups.data?.items?.map((g) => <option key={g.id} value={g.id}>{g.name ?? "—"}</option>)}
              </Select>
            </Field>
            <Field label="Branch">
              <Select value={branchId} onChange={(e) => setBranchId(e.target.value)} disabled={branches.isPending}>
                <option value="">Select branch</option>
                {branches.data?.items?.map((b) => <option key={b.id} value={b.id}>{b.title ?? "—"}</option>)}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Amount">
              <Input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} className="h-10" placeholder="500" />
            </Field>
            <Field label="Paid">
              <Input type="number" min={0} value={paid} onChange={(e) => setPaid(e.target.value)} className="h-10" placeholder="0" />
            </Field>
            <Field label="Discount">
              <Input type="number" min={0} value={discount} onChange={(e) => setDiscount(e.target.value)} className="h-10" placeholder="0" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Date">
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-10" />
            </Field>
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus(e.target.value as PaymentStatus)}>
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
          Save payment
        </Button>
        <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
