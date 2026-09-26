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

export interface FocusSession {
  id: string;
  subjectIdx: number;
  durationMinutes: number;
  goal: string;
  testsCompleted: number;
  completed: boolean;
  startedAt: number;
}

export type FocusStatus = "idle" | "running" | "paused" | "completed";

export type ViewKey = "dashboard" | "day" | "week" | "progress" | "focus";

export type GrowthStage = "seed" | "sprout" | "sapling" | "tree" | "oak";
