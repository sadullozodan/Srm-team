"use client";

import React, { useState } from "react";
import { X, Plus, SquarePen, Trash2 } from "lucide-react";
import { SmsTemplate } from "./types";

export interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  templates: SmsTemplate[];
  onAddTemplate: (newTpl: SmsTemplate) => void;
  onUpdateTemplate: (updatedTpl: SmsTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

export function TemplatesModal({
  isOpen,
  onClose,
  templates,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
}: TemplatesModalProps) {
  // Add new template form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  // Edit template inline state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  if (!isOpen) return null;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTpl: SmsTemplate = {
      id: `tpl-${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim() || "Template description",
    };

    onAddTemplate(newTpl);
    setNewTitle("");
    setNewDescription("");
    setIsAddOpen(false);
  };

  const handleStartEdit = (tpl: SmsTemplate) => {
    setEditingId(tpl.id);
    setEditTitle(tpl.title);
    setEditDescription(tpl.description);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !editTitle.trim()) return;

    onUpdateTemplate({
      id: editingId,
      title: editTitle.trim(),
      description: editDescription.trim(),
    });

    setEditingId(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-card text-foreground rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
            Templates
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 no-scrollbar">
          {/* Add New Section Header/Form */}
          <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Add new
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(!isAddOpen)}
                className="size-7 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-100 transition-colors"
              >
                {isAddOpen ? (
                  <X className="size-4" />
                ) : (
                  <Plus className="size-4 stroke-[3]" />
                )}
              </button>
            </div>

            {isAddOpen && (
              <form onSubmit={handleAddSubmit} className="space-y-3 pt-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Title"
                  required
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200"
                />
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200 resize-none"
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20"
                >
                  Create
                </button>
              </form>
            )}
          </div>

          {/* Inline Edit Card (if editing a template) */}
          {editingId && (
            <form
              onSubmit={handleSaveEdit}
              className="border-2 border-indigo-500 rounded-2xl p-4 bg-white dark:bg-slate-900 space-y-3 shadow-lg"
            >
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Edit
              </h3>
              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white dark:bg-slate-900 px-1 text-[10px] font-semibold text-slate-400">
                  Title
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="relative">
                <label className="absolute -top-2 left-3 bg-white dark:bg-slate-900 px-1 text-[10px] font-semibold text-indigo-500">
                  Description
                </label>
                <textarea
                  rows={4}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-medium bg-white dark:bg-slate-900 border-2 border-indigo-500 rounded-xl focus:outline-none text-slate-900 dark:text-slate-100 leading-relaxed resize-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="px-5 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Template Item Cards List */}
          <div className="space-y-3">
            {templates.map((tpl) => {
              if (editingId === tpl.id) return null; // Hidden while editing
              return (
                <div
                  key={tpl.id}
                  className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 space-y-2 relative group hover:shadow-2xs transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                      {tpl.title}
                    </h4>

                    {/* Actions: Edit & Delete */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEdit(tpl)}
                        className="p-1 rounded-lg text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 transition-colors"
                      >
                        <SquarePen className="size-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTemplate(tpl.id)}
                        className="p-1 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 transition-colors"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                    {tpl.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
