"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/login", label: "Log in" },
  { href: "/register", label: "Sign up" },
];

// Two routes shown as one tab pair. Links, not state, so each tab keeps its own
// URL and the browser back button still works.
export function AuthTabs() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-2 gap-1 rounded-xl border border-border/60 bg-muted/70 p-1">
      {TABS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-lg px-3 py-2.5 text-center text-[15px] font-semibold transition-all",
              active
                ? "bg-card text-foreground shadow-[0_8px_20px_rgb(31_37_60_/_0.08)] ring-1 ring-border/60 dark:shadow-[0_10px_24px_rgb(0_0_0_/_0.18)]"
                : "text-muted-foreground hover:bg-card/50 hover:text-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
