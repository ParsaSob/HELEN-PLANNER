"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Clock, FileText, Target, StickyNote } from "lucide-react";
import { usePlannerStore } from "@/lib/store";
import { SUBJECT_ICONS, SUBJECT_ACCENTS, toPersianDigits } from "@/lib/constants";
import type { SubjectEntry } from "@/lib/types";
import { useRef } from "react";

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
  const accent = SUBJECT_ACCENTS[subjIdx];
  const icon = SUBJECT_ICONS[subjIdx];
  const noteRef = useRef<HTMLTextAreaElement>(null);

  const numValue = (v: string): number | "" => (v === "" ? "" : Number(v));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: subjIdx * 0.04, duration: 0.3 }}
      className={`rounded-card overflow-hidden transition-all duration-300 ${
        subject.done
          ? "card-warm border-fern/20"
          : "card-depth"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-3.5 pb-2">
        <button
          onClick={() => updateSubject(dayIdx, subjIdx, { done: !subject.done })}
          className={`shrink-0 w-7 h-7 rounded-card flex items-center justify-center transition-all duration-300 ${
            subject.done
              ? "bg-fern text-[#0c1712] scale-100"
              : "border-2 border-white/15 text-transparent hover:border-fern/50"
          }`}
          aria-label={subject.done ? "انجام‌شده" : "انجام نشده"}
        >
          <Check className="w-4 h-4" strokeWidth={3} />
        </button>
        <span className="text-lg">{icon}</span>
        <span
          className={`flex-1 text-[13px] font-bold transition-colors duration-300 ${
            subject.done ? "text-fern" : "text-ink"
          }`}
        >
          {name}
        </span>
        {subject.done && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-[10px] text-fern bg-fern/10 rounded-pill px-2 py-0.5"
          >
            انجام شد
          </motion.span>
        )}
      </div>

      {/* Inputs */}
      <div className="px-3.5 pb-3.5 space-y-2">
        <div className="grid grid-cols-4 max-[600px]:grid-cols-2 gap-2">
          <FieldInput
            icon={<Clock className="w-3 h-3" />}
            placeholder="ساعت"
            value={subject.hours}
            onChange={(v) => updateSubject(dayIdx, subjIdx, { hours: numValue(v) })}
            type="number"
            step={0.5}
            accent={accent}
          />
          <FieldInput
            icon={<FileText className="w-3 h-3" />}
            placeholder="تست"
            value={subject.tests}
            onChange={(v) => updateSubject(dayIdx, subjIdx, { tests: numValue(v) })}
            type="number"
            accent={accent}
          />
          <FieldInput
            icon={<Target className="w-3 h-3" />}
            placeholder="درصد"
            value={subject.percent}
            onChange={(v) => updateSubject(dayIdx, subjIdx, { percent: numValue(v) })}
            type="number"
            max={100}
            accent={accent}
          />
          <FieldInput
            icon={<Clock className="w-3 h-3" />}
            placeholder="تحلیل (دقیقه)"
            value={subject.analysisMinutes}
            onChange={(v) => updateSubject(dayIdx, subjIdx, { analysisMinutes: numValue(v) })}
            type="number"
            accent={accent}
          />
        </div>

        {/* Note */}
        <div className="relative">
          <StickyNote className="absolute right-2.5 top-2.5 w-3 h-3 text-inkDim pointer-events-none" />
          <textarea
            ref={noteRef}
            placeholder="توضیحات..."
            value={subject.note}
            onChange={(e) => updateSubject(dayIdx, subjIdx, { note: e.target.value })}
            rows={1}
            className="w-full bg-black/20 border border-white/8 rounded-card pr-8 pl-3 py-2 text-[11.5px] resize-none placeholder:text-inkDim focus:border-gold/30 transition-colors"
          />
        </div>

        {/* Progress bar for percent */}
        <AnimatePresence>
          {subject.percent !== "" && !Number.isNaN(Number(subject.percent)) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex justify-between text-[9px] text-inkSoft mb-1">
                <span>درصد</span>
                <span>{toPersianDigits(Number(subject.percent))}٪</span>
              </div>
              <div className="w-full h-1.5 rounded-pill bg-white/6 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Number(subject.percent))}%` }}
                  className="h-full rounded-pill"
                  style={{ background: `linear-gradient(90deg, ${accent}, #e8b979)` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function FieldInput({
  icon,
  placeholder,
  value,
  onChange,
  type,
  step,
  max,
  accent,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: number | "";
  onChange: (v: string) => void;
  type: string;
  step?: number;
  max?: number;
  accent: string;
}) {
  return (
    <div className="relative">
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-inkDim pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        step={step}
        min={0}
        max={max}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-black/20 border border-white/8 rounded-card pr-7 pl-2 py-2 text-[11px] placeholder:text-inkDim focus:border-gold/30 transition-colors text-left"
        style={{ direction: "ltr" }}
      />
      <div
        className="absolute bottom-0 right-0 h-0.5 rounded-bl-card transition-all duration-300"
        style={{ width: value !== "" ? "100%" : "0%", background: accent, opacity: 0.4 }}
      />
    </div>
  );
}
