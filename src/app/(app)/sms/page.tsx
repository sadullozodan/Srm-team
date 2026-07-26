"use client";

import { useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, ChevronLeft, ChevronRight, DollarSign, MessageSquareText, Send } from "lucide-react";
import {
  notificationsApi,
  queryKeys,
  smsMailingsApi,
  smsTemplatesApi,
} from "@/lib/api/resources";
import type { SendSmsRequest, SmsMailingDto, SmsTargetType } from "@/lib/api/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TemplateDialog } from "./template-dialog";
import { DebtorBilling } from "./debtor-billing";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;
const TARGETS: SmsTargetType[] = ["Students", "Group", "Mentors", "Leads", "Graduates"];

function parseRecipientIds(value: string) {
  return value
    .split(/[\s,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const TABS = [
  { key: "campaigns", label: "Campaigns", icon: MessageSquareText },
  { key: "billing", label: "Debtor billing", icon: DollarSign },
] as const;

type Tab = (typeof TABS)[number]["key"];

export default function SmsPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<Tab>("campaigns");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [targetType, setTargetType] = useState<SmsTargetType>("Students");
  const [recipientIds, setRecipientIds] = useState("");
  const [page, setPage] = useState(1);

  const historyParams = useMemo(() => ({ page, pageSize: PAGE_SIZE }), [page]);

  const templatesQuery = useQuery({
    queryKey: queryKeys.list(smsTemplatesApi.key, { pageSize: 100 }),
    queryFn: () => smsTemplatesApi.list({ pageSize: 100 }),
  });

  const historyQuery = useQuery({
    queryKey: queryKeys.smsHistory(historyParams),
    queryFn: () => smsMailingsApi.history(historyParams),
    placeholderData: keepPreviousData,
  });

  const sendMutation = useMutation({
    mutationFn: async (payload: SendSmsRequest) => {
      const mailing = await smsMailingsApi.send(payload);
      let notificationError: string | null = null;

      try {
        await notificationsApi.create({
          title: "SMS mailing sent",
          message: `${mailing.title ?? payload.title} was sent to ${mailing.recipientCount} recipient${mailing.recipientCount === 1 ? "" : "s"}.`,
        });
      } catch (error) {
        notificationError = error instanceof Error ? error.message : "Notification was not created.";
      }

      return { mailing, notificationError };
    },
    onSuccess: () => {
      setTitle("");
      setBody("");
      setRecipientIds("");
      queryClient.invalidateQueries({ queryKey: ["SmsMailings"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationsUnreadCount });
    },
  });

  const templates = templatesQuery.data?.items ?? [];
  const mailings = historyQuery.data?.items ?? [];
  const totalPages = Math.max(historyQuery.data?.totalPages ?? 1, 1);
  const bodyLeft = 1000 - body.length;
  const canSend = title.trim() !== "" && body.trim() !== "" && !sendMutation.isPending;

  function applyTemplate(id: string) {
    const template = templates.find((item) => item.id === id);
    if (!template) return;
    setTitle(template.title ?? "");
    setBody(template.body ?? "");
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const ids = parseRecipientIds(recipientIds);
    sendMutation.mutate({
      title: title.trim(),
      body: body.trim(),
      targetType,
      recipientIds: ids.length > 0 ? ids : null,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">SMS mailings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Send a backend SMS campaign and track the real delivery history.
          </p>
        </div>
        <Badge variant="outline" className="gap-1.5">
          <MessageSquareText className="size-3.5" />
          Revenge API
        </Badge>
      </div>

      <div className="flex gap-1 rounded-xl bg-muted/60 p-1">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              tab === item.key
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </button>
        ))}
      </div>

      {tab === "billing" ? (
        <DebtorBilling />
      ) : (
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader>
            <CardTitle>New mailing</CardTitle>
            <CardDescription>
              The message is sent through POST /api/SmsMailings/send.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block space-y-1.5">
                <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  Template
                  <TemplateDialog />
                </span>
                <Select
                  defaultValue=""
                  onChange={(event) => applyTemplate(event.target.value)}
                  disabled={templatesQuery.isPending || templates.length === 0}
                >
                  <option value="">Choose template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.title ?? "Untitled template"}
                    </option>
                  ))}
                </Select>
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Title</span>
                <Input
                  value={title}
                  maxLength={150}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Payment reminder"
                  className="h-11"
                  required
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Audience</span>
                <Select
                  value={targetType}
                  onChange={(event) => setTargetType(event.target.value as SmsTargetType)}
                >
                  {TARGETS.map((target) => (
                    <option key={target} value={target}>
                      {target}
                    </option>
                  ))}
                </Select>
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Recipient IDs
                </span>
                <textarea
                  value={recipientIds}
                  onChange={(event) => setRecipientIds(event.target.value)}
                  placeholder="Optional UUIDs separated by comma, space, or new line"
                  className="min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground">Message</span>
                <textarea
                  value={body}
                  maxLength={1000}
                  onChange={(event) => setBody(event.target.value)}
                  placeholder="Write the SMS text"
                  className="min-h-36 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  required
                />
                <span className="block text-right text-xs text-muted-foreground">
                  {bodyLeft} characters left
                </span>
              </label>

              {sendMutation.isError && (
                <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {sendMutation.error instanceof Error ? sendMutation.error.message : "Could not send SMS."}
                </p>
              )}

              {sendMutation.data && (
                <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
                  SMS sent to {sendMutation.data.mailing.recipientCount} recipient
                  {sendMutation.data.mailing.recipientCount === 1 ? "" : "s"}.
                  {sendMutation.data.notificationError
                    ? ` Notification warning: ${sendMutation.data.notificationError}`
                    : " Notification created."}
                </p>
              )}

              <Button type="submit" size="lg" disabled={!canSend} className="w-full gap-2">
                <Send className="size-4" />
                {sendMutation.isPending ? "Sending..." : "Send SMS"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mailing history</CardTitle>
            <CardDescription>Latest records from GET /api/SmsMailings/history.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MailingTable items={mailings} loading={historyQuery.isPending} />

            <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>{historyQuery.data?.totalCount ?? 0} total</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={historyQuery.isPlaceholderData || page <= 1}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span className="min-w-20 text-center">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={historyQuery.isPlaceholderData || page >= totalPages}
                  aria-label="Next page"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
              <Bell className="size-4 text-primary" />
              Successful sends refresh the notification list and unread badge.
            </div>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  );
}

function MailingTable({ items, loading }: { items: SmsMailingDto[]; loading: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Title</TableHead>
            <TableHead>Audience</TableHead>
            <TableHead>Recipients</TableHead>
            <TableHead>Sent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                {Array.from({ length: 4 }).map((__, cell) => (
                  <TableCell key={cell}>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : items.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                No SMS mailings yet.
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">
                  <div className="max-w-72">
                    <p className="truncate">{item.title ?? "Untitled mailing"}</p>
                    {item.body && (
                      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                        {item.body}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="muted">{item.targetType}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{item.recipientCount}</TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {formatDate(item.sentAt)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
