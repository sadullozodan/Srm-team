"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Check, X, Mail, Phone, MessageCircle, Globe, Bell } from "lucide-react";
import { profileApi } from "@/lib/api/resources";
import type { ProfileDto, UpdateProfileRequest } from "@/lib/api/types";
import { useT } from "@/lib/i18n";
import { Panel, PanelHeader, Pill } from "../panels";
import { Button } from "@/components/ui/button";

function initials(name: string | null) {
  return (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const langOptions = ["Ru", "En", "Ky"] as const;
const channelOptions = ["Telegram", "Sms", "Email", "WhatsApp"] as const;

export default function ProfilePage() {
  const t = useT();
  const qc = useQueryClient();

  const { data: profile, isPending, isError } = useQuery({
    queryKey: ["profile"],
    queryFn: profileApi.get,
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<UpdateProfileRequest | null>(null);

  const updateMut = useMutation({
    mutationFn: (body: UpdateProfileRequest) => profileApi.update(body),
    onSuccess: (data) => {
      qc.setQueryData(["profile"], data);
      setEditing(false);
    },
  });

  function startEdit(p: ProfileDto) {
    setForm({
      fullName: p.fullName ?? "",
      phoneNumber: p.phoneNumber ?? "",
      email: p.email ?? "",
      telegramUsername: "",
      preferredLanguage: p.preferredLanguage,
      preferredChannel: p.preferredChannel,
    });
    setEditing(true);
  }

  if (isError) {
    return (
      <Panel>
        <PanelHeader title={t("Profile")} />
        <p className="py-10 text-center text-sm text-destructive">
          Couldn&apos;t load your profile.
        </p>
      </Panel>
    );
  }

  const p = profile;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* Identity card */}
      <Panel className="h-fit lg:col-span-1">
        <div className="flex flex-col items-center text-center">
          {p?.photoUrl ? (
            <img src={p.photoUrl} alt={p.fullName ?? ""} className="size-24 rounded-full object-cover" />
          ) : (
            <div className="grid size-24 place-items-center rounded-full bg-primary/10 text-2xl font-black text-primary">
              {isPending ? "…" : initials(p?.fullName ?? null)}
            </div>
          )}
          <h2 className="mt-4 text-lg font-black">{p?.fullName ?? "—"}</h2>
          <p className="text-sm text-muted-foreground">{p?.kind ?? "—"}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {(p?.roles ?? []).map((role) => (
              <Pill key={role} tone="brand">{role}</Pill>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <Line icon={<Phone className="size-4" />} value={p?.phoneNumber} />
          <Line icon={<Mail className="size-4" />} value={p?.email} />
          <Line icon={<Globe className="size-4" />} value={p?.preferredLanguage} />
          <Line icon={<Bell className="size-4" />} value={p?.preferredChannel} />
        </div>
      </Panel>

      {/* Edit / Info panel */}
      <Panel className="lg:col-span-2">
        <div className="flex items-center justify-between">
          <PanelHeader title={t("Profile")} />
          {!editing && p && (
            <Button variant="outline" size="sm" onClick={() => startEdit(p)}>
              <Pencil className="mr-1.5 size-3.5" />
              {t("Edit")}
            </Button>
          )}
          {editing && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                <X className="mr-1.5 size-3.5" />
                {t("Cancel")}
              </Button>
              <Button size="sm" onClick={() => form && updateMut.mutate(form)} disabled={updateMut.isPending}>
                <Check className="mr-1.5 size-3.5" />
                {updateMut.isPending ? "…" : t("Save")}
              </Button>
            </div>
          )}
        </div>

        {editing && form ? (
          <div className="mt-6 space-y-4">
            <Field label={t("Full name")} value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} />
            <Field label={t("Phone")} value={form.phoneNumber ?? ""} onChange={(v) => setForm({ ...form, phoneNumber: v })} icon={<Phone className="size-4" />} />
            <Field label={t("Email")} value={form.email ?? ""} onChange={(v) => setForm({ ...form, email: v })} icon={<Mail className="size-4" />} />
            <Field label="Telegram" value={form.telegramUsername ?? ""} onChange={(v) => setForm({ ...form, telegramUsername: v })} icon={<MessageCircle className="size-4" />} />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectField
                label={t("Language")}
                value={form.preferredLanguage}
                options={[...langOptions]}
                onChange={(v) => setForm({ ...form, preferredLanguage: v as ProfileDto["preferredLanguage"] })}
              />
              <SelectField
                label={t("Notification channel")}
                value={form.preferredChannel}
                options={[...channelOptions]}
                onChange={(v) => setForm({ ...form, preferredChannel: v as ProfileDto["preferredChannel"] })}
              />
            </div>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("Account")}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow label={t("Full name")} value={p?.fullName} />
                <InfoRow label={t("Phone")} value={p?.phoneNumber} />
                <InfoRow label={t("Email")} value={p?.email} />
                <InfoRow label={t("Role")} value={p?.kind} />
              </div>
            </section>
            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {t("Preferences")}
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow label={t("Language")} value={p?.preferredLanguage} />
                <InfoRow label={t("Notification channel")} value={p?.preferredChannel} />
                <InfoRow label={t("Created at")} value={p?.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—"} />
                <InfoRow label={t("Last login")} value={p?.lastLoginAt ? new Date(p.lastLoginAt).toLocaleString() : "—"} />
              </div>
            </section>
          </div>
        )}
      </Panel>
    </div>
  );
}

function Line({ icon, value }: { icon: React.ReactNode; value?: string | null }) {
  return (
    <div className="flex items-center gap-2.5 text-muted-foreground">
      <span className="text-primary">{icon}</span>
      <span className="truncate">{value || "—"}</span>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        <input
          className={`w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring ${icon ? "pl-9" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <select
        className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
