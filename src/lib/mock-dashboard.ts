import { MONTHS } from "./series";

// Widgets with NO endpoint behind them, anywhere in the swagger. Everything
// here is invented and stays invented until the backend catches up — see
// BACKEND-GAPS.md. Anything the API *can* answer is fetched, not mocked.

// ponytail: needs GET /api/Dashboard/left-courses?year=. There is no
// enrollments list endpoint and nothing records when a status became "Left".
export const leftCoursesByMonth = [
  [18, 10], [26, 22], [12, 8], [30, 16], [24, 20], [28, 26],
].map(([left, returned], i) => ({ month: MONTHS[i], left, returned }));

// ponytail: needs GET /api/Notifications. Display-only, nothing is clickable.
export const notifications = [
  {
    id: "n1",
    from: "Admin",
    text: "Вы пропустили занятие React June (center) 25 июня 2023 г. Если вы пропустите 3 занятия, вы будете отчисленны из академии.",
    time: "25 June, 12:00",
    read: false,
  },
  {
    id: "n2",
    from: "Teacher",
    text: "Ура, поздравляем! Вы получили сертификат за курс «HTML & CSS». Его можно найти в разделе Профиль >> Мои сертификаты, можно скачать или поделиться им.",
    time: "25 June, 12:00",
    read: true,
  },
];
