"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Coins, Loader2, X } from "lucide-react";
import { tokensApi } from "@/lib/api/resources";
import { useAuth } from "@/lib/auth/context";
import { cn } from "@/lib/utils";

// Only "Mentor and above" may grant tokens (matches the backend TokenManagers group).
const GRANTERS = ["SuperAdmin", "Admin", "Manager", "Mentor"];

export function useCanGrantTokens() {
  const { user } = useAuth();
  return (user?.roles ?? []).some((role) => GRANTERS.includes(role));
}

const QUICK = [50, 100, 250, 500];

export function GrantTokensButton({
  studentId,
  studentName,
  onGranted,
  className,
}: {
  studentId: string;
  studentName?: string | null;
  onGranted?: () => void;
  className?: string;
}) {
  const canGrant = useCanGrantTokens();
  const [open, setOpen] = useState(false);
  if (!canGrant) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 rounded-xl bg-amber-500 px-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-amber-600 active:translate-y-px",
          className,
        )}
      >
        <Coins className="size-4" />
        Give tokens
      </button>
      {open && (
        <GrantModal
          studentId={studentId}
          studentName={studentName}
          onClose={() => setOpen(false)}
          onGranted={onGranted}
        />
      )}
    </>
  );
}

export function GrantModal({
  studentId,
  studentName,
  onClose,
  onGranted,
}: {
  studentId: string;
  studentName?: string | null;
  onClose: () => void;
  onGranted?: () => void;
}) {
  const [amount, setAmount] = useState(100);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const grant = useMutation({
    mutationFn: () => tokensApi.grant({ studentId, amount, reason: reason.trim() || undefined }),
    onSuccess: () => {
      onGranted?.();
      onClose();
    },
    onError: (e) => setError(e instanceof Error ? e.message : "Couldn't grant."),
  });

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-amber-500/15 text-amber-500">
              <Coins className="size-5" />
            </span>
            <div>
              <h2 className="text-base font-black">Give tokens</h2>
              {studentName && <p className="text-xs text-muted-foreground">{studentName}</p>}
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (amount > 0) grant.mutate();
          }}
          className="space-y-4"
        >
          {/* Amount + quick chips */}
          <div>
            <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Amount</label>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className="h-11 w-full rounded-xl border border-border bg-muted/40 px-3 text-lg font-black tabular-nums focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              />
              <span className="text-sm font-bold text-amber-500">₮</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {QUICK.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setAmount(q)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-xs font-bold transition-colors",
                    amount === q
                      ? "border-amber-500 bg-amber-500/10 text-amber-600"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  +{q}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">Reason (optional)</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. great attendance"
              className="mt-1.5 h-10 w-full rounded-xl border border-border bg-muted/40 px-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={grant.isPending || amount <= 0}
              className="inline-flex h-10 flex-1 items-center justify-center gap-1.5 rounded-xl bg-amber-500 text-sm font-bold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
            >
              {grant.isPending ? <Loader2 className="size-4 animate-spin" /> : <Coins className="size-4" />}
              Give {amount} ₮
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-xl border border-border px-4 text-sm font-bold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
