"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  Flame,
  Star,
  Trophy,
  Calendar,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { DAYS, SUBJECTS, SUBJECT_ICONS, toPersianDigits, formatHours } from "@/lib/constants";
import {
  usePlannerStore,
  dayXP,
  totalXP,
  growthStage,
  weekHoursTotal,
  weekTestsTotal,
  weekAnalysisTotal,
  avgDailyHours,
  avgPercent,
  bestDayIndex,
  worstDayIndex,
  dayHoursSum,
  dayTestsSum,
  subjectTotalHours,
  subjectAvgPercent,
} from "@/lib/store";
import { Card, Badge, ProgressBar } from "./ui";
import { PageHeader } from "./Navigation";

const StudyTree3D = dynamic(() => import("./StudyTree3D"), { ssr: false });

export default function ProgressView() {
  const days = usePlannerStore((s) => s.days);
  const sessions = usePlannerStore((s) => s.focusSessions);

  const xpTotal = totalXP(days, sessions);
  const { stage, next, progress } = growthStage(xpTotal);
  const weekHours = weekHoursTotal(days);
  const weekTests = weekTestsTotal(days);
  const weekAnalysis = weekAnalysisTotal(days);
  const avgHours = avgDailyHours(days);
  const avgPct = avgPercent(days);
  const bestIdx = bestDayIndex(days);
  const worstIdx = worstDayIndex(days);
  const focusMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  const xpData = days.map((d, i) => ({
    name: DAYS[i],
    امتیاز: dayXP(d),
  }));

  const maxXP = Math.max(...xpData.map((d) => d.امتیاز), 1);

  const subjectData = SUBJECTS.map((name, si) => ({
    name,
    icon: SUBJECT_ICONS[si],
    hours: subjectTotalHours(days, si),
    avg: subjectAvgPercent(days, si),
  })).sort((a, b) => b.hours - a.hours);

  const axisColor = "#A79C89";
  const gridColor = "rgba(233,224,204,0.1)";
  const tooltipStyle = {
    background: "#13201A",
    border: "1px solid rgba(233,224,204,.15)",
    borderRadius: "12px",
    fontSize: "11px",
    color: "#ECE6D8",
  };

  return (
    <div>
      <PageHeader title="پیشرفت" subtitle="مسیر رشد تو از بذر تا بلوط" accent="fern" />

      {/* Study Tree 3D */}
      <Card warm className="p-5 mb-4 overflow-hidden relative" delay={0.05}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative flex flex-col items-center">
          <div className="w-full h-[240px] flex items-center justify-center">
            <StudyTree3D growthProgress={progress} stageKey={stage.key} />
          </div>
          <div className="text-center mt-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-2xl">{stage.emoji}</span>
              <span className="text-[16px] font-bold text-gradient-gold">{stage.label}</span>
            </div>
            <p className="text-[11px] text-inkSoft">
              {next
                ? `${toPersianDigits(xpTotal)} امتیاز تا ${next.label} · ${toPersianDigits(Math.round(progress))}٪`
                : `حداکثر سطح رسیدی! ${toPersianDigits(xpTotal)} امتیاز`}
            </p>
          </div>
          <div className="w-full mt-3">
            <ProgressBar value={progress} color="gold" height={8} />
          </div>
        </div>
      </Card>

      {/* Key stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-4">
        <StatCard icon={<Clock className="w-4 h-4" />} label="مجموع ساعت" value={formatHours(weekHours)} color="fern" delay={0.1} />
        <StatCard icon={<Target className="w-4 h-4" />} label="میانگین روزانه" value={`${formatHours(avgHours)}س`} color="gold" delay={0.12} />
        <StatCard icon={<Star className="w-4 h-4" />} label="مجموع تست" value={toPersianDigits(weekTests)} color="ember" delay={0.14} />
        <StatCard icon={<TrendingUp className="w-4 h-4" />} label="میانگین درصد" value={avgPct !== null ? `${toPersianDigits(avgPct)}٪` : "—"} color="gold" delay={0.16} />
      </div>

      {/* XP bar chart */}
      <Card className="p-5 mb-3" delay={0.2}>
        <div className="flex items-center gap-2 mb-3.5">
          <Flame className="w-4 h-4 text-ember" />
          <h3 className="text-[14px] font-bold">امتیاز روزانه (XP)</h3>
        </div>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={xpData}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke={axisColor} fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="امتیاز" radius={[6, 6, 0, 0]} maxBarSize={32}>
                {xpData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={i === bestIdx ? "#E8B979" : i === worstIdx ? "rgba(167,156,137,0.4)" : "#6E9878"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-between text-[10px] text-inkSoft mt-2">
          <span>بهترین: {DAYS[bestIdx]}</span>
          <span>نیاز به تلاش: {DAYS[worstIdx]}</span>
        </div>
      </Card>

      {/* Best/worst day + focus time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <Card warm className="p-4" hover delay={0.25}>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-gold" />
            <span className="text-[12px] font-bold">بهترین روز</span>
          </div>
          <div className="text-[20px] font-bold text-gradient-gold">{DAYS[bestIdx]}</div>
          <div className="text-[10px] text-inkSoft mt-1">
            {formatHours(dayHoursSum(days[bestIdx]))} ساعت · {toPersianDigits(dayTestsSum(days[bestIdx]))} تست
          </div>
        </Card>

        <Card className="p-4" hover delay={0.3}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-stone" />
            <span className="text-[12px] font-bold">روز ضعیف</span>
          </div>
          <div className="text-[20px] font-bold text-stone">{DAYS[worstIdx]}</div>
          <div className="text-[10px] text-inkSoft mt-1">
            {formatHours(dayHoursSum(days[worstIdx]))} ساعت · {toPersianDigits(dayTestsSum(days[worstIdx]))} تست
          </div>
        </Card>

        <Card className="p-4" hover delay={0.35}>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-fern" />
            <span className="text-[12px] font-bold">زمان تمرکز</span>
          </div>
          <div className="text-[20px] font-bold text-fern">{toPersianDigits(focusMinutes)}</div>
          <div className="text-[10px] text-inkSoft mt-1">دقیقه در جلسات تمرکز</div>
        </Card>
      </div>

      {/* Subject ranking */}
      <Card className="p-5 mb-3" delay={0.4}>
        <div className="flex items-center gap-2 mb-3.5">
          <Award className="w-4 h-4 text-gold" />
          <h3 className="text-[14px] font-bold">رتبه‌بندی درس‌ها بر اساس ساعت</h3>
        </div>
        <div className="space-y-2">
          {subjectData.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.04 }}
              className="flex items-center gap-3"
            >
              <span className="text-[10px] text-inkDim w-4 text-center">{toPersianDigits(i + 1)}</span>
              <span className="text-sm">{s.icon}</span>
              <span className="text-[11.5px] text-ink w-16 shrink-0">{s.name}</span>
              <div className="flex-1">
                <ProgressBar value={s.hours} max={subjectData[0].hours || 1} color="fern" height={6} />
              </div>
              <span className="text-[10px] text-fern w-10 text-left">{formatHours(s.hours)}س</span>
              {s.avg !== null && (
                <Badge color="gold">{toPersianDigits(s.avg)}٪</Badge>
              )}
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Analysis time */}
      <Card className="p-5" delay={0.5}>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-ember" />
          <h3 className="text-[14px] font-bold">زمان تحلیل</h3>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-[18px] font-bold text-ember">{toPersianDigits(weekAnalysis)}</div>
            <div className="text-[9px] text-inkSoft">دقیقه کل</div>
          </div>
          <div>
            <div className="text-[18px] font-bold text-gold">{formatHours(weekAnalysis / 60)}</div>
            <div className="text-[9px] text-inkSoft">ساعت کل</div>
          </div>
          <div>
            <div className="text-[18px] font-bold text-fern">{toPersianDigits(sessions.length)}</div>
            <div className="text-[9px] text-inkSoft">جلسه تمرکز</div>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "gold" | "fern" | "ember";
  delay: number;
}) {
  const colors = {
    gold: "text-gold",
    fern: "text-fern",
    ember: "text-ember",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="p-3.5" hover delay={delay}>
        <div className={`mb-1.5 ${colors[color]}`}>{icon}</div>
        <div className={`text-[17px] font-bold ${colors[color]}`}>{value}</div>
        <div className="text-[9.5px] text-inkSoft">{label}</div>
      </Card>
    </motion.div>
  );
}
