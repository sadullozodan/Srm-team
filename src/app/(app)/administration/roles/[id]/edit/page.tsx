"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { rolesApi, queryKeys } from "@/lib/api/resources";
import { RoleForm } from "@/components/roles/role-form";
import { Card, CardContent } from "@/components/ui/card";

export default function EditRolePage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.detail("Roles", id),
    queryFn: () => rolesApi.get(id),
    enabled: !!id,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/administration/roles" aria-label="Back" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-6" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Edit role</h1>
      </div>
      {isError ? (
        <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load this role.</CardContent></Card>
      ) : isPending ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div>
      ) : (
        <RoleForm roleId={id} initial={data} />
      )}
    </div>
  );
}
