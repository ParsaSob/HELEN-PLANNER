"use client";

import { motion } from "framer-motion";
import { CalendarDays, FileCheck, Target, ChevronLeft, Sparkles, BookOpen, ChartBar as BarChart3 } from "lucide-react";
import dynamic from "next/dynamic";
import { usePlannerStore } from "@/lib/store";
import {
  dayTaskPercent,
  dayHoursSum,
  dayHoursPercent,
  dayTestsSum,
  dayXP,
  totalXP,
  growthStage,
  weekHoursTotal,
  weekTestsTotal,
  weekDoneTasks,
  weekTotalTasks,
  weekCompletionPercent,
} from "@/lib/store";
import { DAYS, SUBJECTS, SUBJECT_ICONS, toPersianDigits, formatHours } from "@/lib/constants";
import { Card, ProgressBar, Badge, EmptyState } from "./ui";
import { PageHeader, StatPill } from "./Navigation";

const ProgressOrb3D = dynamic(() => import("./ProgressOrb3D"), { ssr: false });

export default function Dashboard() {
  const currentDay = usePlannerStore((s) => s.currentDay);
  const setCurrentDay = usePlannerStore((s) => s.setCurrentDay);
  const setView = usePlannerStore((s) => s.setView);
  const day = usePlannerStore((s) => s.days[currentDay]);
  const days = usePlannerStore((s) => s.days);
  const sessions = usePlannerStore((s) => s.focusSessions);

  const taskPct = dayTaskPercent(day);
  const hoursPct = dayHoursPercent(day);
  const hoursToday = dayHoursSum(day);
  const testsToday = dayTestsSum(day);
  const xpToday = dayXP(day);
  const xpTotal = totalXP(days, sessions);
  const { stage, next, progress } = growthStage(xpTotal);

  const weekHours = weekHoursTotal(days);
  const weekTests = weekTestsTotal(days);
  const weekDone = weekDoneTasks(days);
  const weekTotal = weekTotalTasks();
  const weekPct = weekCompletionPercent(days);

  const todayName = DAYS[currentDay];

  const pendingSubjects = day.subjects
    .map((s, i) => ({ ...s, name: SUBJECTS[i], idx: i, icon: SUBJECT_ICONS[i] }))
    .filter((s) => !s.done);

  const completedSubjects = day.subjects
    .map((s, i) => ({ ...s, name: SUBJECTS[i], idx: i, icon: SUBJECT_ICONS[i] }))
    .filter((s) => s.done);

  const hasActivity = hoursToday > 0 || testsToday > 0 || completedSubjects.length > 0;

  return (
    <div>
      <PageHeader
        title={`سلام هلن ${stage.emoji}`}
        subtitle={`${todayName} · یک گوشه‌ی آرام برای درس خوندن`}
      />

      {/* Hero — today's study environment */}
      <Card className="p-5 mb-4 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-40 h-40 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-fern/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row gap-5 items-center">
          {/* 3D Orb */}
          <div className="shrink-0">
            <ProgressOrb3D taskPercent={taskPct} hoursPercent={hoursPct} />
          </div>

          {/* Today stats */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex items-center gap-2 mb-3">
              <Badge color="gold">
                <Sparkles className="w-3 h-3" />
                امروز
              </Badge>
              {day.goal && (
                <span className="text-[11.5px] text-inkSoft truncate">· {day.goal}</span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <StatPill label="ساعت مطالعه" value={formatHours(hoursToday)} icon="⏱" color="fern" />
              <StatPill label="تعداد تست" value={toPersianDigits(testsToday)} icon="✍" color="gold" />
              <StatPill label="درس انجام‌شده" value={`${toPersianDigits(completedSubjects.length)}/${toPersianDigits(SUBJECTS.length)}`} icon="✓" color="ember" />
              <StatPill label="امتیاز امروز" value={toPersianDigits(xpToday)} icon="✦" color="gold" />
            </div>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-[10.5px] text-inkSoft mb-1">
                  <span>پیشرفت درس‌ها</span>
                  <span>{toPersianDigits(taskPct)}٪</span>
                </div>
                <ProgressBar value={taskPct} color="gold" height={6} />
              </div>
              <div>
                <div className="flex justify-between text-[10.5px] text-inkSoft mb-1">
                  <span>ساعت مطالعه</span>
                  <span>{toPersianDigits(hoursPct)}٪</span>
                </div>
                <ProgressBar value={hoursPct} color="fern" height={6} />
              </div>
            </div>

            {!day.goal && !hasActivity && (
              <div className="mt-3 text-[11px] text-inkSoft bg-white/4 rounded-card px-3 py-2">
                امروز هنوز شروع نشده. اولین قدم را بردار.
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Growth + Week summary row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <Card warm className="p-4" hover delay={0.05}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{stage.emoji}</span>
              <div>
                <div className="text-[14px] font-bold text-ink">درخت پیشرفت</div>
                <div className="text-[10.5px] text-inkSoft">
                  مرحله: {stage.label}
                  {next && ` → ${next.label}`}
                </div>
              </div>
            </div>
            <button
              onClick={() => setView("progress")}
              className="text-gold text-[11px] flex items-center gap-0.5 hover:gap-1.5 transition-all"
            >
              جزئیات
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
          <ProgressBar
            value={progress}
            color="gold"
            height={8}
            showLabel
            label={next ? `${stage.label} → ${next.label}` : "حداکثر سطح"}
          />
          <div className="mt-2 text-[10px] text-inkSoft text-left">
            {toPersianDigits(xpTotal)} امتیاز کل
          </div>
        </Card>

        <Card className="p-4" hover delay={0.1}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-fern" />
              <div className="text-[14px] font-bold text-ink">خلاصه هفته</div>
            </div>
            <button
              onClick={() => setView("week")}
              className="text-fern text-[11px] flex items-center gap-0.5 hover:gap-1.5 transition-all"
            >
              جزئیات
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <div className="text-[16px] font-bold text-fern">{formatHours(weekHours)}</div>
              <div className="text-[9px] text-inkSoft">ساعت</div>
            </div>
            <div className="text-center">
              <div className="text-[16px] font-bold text-gold">{toPersianDigits(weekTests)}</div>
              <div className="text-[9px] text-inkSoft">تست</div>
            </div>
            <div className="text-center">
              <div className="text-[16px] font-bold text-ember">{toPersianDigits(weekPct)}٪</div>
              <div className="text-[9px] text-inkSoft">تکمیل</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Day selector strip */}
      <div className="flex gap-1.5 overflow-x-auto pb-1.5 mb-4 -mx-1 px-1">
        {DAYS.map((d, i) => {
          const dHours = dayHoursSum(days[i]);
          const dPct = dayTaskPercent(days[i]);
          const active = i === currentDay;
          return (
            <button
              key={d}
              onClick={() => setCurrentDay(i)}
              className={`shrink-0 rounded-card px-3.5 py-2.5 min-w-[68px] text-center transition-all duration-300 ${
                active
                  ? "card-warm border-gold/30"
                  : "glass hover:bg-white/8"
              }`}
            >
              <div className={`text-[11.5px] font-bold mb-1 ${active ? "text-gold" : "text-ink"}`}>
                {d}
              </div>
              <div className="w-full h-1 rounded-pill bg-white/8 overflow-hidden">
                <div
                  className="h-full rounded-pill transition-all duration-500"
                  style={{
                    width: `${dPct}%`,
                    background: active ? "linear-gradient(90deg,#c9a15d,#e8b979)" : "linear-gradient(90deg,#6e9878,#8baf9e)",
                  }}
                />
              </div>
              <div className="text-[8.5px] text-inkDim mt-1">
                {dHours > 0 ? `${formatHours(dHours)}س` : "—"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Pending subjects */}
      {pendingSubjects.length > 0 && (
        <Card className="p-4 mb-4" delay={0.15}>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="w-4 h-4 text-gold" />
            <h3 className="text-[13.5px] font-bold">درس‌های باقی‌مانده امروز</h3>
          </div>
          <div className="space-y-2">
            {pendingSubjects.map((s, i) => (
              <motion.button
                key={s.idx}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                onClick={() => setView("day")}
                className="w-full flex items-center gap-3 rounded-card bg-white/4 hover:bg-white/8 px-3 py-2.5 transition-all duration-200 group"
              >
                <span className="text-lg">{s.icon}</span>
                <span className="flex-1 text-right text-[12.5px] text-ink group-hover:text-gold transition-colors">
                  {s.name}
                </span>
                {s.hours !== "" && Number(s.hours) > 0 && (
                  <Badge color="fern">{formatHours(Number(s.hours))}س</Badge>
                )}
                {s.tests !== "" && Number(s.tests) > 0 && (
                  <Badge color="gold">{toPersianDigits(Number(s.tests))} تست</Badge>
                )}
                <ChevronLeft className="w-4 h-4 text-inkDim group-hover:text-gold transition-colors" />
              </motion.button>
            ))}
          </div>
        </Card>
      )}

      {/* Completed subjects */}
      {completedSubjects.length > 0 && (
        <Card warm className="p-4 mb-4" delay={0.2}>
          <div className="flex items-center gap-2 mb-3">
            <FileCheck className="w-4 h-4 text-fern" />
            <h3 className="text-[13.5px] font-bold">درس‌های انجام‌شده امروز</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {completedSubjects.map((s, i) => (
              <motion.div
                key={s.idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.04, type: "spring", stiffness: 400 }}
                className="flex items-center gap-1.5 rounded-pill bg-fern/10 border border-fern/20 px-3 py-1.5"
              >
                <span className="text-sm">{s.icon}</span>
                <span className="text-[11.5px] text-fern">{s.name}</span>
                <FileCheck className="w-3 h-3 text-fern" />
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => setView("focus")}
          className="card-depth rounded-card p-4 text-right hover:shadow-cardHover transition-all duration-300 group"
        >
          <Target className="w-5 h-5 text-gold mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-[13px] font-bold text-ink">شروع تمرکز</div>
          <div className="text-[10.5px] text-inkSoft mt-0.5">تایمر پومودورو و محیط آرام</div>
        </button>
        <button
          onClick={() => setView("day")}
          className="card-depth rounded-card p-4 text-right hover:shadow-cardHover transition-all duration-300 group"
        >
          <CalendarDays className="w-5 h-5 text-fern mb-2 group-hover:scale-110 transition-transform" />
          <div className="text-[13px] font-bold text-ink">برنامه روز</div>
          <div className="text-[10.5px] text-inkSoft mt-0.5">ویرایش درس‌ها و اهداف</div>
        </button>
      </div>

      {!hasActivity && pendingSubjects.length === 0 && (
        <EmptyState
          title="امروز هنوز شروع نشده"
          message="اولین درس امروز را علامت بزن یا هدف امروز را تعیین کن."
          action={
            <button
              onClick={() => setView("day")}
              className="rounded-pill bg-gradient-to-br from-gold to-ember text-[#20180b] font-bold px-5 py-2.5 text-[12.5px]"
            >
              شروع برنامه امروز
            </button>
          }
        />
      )}
    </div>
  );
}


