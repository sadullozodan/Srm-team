"use client";

import { useQuery } from "@tanstack/react-query";
import { tokensApi } from "@/lib/api/resources";

// Shows the signed-in user's token balance with an auto-spinning 3D coin.
// Staff have no token account (endpoint 403s) — the query fails quietly and the
// badge shows 0, still spinning.
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
      className="hidden h-10 items-center gap-2 rounded-full border border-amber-300/60 bg-amber-50 px-3 dark:border-amber-800/50 dark:bg-amber-950/40 md:flex"
    >
      <span className="coin3d" aria-hidden>
        <span className="coin3d-face">₮</span>
        <span className="coin3d-face coin3d-back">₮</span>
      </span>
      <span className="text-sm font-black tabular-nums text-amber-600 dark:text-amber-300">{balance}</span>
      <span className="text-[11px] font-semibold text-amber-500/80">kins</span>
    </div>
  );
}
