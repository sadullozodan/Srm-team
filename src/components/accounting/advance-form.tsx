"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { advancesApi, employeesApi, queryKeys } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { AdvanceDto, AdvanceStatus, AdvanceWriteDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/form-field";

const STATUSES: AdvanceStatus[] = ["Pending", "Approved", "Denied", "Done"];
const now = new Date();

export function AdvanceForm({ advanceId, initial }: { advanceId?: string; initial?: AdvanceDto }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [employeeId, setEmployeeId] = useState(initial?.employeeId ?? "");
  const [year, setYear] = useState(String(initial?.year ?? now.getFullYear()));
  const [month, setMonth] = useState(String(initial?.month ?? now.getMonth() + 1));
  const [amount, setAmount] = useState(initial?.amount != null ? String(initial.amount) : "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<AdvanceStatus>(initial?.status ?? "Pending");
  const [error, setError] = useState<string | null>(null);

  const employees = useQuery({ queryKey: queryKeys.list("Employees", { pageSize: 100 }), queryFn: () => employeesApi.list({ pageSize: 100 }) });

  const mutation = useMutation({
    mutationFn: (body: AdvanceWriteDto) => (advanceId ? advancesApi.update(advanceId, body) : advancesApi.create(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Advances"] });
      router.push("/accounting/avans");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Couldn't save the advance."),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        mutation.mutate({
          employeeId,
          year: Number(year) || now.getFullYear(),
          month: Number(month) || now.getMonth() + 1,
          amount: Number(amount) || 0,
          description: description.trim() || null,
          status,
        });
      }}
      className="max-w-2xl space-y-6"
    >
      <Card>
        <CardContent className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">Advance details</h2>
          <Field label="Employee" required>
            <Select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} required disabled={employees.isPending}>
              <option value="">Select employee</option>
              {employees.data?.items?.map((m) => <option key={m.id} value={m.id}>{m.fullName ?? [m.firstName, m.lastName].filter(Boolean).join(" ")}</option>)}
            </Select>
          </Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Year">
              <Input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="h-10" />
            </Field>
            <Field label="Month">
              <Input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(e.target.value)} className="h-10" />
            </Field>
            <Field label="Amount">
              <Input type="number" min={0} value={amount} onChange={(e) => setAmount(e.target.value)} className="h-10" placeholder="500" />
            </Field>
          </div>
          <Field label="Status">
            <Select value={status} onChange={(e) => setStatus(e.target.value as AdvanceStatus)} className="sm:max-w-56">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </Field>
          <Field label="Description">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30" placeholder="Reason" />
          </Field>
        </CardContent>
      </Card>

      {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" className="h-10" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Save advance
        </Button>
        <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
