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
    <div className="grid grid-cols-2 border-b border-border">
      {TABS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 pb-3 text-center text-[15px] font-medium transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
