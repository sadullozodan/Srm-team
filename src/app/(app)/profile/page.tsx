"use client";

import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, ShieldCheck, User } from "lucide-react";
import { authApi, studentsApi, employeesApi } from "@/lib/api/resources";
import { Panel, PanelHeader, Pill } from "../panels";
import { dateTime } from "../resource-table";

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
  const { data: me, isPending: mePending, isError: meError } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: authApi.me,
  });

  const isStudent = !!me?.studentId;
  const isEmployee = !!me?.employeeId;

  const { data: student } = useQuery({
    queryKey: ["profile", "student", me?.studentId],
    queryFn: () => studentsApi.get(me!.studentId!),
    enabled: isStudent,
  });

  const { data: employee } = useQuery({
    queryKey: ["profile", "employee", me?.employeeId],
    queryFn: () => employeesApi.get(me!.employeeId!),
    enabled: isEmployee,
  });

  if (meError) {
    return (
      <Panel>
        <PanelHeader title="Profile" />
        <p className="py-10 text-center text-sm text-destructive">
          Couldn&apos;t load your profile.
        </p>
      </Panel>
    );
  }

  const fullName = me?.fullName ?? "—";
  const roles = me?.roles ?? [];
  const phone = student?.phoneNumber ?? employee?.phoneNumber ?? me?.userName ?? "—";
  const email = student?.email ?? employee?.email ?? null;
  const photo = student?.photoUrl ?? employee?.photoUrl ?? null;
  const kind = isStudent ? "Student" : isEmployee ? "Employee" : "System";

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* Identity card */}
      <Panel className="h-fit lg:col-span-1">
        <div className="flex flex-col items-center text-center">
          {photo ? (
            <img
              src={photo}
              alt={fullName}
              className="size-24 rounded-full object-cover"
            />
          ) : (
            <div className="grid size-24 place-items-center rounded-full bg-primary/10 text-2xl font-black text-primary">
              {mePending ? "…" : initials(fullName)}
            </div>
          )}
          <h2 className="mt-4 text-lg font-black">{fullName}</h2>
          <p className="text-sm text-muted-foreground">{kind}</p>

          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {roles.map((role) => (
              <Pill key={role} tone="brand">
                {role}
              </Pill>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3 text-sm">
          <Line icon={<Phone className="size-4" />} value={phone} />
          <Line icon={<Mail className="size-4" />} value={email} />
          <Line
            icon={<ShieldCheck className="size-4" />}
            value={me?.id ? `User ID: ${me.id.slice(0, 8)}…` : "—"}
          />
        </div>
      </Panel>

      {/* Info panel */}
      <Panel className="lg:col-span-2">
        <PanelHeader title="Profile" />

        <div className="space-y-6">
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Account
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoRow label="Full name" value={fullName} />
              <InfoRow label="Phone (login)" value={phone} />
              <InfoRow label="Email" value={email ?? "—"} />
              <InfoRow label="Role" value={kind} />
            </div>
          </section>

          {isStudent && student && (
            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Student Info
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow label="Status" value={student.status} />
                <InfoRow label="Branch" value={student.branchName ?? "—"} />
                <InfoRow
                  label="Groups"
                  value={student.groups?.join(", ") ?? "—"}
                />
                <InfoRow
                  label="Telegram"
                  value={student.telegramUsername ?? "—"}
                />
              </div>
            </section>
          )}

          {isEmployee && employee && (
            <section>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Employee Info
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <InfoRow label="Status" value={employee.status} />
                <InfoRow label="Branch" value={employee.branchName ?? "—"} />
                <InfoRow
                  label="Positions"
                  value={employee.positions?.join(", ") ?? "—"}
                />
                <InfoRow
                  label="Experience"
                  value={employee.experience ? `${employee.experience} yr` : "—"}
                />
              </div>
            </section>
          )}
        </div>
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
