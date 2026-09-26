"use client";

import { motion } from "framer-motion";
import { RotateCcw, TrendingUp, Award, ChartBar as BarChart3 } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { DAYS, SUBJECTS, SUBJECT_ICONS, SUBJECT_ACCENTS, toPersianDigits, formatHours } from "@/lib/constants";
import {
  dayAnalysisMinutesSum,
  dayHoursSum,
  dayTestsSum,
  dayTaskPercent,
  usePlannerStore,
  weekHoursTotal,
  weekTestsTotal,
  weekDoneTasks,
  weekTotalTasks,
  weekCompletionPercent,
  subjectAvgPercent,
  subjectTotalHours,
  subjectTotalTests,
  subjectTotalAnalysis,
} from "@/lib/store";
import { Card, Badge, ProgressBar } from "./ui";
import { PageHeader } from "./Navigation";

export default function WeekView() {
  const days = usePlannerStore((s) => s.days);
  const resetWeek = usePlannerStore((s) => s.resetWeek);

  const hoursData = days.map((d, i) => ({
    name: DAYS[i],
    ساعت: Number(dayHoursSum(d).toFixed(1)),
    هدف: Number(d.hourGoal) || 0,
    "تحلیل (ساعت)": Number((dayAnalysisMinutesSum(d) / 60).toFixed(1)),
  }));

  const testsData = days.map((d, i) => ({
    name: DAYS[i],
    تست: dayTestsSum(d),
  }));

  const radarData = SUBJECTS.map((name, si) => ({
    subject: name,
    درصد: subjectAvgPercent(days, si) ?? 0,
  }));

  const totals = SUBJECTS.map((name, si) => ({
    name,
    icon: SUBJECT_ICONS[si],
    accent: SUBJECT_ACCENTS[si],
    h: subjectTotalHours(days, si),
    t: subjectTotalTests(days, si),
    am: subjectTotalAnalysis(days, si),
    avg: subjectAvgPercent(days, si),
  }));

  const weekHours = weekHoursTotal(days);
  const weekTests = weekTestsTotal(days);
  const weekDone = weekDoneTasks(days);
  const weekPct = weekCompletionPercent(days);

  const axisColor = "#A79C89";
  const gridColor = "rgba(233,224,204,0.1)";
  const tooltipStyle = {
    background: "#13201A",
    border: "1px solid rgba(233,224,204,.15)",
    borderRadius: "12px",
    fontSize: "11px",
    color: "#ECE6D8",
  };

  const maxDayHours = Math.max(...hoursData.map((d) => d.ساعت), 1);

  return (
    <div>
      <PageHeader title="برنامه هفته" subtitle="مقایسه و تحلیل هفتگی پیشرفت" accent="fern" />

      {/* Week summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
        {[
          { label: "مجموع ساعت", value: formatHours(weekHours), icon: "⏱", color: "fern" as const },
          { label: "مجموع تست", value: toPersianDigits(weekTests), icon: "✍", color: "gold" as const },
          { label: "درس‌های انجام‌شده", value: `${toPersianDigits(weekDone)}/${toPersianDigits(weekTotalTasks())}`, icon: "✓", color: "ember" as const },
          { label: "درصد تکمیل", value: `${toPersianDigits(weekPct)}٪`, icon: "📊", color: "gold" as const },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-3 text-center" hover delay={i * 0.05}>
              <div className="text-lg mb-1">{stat.icon}</div>
              <div className={`text-[16px] font-bold ${
                stat.color === "gold" ? "text-gold" :
                stat.color === "fern" ? "text-fern" : "text-ember"
              }`}>
                {stat.value}
              </div>
              <div className="text-[9px] text-inkSoft">{stat.label}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Hours bar chart */}
      <Card className="p-5 mb-3" delay={0.1}>
        <div className="flex items-center gap-2 mb-3.5">
          <BarChart3 className="w-4 h-4 text-fern" />
          <h3 className="text-[14px] font-bold">ساعت مطالعه در طول هفته</h3>
        </div>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hoursData} barGap={4}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="ساعت" radius={[6, 6, 0, 0]} maxBarSize={28}>
                {hoursData.map((entry, i) => (
                  <Cell key={i} fill={entry.ساعت >= entry.هدف ? "#6E9878" : "rgba(110,152,120,0.5)"} />
                ))}
              </Bar>
              <Bar dataKey="هدف" fill="rgba(201,161,93,.3)" radius={[6, 6, 0, 0]} maxBarSize={28} />
              <Bar dataKey="تحلیل (ساعت)" fill="#E8B979" radius={[6, 6, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Radar + Tests line side by side on desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <Card className="p-5" delay={0.15}>
          <div className="flex items-center gap-2 mb-3.5">
            <TrendingUp className="w-4 h-4 text-gold" />
            <h3 className="text-[14px] font-bold">توازن درصد بین درس‌ها</h3>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke={gridColor} />
                <PolarAngleAxis dataKey="subject" stroke={axisColor} fontSize={9} tick={{ fill: axisColor }} />
                <Radar dataKey="درصد" stroke="#C9A15D" fill="#C9A15D" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5" delay={0.2}>
          <div className="flex items-center gap-2 mb-3.5">
            <Award className="w-4 h-4 text-ember" />
            <h3 className="text-[14px] font-bold">تعداد تست روزانه</h3>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={testsData}>
                <CartesianGrid stroke={gridColor} vertical={false} />
                <XAxis dataKey="name" stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(255,255,255,0.1)" }} />
                <Line
                  type="monotone"
                  dataKey="تست"
                  stroke="#E8B979"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: "#E8B979" }}
                  activeDot={{ r: 5, fill: "#C9A15D" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Day-by-day completion heatmap */}
      <Card className="p-5 mb-3" delay={0.25}>
        <h3 className="text-[14px] font-bold mb-3.5">نقشه‌ی تکمیل هفته</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d, i) => {
            const pct = dayTaskPercent(d);
            const hours = dayHoursSum(d);
            const intensity = Math.min(1, pct / 100);
            return (
              <div key={i} className="text-center">
                <div className="text-[9px] text-inkSoft mb-1">{DAYS[i]}</div>
                <div
                  className="aspect-square rounded-card flex flex-col items-center justify-center transition-all duration-500 hover:scale-105 cursor-default"
                  style={{
                    background: `rgba(110,152,120,${0.08 + intensity * 0.35})`,
                    border: `1px solid rgba(110,152,120,${0.1 + intensity * 0.2})`,
                  }}
                >
                  <div className="text-[11px] font-bold text-ink">{toPersianDigits(pct)}٪</div>
                  <div className="text-[8px] text-inkSoft">{formatHours(hours)}س</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Subject totals table */}
      <Card className="p-5 mb-3" delay={0.3}>
        <h3 className="text-[14px] font-bold mb-3.5">جمع دروس در هفته</h3>
        <div className="space-y-1">
          {/* Header */}
          <div className="grid grid-cols-12 gap-2 text-[9.5px] text-inkSoft pb-2 border-b border-white/8">
            <div className="col-span-3 text-right">درس</div>
            <div className="col-span-2 text-center">ساعت</div>
            <div className="col-span-2 text-center">تست</div>
            <div className="col-span-2 text-center">تحلیل</div>
            <div className="col-span-3 text-center">میانگین درصد</div>
          </div>
          {totals.map((x, i) => (
            <motion.div
              key={x.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.03 }}
              className="grid grid-cols-12 gap-2 items-center py-2 border-b border-white/4 last:border-0"
            >
              <div className="col-span-3 flex items-center gap-1.5 text-right">
                <span>{x.icon}</span>
                <span className="text-[11.5px] text-ink">{x.name}</span>
              </div>
              <div className="col-span-2 text-center text-[11px] text-fern">{formatHours(x.h)}</div>
              <div className="col-span-2 text-center text-[11px] text-gold">{toPersianDigits(x.t)}</div>
              <div className="col-span-2 text-center text-[11px] text-ember">{toPersianDigits(x.am)}</div>
              <div className="col-span-3 flex items-center gap-1.5 justify-center">
                <div className="flex-1 max-w-[60px]">
                  <ProgressBar value={x.avg ?? 0} color="gold" height={5} />
                </div>
                <span className="text-[10px] text-inkSoft w-7 text-left">
                  {x.avg === null ? "—" : `${toPersianDigits(x.avg)}٪`}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Reset */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={resetWeek}
        className="flex items-center gap-2 border border-white/10 text-inkSoft rounded-card px-4 py-2.5 text-[11.5px] hover:border-ember/30 hover:text-ember transition-all"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        پاک کردن کل هفته
      </motion.button>
    </div>
  );
}
