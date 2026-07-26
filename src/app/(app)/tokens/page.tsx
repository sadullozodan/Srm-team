"use client";

import { useQuery } from "@tanstack/react-query";
import { Coins, Package } from "lucide-react";
import { rewardsApi, queryKeys } from "@/lib/api/resources";
import type { RewardDto } from "@/lib/api/types";
import { Panel, PanelHeader, Pill } from "../panels";

export default function TokensPage() {
  const params = { pageSize: 60 };
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.list("Rewards", params),
    queryFn: () => rewardsApi.list(params),
  });

  const rewards = data?.items ?? [];

  return (
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
  );
}
