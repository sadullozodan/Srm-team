"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { groupsApi, queryKeys } from "@/lib/api/resources";
import { GroupForm } from "@/components/groups/group-form";
import { PanelHeader } from "../../../panels";

export default function EditGroupPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const { data, isPending, isError, error } = useQuery({
    queryKey: queryKeys.detail("Groups", id),
    queryFn: () => groupsApi.get(id),
    enabled: !!id,
  });

  return (
    <div className="space-y-6">
      <PanelHeader title="Edit group" backHref={`/groups/${id}`} />

      {isError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
          Couldn&apos;t load this group
          {error instanceof Error ? `: ${error.message}` : "."}
        </div>
      ) : isPending ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (
        <GroupForm groupId={id} initial={data} />
      )}
    </div>
  );
}
