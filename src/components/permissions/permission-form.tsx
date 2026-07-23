"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { permissionsApi } from "@/lib/api/resources";
import { ApiError } from "@/lib/api/client";
import type { PermissionDto, PermissionWriteDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function PermissionForm({ permissionId, initial }: { permissionId?: string; initial?: PermissionDto }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState(initial?.name ?? "");
  const [group, setGroup] = useState(initial?.group ?? "");
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (body: PermissionWriteDto) =>
      permissionId ? permissionsApi.update(permissionId, body) : permissionsApi.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Permissions"] });
      router.push("/administration/permission");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Couldn't save."),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        mutation.mutate({ name: name.trim(), group: group.trim() || null });
      }}
      className="max-w-xl space-y-6"
    >
      <Card>
        <CardContent className="space-y-5 p-6">
          <h2 className="text-lg font-semibold">Permission details</h2>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Name <span className="text-destructive">*</span></label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required className="h-10" placeholder="e.g. students.create" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Group</label>
            <Input value={group} onChange={(e) => setGroup(e.target.value)} className="h-10" placeholder="e.g. Students" />
          </div>
        </CardContent>
      </Card>

      {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" className="h-10" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="animate-spin" />}
          Save permission
        </Button>
        <Button type="button" variant="outline" size="lg" className="h-10" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
