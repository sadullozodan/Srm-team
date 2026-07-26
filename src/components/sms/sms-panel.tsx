"use client";

import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { SmsTemplate, INITIAL_TEMPLATES } from "./types";
import { RecipientsPanel } from "./recipients-panel";
import { ComposerPanel } from "./composer-panel";
import { TemplatesModal } from "./templates-modal";

export function SmsPanel() {
  const [selectedCount, setSelectedCount] = useState(4);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [templates, setTemplates] = useState<SmsTemplate[]>(INITIAL_TEMPLATES);

  const handleAddTemplate = (newTpl: SmsTemplate) => {
    setTemplates((prev) => [newTpl, ...prev]);
  };

  const handleUpdateTemplate = (updatedTpl: SmsTemplate) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === updatedTpl.id ? updatedTpl : t))
    );
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="w-full space-y-6 font-sans">
      {/* Top Header: Title + TEMPLATES Button */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          SMS mailings
        </h1>

        <button
          onClick={() => setIsTemplatesModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-xs font-extrabold tracking-wider transition-all"
        >
          <SlidersHorizontal className="size-4 stroke-[2.5]" />
          <span>TEMPLATES</span>
        </button>
      </div>

      {/* Two-Column Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Recipient Selection (~65% width) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <RecipientsPanel onSelectedCountChange={setSelectedCount} />
        </div>

        {/* Right Column: Composer & Sent History (~35% width) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <ComposerPanel
            templates={templates}
            selectedCount={selectedCount}
          />
        </div>
      </div>

      {/* Templates Manager Modal */}
      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        templates={templates}
        onAddTemplate={handleAddTemplate}
        onUpdateTemplate={handleUpdateTemplate}
        onDeleteTemplate={handleDeleteTemplate}
      />
    </div>
  );
}
