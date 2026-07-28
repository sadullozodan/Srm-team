"use client";

import { useCallback, useMemo, useState } from "react";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SlidersHorizontal } from "lucide-react";
import { employeesApi, groupsApi, graduatesApi, leadsApi, notificationsApi, queryKeys, smsMailingsApi, smsTemplatesApi, studentsApi } from "@/lib/api/resources";
import type { EmployeeDto, GraduateDto, GroupDto, LeadDto, SmsTemplateDto, StudentDto } from "@/lib/api/types";
import { PhoneOption, SmsTemplate, StudentRecipient, GroupRecipient, MentorRecipient, LeadRecipient, GraduateRecipient } from "./types";
import { RecipientsPanel } from "./recipients-panel";
import { ComposerPanel } from "./composer-panel";
import { TemplatesModal } from "./templates-modal";

function toPhoneOptions(dto: StudentDto | EmployeeDto): PhoneOption[] {
  const phones: PhoneOption[] = [];
  if (dto.phoneNumber) phones.push({ type: "Student", number: dto.phoneNumber });
  return phones;
}

function studentToRecipient(s: StudentDto): StudentRecipient {
  const phones = toPhoneOptions(s);
  return {
    id: s.id,
    name: s.fullName ?? s.firstName ?? "",
    course: "",
    age: "",
    phones,
    selectedPhone: phones[0]?.number ?? "",
    selected: false,
  };
}

function employeeToMentor(e: EmployeeDto): MentorRecipient {
  const phones = toPhoneOptions(e);
  return {
    id: e.id,
    name: e.fullName ?? e.firstName ?? "",
    level: "",
    age: "",
    phones,
    selectedPhone: phones[0]?.number ?? "",
    selected: false,
  };
}

function leadToRecipient(l: LeadDto): LeadRecipient {
  const phones: PhoneOption[] = l.phone ? [{ type: "Student", number: l.phone }] : [];
  return {
    id: l.id,
    name: l.fullName ?? "",
    course: l.courseName ?? "",
    status: l.type as "Lead" | "Client",
    month: l.registerMonth ?? "",
    phones,
    selectedPhone: phones[0]?.number ?? "",
    selected: false,
  };
}

function graduateToRecipient(g: GraduateDto): GraduateRecipient {
  const phones: PhoneOption[] = [];
  return {
    id: g.id,
    name: g.studentName ?? "",
    careerTag: g.status,
    company: g.workPlace ?? "",
    age: g.age != null ? `${g.age} year` : "",
    phones,
    selectedPhone: "",
    selected: false,
  };
}

function templateToSmsTemplate(t: SmsTemplateDto): SmsTemplate {
  return { id: t.id, title: t.title ?? "", description: t.body ?? "" };
}

export function SmsPanel() {
  const queryClient = useQueryClient();
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);

  const studentsQuery = useQuery({
    queryKey: queryKeys.list("Students", { pageSize: 500 }),
    queryFn: () => studentsApi.list({ pageSize: 500 }),
    placeholderData: keepPreviousData,
  });

  const groupsQuery = useQuery({
    queryKey: queryKeys.list("Groups", { pageSize: 100 }),
    queryFn: () => groupsApi.list({ pageSize: 100 }),
    placeholderData: keepPreviousData,
  });

  const employeesQuery = useQuery({
    queryKey: queryKeys.list("Employees", { pageSize: 100 }),
    queryFn: () => employeesApi.list({ pageSize: 100 }),
    placeholderData: keepPreviousData,
  });

  const leadsQuery = useQuery({
    queryKey: queryKeys.list("Leads", { pageSize: 100 }),
    queryFn: () => leadsApi.list({ pageSize: 100 }),
    placeholderData: keepPreviousData,
  });

  const graduatesQuery = useQuery({
    queryKey: queryKeys.list("Graduates", { pageSize: 100 }),
    queryFn: () => graduatesApi.list({ pageSize: 100 }),
    placeholderData: keepPreviousData,
  });

  const templatesQuery = useQuery({
    queryKey: queryKeys.list(smsTemplatesApi.key, { pageSize: 100 }),
    queryFn: () => smsTemplatesApi.list({ pageSize: 100 }),
    placeholderData: keepPreviousData,
  });

  const historyQuery = useQuery({
    queryKey: queryKeys.list(smsMailingsApi.key, { pageSize: 20 }),
    queryFn: () => smsMailingsApi.list({ pageSize: 20 }),
    placeholderData: keepPreviousData,
  });

  const templates: SmsTemplate[] = useMemo(
    () => (templatesQuery.data?.items ?? []).map(templateToSmsTemplate),
    [templatesQuery.data],
  );

  const students: StudentRecipient[] = useMemo(
    () => (studentsQuery.data?.items ?? []).map(studentToRecipient),
    [studentsQuery.data],
  );

  const groups: GroupRecipient[] = useMemo(
    () => (groupsQuery.data?.items ?? []).map((g: GroupDto) => ({
      id: g.id,
      name: g.name ?? "",
      dateRange: `${g.startDate} - ${g.endDate}`,
      selectedCount: 0,
      totalCount: g.enrolledCount,
      students: [],
      expanded: false,
    })),
    [groupsQuery.data],
  );

  const mentors: MentorRecipient[] = useMemo(
    () => (employeesQuery.data?.items ?? []).map(employeeToMentor),
    [employeesQuery.data],
  );

  const leads: LeadRecipient[] = useMemo(
    () => (leadsQuery.data?.items ?? []).map(leadToRecipient),
    [leadsQuery.data],
  );

  const graduates: GraduateRecipient[] = useMemo(
    () => (graduatesQuery.data?.items ?? []).map(graduateToRecipient),
    [graduatesQuery.data],
  );

  const sendMutation = useMutation({
    mutationFn: async (payload: { title: string; body: string; targetType: string; recipientIds: string[] }) => {
      const mailing = await smsMailingsApi.send({
        title: payload.title,
        body: payload.body,
        targetType: payload.targetType as "Group" | "Students" | "Mentors" | "Leads" | "Graduates",
        recipientIds: payload.recipientIds,
      });
      try {
        await notificationsApi.create({
          title: "SMS sent",
          message: `"${payload.title}" sent to ${mailing.recipientCount} recipient${mailing.recipientCount === 1 ? "" : "s"}.`,
        });
      } catch { /* best-effort */ }
      return mailing;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.list(smsMailingsApi.key) });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationsUnreadCount });
    },
  });

  const handleAddTemplate = useCallback(async (newTpl: SmsTemplate) => {
    await smsTemplatesApi.create({ title: newTpl.title, body: newTpl.description });
    queryClient.invalidateQueries({ queryKey: queryKeys.list(smsTemplatesApi.key) });
  }, [queryClient]);

  const handleUpdateTemplate = useCallback(async (updatedTpl: SmsTemplate) => {
    await smsTemplatesApi.update(updatedTpl.id, { title: updatedTpl.title, body: updatedTpl.description });
    queryClient.invalidateQueries({ queryKey: queryKeys.list(smsTemplatesApi.key) });
  }, [queryClient]);

  const handleDeleteTemplate = useCallback(async (id: string) => {
    await smsTemplatesApi.remove(id);
    queryClient.invalidateQueries({ queryKey: queryKeys.list(smsTemplatesApi.key) });
  }, [queryClient]);

  const isRecipientsLoading = studentsQuery.isPending || groupsQuery.isPending || employeesQuery.isPending || leadsQuery.isPending || graduatesQuery.isPending;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedTargetType, setSelectedTargetType] = useState<string>("Students");

  const handleSelectedChange = useCallback((ids: string[], targetType: string) => {
    setSelectedIds(new Set(ids));
    setSelectedTargetType(targetType);
  }, []);

  return (
    <div className="w-full space-y-6 font-sans">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          SMS mailings
        </h1>
        <button
          onClick={() => setIsTemplatesModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-indigo-600 dark:border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-xs font-extrabold tracking-wider transition-all"
        >
          <SlidersHorizontal className="size-4 stroke-[2.5]" />
          <span>TEMPLATES</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 xl:col-span-8">
          <RecipientsPanel
            students={students}
            groups={groups}
            mentors={mentors}
            leads={leads}
            graduates={graduates}
            isLoading={isRecipientsLoading}
            onSelectedChange={handleSelectedChange}
          />
        </div>
        <div className="lg:col-span-5 xl:col-span-4">
          <ComposerPanel
            templates={templates}
            selectedCount={selectedIds.size}
            historyQuery={historyQuery}
            sendMutation={sendMutation}
            recipientIds={Array.from(selectedIds)}
          />
        </div>
      </div>

      <TemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        templates={templates}
        onAddTemplate={handleAddTemplate}
        onUpdateTemplate={handleUpdateTemplate}
        onDeleteTemplate={handleDeleteTemplate}
      />
    </div>
  );
}
