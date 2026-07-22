"use client";

// Lightweight i18n: a language stored per-browser and a dictionary keyed by the
// English string (English is the source, so its own text is the fallback).
// Covers the always-visible chrome — sidebar nav, header, common actions — so
// switching language visibly changes the whole shell. Extend the dictionary to
// translate more strings.

import { createContext, useContext, useEffect, useState } from "react";
import type { LangCode } from "./langs";

type Entry = { RU: string; TJ: string };

const DICT: Record<string, Entry> = {
  // --- Sidebar navigation ---
  Dashboard: { RU: "Дашборд", TJ: "Асосӣ" },
  Students: { RU: "Студенты", TJ: "Донишҷӯён" },
  "All students": { RU: "Все студенты", TJ: "Ҳамаи донишҷӯён" },
  Graduates: { RU: "Выпускники", TJ: "Хатмкардагон" },
  "Left courses": { RU: "Ушедшие", TJ: "Тарккардагон" },
  Groups: { RU: "Группы", TJ: "Гурӯҳҳо" },
  Employees: { RU: "Сотрудники", TJ: "Кормандон" },
  Progressbook: { RU: "Журнал", TJ: "Журнал" },
  Timetable: { RU: "Расписание", TJ: "Ҷадвал" },
  Courses: { RU: "Курсы", TJ: "Курсҳо" },
  "All courses": { RU: "Все курсы", TJ: "Ҳамаи курсҳо" },
  Clients: { RU: "Клиенты", TJ: "Муштариён" },
  Administration: { RU: "Администрирование", TJ: "Маъмурият" },
  Users: { RU: "Пользователи", TJ: "Корбарон" },
  Permission: { RU: "Права", TJ: "Ҳуқуқҳо" },
  Logs: { RU: "Журнал действий", TJ: "Сабтҳо" },
  Accounting: { RU: "Бухгалтерия", TJ: "Ҳисобдорӣ" },
  Overview: { RU: "Обзор", TJ: "Шарҳ" },
  "Payment's": { RU: "Платежи", TJ: "Пардохтҳо" },
  Debtors: { RU: "Должники", TJ: "Қарздорон" },
  Budget: { RU: "Бюджет", TJ: "Буҷет" },
  Expenses: { RU: "Расходы", TJ: "Хароҷот" },
  Salary: { RU: "Зарплата", TJ: "Маош" },
  Avans: { RU: "Авансы", TJ: "Бунак" },
  Branches: { RU: "Филиалы", TJ: "Филиалҳо" },
  Jobs: { RU: "Вакансии", TJ: "Ҷойҳои корӣ" },
  Tokens: { RU: "Токены", TJ: "Токенҳо" },
  "SMS mailings": { RU: "SMS-рассылки", TJ: "SMS-паёмҳо" },

  // --- Header / common ---
  "Search students, groups, courses…": {
    RU: "Поиск студентов, групп, курсов…",
    TJ: "Ҷустуҷӯи донишҷӯён, гурӯҳҳо…",
  },
  "Sign out": { RU: "Выйти", TJ: "Баромад" },
  Account: { RU: "Аккаунт", TJ: "Ҳисоб" },
  Notifications: { RU: "Уведомления", TJ: "Огоҳиномаҳо" },
};

interface LangContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextValue | null>(null);
const STORAGE_KEY = "omuz.lang";

export function LangProvider({ children }: { children: React.ReactNode }) {
  // Start at EN so the server and first client render agree; hydrate the saved
  // choice on mount.
  const [lang, setLangState] = useState<LangCode>("EN");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (saved) {
      setLangState(saved);
      document.documentElement.lang = saved.toLowerCase();
    }
  }, []);

  const setLang = (next: LangCode) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next.toLowerCase();
  };

  const t = (key: string) => (lang === "EN" ? key : DICT[key]?.[lang] ?? key);

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within <LangProvider>");
  return ctx;
}

export function useT() {
  return useLang().t;
}
