import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DAYS, SUBJECTS } from "./constants";
import type { DayEntry, PlannerState, SubjectEntry } from "./types";

function emptySubject(): SubjectEntry {
  return { done: false, hours: "", tests: "", percent: "", analysisMinutes: "", note: "" };
}

function emptyDay(): DayEntry {
  return {
    goal: "",
    hourGoal: "",
    subjects: SUBJECTS.map(() => emptySubject()),
  };
}

function emptyState(): PlannerState {
  return { days: DAYS.map(() => emptyDay()) };
}

interface PlannerStore extends PlannerState {
  currentDay: number;
  setCurrentDay: (i: number) => void;
  updateDay: (i: number, patch: Partial<DayEntry>) => void;
  updateSubject: (dayIdx: number, subjIdx: number, patch: Partial<SubjectEntry>) => void;
  resetDay: (i: number) => void;
  resetWeek: () => void;
}

export const usePlannerStore = create<PlannerStore>()(
  persist(
    (set) => ({
      ...emptyState(),
      currentDay: 0,
      setCurrentDay: (i) => set({ currentDay: i }),
      updateDay: (i, patch) =>
        set((state) => {
          const days = [...state.days];
          days[i] = { ...days[i], ...patch };
          return { days };
        }),
      updateSubject: (dayIdx, subjIdx, patch) =>
        set((state) => {
          const days = [...state.days];
          const subjects = [...days[dayIdx].subjects];
          subjects[subjIdx] = { ...subjects[subjIdx], ...patch };
          days[dayIdx] = { ...days[dayIdx], subjects };
          return { days };
        }),
      resetDay: (i) =>
        set((state) => {
          const days = [...state.days];
          days[i] = emptyDay();
          return { days };
        }),
      resetWeek: () => set({ ...emptyState() }),
    }),
    {
      name: "helen-planner-v3",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

export function dayTaskPercent(day: DayEntry): number {
  const done = day.subjects.filter((s) => s.done).length;
  return Math.round((done / day.subjects.length) * 100);
}

export function dayHoursSum(day: DayEntry): number {
  return day.subjects.reduce((acc, s) => acc + (Number(s.hours) || 0), 0);
}

export function dayHoursPercent(day: DayEntry): number {
  const goal = Number(day.hourGoal);
  if (!goal) return 0;
  return Math.min(100, Math.round((dayHoursSum(day) / goal) * 100));
}

export function dayAnalysisMinutesSum(day: DayEntry): number {
  return day.subjects.reduce((acc, s) => acc + (Number(s.analysisMinutes) || 0), 0);
}
