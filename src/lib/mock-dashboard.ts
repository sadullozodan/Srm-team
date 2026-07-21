import { MONTHS } from "./series";

// Widgets with NO endpoint behind them, anywhere in the swagger. Everything
// here is invented and stays invented until the backend catches up — see
// BACKEND-GAPS.md. Anything the API *can* answer is fetched, not mocked.

// ponytail: needs GET /api/Dashboard/attendance?year=&month= — daily late/absent.
// Journal only exposes attendance per lesson id, which the dashboard has not got.
export const attendanceByDay = [
  [30, 10], [28, 9], [25, 11], [24, 14], [26, 17], [30, 19], [33, 20], [32, 19],
  [30, 21], [28, 24], [26, 27], [24, 29], [22, 30], [24, 28], [27, 26], [30, 25],
  [32, 24], [31, 26], [28, 29], [25, 31], [22, 33], [20, 35], [19, 34], [20, 32],
  [22, 30], [21, 28], [18, 26], [15, 25], [13, 26], [12, 28],
].map(([late, absent], i) => ({
  day: String(i + 1).padStart(2, "0"),
  late,
  absent,
}));

// ponytail: needs GET /api/Journal/absentees?date= — today's absent students
// with a reason. No endpoint returns a student and a reason together.
const REASON = "Компютераш вайрон шуд, наомад дарс ...";
export const absentRows = [
  { id: "a1", name: "Tojiev Olimjon", group: "HTML June", phones: ["985415287"], reason: REASON },
  { id: "a2", name: "Tojiev Olimjon", group: "HTML June", phones: ["985415287"], reason: "" },
  { id: "a3", name: "Tojiev Olimjon", group: "C# June", phones: ["985415287", "232030320"], reason: REASON },
  { id: "a4", name: "Tojiev Olimjon", group: "C# June", phones: ["985415287", "232030320"], reason: REASON },
  { id: "a5", name: "Tojiev Olimjon", group: "HTML June", phones: ["985415287"], reason: REASON },
  { id: "a6", name: "Tojiev Olimjon", group: "C# June", phones: ["985415287"], reason: REASON },
];

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
