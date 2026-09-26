"use client";

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
} from "recharts";
import { DAYS, SUBJECTS } from "@/lib/constants";
import { dayAnalysisMinutesSum, dayHoursSum, usePlannerStore } from "@/lib/store";

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
    تست: d.subjects.reduce((a, s) => a + (Number(s.tests) || 0), 0),
  }));

  const radarData = SUBJECTS.map((name, si) => {
    let sum = 0;
    let count = 0;
    days.forEach((d) => {
      const p = Number(d.subjects[si].percent);
      if (d.subjects[si].percent !== "" && !Number.isNaN(p)) {
        sum += p;
        count++;
      }
    });
    return { subject: name, درصد: count ? Math.round(sum / count) : 0 };
  });

  const totals = SUBJECTS.map((name, si) => {
    let h = 0;
    let t = 0;
    let am = 0;
    let psum = 0;
    let pc = 0;
    days.forEach((d) => {
      const s = d.subjects[si];
      h += Number(s.hours) || 0;
      t += Number(s.tests) || 0;
      am += Number(s.analysisMinutes) || 0;
      if (s.percent !== "" && !Number.isNaN(Number(s.percent))) {
        psum += Number(s.percent);
        pc++;
      }
    });
    return { name, h, t, am, avg: pc ? Math.round(psum / pc) : null };
  });

  const axisColor = "#A79C89";
  const gridColor = "rgba(233,224,204,0.12)";

  return (
    <div>
      <div className="glass rounded-organic p-5 mb-4">
        <h3 className="text-[14.5px] font-bold mb-3.5">ساعت مطالعه در طول هفته</h3>
        <div className="h-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hoursData}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={11} />
              <YAxis stroke={axisColor} fontSize={11} />
              <Tooltip contentStyle={{ background: "#16261C", border: "1px solid rgba(233,224,204,.2)" }} />
              <Bar dataKey="ساعت" fill="#6E9878" radius={[6, 6, 0, 0]} />
              <Bar dataKey="هدف" fill="rgba(201,161,93,.4)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="تحلیل (ساعت)" fill="#E8B979" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-organic p-5 mb-4">
        <h3 className="text-[14.5px] font-bold mb-3.5">توازن درصد بین درس‌ها</h3>
        <div className="h-[230px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="subject" stroke={axisColor} fontSize={10.5} />
              <Radar dataKey="درصد" stroke="#C9A15D" fill="#C9A15D" fillOpacity={0.28} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-organic p-5 mb-4">
        <h3 className="text-[14.5px] font-bold mb-3.5">تعداد تست روزانه</h3>
        <div className="h-[210px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={testsData}>
              <CartesianGrid stroke={gridColor} vertical={false} />
              <XAxis dataKey="name" stroke={axisColor} fontSize={11} />
              <YAxis stroke={axisColor} fontSize={11} />
              <Tooltip contentStyle={{ background: "#16261C", border: "1px solid rgba(233,224,204,.2)" }} />
              <Line type="monotone" dataKey="تست" stroke="#E8B979" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass rounded-organic p-5 mb-4">
        <h3 className="text-[14.5px] font-bold mb-3.5">جمع دروس در هفته</h3>
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr className="text-inkSoft text-[11px] font-normal">
              <th className="text-right pb-2 font-normal">درس</th>
              <th className="text-right pb-2 font-normal">ساعت</th>
              <th className="text-right pb-2 font-normal">تست</th>
              <th className="text-right pb-2 font-normal">دقیقه تحلیل</th>
              <th className="text-right pb-2 font-normal">میانگین درصد</th>
            </tr>
          </thead>
          <tbody>
            {totals.map((x) => (
              <tr key={x.name} className="border-t border-white/10">
                <td className="py-2">{x.name}</td>
                <td className="py-2">{x.h.toFixed(1)}</td>
                <td className="py-2">{x.t}</td>
                <td className="py-2">{x.am}</td>
                <td className="py-2">
                  <span className="mini-track">
                    <span className="mini-fill" style={{ width: `${x.avg || 0}%` }} />
                  </span>{" "}
                  {x.avg === null ? "—" : `${x.avg}٪`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={resetWeek}
        className="border border-white/10 text-inkSoft rounded-xl px-4 py-2 text-[11.5px]"
      >
        پاک کردن کل هفته
      </button>
    </div>
  );
}
