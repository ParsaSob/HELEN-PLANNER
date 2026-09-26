"use client";

import { motion } from "framer-motion";
import { CalendarDays, RotateCcw, Target, Clock } from "lucide-react";
import dynamic from "next/dynamic";
import { DAYS, SUBJECTS, toPersianDigits, formatHours } from "@/lib/constants";
import { dayHoursPercent, dayHoursSum, dayTaskPercent, dayTestsSum, usePlannerStore } from "@/lib/store";
import SubjectCard from "./SubjectCard";
import { Card, ProgressBar, Badge } from "./ui";
import { PageHeader } from "./Navigation";

const ProgressOrb3D = dynamic(() => import("./ProgressOrb3D"), { ssr: false });

export default function DayView() {
  const currentDay = usePlannerStore((s) => s.currentDay);
  const setCurrentDay = usePlannerStore((s) => s.setCurrentDay);
  const day = usePlannerStore((s) => s.days[currentDay]);
  const updateDay = usePlannerStore((s) => s.updateDay);
  const resetDay = usePlannerStore((s) => s.resetDay);

  const taskPct = dayTaskPercent(day);
  const hoursPct = dayHoursPercent(day);
  const hoursSum = dayHoursSum(day);
  const testsSum = dayTestsSum(day);
  const todayName = DAYS[currentDay];

  return (
    <div>
      <PageHeader title={`برنامه ${todayName}`} subtitle="درس‌ها و اهداف امروز را مدیریت کن" />

      {/* Day selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-4 -mx-1 px-1">
        {DAYS.map((d, i) => {
          const active = i === currentDay;
          return (
            <button
              key={d}
              onClick={() => setCurrentDay(i)}
              className={`shrink-0 rounded-card px-4 py-2.5 text-[12px] font-medium transition-all duration-300 ${
                active
                  ? "card-warm border-gold/30 text-gold"
                  : "glass text-inkSoft hover:text-ink hover:bg-white/8"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>

      {/* Goal + progress orb */}
      <Card className="p-5 mb-4" delay={0.05}>
        <div className="flex gap-5 items-center flex-wrap">
          <div className="shrink-0">
            <ProgressOrb3D taskPercent={taskPct} hoursPercent={hoursPct} />
          </div>
          <div className="flex-1 min-w-[200px] space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <Badge color="gold">
                <CalendarDays className="w-3 h-3" />
                {todayName}
              </Badge>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[10.5px] text-inkSoft mb-1.5">
                <Target className="w-3 h-3" />
                هدف امروز
              </label>
              <input
                type="text"
                value={day.goal}
                onChange={(e) => updateDay(currentDay, { goal: e.target.value })}
                placeholder="مثلاً: جمع‌بندی فصل ژنتیک"
                className="w-full border border-white/10 bg-black/20 rounded-card px-3.5 py-2.5 text-[13px] placeholder:text-inkDim focus:border-gold/30 transition-colors"
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-[10.5px] text-inkSoft mb-1.5">
                <Clock className="w-3 h-3" />
                هدف ساعت مطالعه
              </label>
              <input
                type="number"
                step={0.5}
                min={0}
                value={day.hourGoal}
                onChange={(e) =>
                  updateDay(currentDay, { hourGoal: e.target.value === "" ? "" : Number(e.target.value) })
                }
                placeholder="مثلاً ۴"
                className="w-full border border-white/10 bg-black/20 rounded-card px-3.5 py-2.5 text-[13px] placeholder:text-inkDim focus:border-gold/30 transition-colors"
                style={{ direction: "ltr" }}
              />
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3 flex-wrap">
            <div className="text-center px-3 py-2 rounded-card bg-white/4">
              <div className="text-[18px] font-bold text-fern">{formatHours(hoursSum)}</div>
              <div className="text-[9px] text-inkSoft">ساعت</div>
            </div>
            <div className="text-center px-3 py-2 rounded-card bg-white/4">
              <div className="text-[18px] font-bold text-gold">{toPersianDigits(testsSum)}</div>
              <div className="text-[9px] text-inkSoft">تست</div>
            </div>
            <div className="text-center px-3 py-2 rounded-card bg-white/4">
              <div className="text-[18px] font-bold text-ember">{toPersianDigits(taskPct)}٪</div>
              <div className="text-[9px] text-inkSoft">تکمیل</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Subject cards */}
      <div className="space-y-2.5">
        {SUBJECTS.map((name, si) => (
          <SubjectCard key={name} dayIdx={currentDay} subjIdx={si} name={name} />
        ))}
      </div>

      {/* Reset */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => resetDay(currentDay)}
        className="flex items-center gap-2 border border-white/10 text-inkSoft rounded-card px-4 py-2.5 text-[11.5px] mt-3 hover:border-ember/30 hover:text-ember transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        پاک کردن این روز
      </motion.button>
    </div>
  );
}
