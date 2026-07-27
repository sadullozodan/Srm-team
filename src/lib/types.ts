export interface Student {
  id: string;
  name: string;
}

export interface WeekEndResult {
  bonus: number;
  exam: number;
  sum: number;
}

export interface WeekData {
  id: string;
  weekNumber: number;
  title: string;
  dates: string[];
  attendance: Record<string, boolean[]>;
  scores: Record<string, number[]>;
  endOfWeek: Record<string, WeekEndResult>;
}

export interface ChartDataPoint {
  week: string;
  [key: string]: string | number;
}
