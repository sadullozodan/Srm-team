"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { positionsApi, queryKeys } from "@/lib/api/resources";
import type { PositionDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Positions are the job titles an employee can hold. Short list, edited in
// place — a page rather than the drawer the Figma shows, because the rest of
// the app has no drawer pattern yet.

const LIST_PARAMS = { pageSize: 100 };

export default function PositionsPage() {
  const queryClient = useQueryClient();
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const { data, isPending } = useQuery({
    queryKey: queryKeys.list("Positions", LIST_PARAMS),
    queryFn: () => positionsApi.list(LIST_PARAMS),
  });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: ["Positions"] });
  }

  const createMutation = useMutation({
    mutationFn: (name: string) => positionsApi.create({ name }),
    onSuccess: () => {
      setNewName("");
      refresh();
    },
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      positionsApi.update(id, { name }),
    onSuccess: () => {
      setEditingId(null);
      refresh();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => positionsApi.remove(id),
    onSuccess: refresh,
  });

  function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    const name = newName.trim();
    if (name) createMutation.mutate(name);
  }

  function startEditing(position: PositionDto) {
    setEditingId(position.id);
    setEditingName(position.name ?? "");
  }

  function handleDelete(position: PositionDto) {
    if (window.confirm(`Delete the ${position.name} position?`)) {
      deleteMutation.mutate(position.id);
    }
  }

  const positions = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Positions</h1>
        <Button variant="outline" render={<Link href="/employees" />}>
          <ArrowLeft className="size-4" />
          Employees
        </Button>
      </div>

      <Card>
        <CardContent className="p-5">
          <form onSubmit={handleCreate} className="flex flex-wrap items-center gap-3">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New position name"
              className="h-11 min-w-56 flex-1 rounded-xl"
            />
            <Button type="submit" disabled={!newName.trim() || createMutation.isPending}>
              <Plus className="size-4" />
              Add position
            </Button>
          </form>
          {createMutation.isError && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {createMutation.error instanceof Error
                ? createMutation.error.message
                : "Couldn't add that position."}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {isPending
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-5 w-32" />
                </CardContent>
              </Card>
            ))
          : positions.map((position) => (
              <Card key={position.id}>
                <CardContent className="flex items-center justify-between gap-2 p-4">
                  {editingId === position.id ? (
                    <>
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="h-9 rounded-lg"
                        autoFocus
                      />
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Save"
                          disabled={!editingName.trim()}
                          onClick={() =>
                            renameMutation.mutate({
                              id: position.id,
                              name: editingName.trim(),
                            })
                          }
                        >
                          <Check className="size-4 text-emerald-600" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Cancel"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="truncate font-medium">{position.name ?? "—"}</span>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Rename"
                          onClick={() => startEditing(position)}
                        >
                          <Pencil className="size-4 text-primary" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Delete"
                          onClick={() => handleDelete(position)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
      </div>

      {!isPending && positions.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No positions yet — add the first one above.
        </p>
      )}
    </div>
  );
}
