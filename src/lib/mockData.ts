import { Student, WeekData, ChartDataPoint } from "./types";

export const STUDENTS: Student[] = [
  { id: "s1", name: "Алишер Рахмонов" },
  { id: "s2", name: "Мария Иванова" },
  { id: "s3", name: "Дмитрий Волков" },
  { id: "s4", name: "Анна Смирнова" },
  { id: "s5", name: "Бахтиёр Каримов" },
  { id: "s6", name: "Елена Попова" },
  { id: "s7", name: "Сергей Козлов" },
  { id: "s8", name: "Наргиза Азимова" },
];

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickAttendance(probPresent = 0.8): boolean {
  return Math.random() < probPresent;
}

function pickScore(skill: number): number {
  const base = skill + rand(-15, 15);
  return Math.max(0, Math.min(100, base));
}

function pickBonus(): number {
  return rand(0, 10);
}

function pickExam(skill: number): number {
  const base = rand(Math.max(0, skill - 20), Math.min(100, skill + 10));
  return Math.max(0, Math.min(100, base));
}

const SKILL_LEVELS: Record<string, number> = {
  s1: 78,
  s2: 88,
  s3: 65,
  s4: 92,
  s5: 58,
  s6: 82,
  s7: 70,
  s8: 74,
};

const studentIds = STUDENTS.map((s) => s.id);

export function generateWeeks(count = 4): WeekData[] {
  const weeks: WeekData[] = [];
  const weekTitles = [
    "Основы программирования",
    "Типы данных",
    "Функции",
    "Объекты и классы",
  ];

  for (let w = 0; w < count; w++) {
    const dayOffset = w * 7 + 1;
    const dates: string[] = [];
    for (let d = 0; d < 5; d++) {
      const day = dayOffset + d;
      dates.push(`${String(day).padStart(2, "0")}.11.22`);
    }

    const skillBoost = w * 3;
    const attendance: Record<string, boolean[]> = {};
    const scores: Record<string, number[]> = {};
    const endOfWeek: Record<string, { bonus: number; exam: number; sum: number }> = {};

    for (const id of studentIds) {
      const skill = Math.min(100, SKILL_LEVELS[id] + skillBoost);
      const attDays: boolean[] = [];
      const scoreDays: number[] = [];

      for (let d = 0; d < 5; d++) {
        const present = pickAttendance(0.85);
        attDays.push(present);
        scoreDays.push(present ? pickScore(skill) : 0);
      }

      attendance[id] = attDays;
      scores[id] = scoreDays;

      const bonus = pickBonus();
      const exam = pickExam(skill);
      const sumScore = scoreDays.reduce((a, b) => a + b, 0) / 5 + bonus + exam;
      endOfWeek[id] = {
        bonus,
        exam,
        sum: Math.round(sumScore),
      };
    }

    weeks.push({
      id: `w${w + 1}`,
      weekNumber: w + 1,
      title: weekTitles[w] || `Неделя ${w + 1}`,
      dates,
      attendance,
      scores,
      endOfWeek,
    });
  }

  return weeks;
}

export function buildChartData(weeks: WeekData[], students: Student[]): ChartDataPoint[] {
  const points: ChartDataPoint[] = weeks.map((w) => {
    const entry: ChartDataPoint = { week: `Неделя ${w.weekNumber}` };
    for (const s of students) {
      const sumW = w.endOfWeek[s.id]?.sum ?? 0;
      entry[s.id] = sumW;
    }
    return entry;
  });

  const avg: ChartDataPoint = { week: "Average" };
  for (const s of students) {
    const vals = weeks.map((w) => w.endOfWeek[s.id]?.sum ?? 0);
    const total = vals.reduce((a, b) => a + b, 0);
    avg[s.id] = Math.round(total / vals.length);
  }
  points.push(avg);

  return points;
}

export const SERIES_COLORS = [
  "#FF9F43",
  "#2ED47A",
  "#3B9EFF",
  "#8B7CF6",
  "#2EC5D4",
  "#8A94A6",
  "#F5B700",
  "#FF4757",
];
