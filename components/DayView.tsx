"use client";

import dynamic from "next/dynamic";
import { DAYS, SUBJECTS } from "@/lib/constants";
import { dayHoursPercent, dayTaskPercent, usePlannerStore } from "@/lib/store";
import SubjectCard from "./SubjectCard";

const ProgressOrb3D = dynamic(() => import("./ProgressOrb3D"), { ssr: false });

export default function DayView() {
  const currentDay = usePlannerStore((s) => s.currentDay);
  const setCurrentDay = usePlannerStore((s) => s.setCurrentDay);
  const day = usePlannerStore((s) => s.days[currentDay]);
  const updateDay = usePlannerStore((s) => s.updateDay);
  const resetDay = usePlannerStore((s) => s.resetDay);

  const taskPct = dayTaskPercent(day);
  const hoursPct = dayHoursPercent(day);

  return (
    <div>
      <div className="flex gap-1.5 overflow-x-auto pb-1.5 mb-5">
        {DAYS.map((d, i) => (
          <button
            key={d}
            onClick={() => setCurrentDay(i)}
            className={`shrink-0 border rounded-[14px_8px_14px_8px] px-4 py-2 text-[13px] backdrop-blur-sm ${
              i === currentDay
                ? "border-gold bg-gradient-to-br from-gold/35 to-fern/25"
                : "border-white/10 glass text-ink"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="glass rounded-organic p-5 flex gap-6 items-center flex-wrap mb-5 shadow-[0_12px_40px_-18px_rgba(0,0,0,0.6)]">
        <ProgressOrb3D taskPercent={taskPct} hoursPercent={hoursPct} />
        <div className="flex-1 min-w-[220px] flex flex-col gap-2.5">
          <div className="flex gap-3.5 text-[11.5px] text-inkSoft mb-1">
            <span>
              <i className="inline-block w-[9px] h-[9px] rounded-[3px] ml-1 align-[-1px] bg-gold" />
              پیشرفت درس‌ها ({taskPct}٪)
            </span>
            <span>
              <i className="inline-block w-[9px] h-[9px] rounded-[3px] ml-1 align-[-1px] bg-fern" />
              ساعت مطالعه ({hoursPct}٪)
            </span>
          </div>
          <label className="text-[11.5px] text-inkSoft">هدف امروز</label>
          <input
            type="text"
            value={day.goal}
            onChange={(e) => updateDay(currentDay, { goal: e.target.value })}
            placeholder="مثلاً: جمع‌بندی فصل ژنتیک"
            className="w-full border border-white/10 bg-black/20 rounded-xl px-3.5 py-2.5 text-[13.5px]"
          />
          <label className="text-[11.5px] text-inkSoft">هدف ساعت مطالعه امروز</label>
          <input
            type="number"
            step={0.5}
            min={0}
            value={day.hourGoal}
            onChange={(e) =>
              updateDay(currentDay, { hourGoal: e.target.value === "" ? "" : Number(e.target.value) })
            }
            placeholder="مثلاً ۴"
            className="w-full border border-white/10 bg-black/20 rounded-xl px-3.5 py-2.5 text-[13.5px]"
          />
        </div>
      </div>

      {SUBJECTS.map((name, si) => (
        <SubjectCard key={name} dayIdx={currentDay} subjIdx={si} name={name} />
      ))}

      <button
        onClick={() => resetDay(currentDay)}
        className="border border-white/10 text-inkSoft rounded-xl px-4 py-2 text-[11.5px] mt-1.5"
      >
        پاک کردن این روز
      </button>
    </div>
  );
}
