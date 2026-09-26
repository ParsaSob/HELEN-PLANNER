export interface SubjectEntry {
  done: boolean;
  hours: number | "";
  tests: number | "";
  percent: number | "";
  analysisMinutes: number | "";
  note: string;
}

export interface DayEntry {
  goal: string;
  hourGoal: number | "";
  subjects: SubjectEntry[];
}

export interface PlannerState {
  days: DayEntry[];
}
