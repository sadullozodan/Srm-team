"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { rolesApi } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { RoleDto, RoleType, RoleWriteDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Field } from "@/components/ui/form-field";

const ROLE_TYPES: RoleType[] = ["SuperAdmin", "Admin", "Manager", "Accountant", "Mentor", "Developer", "Student"];

export function RoleForm({ roleId, initial }: { roleId?: string; initial?: RoleDto }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState(initial?.name ?? "");
  const [type, setType] = useState<RoleType>(initial?.type ?? "Manager");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (body: RoleWriteDto) => (roleId ? rolesApi.update(roleId, body) : rolesApi.create(body)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Roles"] });
      router.push("/administration/roles");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Couldn't save the role."),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        mutation.mutate({ name: name.trim(), type, description: description.trim() || null });
      }}
      className="max-w-xl space-y-6"
    >
      <Card>
        <CardContent className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">Role details</h2>
          <Field label="Name" required>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="h-10" placeholder="e.g. Branch manager" />
          </Field>
          <Field label="Type">
            <Select value={type} onChange={(e) => setType(e.target.value as RoleType)} className="sm:max-w-56">
              {ROLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </Field>
          <Field label="Description">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30" placeholder="What can this role do?" />
          </Field>
        </CardContent>
      </Card>

      {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" className="h-10" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Save role
        </Button>
        <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
