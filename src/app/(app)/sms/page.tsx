"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send, Users } from "lucide-react";
import { smsMailingsApi } from "@/lib/api/resources";
import type { SmsTargetType } from "@/lib/api/types";
import {
  FormError,
  Panel,
  PanelHeader,
  Pill,
  PrimaryAction,
  Segmented,
  TextAreaField,
  TextField,
  cellCls,
} from "../panels";
import { ResourceTable, dateTime } from "../resource-table";

const TARGETS: readonly SmsTargetType[] = ["Students", "Group", "Mentors", "Leads", "Graduates"];

export default function SmsMailingsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const [target, setTarget] = useState<SmsTargetType>("Students");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  const send = useMutation({
    mutationFn: () =>
      smsMailingsApi.send({ title, body, targetType: target, recipientIds: [] }),
    onSuccess: () => {
      setTitle("");
      setBody("");
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["SmsMailings"] });
    },
    onError: (e) => setError(e instanceof Error ? e.message : "Couldn't send."),
  });

  return (
    <div className="space-y-5">
      {/* Compose */}
      <Panel>
        <PanelHeader title="New mailing" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (title && body) send.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <p className="mb-2 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Audience</p>
            <Segmented options={TARGETS} value={target} onChange={setTarget} />
          </div>

          <TextField label="Title" value={title} onChange={setTitle} required />
          <TextAreaField label="Message" value={body} onChange={setBody} rows={4} />

          <FormError message={error} />
          {send.isSuccess && !error && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">Mailing sent.</p>
          )}

          <PrimaryAction type="submit" disabled={send.isPending || !title || !body}>
            <Send className="size-4" />
            {send.isPending ? "SENDING…" : "SEND"}
          </PrimaryAction>
        </form>
      </Panel>

      {/* History */}
      <Panel>
        <PanelHeader title="History" />
        <div className="pt-1">
          <ResourceTable
            api={smsMailingsApi}
            search=""
            page={page}
            onPageChange={setPage}
            emptyMessage="No mailings sent yet."
            minWidth="min-w-[760px]"
            columns={["Mailing", "Audience", "Recipients", "Sent"]}
            row={(m) => (
              <tr key={m.id} className="align-top transition-colors hover:bg-muted/40">
                <td className={cellCls}>
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                      <MessageSquare className="size-4" />
                    </span>
                    <div>
                      <div className="font-bold">{m.title ?? "—"}</div>
                      <div className="mt-0.5 line-clamp-2 max-w-md text-[11px] text-muted-foreground">{m.body}</div>
                    </div>
                  </div>
                </td>
                <td className={cellCls}>
                  <Pill tone="brand">{m.targetType}</Pill>
                </td>
                <td className={cellCls}>
                  <span className="inline-flex items-center gap-1.5 font-semibold">
                    <Users className="size-3.5 text-muted-foreground" />
                    {m.recipientCount}
                  </span>
                </td>
                <td className={`${cellCls} text-xs whitespace-nowrap text-muted-foreground`}>{dateTime(m.sentAt)}</td>
              </tr>
            )}
          />
        </div>
      </Panel>
    </div>
  );
}

// Search field lives inline in the history controls (kept minimal here).
