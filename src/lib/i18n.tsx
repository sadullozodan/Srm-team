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
  "Search students, groups, courses…": {
    RU: "Поиск студентов, групп, курсов…",
    TJ: "Ҷустуҷӯи донишҷӯён, гурӯҳҳо…",
  },
  "Sign out": { RU: "Выйти", TJ: "Баромад" },
  Profile: { RU: "Профиль", TJ: "Профил" },
  Account: { RU: "Аккаунт", TJ: "Ҳисоб" },
  Notifications: { RU: "Уведомления", TJ: "Огоҳиномаҳо" },
  Back: { RU: "Назад", TJ: "Бозгашт" },

  // --- Dashboard ---
  "A quick read on students, attendance and cashflow.": {
    RU: "Коротко о студентах, посещаемости и деньгах.",
    TJ: "Хулосаи мухтасар: донишҷӯён, иштирок ва пул.",
  },

  // --- Page titles (flow through PanelHeader) ---
  "Add new student": { RU: "Новый студент", TJ: "Донишҷӯи нав" },
  "Add new employee": { RU: "Новый сотрудник", TJ: "Корманди нав" },
  "Add new group": { RU: "Новая группа", TJ: "Гурӯҳи нав" },
  "Add new course": { RU: "Новый курс", TJ: "Курси нав" },
  "Edit student": { RU: "Изменить студента", TJ: "Тағйири донишҷӯ" },
  "Edit employee": { RU: "Изменить сотрудника", TJ: "Тағйири корманд" },
  "Edit group": { RU: "Изменить группу", TJ: "Тағйири гурӯҳ" },
  "Edit course": { RU: "Изменить курс", TJ: "Тағйири курс" },
  "Budget plan": { RU: "План бюджета", TJ: "Нақшаи буҷет" },
  "Mentor levels": { RU: "Уровни менторов", TJ: "Сатҳи устодон" },
  Positions: { RU: "Должности", TJ: "Вазифаҳо" },
  "Tokens & rewards": { RU: "Токены и награды", TJ: "Токенҳо ва мукофотҳо" },
  "Grant tokens": { RU: "Начислить токены", TJ: "Додани токенҳо" },
  "New mailing": { RU: "Новая рассылка", TJ: "Паёми нав" },
  History: { RU: "История", TJ: "Таърих" },

  // --- Table columns ---
  "Full name": { RU: "ФИО", TJ: "Ному насаб" },
  Phone: { RU: "Телефон", TJ: "Телефон" },
  Login: { RU: "Логин", TJ: "Ворид" },
  Status: { RU: "Статус", TJ: "Вазъият" },
  Type: { RU: "Тип", TJ: "Навъ" },
  Group: { RU: "Группа", TJ: "Гурӯҳ" },
  Course: { RU: "Курс", TJ: "Курс" },
  Branch: { RU: "Филиал", TJ: "Филиал" },
  Amount: { RU: "Сумма", TJ: "Маблағ" },
  Paid: { RU: "Оплачено", TJ: "Пардохтшуда" },
  Date: { RU: "Дата", TJ: "Сана" },
  Time: { RU: "Время", TJ: "Вақт" },
  Month: { RU: "Месяц", TJ: "Моҳ" },
  Total: { RU: "Итого", TJ: "Ҷамъ" },
  "Total payment": { RU: "Всего к оплате", TJ: "Ҳамагӣ пардохт" },
  Prepaid: { RU: "Предоплата", TJ: "Пешпардохт" },
  Remaining: { RU: "Остаток", TJ: "Боқимонда" },
  Category: { RU: "Категория", TJ: "Категория" },
  Recipient: { RU: "Получатель", TJ: "Гиранда" },
  Recipients: { RU: "Получатели", TJ: "Гирандагон" },
  Description: { RU: "Описание", TJ: "Тавсиф" },
  Reason: { RU: "Причина", TJ: "Сабаб" },
  Address: { RU: "Адрес", TJ: "Суроға" },
  City: { RU: "Город", TJ: "Шаҳр" },
  District: { RU: "Район", TJ: "Ноҳия" },
  Position: { RU: "Должность", TJ: "Вазифа" },
  Level: { RU: "Уровень", TJ: "Сатҳ" },
  "Hour rate": { RU: "Ставка/час", TJ: "Нарх/соат" },
  Company: { RU: "Компания", TJ: "Ширкат" },
  Location: { RU: "Локация", TJ: "Ҷойгиршавӣ" },
  Hired: { RU: "Трудоустроен", TJ: "Ба кор гирифта шуд" },
  Work: { RU: "Работа", TJ: "Кор" },
  Workplace: { RU: "Место работы", TJ: "Ҷои кор" },
  Certificate: { RU: "Сертификат", TJ: "Сертификат" },
  "Date of issue": { RU: "Дата выдачи", TJ: "Санаи додан" },
  Graduate: { RU: "Выпускник", TJ: "Хатмкарда" },
  Actor: { RU: "Кто", TJ: "Иҷрокунанда" },
  Action: { RU: "Действие", TJ: "Амал" },
  Entity: { RU: "Объект", TJ: "Объект" },
  Result: { RU: "Результат", TJ: "Натиҷа" },
  "Last login": { RU: "Последний вход", TJ: "Вуруди охирин" },
  Role: { RU: "Роль", TJ: "Нақш" },
  User: { RU: "Пользователь", TJ: "Корбар" },
  Mailing: { RU: "Рассылка", TJ: "Паём" },
  Audience: { RU: "Аудитория", TJ: "Шунавандагон" },
  Sent: { RU: "Отправлено", TJ: "Фиристода шуд" },

  // --- Status values (flow through Pill / SelectField) ---
  Active: { RU: "Активен", TJ: "Фаъол" },
  Inactive: { RU: "Неактивен", TJ: "Ғайрифаъол" },
  Finished: { RU: "Завершён", TJ: "Анҷомид" },
  NotPaid: { RU: "Не оплачен", TJ: "Пардохт нашуд" },
  Prepayment: { RU: "Предоплата", TJ: "Пешпардохт" },
  Pending: { RU: "Ожидает", TJ: "Дар интизор" },
  Approved: { RU: "Одобрено", TJ: "Тасдиқ шуд" },
  Denied: { RU: "Отказано", TJ: "Рад шуд" },
  Done: { RU: "Готово", TJ: "Иҷро шуд" },
  InProgress: { RU: "В процессе", TJ: "Дар ҷараён" },
  Open: { RU: "Открыта", TJ: "Кушода" },
  Closed: { RU: "Закрыта", TJ: "Пӯшида" },
  Success: { RU: "Успешно", TJ: "Бомуваффақият" },
  Failed: { RU: "Ошибка", TJ: "Хато" },
  Off: { RU: "Выкл", TJ: "Хомӯш" },

  // --- Actions and filter labels ---
  EXPORT: { RU: "ЭКСПОРТ", TJ: "ЭКСПОРТ" },
  SAVE: { RU: "СОХРАНИТЬ", TJ: "НИГОҲ ДОШТАН" },
  CANCEL: { RU: "ОТМЕНА", TJ: "БЕКОР КАРДАН" },
  "SAVING…": { RU: "СОХРАНЕНИЕ…", TJ: "НИГОҲ ДОШТА МЕШАВАД…" },
  SEND: { RU: "ОТПРАВИТЬ", TJ: "ФИРИСТОДАН" },
  "SENDING…": { RU: "ОТПРАВКА…", TJ: "ФИРИСТОДА МЕШАВАД…" },
  Search: { RU: "Поиск", TJ: "Ҷустуҷӯ" },
  "Search by name": { RU: "Поиск по имени", TJ: "Ҷустуҷӯ бо ном" },
  "All status": { RU: "Все статусы", TJ: "Ҳамаи вазъиятҳо" },
  Language: { RU: "Язык", TJ: "Забон" },
  Personal: { RU: "Личные данные", TJ: "Маълумоти шахсӣ" },
  Preferences: { RU: "Настройки", TJ: "Танзимот" },
  total: { RU: "всего", TJ: "ҳамагӣ" },
  Page: { RU: "Стр.", TJ: "Саҳ." },
  of: { RU: "из", TJ: "аз" },
  "Previous page": { RU: "Предыдущая страница", TJ: "Саҳифаи қаблӣ" },
  "Next page": { RU: "Следующая страница", TJ: "Саҳифаи оянда" },

  // --- Empty states ---
  "Nothing here yet.": { RU: "Пока ничего нет.", TJ: "Ҳоло чизе нест." },
  "No users found.": { RU: "Пользователи не найдены.", TJ: "Корбар ёфт нашуд." },
  "No branches found.": { RU: "Филиалы не найдены.", TJ: "Филиал ёфт нашуд." },
  "No graduates yet.": { RU: "Выпускников пока нет.", TJ: "Ҳоло хатмкарда нест." },
  "No vacancies yet.": { RU: "Вакансий пока нет.", TJ: "Ҳоло ҷои корӣ нест." },
  "No roles.": { RU: "Ролей нет.", TJ: "Нақш нест." },
  "No mailings sent yet.": { RU: "Рассылок пока не было.", TJ: "Ҳоло паём фиристода нашуд." },
  "No activity recorded yet.": { RU: "Действий пока не записано.", TJ: "Ҳоло амал сабт нашуд." },
  "No payments found.": { RU: "Платежи не найдены.", TJ: "Пардохт ёфт нашуд." },
  "No expenses recorded.": { RU: "Расходов нет.", TJ: "Хароҷот нест." },
  "No salaries found.": { RU: "Зарплаты не найдены.", TJ: "Маош ёфт нашуд." },
  "No advances requested.": { RU: "Заявок на аванс нет.", TJ: "Дархости бунак нест." },
  "No budget lines found.": { RU: "Бюджетных строк нет.", TJ: "Сатри буҷет нест." },
  "Nobody is in debt.": { RU: "Должников нет.", TJ: "Қарздор нест." },
  "No mentor levels set.": { RU: "Уровни не заданы.", TJ: "Сатҳҳо таъин нашудаанд." },
  "No lessons": { RU: "Занятий нет", TJ: "Дарс нест" },

  // --- Profile ---
  Edit: { RU: "Редактировать", TJ: "Тағйир додан" },
  Save: { RU: "Сохранить", TJ: "Нигоҳ доштан" },
  Cancel: { RU: "Отмена", TJ: "Бекор кардан" },
  Email: { RU: "Эл. почта", TJ: "Почтаи электронӣ" },
  "Notification channel": { RU: "Канал уведомлений", TJ: "Канали огоҳинома" },
  "Created at": { RU: "Создан", TJ: "Эҷод шудааст" },
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
