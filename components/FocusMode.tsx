"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  Square,
  ChevronLeft,
  Target,
  Clock,
  Check,
  Volume2,
  VolumeX,
} from "lucide-react";
import dynamic from "next/dynamic";
import { usePlannerStore } from "@/lib/store";
import { SUBJECTS, SUBJECT_ICONS, POMODORO_PRESETS, toPersianDigits } from "@/lib/constants";
import type { FocusStatus } from "@/lib/types";
import { Card, Badge, ProgressBar } from "./ui";
import { PageHeader } from "./Navigation";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

export default function FocusMode() {
  const setView = usePlannerStore((s) => s.setView);
  const addFocusSession = usePlannerStore((s) => s.addFocusSession);

  const [status, setStatus] = useState<FocusStatus>("idle");
  const [duration, setDuration] = useState(25);
  const [remaining, setRemaining] = useState(25 * 60);
  const [subjectIdx, setSubjectIdx] = useState(0);
  const [goal, setGoal] = useState("");
  const [testsCompleted, setTestsCompleted] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) {
            clearInterval(intervalRef.current!);
            setStatus("completed");
            return 0;
          }
          return r - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [status]);

  const start = () => {
    if (status === "paused") {
      setStatus("running");
    } else {
      setRemaining(duration * 60);
      setStatus("running");
      setSessionSaved(false);
    }
  };

  const pause = () => setStatus("paused");

  const stop = () => {
    setStatus("idle");
    setRemaining(duration * 60);
  };

  const saveSession = () => {
    addFocusSession({
      id: `${Date.now()}`,
      subjectIdx,
      durationMinutes: duration,
      goal,
      testsCompleted,
      completed: true,
      startedAt: Date.now(),
    });
    setSessionSaved(true);
    setTimeout(() => {
      setStatus("idle");
      setRemaining(duration * 60);
      setGoal("");
      setTestsCompleted(0);
      setSessionSaved(false);
    }, 1500);
  };

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const progress = ((duration * 60 - remaining) / (duration * 60)) * 100;

  const isActive = status === "running" || status === "paused" || status === "completed";

  return (
    <div className="relative">
      {/* Ambient background when active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 -z-10"
          >
            <Scene3D />
          </motion.div>
        )}
      </AnimatePresence>

      <PageHeader title="تمرکز" subtitle="یک جلسه‌ی آرام مطالعه را شروع کن" accent="fern" />

      {/* Setup state */}
      {!isActive && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="p-5 mb-3" delay={0.05}>
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-gold" />
              <h3 className="text-[13.5px] font-bold">مدت زمان</h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {POMODORO_PRESETS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => {
                    setDuration(p.value);
                    setRemaining(p.value * 60);
                  }}
                  className={`rounded-card py-3 text-center transition-all duration-200 ${
                    duration === p.value
                      ? "card-warm border-gold/30 text-gold"
                      : "glass text-inkSoft hover:text-ink"
                  }`}
                >
                  <div className="text-[14px] font-bold">{p.label}</div>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5 mb-3" delay={0.1}>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-fern" />
              <h3 className="text-[13.5px] font-bold">درس مورد نظر</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {SUBJECTS.map((name, i) => (
                <button
                  key={name}
                  onClick={() => setSubjectIdx(i)}
                  className={`flex items-center gap-2 rounded-card px-3 py-2.5 text-right transition-all duration-200 ${
                    subjectIdx === i
                      ? "card-warm border-gold/30"
                      : "glass hover:bg-white/8"
                  }`}
                >
                  <span className="text-sm">{SUBJECT_ICONS[i]}</span>
                  <span className={`text-[11px] ${subjectIdx === i ? "text-gold" : "text-inkSoft"}`}>
                    {name}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5 mb-4" delay={0.15}>
            <label className="text-[10.5px] text-inkSoft mb-1.5 block">هدف این جلسه</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="مثلاً: ۳۰ تست زیست‌شناسی فصل ۵"
              className="w-full border border-white/10 bg-black/20 rounded-card px-3.5 py-2.5 text-[13px] placeholder:text-inkDim focus:border-gold/30 transition-colors"
            />
          </Card>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={start}
            className="w-full rounded-card bg-gradient-to-br from-fern to-sage text-[#0c1712] font-bold py-3.5 text-[14px] flex items-center justify-center gap-2 shadow-glowFern"
          >
            <Play className="w-5 h-5" fill="currentColor" />
            شروع جلسه تمرکز
          </motion.button>
        </motion.div>
      )}

      {/* Active session */}
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            {/* Subject + goal */}
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">{SUBJECT_ICONS[subjectIdx]}</div>
              <div className="text-[15px] font-bold text-ink mb-1">{SUBJECTS[subjectIdx]}</div>
              {goal && <p className="text-[12px] text-inkSoft max-w-[280px]">{goal}</p>}
            </div>

            {/* Timer circle */}
            <div className="relative w-[220px] h-[220px] mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="6"
                />
                <motion.circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="url(#timerGradient)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 90}
                  animate={{ strokeDashoffset: 2 * Math.PI * 90 * (1 - progress / 100) }}
                  transition={{ duration: 0.5, ease: "linear" }}
                />
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6E9878" />
                    <stop offset="100%" stopColor="#C9A15D" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {status === "completed" ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="flex flex-col items-center"
                  >
                    <Check className="w-10 h-10 text-fern mb-1" strokeWidth={3} />
                    <span className="text-[13px] text-fern font-bold">آفرین!</span>
                  </motion.div>
                ) : (
                  <>
                    <div className="text-[40px] font-black text-ink tabular-nums" style={{ direction: "ltr" }}>
                      {toPersianDigits(String(mins).padStart(2, "0"))}:{toPersianDigits(String(secs).padStart(2, "0"))}
                    </div>
                    <div className="text-[10px] text-inkSoft mt-1">
                      {status === "paused" ? "متوقف شد" : "در حال تمرکز"}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Controls */}
            {status !== "completed" ? (
              <div className="flex items-center gap-3 mb-4">
                {status === "running" ? (
                  <button
                    onClick={pause}
                    className="w-14 h-14 rounded-card glass-strong flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Pause className="w-6 h-6 text-gold" fill="currentColor" />
                  </button>
                ) : (
                  <button
                    onClick={start}
                    className="w-14 h-14 rounded-card glass-strong flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    <Play className="w-6 h-6 text-fern" fill="currentColor" />
                  </button>
                )}
                <button
                  onClick={stop}
                  className="w-14 h-14 rounded-card glass-strong flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Square className="w-5 h-5 text-ember" fill="currentColor" />
                </button>
                <button
                  onClick={() => setSoundOn(!soundOn)}
                  className="w-14 h-14 rounded-card glass-strong flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {soundOn ? <Volume2 className="w-5 h-5 text-inkSoft" /> : <VolumeX className="w-5 h-5 text-inkDim" />}
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[320px] space-y-3"
              >
                <Card warm className="p-4">
                  <label className="text-[10.5px] text-inkSoft mb-1.5 block">تعداد تست‌های انجام‌شده</label>
                  <input
                    type="number"
                    min={0}
                    value={testsCompleted || ""}
                    onChange={(e) => setTestsCompleted(e.target.value === "" ? 0 : Number(e.target.value))}
                    placeholder="0"
                    className="w-full border border-white/10 bg-black/20 rounded-card px-3 py-2.5 text-[13px] placeholder:text-inkDim focus:border-gold/30"
                    style={{ direction: "ltr" }}
                  />
                </Card>

                {sessionSaved ? (
                  <div className="flex items-center justify-center gap-2 text-fern text-[13px] font-bold py-3">
                    <Check className="w-5 h-5" strokeWidth={3} />
                    جلسه ذخیره شد!
                  </div>
                ) : (
                  <button
                    onClick={saveSession}
                    className="w-full rounded-card bg-gradient-to-br from-fern to-sage text-[#0c1712] font-bold py-3 text-[13px] flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" strokeWidth={3} />
                    ذخیره جلسه
                  </button>
                )}
              </motion.div>
            )}

            {/* Progress bar */}
            {status !== "completed" && (
              <div className="w-full max-w-[300px]">
                <ProgressBar value={progress} color="fern" height={4} />
              </div>
            )}

            {/* Hint */}
            {status === "running" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="text-[10.5px] text-inkSoft mt-4 text-center max-w-[260px] leading-relaxed"
              >
                نفس عمیق بکش و تمرکزت را روی درس بگذار. اینجا فقط تو و درس‌ت هستید.
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back button when active */}
      {isActive && status !== "completed" && (
        <button
          onClick={() => setView("dashboard")}
          className="fixed top-4 right-4 md:right-[84px] z-40 glass-strong rounded-card px-3 py-2 text-[11px] text-inkSoft flex items-center gap-1 hover:text-ink transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          بازگشت
        </button>
      )}
    </div>
  );
}
