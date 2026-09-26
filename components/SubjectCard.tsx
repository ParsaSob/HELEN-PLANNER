"use client";

import { usePlannerStore } from "@/lib/store";

export default function SubjectCard({
  dayIdx,
  subjIdx,
  name,
}: {
  dayIdx: number;
  subjIdx: number;
  name: string;
}) {
  const subject = usePlannerStore((s) => s.days[dayIdx].subjects[subjIdx]);
  const updateSubject = usePlannerStore((s) => s.updateSubject);

  return (
    <div className="glass rounded-organic2 p-4 mb-3">
      <label className="flex items-center gap-2 mb-3 cursor-pointer">
        <input
          type="checkbox"
          checked={subject.done}
          onChange={(e) => updateSubject(dayIdx, subjIdx, { done: e.target.checked })}
          className="w-[18px] h-[18px] accent-fern"
        />
        <b className="text-sm">{name}</b>
      </label>
      <div className="grid grid-cols-5 max-[600px]:grid-cols-2 gap-2 text-xs">
        <input
          type="number"
          step={0.5}
          min={0}
          placeholder="ساعت مطالعه"
          value={subject.hours}
          onChange={(e) =>
            updateSubject(dayIdx, subjIdx, { hours: e.target.value === "" ? "" : Number(e.target.value) })
          }
          className="bg-black/20 border border-white/10 rounded-lg px-2 py-2 placeholder:text-inkSoft"
        />
        <input
          type="number"
          min={0}
          placeholder="تعداد تست"
          value={subject.tests}
          onChange={(e) =>
            updateSubject(dayIdx, subjIdx, { tests: e.target.value === "" ? "" : Number(e.target.value) })
          }
          className="bg-black/20 border border-white/10 rounded-lg px-2 py-2 placeholder:text-inkSoft"
        />
        <input
          type="number"
          min={0}
          max={100}
          placeholder="درصد"
          value={subject.percent}
          onChange={(e) =>
            updateSubject(dayIdx, subjIdx, { percent: e.target.value === "" ? "" : Number(e.target.value) })
          }
          className="bg-black/20 border border-white/10 rounded-lg px-2 py-2 placeholder:text-inkSoft"
        />
        <input
          type="number"
          min={0}
          placeholder="زمان تحلیل (دقیقه)"
          value={subject.analysisMinutes}
          onChange={(e) =>
            updateSubject(dayIdx, subjIdx, {
              analysisMinutes: e.target.value === "" ? "" : Number(e.target.value),
            })
          }
          className="col-span-2 max-[600px]:col-span-2 bg-black/20 border border-white/10 rounded-lg px-2 py-2 placeholder:text-inkSoft"
        />
        <input
          type="text"
          placeholder="توضیحات"
          value={subject.note}
          onChange={(e) => updateSubject(dayIdx, subjIdx, { note: e.target.value })}
          className="col-span-5 max-[600px]:col-span-2 bg-black/20 border border-white/10 rounded-lg px-2 py-2 placeholder:text-inkSoft"
        />
      </div>
    </div>
  );
}
