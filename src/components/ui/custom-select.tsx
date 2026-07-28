"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export interface CustomSelectOption {
  label: string;
  value: string;
}

export interface CustomSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: (CustomSelectOption | string)[];
  className?: string;
}

export function CustomSelect({
  label,
  value,
  onChange,
  options,
  className = "",
}: CustomSelectProps) {
  const parsedOptions: CustomSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  const selectedOption =
    parsedOptions.find((opt) => opt.value === value) || parsedOptions[0];

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="absolute -top-2.5 left-3 bg-white dark:bg-card px-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 z-10 pointer-events-none">
          {label}
        </label>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5 text-xs font-semibold bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-slate-200 cursor-pointer shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-left"
            />
          }
        >
          <span className="truncate">{selectedOption?.label}</span>
          <ChevronDown className="size-4 text-slate-400 shrink-0 ml-1" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={6}
          className="w-(--anchor-width) min-w-[160px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          {parsedOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <DropdownMenuItem
                key={opt.value}
                onClick={() => onChange(opt.value)}
                className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                }`}
              >
                <span>{opt.label}</span>
                {isSelected && (
                  <Check className="size-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                )}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
