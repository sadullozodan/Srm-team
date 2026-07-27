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
  Roles: { RU: "Роли", TJ: "Нақшҳо" },
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
  Lang: { RU: "Язык", TJ: "Забон" },
  Language: { RU: "Язык", TJ: "Забон" },
  Profile: { RU: "Профиль", TJ: "Профил" },
  "Search students, groups, courses…": {
    RU: "Поиск студентов, групп, курсов…",
    TJ: "Ҷустуҷӯи донишҷӯён, гурӯҳҳо…",
  },
  "Sign out": { RU: "Выйти", TJ: "Баромад" },
  Account: { RU: "Аккаунт", TJ: "Ҳисоб" },
  Notifications: { RU: "Уведомления", TJ: "Огоҳиномаҳо" },

  // --- Auth pages ---
  "Log in": { RU: "Войти", TJ: "Даромадан" },
  Phone: { RU: "Телефон", TJ: "Телефон" },
  "Phone number": { RU: "Номер телефона", TJ: "Рақами телефон" },
  Password: { RU: "Пароль", TJ: "Рамз" },
  "Hide password": { RU: "Скрыть пароль", TJ: "Пинҳон кардани рамз" },
  "Show password": { RU: "Показать пароль", TJ: "Нишон додани рамз" },
  "Forgot password?": { RU: "Забыли пароль?", TJ: "Рамзро фаромӯш кардед?" },
  "Incorrect phone number or password.": {
    RU: "Неверный номер телефона или пароль.",
    TJ: "Рақами телефон ё рамз нодуруст аст.",
  },
  "Something went wrong.": {
    RU: "Что-то пошло не так.",
    TJ: "Чизе нодуруст шуд.",
  },
  "Welcome to": { RU: "Добро пожаловать в", TJ: "Хуш омадед ба" },

  // --- Forgot password ---
  "Verification code": { RU: "Код подтверждения", TJ: "Рамзи тасдиқ" },
  Code: { RU: "Код", TJ: "Рамз" },
  "Send code": { RU: "Отправить код", TJ: "Фиристодани рамз" },
  Verify: { RU: "Подтвердить", TJ: "Тасдиқ кардан" },
  Save: { RU: "Сохранить", TJ: "Сабт кардан" },
  Cancel: { RU: "Отмена", TJ: "Бекор кардан" },
  "Request a new code": { RU: "Запросить новый код", TJ: "Дархости рамзи нав" },
  "New password": { RU: "Новый пароль", TJ: "Рамзи нав" },
  "Confirm password": { RU: "Подтвердите пароль", TJ: "Тасдиқи рамз" },
  "Passwords don't match.": {
    RU: "Пароли не совпадают.",
    TJ: "Рамзҳо мувофиқат намекунанд.",
  },
  "Don't worry! We'll send a code to your phone number to reset your password.": {
    RU: "Не волнуйтесь! Мы отправим код на ваш номер телефона для сброса пароля.",
    TJ: "Нигарон нашавед! Мо ба рақами телефони шумо рамзро барои барқарор кардани рамз мефиристем.",
  },
  "Enter the code that you received.": {
    RU: "Введите полученный код.",
    TJ: "Рамзи гирифташударо ворид кунед.",
  },
  "Reset password": { RU: "Сброс пароля", TJ: "Барқарор кардани рамз" },
  "Create a new password": {
    RU: "Создайте новый пароль",
    TJ: "Рамзи нав эҷод кунед",
  },

  // --- Dashboard ---
  "Couldn't load dashboard data": {
    RU: "Не удалось загрузить данные дашборда",
    TJ: "Боргирии маълумоти дашборд муяссар нашуд",
  },
  "Select date": { RU: "Выберите дату", TJ: "Санаро интихоб кунед" },
  Date: { RU: "Дата", TJ: "Сана" },
  Income: { RU: "Доход", TJ: "Даромад" },
  "No payments the month before": {
    RU: "Нет платежей за предыдущий месяц",
    TJ: "Пардохтҳо дар моҳи пешина нестанд",
  },
  less: { RU: "меньше", TJ: "камтар" },
  more: { RU: "больше", TJ: "бештар" },
  "than the month before": {
    RU: "чем в предыдущем месяце",
    TJ: "нисбат ба моҳи гузашта",
  },
  collected: { RU: "собрано", TJ: "ҷамъоварӣ шуд" },
  "No groups yet": { RU: "Групп пока нет", TJ: "Ҳанӯз гурӯҳе нест" },
  "Absent:": { RU: "Отсутствуют:", TJ: "Ғоиб:" },
  "Late:": { RU: "Опоздали:", TJ: "Дермонда:" },
  Journal: { RU: "Журнал", TJ: "Журнал" },
  "Open group": { RU: "Открыть группу", TJ: "Кушодани гурӯҳ" },
  Enroll: { RU: "Зачисление", TJ: "Қабул" },
  "Full name": { RU: "ФИО", TJ: "Ному насаб" },
  Course: { RU: "Курс", TJ: "Курс" },
  "No students yet": { RU: "Студентов пока нет", TJ: "Ҳанӯз донишҷӯе нест" },
  "Employed graduates ({count})": {
    RU: "Трудоустроено выпускников ({count})",
    TJ: "Хатмкардагони кормандшуда ({count})",
  },
  "Date of issue": { RU: "Дата выдачи", TJ: "Санаи додан" },
  Work: { RU: "Место работы", TJ: "Ҷойи кор" },
  "No graduates yet": {
    RU: "Выпускников пока нет",
    TJ: "Ҳанӯз хатмкардае нест",
  },
  year: { RU: "год", TJ: "сол" },
  Present: { RU: "Присутствуют", TJ: "Ҳозиранд" },
  Absent: { RU: "Отсутствуют", TJ: "Ғоиб" },
  Late: { RU: "Опоздали", TJ: "Дермонда" },
  "Absent students": {
    RU: "Отсутствующие студенты",
    TJ: "Донишҷӯёни ғоиб",
  },
  Reason: { RU: "Причина", TJ: "Сабаб" },
  "Everyone is in today": {
    RU: "Сегодня все присутствуют",
    TJ: "Имрӯз ҳама ҳозиранд",
  },
  "No group": { RU: "Без группы", TJ: "Бе гурӯҳ" },
  Leads: { RU: "Лиды", TJ: "Лидерҳо" },
  Attendance: { RU: "Посещаемость", TJ: "Иштирок" },
  "Show list": { RU: "Показать список", TJ: "Нишон додани рӯйхат" },

  // --- Common chrome ---
  "See more": { RU: "Подробнее", TJ: "Бештар" },
  Previous: { RU: "Назад", TJ: "Ба қафо" },
  Next: { RU: "Вперёд", TJ: "Ба пеш" },

  // --- Notifications ---
  Notification: { RU: "Уведомление", TJ: "Огоҳинома" },
  "Mark all as read": {
    RU: "Отметить все как прочитанные",
    TJ: "Ҳамаро хондашуда ҳисоб кардан",
  },
  "Nothing new": { RU: "Ничего нового", TJ: "Чизеи нав нест" },
  Read: { RU: "Прочитано", TJ: "Хонда шуд" },
  "Mark as read": { RU: "Отметить как прочитанное", TJ: "Ҳамчун хондашуда қайд кардан" },

  // --- Error / Not found ---
  "Page not found": {
    RU: "Страница не найдена",
    TJ: "Саҳифа ёфт нашуд",
  },
  "The page you are looking for does not exist or has been moved.": {
    RU: "Страница, которую вы ищете, не существует или была перемещена.",
    TJ: "Саҳифаи ҷустуҷӯшаванда мавҷуд нест ё интиқол дода шудааст.",
  },
  "Back to home": { RU: "На главную", TJ: "Ба саҳифаи асосӣ" },
  "Go back": { RU: "Назад", TJ: "Бозгашт" },
  "An unexpected error occurred. Please try again or contact support.": {
    RU: "Произошла неожиданная ошибка. Пожалуйста, попробуйте снова или обратитесь в поддержку.",
    TJ: "Хатои ногаҳон рух дод. Лутфан, дубора кӯшиш кунед ё ба дастгирӣ муроҷиат кунед.",
  },
  "Try again": { RU: "Попробовать снова", TJ: "Дубора кӯшиш кунед" },
  "Error ID: {digest}": { RU: "ID ошибки: {digest}", TJ: "ID хато: {digest}" },
  "Sorry!": { RU: "Извините!", TJ: "Узр!" },
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
