"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { SmsTemplate, SmsHistoryItem, INITIAL_HISTORY } from "./types";

export interface ComposerPanelProps {
  templates: SmsTemplate[];
  selectedCount: number;
}

export function ComposerPanel({ templates, selectedCount }: ComposerPanelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Templates accordion state
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // History list state
  const [historyList, setHistoryList] = useState<SmsHistoryItem[]>(INITIAL_HISTORY);
  const [expandedHistoryId, setExpandedHistoryId] = useState<string | null>("hist-2");

  // Handle template selection
  const handleSelectTemplate = (tpl: SmsTemplate) => {
    setSelectedTemplateId(tpl.id);
    setTitle(tpl.title);
    setDescription(tpl.description);
  };

  // Handle Send action
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !description.trim()) return;

    const newHistoryItem: SmsHistoryItem = {
      id: `hist-${Date.now()}`,
      title: title.trim() || "Broadcast SMS",
      date: new Date().toLocaleDateString("ru-RU"),
      description: description.trim() || "SMS message content",
      groups: ["Active Selected Recipients"],
      recipients: [`Selected ${selectedCount} recipients`],
    };

    setHistoryList((prev) => [newHistoryItem, ...prev]);
    setExpandedHistoryId(newHistoryItem.id);

    // Reset form
    setTitle("");
    setDescription("");
    setSelectedTemplateId(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. SMS Text Card */}
      <div className="bg-white dark:bg-card rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
          SMS text
        </h2>

        <form onSubmit={handleSend} className="space-y-4">
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-4 py-3 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full px-4 py-3 text-xs font-medium bg-slate-50/60 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200 resize-none"
            />
          </div>

          {/* Templates Accordion Dropdown */}
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

                      {/* Selected Template Description Snippet */}
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

          {/* Primary Send Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-[0.99]"
          >
            Send
          </button>
        </form>
      </div>

      {/* 2. History Section */}
      <div className="bg-white dark:bg-card rounded-2xl md:rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
          History
        </h2>

        <div className="space-y-3">
          {historyList.map((hist) => {
            const isExpanded = expandedHistoryId === hist.id;
            return (
              <div
                key={hist.id}
                className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-50/40 dark:bg-slate-900/20"
              >
                {/* Accordion Header */}
                <div
                  onClick={() =>
                    setExpandedHistoryId(isExpanded ? null : hist.id)
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
                      {hist.title}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 font-mono">
                    {hist.date}
                  </span>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 space-y-3 text-xs">
                    <p className="font-medium text-slate-700 dark:text-slate-300 leading-relaxed">
                      {hist.description}
                    </p>

                    {hist.groups.length > 0 && (
                      <div className="space-y-1">
                        <span className="font-bold text-slate-500 dark:text-slate-400 text-[11px]">
                          Groups:
                        </span>
                        {hist.groups.map((g, idx) => (
                          <p
                            key={idx}
                            className="font-semibold text-slate-800 dark:text-slate-200 text-[11px]"
                          >
                            {g}
                          </p>
                        ))}
                      </div>
                    )}

                    {hist.recipients.length > 0 && (
                      <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          {hist.recipients.join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
