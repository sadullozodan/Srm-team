"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Phone, ShieldCheck } from "lucide-react";
import { profileApi } from "@/lib/api/resources";
import type { Language, NotificationChannel } from "@/lib/api/types";
import {
  FormActions,
  FormError,
  Panel,
  PanelHeader,
  Pill,
  SectionTitle,
  SelectBox,
  TextField,
} from "../panels";
import { dateTime } from "../resource-table";

const LANGS: Language[] = ["Ru", "En", "Tj"];
const CHANNELS: NotificationChannel[] = ["Telegram", "Sms"];

function initials(name: string | null) {
  return (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {
  const queryClient = useQueryClient();
  const { data, isPending, isError } = useQuery({ queryKey: ["profile"], queryFn: profileApi.get });

  const [fullName, setFullName] = useState("");
  const [language, setLanguage] = useState<Language>("Ru");
  const [channel, setChannel] = useState<NotificationChannel>("Telegram");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setFullName(data.fullName ?? "");
      setLanguage(data.preferredLanguage);
      setChannel(data.preferredChannel);
    }
  }, [data]);

  const save = useMutation({
    mutationFn: () => profileApi.update({ fullName, preferredLanguage: language, preferredChannel: channel }),
    onSuccess: () => {
      setError(null);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e) => setError(e instanceof Error ? e.message : "Couldn't save."),
  });

  if (isError) {
    return (
      <Panel>
        <PanelHeader title="Profile" />
        <p className="py-10 text-center text-sm text-destructive">Couldn&apos;t load your profile.</p>
      </Panel>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* Identity card */}
      <Panel className="h-fit lg:col-span-1">
        <div className="flex flex-col items-center text-center">
          <div className="grid size-24 place-items-center rounded-full bg-primary/10 text-2xl font-black text-primary">
            {isPending ? "…" : initials(data?.fullName ?? null)}
          </div>
          <h2 className="mt-4 text-lg font-black">{data?.fullName ?? "—"}</h2>
          <p className="text-sm text-muted-foreground">{data?.kind}</p>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {(data?.roles ?? []).map((role) => (
              <Pill key={role} tone="brand">
                {role}
              </Pill>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <Line icon={<Phone className="size-4" />} value={data?.phoneNumber} />
          <Line icon={<Mail className="size-4" />} value={data?.email} />
          <Line icon={<ShieldCheck className="size-4" />} value={data?.lastLoginAt ? `Last login ${dateTime(data.lastLoginAt)}` : "—"} />
        </div>
      </Panel>

      {/* Edit form */}
      <Panel className="lg:col-span-2">
        <PanelHeader title="Profile" />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
          className="space-y-5"
        >
          <SectionTitle>Personal</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="Full name" value={fullName} onChange={setFullName} required />
            <TextField label="Phone (login)" value={data?.phoneNumber ?? ""} onChange={() => {}} disabled />
          </div>

          <SectionTitle>Preferences</SectionTitle>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectBox label="Language" value={language} onChange={(v) => setLanguage(v as Language)}>
              {LANGS.map((l) => (
                <option key={l} value={l}>
                  {l === "Ru" ? "Русский" : l === "En" ? "English" : "Тоҷикӣ"}
                </option>
              ))}
            </SelectBox>
            <SelectBox label="Notifications" value={channel} onChange={(v) => setChannel(v as NotificationChannel)}>
              {CHANNELS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </SelectBox>
          </div>

          <FormError message={error} />
          {save.isSuccess && !error && <p className="text-sm text-emerald-600 dark:text-emerald-400">Saved.</p>}

          <FormActions saveLabel="SAVE" saving={save.isPending} onCancel={() => data && setFullName(data.fullName ?? "")} />
        </form>
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
