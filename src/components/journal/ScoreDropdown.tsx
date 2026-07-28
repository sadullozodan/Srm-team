"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ScoreDropdownProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  variant?: "pill" | "badge" | "gold";
}

export function ScoreDropdown({
  value,
  onChange,
  min = 0,
  max = 100,
  variant = "pill",
}: ScoreDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const variants = {
    pill: "rounded-md bg-gray-100 dark:bg-white/5 px-2 py-1 text-xs text-gray-700 dark:text-gray-300",
    badge:
      "rounded-md bg-gray-100 dark:bg-white/5 px-2 py-1 text-xs text-gray-700 dark:text-gray-300",
    gold: "rounded-full bg-gold px-3 py-1 text-sm font-bold text-gray-900",
  };

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        onClick={() => setOpen(!open)}
        className={cn("cursor-pointer transition-colors hover:opacity-80", variants[variant])}
      >
        {value}
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-1 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-white/10 dark:bg-surface-dark">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onChange(Math.max(min, value - 5))}
              className="flex size-6 items-center justify-center rounded text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            >
              -
            </button>
            <input
              type="number"
              value={value}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v)) onChange(Math.max(min, Math.min(max, v)));
              }}
              className="w-12 rounded border border-gray-200 bg-transparent px-1 py-0.5 text-center text-xs dark:border-white/10"
              min={min}
              max={max}
            />
            <button
              onClick={() => onChange(Math.min(max, value + 5))}
              className="flex size-6 items-center justify-center rounded text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
