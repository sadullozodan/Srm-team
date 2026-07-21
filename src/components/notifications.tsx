"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, CheckCheck, Mail } from "lucide-react";
import { notificationsApi, queryKeys } from "@/lib/api/resources";
import { Skeleton } from "@/components/ui/skeleton";

const LIST_PARAMS = { pageSize: 20 };

/** "3 h ago" — the API returns an absolute timestamp, the bell wants a relative one. */
function timeAgo(iso: string) {
  const then = new Date(iso).getTime();
  if (isNaN(then)) return "";

  const minutes = Math.round((Date.now() - then) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.round(hours / 24)} d ago`;
}

export function NotificationPanel() {
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery({
    queryKey: queryKeys.notifications,
    queryFn: () => notificationsApi.list(LIST_PARAMS),
  });

  function refresh() {
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
  }

  const readMutation = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: refresh,
  });

  const readAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: refresh,
  });

  const items = data?.items ?? [];
  const hasUnread = items.some((item) => !item.isRead);

  return (
    <div className="overflow-hidden rounded-xl bg-popover">
      <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
        <span className="text-lg font-semibold">Notification</span>
        {hasUnread ? (
          <button
            type="button"
            onClick={() => readAllMutation.mutate()}
            disabled={readAllMutation.isPending}
            aria-label="Mark all as read"
            className="transition-opacity hover:opacity-80"
          >
            <CheckCheck className="size-5" />
          </button>
        ) : (
          <Mail className="size-5" />
        )}
      </div>

      <ul className="max-h-[60vh] divide-y overflow-y-auto">
        {isPending &&
          Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="space-y-2 px-4 py-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-full" />
            </li>
          ))}

        {!isPending && items.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-muted-foreground">
            Nothing new
          </li>
        )}

        {items.map((notification) => (
          <li key={notification.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold">{notification.title ?? "Notification"}</p>
              <button
                type="button"
                onClick={() => readMutation.mutate(notification.id)}
                disabled={notification.isRead || readMutation.isPending}
                aria-label={notification.isRead ? "Read" : "Mark as read"}
                className="shrink-0"
              >
                <Check
                  className={`size-4 ${
                    notification.isRead ? "text-emerald-500" : "text-muted-foreground/40"
                  }`}
                />
              </button>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {notification.message}
            </p>
            <div className="mt-2 text-right">
              <span className="text-xs text-muted-foreground">
                {timeAgo(notification.createdAt)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
