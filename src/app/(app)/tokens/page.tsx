"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Coins, Package, Search } from "lucide-react";
import { rewardsApi, studentsApi, queryKeys } from "@/lib/api/resources";
import type { RewardDto } from "@/lib/api/types";
import { GrantModal, useCanGrantTokens } from "@/components/grant-tokens";
import { Panel, PanelHeader, Pill, cellCls } from "../panels";

export default function TokensPage() {
  const params = { pageSize: 60 };
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Rewards", params),
    queryFn: () => rewardsApi.list(params),
  });

  const rewards = data?.items ?? [];

  return (
    <div className="space-y-5">
      <GrantPanel />

      <Panel>
        <PanelHeader title="Tokens & rewards" />
        <p className="-mt-2 max-w-2xl text-sm text-muted-foreground">
          Students earn tokens for progress and attendance, and spend them on rewards. Mentors and above
          grant tokens and manage this catalogue.
        </p>

        {isError ? (
          <p className="py-10 text-center text-sm text-destructive">Couldn&apos;t load rewards.</p>
        ) : isPending ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : rewards.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No rewards in the catalogue yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rewards.map((reward: RewardDto) => (
              <div
                key={reward.id}
                className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Package className="size-5" />
                  </span>
                  {!reward.isActive && <Pill tone="neutral">Off</Pill>}
                </div>

                <h3 className="text-sm font-black tracking-tight">{reward.name}</h3>
                {reward.description && (
                  <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{reward.description}</p>
                )}

                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="inline-flex items-center gap-1.5 text-base font-black text-primary">
                    <Coins className="size-4" />
                    {reward.cost}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {reward.stock == null ? "Unlimited" : `${reward.stock} left`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

/** Grant tokens to a student (mentor and above). Hidden for everyone else. */
function GrantPanel() {
  const canGrant = useCanGrantTokens();
  const [q, setQ] = useState("");
  const [picked, setPicked] = useState<{ id: string; name: string } | null>(null);

  const { data } = useQuery({
    queryKey: ["students", "grant-search", q],
    queryFn: () => studentsApi.list({ search: q.trim(), pageSize: 6 }),
    enabled: q.trim().length >= 2,
    staleTime: 20_000,
  });

  if (!canGrant) return null;
  const results = data?.items ?? [];

  return (
    <Panel>
      <PanelHeader title="Grant tokens" />
      <p className="-mt-2 text-sm text-muted-foreground">Find a student and reward them with tokens.</p>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search student by name or phone"
          className="h-11 w-full rounded-xl border border-border bg-muted/40 pl-9 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
        />
      </div>

      {q.trim().length >= 2 && (
        <div className="overflow-hidden rounded-xl border border-border">
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">No students found.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-border">
                {results.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/40">
                    <td className={cellCls}>
                      <span className="font-bold">{s.fullName ?? "—"}</span>
                    </td>
                    <td className={`${cellCls} font-mono text-xs text-muted-foreground`}>{s.phoneNumber}</td>
                    <td className={`${cellCls} text-right`}>
                      <button
                        type="button"
                        onClick={() => setPicked({ id: s.id, name: s.fullName ?? "" })}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-amber-500 px-3 text-xs font-bold text-white hover:bg-amber-600"
                      >
                        <Coins className="size-3.5" />
                        Give
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {picked && (
        <GrantModal studentId={picked.id} studentName={picked.name} onClose={() => setPicked(null)} />
      )}
    </Panel>
  );
}
