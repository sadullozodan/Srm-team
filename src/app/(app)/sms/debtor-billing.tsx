"use client";

import { useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { debtorsApi, notificationsApi, queryKeys, smsMailingsApi, smsTemplatesApi } from "@/lib/api/resources";
import type { DebtorDto, SmsTemplateDto } from "@/lib/api/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 10;

function money(amount: number) {
  return `${new Intl.NumberFormat("ru-RU").format(amount)} c`;
}

export function DebtorBilling() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");

  const debtorsQuery = useQuery({
    queryKey: ["debtors", "sms-billing", page],
    queryFn: () => debtorsApi.list({ page, pageSize: PAGE_SIZE, status: 0 }),
    placeholderData: keepPreviousData,
  });

  const templatesQuery = useQuery({
    queryKey: queryKeys.list(smsTemplatesApi.key, { pageSize: 100 }),
    queryFn: () => smsTemplatesApi.list({ pageSize: 100 }),
  });

  const debtors = debtorsQuery.data?.items ?? [];
  const totalPages = Math.max(debtorsQuery.data?.totalPages ?? 1, 1);
  const templates = templatesQuery.data?.items ?? [];

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === debtors.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(debtors.map((d) => d.id)));
    }
  }

  function applyTemplate(id: string) {
    const template = templates.find((t) => t.id === id);
    if (!template) return;
    setTitle(template.title ?? "");
    setBody(template.body ?? "");
  }

  const sendMutation = useMutation({
    mutationFn: async () => {
      const mailing = await smsMailingsApi.send({
        title: title.trim(),
        body: body.trim(),
        targetType: "Students",
        recipientIds: Array.from(selected),
      });
      try {
        await notificationsApi.create({
          title: "Debtor SMS sent",
          message: `Billing SMS sent to ${mailing.recipientCount} debtor${mailing.recipientCount === 1 ? "" : "s"}.`,
        });
      } catch { /* notification is best-effort */ }
      return mailing;
    },
    onSuccess: () => {
      setTitle("");
      setBody("");
      setSelected(new Set());
      queryClient.invalidateQueries({ queryKey: ["SmsMailings"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationsUnreadCount });
    },
  });

  const canSend = selected.size > 0 && title.trim() !== "" && body.trim() !== "" && !sendMutation.isPending;

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Debtor billing</CardTitle>
          <CardDescription>
            Select debtors and send them a payment reminder SMS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Template</span>
            <Select
              defaultValue=""
              onChange={(e) => applyTemplate(e.target.value)}
              disabled={templatesQuery.isPending || templates.length === 0}
            >
              <option value="">Choose template</option>
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title ?? "Untitled"}
                </option>
              ))}
            </Select>
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Title</span>
            <Input
              value={title}
              maxLength={150}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Payment reminder"
              className="h-11"
              required
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Message</span>
            <textarea
              value={body}
              maxLength={1000}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Dear student, please pay your tuition debt."
              className="min-h-36 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              required
            />
            <span className="block text-right text-xs text-muted-foreground">
              {1000 - body.length} characters left
            </span>
          </label>

          {sendMutation.isError && (
            <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {sendMutation.error instanceof Error ? sendMutation.error.message : "Could not send SMS."}
            </p>
          )}

          {sendMutation.data && (
            <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600">
              SMS sent to {sendMutation.data.recipientCount} debtor{sendMutation.data.recipientCount === 1 ? "" : "s"}.
            </p>
          )}

          <Button
            type="button"
            size="lg"
            disabled={!canSend}
            onClick={() => sendMutation.mutate()}
            className="w-full gap-2"
          >
            <Send className="size-4" />
            {sendMutation.isPending
              ? "Sending..."
              : `Send to ${selected.size} debtor${selected.size === 1 ? "" : "s"}`}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Debtors</CardTitle>
          <CardDescription>
            Students with outstanding balances. Select the ones to bill.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {debtorsQuery.isPending ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-lg" />
              ))}
            </div>
          ) : debtors.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No debtors found.
            </p>
          ) : (
            <>
              <div className="flex items-center gap-2 pb-1">
                <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={selected.size === debtors.length && debtors.length > 0}
                    onChange={toggleAll}
                    className="size-4 accent-primary"
                  />
                  Select all ({debtors.length})
                </label>
                {selected.size > 0 && (
                  <Badge variant="muted" className="ml-auto">
                    {selected.size} selected
                  </Badge>
                )}
              </div>

              <div className="space-y-2">
                {debtors.map((debtor) => (
                  <DebtorRow
                    key={debtor.id}
                    debtor={debtor}
                    checked={selected.has(debtor.id)}
                    onToggle={toggle}
                  />
                ))}
              </div>
            </>
          )}

          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
            <span>{debtorsQuery.data?.totalCount ?? 0} total</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={debtorsQuery.isPlaceholderData || page <= 1}
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
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={debtorsQuery.isPlaceholderData || page >= totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DebtorRow({
  debtor,
  checked,
  onToggle,
}: {
  debtor: DebtorDto;
  checked: boolean;
  onToggle: (id: string) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/40 has-checked:border-primary/40 has-checked:bg-primary/5">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle(debtor.id)}
        className="size-4 shrink-0 accent-primary"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{debtor.fullName ?? "Unknown"}</p>
        <p className="text-xs text-muted-foreground">
          Debt: <span className="font-semibold text-rose-500">{money(debtor.totalDebtAmount)}</span>
          {" · "}Paid: <span className="font-semibold text-emerald-600">{money(debtor.totalPaidAmount)}</span>
        </p>
      </div>
    </label>
  );
}
