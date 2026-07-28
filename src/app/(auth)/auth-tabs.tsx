"use client";

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/login", label: "Log in" },
];

// Two routes shown as one tab pair. Links, not state, so each tab keeps its own
// URL and the browser back button still works.
export function AuthTabs() {
  const pathname = usePathname();
  const t = useT();

  return (
    <div className="border-b border-border text-center">
      {TABS.map(({ href, label }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "-mb-px inline-block border-b-2 px-8 pb-3 text-center text-2xl font-semibold transition-colors",
              active
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t(label)}
          </Link>
        );
      })}
    </div>
  );
}
