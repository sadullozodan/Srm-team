"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, SquarePen, Trash2, X } from "lucide-react";
import { positionsApi, queryKeys } from "@/lib/api/resources";
import type { PositionDto } from "@/lib/api/types";
import { Field, Panel, PanelHeader, PrimaryAction } from "../../accounting/parts";

// Positions are the job titles an employee can hold. Short list, edited in
// place — a page rather than the Figma's drawer, because the rest of the app
// has no drawer pattern yet.

const LIST_PARAMS = { pageSize: 100 };

const fieldCls =
  "w-full rounded-xl border border-border bg-muted/40 px-3.5 py-2.5 text-xs font-medium text-foreground transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none";

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
    <Panel>
      <PanelHeader title="Positions" backHref="/employees" />

      <form onSubmit={handleCreate} className="flex flex-wrap items-center gap-3">
        <div className="min-w-56 flex-1">
          <Field label="New position">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Mentor"
              className={fieldCls}
            />
          </Field>
        </div>
        <PrimaryAction type="submit" disabled={!newName.trim() || createMutation.isPending}>
          <Plus className="size-4 stroke-3" />
          <span>ADD</span>
        </PrimaryAction>
      </form>

      {createMutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : "Couldn't add that position."}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {isPending
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border p-4">
                <span className="block h-5 w-32 animate-pulse rounded bg-muted" />
              </div>
            ))
          : positions.map((position) => (
              <div
                key={position.id}
                className="flex items-center justify-between gap-2 rounded-2xl border border-border bg-card p-4 shadow-xs transition-all hover:border-primary/40"
              >
                {editingId === position.id ? (
                  <>
                    <input
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className={fieldCls}
                      autoFocus
                    />
                    <div className="flex shrink-0 items-center gap-1">
                      <IconButton
                        label="Save"
                        tone="text-emerald-600 hover:bg-emerald-500/10"
                        disabled={!editingName.trim()}
                        onClick={() =>
                          renameMutation.mutate({ id: position.id, name: editingName.trim() })
                        }
                      >
                        <Check className="size-4" />
                      </IconButton>
                      <IconButton
                        label="Cancel"
                        tone="text-muted-foreground hover:bg-muted"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="size-4" />
                      </IconButton>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="truncate font-bold">{position.name ?? "—"}</span>
                    <div className="flex shrink-0 items-center gap-1">
                      <IconButton
                        label="Rename"
                        tone="text-primary hover:bg-primary/10"
                        onClick={() => startEditing(position)}
                      >
                        <SquarePen className="size-4" />
                      </IconButton>
                      <IconButton
                        label="Delete"
                        tone="text-rose-500 hover:bg-rose-500/10"
                        onClick={() => handleDelete(position)}
                      >
                        <Trash2 className="size-4" />
                      </IconButton>
                    </div>
                  </>
                )}
              </div>
            ))}
      </div>

      {!isPending && positions.length === 0 && (
        <p className="rounded-xl border border-border py-10 text-center text-sm text-muted-foreground">
          No positions yet — add the first one above.
        </p>
      )}
    </Panel>
  );
}

function IconButton({
  label,
  tone,
  disabled,
  onClick,
  children,
}: {
  label: string;
  tone: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`rounded p-1.5 transition-colors disabled:opacity-40 ${tone}`}
    >
      {children}
    </button>
  );
}
