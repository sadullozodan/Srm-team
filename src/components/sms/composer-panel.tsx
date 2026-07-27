"use client";

import React, { useState } from "react";
import { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { PagedResult, SmsMailingDto } from "@/lib/api/types";
import { SmsTemplate, SmsHistoryItem } from "./types";
import { Skeleton } from "@/components/ui/skeleton";

export interface ComposerPanelProps {
  templates: SmsTemplate[];
  selectedCount: number;
  recipientIds: string[];
  historyQuery: UseQueryResult<PagedResult<SmsMailingDto>>;
  sendMutation: UseMutationResult<SmsMailingDto, Error, { title: string; body: string; targetType: string; recipientIds: string[] }>;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU");
}

function mailingToHistoryItem(m: SmsMailingDto): SmsHistoryItem {
  return {
    id: m.id,
    title: m.title ?? "",
    date: formatDate(m.sentAt),
    description: m.body ?? "",
    groups: [m.targetType],
    recipients: [`${m.recipientCount} recipient${m.recipientCount === 1 ? "" : "s"}`],
  };
}

export function ComposerPanel({ templates, selectedCount, recipientIds, historyQuery, sendMutation }: ComposerPanelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [isTemplatesOpen, setIsTemplatesOpen] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>(null);

  const handleSelectTemplate = (tpl: SmsTemplate) => {
    setSelectedTemplateId(tpl.id);
    setTitle(tpl.title);
    setDescription(tpl.description);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || recipientIds.length === 0) return;
    sendMutation.mutate({
      title: title.trim(),
      body: description.trim(),
      targetType: "Students",
      recipientIds,
    });
    setTitle("");
    setDescription("");
    setSelectedTemplateId(null);
  };

  const historyList = historyQuery.data?.items ?? [];
  const isPending = sendMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-card rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
          SMS text
        </h2>

        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-4 py-3 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200"
            />
          </div>

          <div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full px-4 py-3 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200 resize-none"
            />
          </div>

          <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/20">
            <button
              type="button"
              onClick={() => setIsTemplatesOpen(!isTemplatesOpen)}
              className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
            >
              <span>Templates</span>
              {isTemplatesOpen ? (
                <ChevronUp className="size-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
              ) : (
                <ChevronDown className="size-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
              )}
            </button>

            {isTemplatesOpen && (
              <div className="p-3 pt-0 space-y-2 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900">
                {templates.length === 0 && (
                  <p className="text-xs text-slate-400 py-2 text-center">No templates yet</p>
                )}
                {templates.map((tpl) => {
                  const isSelected = selectedTemplateId === tpl.id;
                  return (
                    <div
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-500"
                          : "border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="selectedTemplate"
                          checked={isSelected}
                          onChange={() => handleSelectTemplate(tpl)}
                          className="size-4 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          {tpl.title}
                        </span>
                      </div>
                      {isSelected && (
                        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 mt-2 pl-6 leading-relaxed">
                          {tpl.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {sendMutation.isError && (
            <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {sendMutation.error instanceof Error ? sendMutation.error.message : "Send failed"}
            </p>
          )}

          {sendMutation.isSuccess && (
            <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs text-emerald-600">
              Sent to {sendMutation.data.recipientCount} recipient{sendMutation.data.recipientCount === 1 ? "" : "s"}.
            </p>
          )}

          <button
            type="submit"
            disabled={isPending || recipientIds.length === 0 || !title.trim() || !description.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-xs font-extrabold tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-[0.99]"
          >
            {isPending
              ? "Sending..."
              : `Send to ${selectedCount} recipient${selectedCount === 1 ? "" : "s"}`}
          </button>
        </form>
      </div>

      <div className="bg-white dark:bg-card rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
          History
        </h2>

        {historyQuery.isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-2xl" />
            ))}
          </div>
        ) : historyList.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No history yet</p>
        ) : (
          <div className="space-y-3">
            {historyList.map((hist) => {
              const item = mailingToHistoryItem(hist);
              const isExpanded = expandedHistoryId === item.id;
              return (
                <div
                  key={item.id}
                  className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/20"
                >
                  <div
                    onClick={() =>
                      setExpandedHistoryId(isExpanded ? null : item.id)
                    }
                    className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronUp className="size-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                      ) : (
                        <ChevronDown className="size-4 text-indigo-600 dark:text-indigo-400 stroke-[2.5]" />
                      )}
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        {item.title}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 font-mono">
                      {item.date}
                    </span>
                  </div>

                  {isExpanded && (
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 space-y-3 text-xs">
                      <p className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                        {item.description}
                      </p>

                      {item.groups.length > 0 && (
                        <div className="space-y-1">
                          <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px]">
                            Target:
                          </span>
                          {item.groups.map((g, idx) => (
                            <p
                              key={idx}
                              className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]"
                            >
                              {g}
                            </p>
                          ))}
                        </div>
                      )}

                      {item.recipients.length > 0 && (
                        <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                          <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                            {item.recipients.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
