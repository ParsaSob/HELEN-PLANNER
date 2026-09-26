import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { DAYS, SUBJECTS, GROWTH_STAGES } from "./constants";
import type {
  DayEntry,
  FocusSession,
  FocusStatus,
  PlannerState,
  SubjectEntry,
  ViewKey,
} from "./types";

function emptySubject(): SubjectEntry {
  return {
    done: false,
    hours: "",
    tests: "",
    percent: "",
    analysisMinutes: "",
    note: "",
  };
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
  view: ViewKey;
  setView: (v: ViewKey) => void;
  setCurrentDay: (i: number) => void;
  updateDay: (i: number, patch: Partial<DayEntry>) => void;
  updateSubject: (
    dayIdx: number,
    subjIdx: number,
    patch: Partial<SubjectEntry>
  ) => void;
  resetDay: (i: number) => void;
  resetWeek: () => void;
  focusSessions: FocusSession[];
  addFocusSession: (s: FocusSession) => void;
}

export const usePlannerStore = create<PlannerStore>()(
  persist(
    (set) => ({
      ...emptyState(),
      currentDay: 0,
      view: "dashboard",

      setView: (v) => set({ view: v }),

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

          subjects[subjIdx] = {
            ...subjects[subjIdx],
            ...patch,
          };

          days[dayIdx] = {
            ...days[dayIdx],
            subjects,
          };

          return { days };
        }),

      resetDay: (i) =>
        set((state) => {
          const days = [...state.days];
          days[i] = emptyDay();
          return { days };
        }),

      resetWeek: () => set({ ...emptyState() }),

      focusSessions: [],

      addFocusSession: (s) =>
        set((state) => ({
          focusSessions: [...state.focusSessions, s],
        })),
    }),
    {
      name: "helen-planner-v4",
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
  return day.subjects.reduce(
    (acc, s) => acc + (Number(s.hours) || 0),
    0
  );
}

export function dayHoursPercent(day: DayEntry): number {
  const goal = Number(day.hourGoal);

  if (!goal) return 0;

  return Math.min(
    100,
    Math.round((dayHoursSum(day) / goal) * 100)
  );
}

export function dayAnalysisMinutesSum(day: DayEntry): number {
  return day.subjects.reduce(
    (acc, s) => acc + (Number(s.analysisMinutes) || 0),
    0
  );
}

export function dayTestsSum(day: DayEntry): number {
  return day.subjects.reduce(
    (acc, s) => acc + (Number(s.tests) || 0),
    0
  );
}

export function weekHoursTotal(days: DayEntry[]): number {
  return days.reduce(
    (acc, d) => acc + dayHoursSum(d),
    0
  );
}

export function weekTestsTotal(days: DayEntry[]): number {
  return days.reduce(
    (acc, d) => acc + dayTestsSum(d),
    0
  );
}

export function weekAnalysisTotal(days: DayEntry[]): number {
  return days.reduce(
    (acc, d) => acc + dayAnalysisMinutesSum(d),
    0
  );
}

export function weekDoneTasks(days: DayEntry[]): number {
  return days.reduce(
    (acc, d) =>
      acc + d.subjects.filter((s) => s.done).length,
    0
  );
}

export function weekTotalTasks(): number {
  return DAYS.length * SUBJECTS.length;
}

export function weekCompletionPercent(days: DayEntry[]): number {
  return Math.round(
    (weekDoneTasks(days) / weekTotalTasks()) * 100
  );
}

export function subjectAvgPercent(
  days: DayEntry[],
  subjIdx: number
): number | null {
  let sum = 0;
  let count = 0;

  days.forEach((d) => {
    const p = Number(d.subjects[subjIdx].percent);

    if (
      d.subjects[subjIdx].percent !== "" &&
      !Number.isNaN(p)
    ) {
      sum += p;
      count++;
    }
  });

  return count ? Math.round(sum / count) : null;
}

export function subjectTotalHours(
  days: DayEntry[],
  subjIdx: number
): number {
  return days.reduce(
    (acc, d) =>
      acc + (Number(d.subjects[subjIdx].hours) || 0),
    0
  );
}

export function subjectTotalTests(
  days: DayEntry[],
  subjIdx: number
): number {
  return days.reduce(
    (acc, d) =>
      acc + (Number(d.subjects[subjIdx].tests) || 0),
    0
  );
}

export function subjectTotalAnalysis(
  days: DayEntry[],
  subjIdx: number
): number {
  return days.reduce(
    (acc, d) =>
      acc +
      (Number(d.subjects[subjIdx].analysisMinutes) || 0),
    0
  );
}

export function dayXP(day: DayEntry): number {
  let xp = 0;

  xp += dayHoursSum(day) * 15;
  xp += dayTestsSum(day) * 2;
  xp += dayAnalysisMinutesSum(day) * 0.5;
  xp += day.subjects.filter((s) => s.done).length * 20;

  return Math.round(xp);
}

export function weekXP(days: DayEntry[]): number {
  return days.reduce(
    (acc, d) => acc + dayXP(d),
    0
  );
}

export function focusXP(minutes: number): number {
  return Math.round(minutes * 10);
}

export function totalXP(
  days: DayEntry[],
  sessions: FocusSession[]
): number {
  return (
    weekXP(days) +
    sessions.reduce(
      (acc, s) => acc + focusXP(s.durationMinutes),
      0
    )
  );
}

/**
 * Returns the current growth stage based on XP,
 * the next growth stage, and progress toward it.
 *
 * The explicit GrowthStage type prevents TypeScript
 * from inferring `stage` as only the first element
 * of the GROWTH_STAGES tuple.
 */
export function growthStage(xp: number) {
  type GrowthStage = (typeof GROWTH_STAGES)[number];

  let stage: GrowthStage = GROWTH_STAGES[0];
  let next: GrowthStage | null = null;

  for (let i = 0; i < GROWTH_STAGES.length; i++) {
    if (xp >= GROWTH_STAGES[i].minXP) {
      stage = GROWTH_STAGES[i];
      next = GROWTH_STAGES[i + 1] ?? null;
    }
  }

  const progress = next
    ? Math.min(
        100,
        ((xp - stage.minXP) /
          (next.minXP - stage.minXP)) *
          100
      )
    : 100;

  return {
    stage,
    next,
    progress,
  };
}

export function bestDayIndex(days: DayEntry[]): number {
  let best = 0;
  let bestXP = -1;

  days.forEach((d, i) => {
    const xp = dayXP(d);

    if (xp > bestXP) {
      bestXP = xp;
      best = i;
    }
  });

  return best;
}

export function worstDayIndex(days: DayEntry[]): number {
  let worst = 0;
  let worstXP = Infinity;

  days.forEach((d, i) => {
    const xp = dayXP(d);

    if (xp < worstXP) {
      worstXP = xp;
      worst = i;
    }
  });

  return worst;
}

export function avgDailyHours(days: DayEntry[]): number {
  return weekHoursTotal(days) / DAYS.length;
}

export function avgPercent(
  days: DayEntry[]
): number | null {
  let sum = 0;
  let count = 0;

  days.forEach((d) => {
    d.subjects.forEach((s) => {
      const p = Number(s.percent);

      if (
        s.percent !== "" &&
        !Number.isNaN(p)
      ) {
        sum += p;
        count++;
      }
    });
  });

  return count ? Math.round(sum / count) : null;
}
