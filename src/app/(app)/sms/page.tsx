"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Send, Trash2 } from "lucide-react";
import { smsApi, smsTemplatesApi, queryKeys } from "@/lib/api/resources";
import type { SendSmsRequest, SmsTargetType, SmsTemplateDto } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const TARGETS: SmsTargetType[] = ["Group", "Students", "Mentors", "Leads", "Graduates"];

type Tab = "send" | "history" | "templates";

export default function SmsPage() {
  const [tab, setTab] = useState<Tab>("send");

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">SMS mailings</h1>

      <div className="flex w-fit overflow-hidden rounded-xl border border-border bg-card">
        {(["send", "history", "templates"] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "h-11 px-5 text-sm font-medium capitalize transition-colors",
              tab === t ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-muted"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "send" && <SendTab />}
      {tab === "history" && <HistoryTab />}
      {tab === "templates" && <TemplatesTab />}
    </div>
  );
}

function SendTab() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetType, setTargetType] = useState<SmsTargetType>("Students");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const templates = useQuery({
    queryKey: queryKeys.list("SmsTemplates", { pageSize: 100 }),
    queryFn: () => smsTemplatesApi.list({ pageSize: 100 }),
  });

  const mutation = useMutation({
    mutationFn: (payload: SendSmsRequest) => smsApi.send(payload),
    onSuccess: () => {
      setSent(true);
      setTitle("");
      setBody("");
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : "Couldn't send."),
  });

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <Card>
        <CardContent className="space-y-5 p-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-10" placeholder="Mailing title" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Send to</label>
            <Select value={targetType} onChange={(e) => setTargetType(e.target.value as SmsTargetType)} className="sm:max-w-56">
              {TARGETS.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Message</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={6} className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30" placeholder="Type your message…" />
          </div>

          {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}
          {sent && <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">Message sent.</p>}

          <Button
            size="lg"
            className="h-10 gap-1.5"
            disabled={mutation.isPending || !title.trim() || !body.trim()}
            onClick={() => {
              setError(null);
              setSent(false);
              mutation.mutate({ title: title.trim(), body: body.trim(), targetType });
            }}
          >
            {mutation.isPending ? <Loader2 className="animate-spin" /> : <Send className="size-4" />}
            Send
          </Button>
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardContent className="p-6">
          <h2 className="mb-3 text-lg font-semibold">Templates</h2>
          {templates.isPending ? (
            <Skeleton className="h-20 w-full rounded-lg" />
          ) : templates.data?.items?.length ? (
            <div className="space-y-2">
              {templates.data.items.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setTitle(t.title ?? "");
                    setBody(t.body ?? "");
                  }}
                  className="w-full rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:border-primary/40"
                >
                  <p className="font-medium">{t.title ?? "Untitled"}</p>
                  <p className="truncate text-xs text-muted-foreground">{t.body}</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No templates yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function HistoryTab() {
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("SmsHistory", { pageSize: 100 }),
    queryFn: () => smsApi.history({ pageSize: 100 }),
  });
  const rows = data?.items ?? [];

  if (isError) return <Card><CardContent className="p-6 text-sm text-destructive">Couldn&apos;t load history.</CardContent></Card>;

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Title</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Sent at</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isPending ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">{Array.from({ length: 4 }).map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-24" /></TableCell>)}</TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow className="hover:bg-transparent"><TableCell colSpan={4} className="py-10 text-center text-muted-foreground">No mailings sent yet.</TableCell></TableRow>
          ) : (
            rows.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.title ?? "—"}</TableCell>
                <TableCell><Badge variant="muted">{m.targetType}</Badge></TableCell>
                <TableCell className="text-muted-foreground">{m.recipientCount}</TableCell>
                <TableCell className="text-muted-foreground">{new Date(m.sentAt).toLocaleString("en-GB")}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

function TemplatesTab() {
  const queryClient = useQueryClient();
  const { data, isPending } = useQuery({
    queryKey: queryKeys.list("SmsTemplates", { pageSize: 100 }),
    queryFn: () => smsTemplatesApi.list({ pageSize: 100 }),
  });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["SmsTemplates"] });

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const createMutation = useMutation({
    mutationFn: () => smsTemplatesApi.create({ title: title.trim(), body: body.trim() }),
    onSuccess: () => {
      setTitle("");
      setBody("");
      invalidate();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => smsTemplatesApi.remove(id),
    onSuccess: invalidate,
  });

  const templates = data?.items ?? [];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <Card className="h-fit">
        <CardContent className="p-0">
          {isPending ? (
            <div className="p-6"><Skeleton className="h-20 w-full rounded-lg" /></div>
          ) : templates.length === 0 ? (
            <p className="p-6 text-sm text-muted-foreground">No templates yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {templates.map((t: SmsTemplateDto) => (
                <div key={t.id} className="flex items-start justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="font-medium">{t.title ?? "Untitled"}</p>
                    <p className="text-sm text-muted-foreground">{t.body}</p>
                  </div>
                  <Button variant="ghost" size="icon-sm" aria-label="Delete" onClick={() => deleteMutation.mutate(t.id)}>
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="h-fit">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-lg font-semibold">New template</h2>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-10" placeholder="Title" />
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30" placeholder="Template body" />
          <Button className="h-10 w-full gap-1.5" disabled={createMutation.isPending || !title.trim() || !body.trim()} onClick={() => createMutation.mutate()}>
            {createMutation.isPending ? <Loader2 className="animate-spin" /> : <Plus className="size-4" />}
            Add template
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
