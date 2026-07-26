"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "@base-ui/react/dialog";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { queryKeys, smsTemplatesApi } from "@/lib/api/resources";
import type { SmsTemplateDto } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TemplateDialog() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { data, isPending } = useQuery({
    queryKey: queryKeys.list(smsTemplatesApi.key, { pageSize: 100 }),
    queryFn: () => smsTemplatesApi.list({ pageSize: 100 }),
  });

  const templates = data?.items ?? [];

  function resetForm() {
    setEditId(null);
    setTitle("");
    setBody("");
  }

  function openEdit(template: SmsTemplateDto) {
    setEditId(template.id);
    setTitle(template.title ?? "");
    setBody(template.body ?? "");
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editId) {
        return smsTemplatesApi.update(editId, { title: title.trim(), body: body.trim() });
      }
      return smsTemplatesApi.create({ title: title.trim(), body: body.trim() });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.list(smsTemplatesApi.key) });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => smsTemplatesApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.list(smsTemplatesApi.key) });
    },
  });

  return (
    <Dialog.Root open={open} onOpenChange={(next) => { setOpen(next); if (!next) resetForm(); }}>
      <Dialog.Trigger
        type="button"
        className="text-xs font-semibold text-primary hover:underline"
      >
        Manage
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/20 transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 flex w-full max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-2xl border border-border bg-card p-6 text-foreground shadow-lg transition-all data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-bold">SMS templates</Dialog.Title>
            <Dialog.Close className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted">
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Template title"
                maxLength={150}
                className="h-10"
              />
              <Button
                type="button"
                size="sm"
                disabled={!title.trim() || !body.trim() || saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
                className="gap-1.5"
              >
                <Plus className="size-4" />
                {editId ? "Save" : "Add"}
              </Button>
            </div>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Template message body"
              maxLength={1000}
              className="min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
            />
          </div>

          {saveMutation.isError && (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {saveMutation.error instanceof Error ? saveMutation.error.message : "Failed to save template."}
            </p>
          )}

          <div className="max-h-64 space-y-1 overflow-y-auto">
            {isPending ? (
              <p className="py-4 text-center text-sm text-muted-foreground">Loading...</p>
            ) : templates.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No templates yet.</p>
            ) : (
              templates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-start justify-between gap-2 rounded-lg border border-border p-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{template.title ?? "Untitled"}</p>
                    {template.body && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {template.body}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(template)}
                      className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
                      aria-label="Edit template"
                    >
                      <Pencil className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Delete this template?")) deleteMutation.mutate(template.id);
                      }}
                      className="grid size-8 place-items-center rounded-lg text-destructive hover:bg-destructive/10"
                      aria-label="Delete template"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
