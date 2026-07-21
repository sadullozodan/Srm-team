"use client";

import { Check, ChevronRight, Mail } from "lucide-react";
import { notifications } from "@/lib/mock-dashboard";

// ponytail: display only — nothing here is clickable and no data is fetched.
// Drop in GET /api/Notifications when it exists.
export function NotificationPanel() {
  return (
    <div className="overflow-hidden rounded-xl bg-popover">
      <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
        <span className="text-lg font-semibold">Notification</span>
        <Mail className="size-5" />
      </div>

      <ul className="max-h-[60vh] divide-y overflow-y-auto">
        {notifications.map((n) => (
          <li key={n.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold">{n.from}</p>
              <Check
                className={`size-4 shrink-0 ${n.read ? "text-emerald-500" : "text-muted-foreground/40"}`}
              />
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{n.text}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-sm font-medium text-primary">
                More <ChevronRight className="size-4" />
              </span>
              <span className="text-xs text-muted-foreground">{n.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
