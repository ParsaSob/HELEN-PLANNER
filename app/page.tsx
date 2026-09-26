"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePlannerStore } from "@/lib/store";
import DayView from "@/components/DayView";
import WeekView from "@/components/WeekView";

const Scene3D = dynamic(() => import("@/components/Scene3D"), { ssr: false });

export default function Home() {
  const [view, setView] = useState<"day" | "week">("day");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    usePlannerStore.persist.rehydrate();
    setHydrated(true);
  }, []);

  return (
    <>
      <Scene3D />
      <main className="max-w-[960px] mx-auto px-4 py-6 pb-14">
        <header className="flex items-start justify-between gap-3.5 flex-wrap mb-6">
          <div>
            <h1 className="text-[27px] font-black mb-1">پلنر هلن 🌿</h1>
            <p className="text-inkSoft text-[13.5px]">
              یک گوشه‌ی آرام برای درس خوندن، قدم به قدم تا کنکور تجربی
            </p>
          </div>
          <div className="flex gap-1.5 glass rounded-full p-1">
            <button
              onClick={() => setView("day")}
              className={`rounded-full px-4.5 py-2 text-[13.5px] ${
                view === "day" ? "bg-gradient-to-br from-gold to-ember text-[#20180b] font-bold" : "text-inkSoft"
              }`}
            >
              نمای روز
            </button>
            <button
              onClick={() => setView("week")}
              className={`rounded-full px-4.5 py-2 text-[13.5px] ${
                view === "week" ? "bg-gradient-to-br from-gold to-ember text-[#20180b] font-bold" : "text-inkSoft"
              }`}
            >
              نمای هفته
            </button>
          </div>
        </header>

        {!hydrated ? null : view === "day" ? <DayView /> : <WeekView />}

        <footer className="text-center text-inkSoft text-[10.5px] mt-6 opacity-70">
          داده‌ها فقط روی همین مرورگر ذخیره می‌شن · ساخته‌شده با عشق
        </footer>
      </main>
    </>
  );
}
