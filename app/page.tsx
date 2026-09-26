"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePlannerStore } from "@/lib/store";
import Navigation from "@/components/Navigation";
import Dashboard from "@/components/Dashboard";
import DayView from "@/components/DayView";
import WeekView from "@/components/WeekView";
import ProgressView from "@/components/ProgressView";
import FocusMode from "@/components/FocusMode";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

export default function Home() {
  const view = usePlannerStore((s) => s.view);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    usePlannerStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  const showAmbient = view !== "focus";

  return (
    <>
      {showAmbient && <Scene3D />}
      <Navigation />
      <main className="max-w-[960px] mx-auto px-4 py-6 pb-20 md:pr-[88px] md:pb-8 min-h-screen">
        {!hydrated ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="text-4xl mb-3 animate-float">🌿</div>
              <p className="text-[12px] text-inkSoft">در حال بارگذاری...</p>
            </div>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {view === "dashboard" && <Dashboard />}
              {view === "day" && <DayView />}
              {view === "week" && <WeekView />}
              {view === "progress" && <ProgressView />}
              {view === "focus" && <FocusMode />}
            </motion.div>
          </AnimatePresence>
        )}

        {showAmbient && (
          <footer className="text-center text-inkSoft text-[10px] mt-8 opacity-60">
            داده‌ها روی همین مرورگر ذخیره می‌شن · ساخته‌شده با عشق 🌿
          </footer>
        )}
      </main>
    </>
  );
}
