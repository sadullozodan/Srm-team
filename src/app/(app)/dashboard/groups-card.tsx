"use client";

import Link from "next/link";
import { ChevronRight, ClipboardList, Send } from "lucide-react";
import { NavIcon } from "@/components/icons";
import type { GroupCardDto } from "@/lib/api/types";
import { CardTitle, Empty, Panel, money } from "../parts";

export function GroupsCard({ count, groups }: { count: number; groups: GroupCardDto[] }) {
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <CardTitle>
          <NavIcon name="groups" className="size-5" />
          Groups
        </CardTitle>
        <span className="text-3xl font-bold text-primary">{count}</span>
      </div>

      <ul className="mt-4 max-h-85 space-y-3 overflow-y-auto pr-1">
        {groups.length === 0 && <Empty>No groups yet</Empty>}
        {groups.map((group) => (
          <GroupRow key={group.id} group={group} />
        ))}
      </ul>
    </Panel>
  );
}

function GroupRow({ group }: { group: GroupCardDto }) {
  return (
    <li className="flex items-center gap-3 rounded-xl bg-muted/60 px-3 py-3">
      <Send className="size-5 shrink-0 text-sky-500" />

      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{group.name}</p>
        <p className="text-xs text-muted-foreground">
          Absent: <b className="text-foreground">{group.absent}</b> | Late:{" "}
          <b className="text-foreground">{group.late}</b>
        </p>
      </div>

      <div className="text-right">
        <p className="text-sm font-semibold text-emerald-600">{money(group.income)}</p>
        <p className="text-[10px] text-muted-foreground">Income</p>
      </div>

      <Link href="/progressbook" aria-label="Journal">
        <ClipboardList className="size-5 text-primary" />
      </Link>
      <Link href="/groups" aria-label="Open group">
        <ChevronRight className="size-5 text-primary" />
      </Link>
    </li>
  );
}
