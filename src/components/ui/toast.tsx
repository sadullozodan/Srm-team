"use client";

import { useEffect } from "react";
import { Check } from "lucide-react";

export function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(onClose, 2500);
    return () => clearTimeout(t);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-center gap-2.5 rounded-full border border-border/50 bg-background/95 px-5 py-2.5 text-sm font-medium text-foreground shadow-2xl backdrop-blur-sm">
        <span className="flex size-5 items-center justify-center rounded-full bg-primary/10">
          <Check className="size-3 text-primary" />
        </span>
        {message}
      </div>
    </div>
  );
}