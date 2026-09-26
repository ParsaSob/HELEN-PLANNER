"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, CalendarDays, ChartBar as BarChart3, Target, TreePine } from "lucide-react";
import { usePlannerStore } from "@/lib/store";
import type { ViewKey } from "@/lib/types";
import { toPersianDigits } from "@/lib/constants";

const NAV_ITEMS: {
  key: ViewKey;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { key: "dashboard", label: "امروز", icon: LayoutDashboard },
  { key: "day", label: "برنامه روز", icon: CalendarDays },
  { key: "week", label: "برنامه هفته", icon: BarChart3 },
  { key: "progress", label: "پیشرفت", icon: TreePine },
  { key: "focus", label: "تمرکز", icon: Target },
];

export default function Navigation() {
  const view = usePlannerStore((s) => s.view);
  const setView = usePlannerStore((s) => s.setView);

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed right-0 top-0 h-full w-[72px] flex-col items-center py-6 z-50">
        <div className="glass-strong rounded-card flex flex-col items-center gap-1 p-2 shadow-card">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                aria-label={item.label}
                className="group relative w-12 h-12 rounded-card flex flex-col items-center justify-center transition-all duration-300"
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-card bg-gradient-to-br from-gold/20 to-fern/15 border border-gold/25"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative w-5 h-5 transition-colors duration-200 ${
                    active ? "text-gold" : "text-inkSoft group-hover:text-ink"
                  }`}
                />
                <span
                  className={`relative text-[8.5px] mt-0.5 transition-colors duration-200 ${
                    active ? "text-gold" : "text-inkDim group-hover:text-inkSoft"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 px-3 pb-3">
        <div className="glass-strong rounded-card flex items-center justify-around p-1.5 shadow-card">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                className="relative flex flex-col items-center justify-center w-12 h-12 rounded-card transition-all duration-200"
              >
                {active && (
                  <motion.div
                    layoutId="nav-active-mobile"
                    className="absolute inset-0 rounded-card bg-gradient-to-br from-gold/20 to-fern/15 border border-gold/25"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon
                  className={`relative w-[18px] h-[18px] transition-colors ${
                    active ? "text-gold" : "text-inkSoft"
                  }`}
                />
                <span
                  className={`relative text-[8px] mt-0.5 ${
                    active ? "text-gold" : "text-inkDim"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export function PageHeader({
  title,
  subtitle,
  accent = "gold",
}: {
  title: string;
  subtitle?: string;
  accent?: "gold" | "fern";
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-5"
    >
      <h1
        className={`text-[22px] font-black ${
          accent === "gold" ? "text-gradient-gold" : "text-gradient-fern"
        }`}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-[12.5px] text-inkSoft mt-1">{subtitle}</p>
      )}
    </motion.header>
  );
}

export function StatPill({
  label,
  value,
  icon,
  color = "gold",
}: {
  label: string;
  value: string | number;
  icon?: string;
  color?: "gold" | "fern" | "ember" | "river";
}) {
  const colors: Record<string, string> = {
    gold: "text-gold",
    fern: "text-fern",
    ember: "text-ember",
    river: "text-river",
  };
  return (
    <div className="flex items-center gap-2">
      {icon && <span className="text-sm">{icon}</span>}
      <div>
        <div className={`text-[15px] font-bold ${colors[color]}`}>
          {typeof value === "number" ? toPersianDigits(value) : value}
        </div>
        <div className="text-[9.5px] text-inkSoft">{label}</div>
      </div>
    </div>
  );
}
