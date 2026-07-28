"use client";

import { useQuery } from "@tanstack/react-query";
import { tokensApi } from "@/lib/api/resources";

export function TokenBadge() {
  const { data } = useQuery({
    queryKey: ["tokens", "me"],
    queryFn: tokensApi.me,
    retry: false,
    staleTime: 60_000,
  });

  const balance = data?.balance ?? 0;

  return (
    <div
      title="Your tokens"
      className="hidden h-10 items-center gap-2 rounded-full border border-amber-300/50 bg-amber-50/90 px-3 shadow-[0_10px_24px_rgb(146_64_14_/_0.08)] dark:border-amber-800/50 dark:bg-amber-950/40 dark:shadow-none md:flex"
    >
      <span className="coin3d" aria-hidden>
        <span className="coin3d-face">T</span>
        <span className="coin3d-face coin3d-back">T</span>
      </span>
      <span className="text-sm font-black tabular-nums text-amber-700 dark:text-amber-300">{balance}</span>
      <span className="text-[11px] font-semibold text-amber-600/80 dark:text-amber-300/70">tokens</span>
    </div>
  );
}
