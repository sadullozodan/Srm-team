"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { employeesApi, salariesApi, queryKeys } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { ActivationStatus, SalaryDto, SalaryWriteDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/form-field";

const STATUSES: ActivationStatus[] = ["Active", "Inactive"];
const now = new Date();

export function SalaryForm({ salaryId, initial }: { salaryId?: string; initial?: SalaryDto }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState(initial?.employeeId ?? "");
  const [total, setTotal] = useState(initial?.total != null ? String(initial.total) : "");
  const [prepaid, setPrepaid] = useState(initial?.prepaid != null ? String(initial.prepaid) : "");
  const [paid, setPaid] = useState(initial?.paid != null ? String(initial.paid) : "");
  const [year, setYear] = useState(String(initial?.year ?? now.getFullYear()));
  const [month, setMonth] = useState(String(initial?.month ?? now.getMonth() + 1));
  const [status, setStatus] = useState<ActivationStatus>(initial?.status ?? "Active");
  const [error, setError] = useState<string | null>(null);

  const employees = useQuery({ queryKey: queryKeys.list("Employees", { pageSize: 100 }), queryFn: () => employeesApi.list({ pageSize: 100 }) });

  const mutation = useMutation({
    mutationFn: (body: SalaryWriteDto) => (salaryId ? salariesApi.update(salaryId, body) : salariesApi.create(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Salaries"] });
      router.push("/accounting/salary");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Couldn't save the salary."),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const t = Number(total) || 0;
        const p = Number(paid) || 0;
        mutation.mutate({
          employeeId,
          total: t,
          prepaid: Number(prepaid) || 0,
          paid: p,
          remaining: t - p,
          year: Number(year) || now.getFullYear(),
          month: Number(month) || now.getMonth() + 1,
          status,
        });
      }}
      className="max-w-2xl space-y-6"
    >
      <Card>
        <CardContent className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">Salary details</h2>
          <Field label="Employee" required>
            <Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required disabled={employees.isPending}>
              <option value="">Select employee</option>
              {employees.data?.items?.map((m) => <option key={m.id} value={m.id}>{m.fullName ?? [m.firstName, m.lastName].filter(Boolean).join(" ")}</option>)}
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Total">
              <Input type="number" min={0} value={total} onChange={(e) => setTotal(e.target.value)} className="h-10" placeholder="3000" />
            </Field>
            <Field label="Prepaid">
              <Input type="number" min={0} value={prepaid} onChange={(e) => setPrepaid(e.target.value)} className="h-10" placeholder="0" />
            </Field>
            <Field label="Paid">
              <Input type="number" min={0} value={paid} onChange={(e) => setPaid(e.target.value)} className="h-10" placeholder="0" />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Year">
              <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="h-10" />
            </Field>
            <Field label="Month">
              <Input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} className="h-10" />
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
          Save salary
        </Button>
        <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
