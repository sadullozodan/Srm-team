"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { searchApi } from "@/lib/api/resources";
import type { GlobalSearchResultDto, SearchHit } from "@/lib/api/types";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Section = { key: keyof GlobalSearchResultDto; label: string; href: (id: string) => string };

const SECTIONS: Section[] = [
  { key: "students", label: "Students", href: (id) => `/students/${id}` },
  { key: "groups", label: "Groups", href: (id) => `/groups/${id}` },
  { key: "employees", label: "Employees", href: (id) => `/employees/${id}` },
  { key: "courses", label: "Courses", href: (id) => `/courses/${id}` },
  { key: "leads", label: "Leads", href: () => `/courses/clients` },
];

export function GlobalSearch() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // Debounce the typed value before it becomes a query.
  useEffect(() => {
    const id = setTimeout(() => setQuery(input.trim()), 300);
    return () => clearTimeout(id);
  }, [input]);

  // Close on outside click.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const { data, isFetching } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchApi.search(query),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });

  const total = data
    ? SECTIONS.reduce((sum, s) => sum + (data[s.key]?.length ?? 0), 0)
    : 0;

  function go(href: string) {
    setOpen(false);
    setInput("");
    router.push(href);
  }

  return (
    <div ref={box} className="relative w-full max-w-md">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={input}
        placeholder="Search students, groups, courses…"
        onChange={(e) => {
          setInput(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="h-11 rounded-full bg-card pl-9"
      />
      {isFetching && (
        <Loader2 className="absolute top-1/2 right-3 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
      )}

      {open && query.length >= 2 && (
        <div className="absolute top-13 left-0 z-50 max-h-[70vh] w-full overflow-y-auto rounded-2xl border border-border bg-popover p-2 shadow-xl">
          {total === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              {isFetching ? "Searching…" : "Nothing found."}
            </p>
          ) : (
            SECTIONS.map((section) => {
              const hits = data?.[section.key] ?? [];
              if (hits.length === 0) return null;
              return (
                <div key={section.key} className="mb-1">
                  <p className="px-3 pt-2 pb-1 text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                    {section.label}
                  </p>
                  {hits.map((hit: SearchHit) => (
                    <button
                      key={hit.id}
                      type="button"
                      onClick={() => go(section.href(hit.id))}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted",
                      )}
                    >
                      <span className="truncate text-sm font-medium">{hit.title}</span>
                      {hit.subtitle && (
                        <span className="shrink-0 text-xs text-muted-foreground">{hit.subtitle}</span>
                      )}
                    </button>
                  ))}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
