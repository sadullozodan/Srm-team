"use client";

import { flushSync } from "react-dom";
import { ArrowLeft, Moon, Plus, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onNewWeek: () => void;
}

export function Header({ onNewWeek }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newTheme = theme === "dark" ? "light" : "dark";
    const x = e.clientX;
    const y = e.clientY;

    if (!document.startViewTransition) {
      setTheme(newTheme);
      return;
    }

    document.documentElement.style.setProperty("--click-x", `${x}px`);
    document.documentElement.style.setProperty("--click-y", `${y}px`);

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(newTheme));
    });

    void transition.finished.then(() => {
      document.documentElement.style.removeProperty("--click-x");
      document.documentElement.style.removeProperty("--click-y");
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button className="flex size-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
          Journal
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className="flex size-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={onNewWeek}
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold uppercase text-white transition-colors",
            "bg-brand hover:bg-brand/90"
          )}
        >
          <Plus size={16} />
          New Week
        </button>
      </div>
    </div>
  );
}
