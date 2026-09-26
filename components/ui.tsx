"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  warm = false,
  hover = false,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  warm?: boolean;
  hover?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.34, 1.56, 0.64, 1] }}
      whileHover={
        hover
          ? { y: -3, transition: { duration: 0.2 } }
          : undefined
      }
      className={`${warm ? "card-warm" : "card-depth"} rounded-card ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({
  children,
  icon,
  subtitle,
}: {
  children: ReactNode;
  icon?: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        {icon && <span className="text-gold text-lg">{icon}</span>}
        <h3 className="text-[15px] font-bold text-ink">{children}</h3>
      </div>
      {subtitle && <p className="text-[11.5px] text-inkSoft mt-0.5">{subtitle}</p>}
    </div>
  );
}

export function ProgressBar({
  value,
  max = 100,
  color = "gold",
  height = 8,
  showLabel = false,
  label,
}: {
  value: number;
  max?: number;
  color?: "gold" | "fern" | "ember" | "river";
  height?: number;
  showLabel?: boolean;
  label?: string;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const colors: Record<string, string> = {
    gold: "linear-gradient(90deg, #c9a15d, #e8b979)",
    fern: "linear-gradient(90deg, #6e9878, #8baf9e)",
    ember: "linear-gradient(90deg, #e8b979, #f0cd97)",
    river: "linear-gradient(90deg, #5b8aa6, #7ba8c4)",
  };
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between text-[10.5px] text-inkSoft mb-1">
          <span>{label}</span>
          <span>{Math.round(pct)}٪</span>
        </div>
      )}
      <div
        className="w-full rounded-pill overflow-hidden bg-white/6"
        style={{ height }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
          className="h-full rounded-pill"
          style={{ background: colors[color] }}
        />
      </div>
    </div>
  );
}

export function Badge({
  children,
  color = "gold",
}: {
  children: ReactNode;
  color?: "gold" | "fern" | "ember" | "river" | "stone";
}) {
  const styles: Record<string, string> = {
    gold: "bg-gold/15 text-gold border-gold/20",
    fern: "bg-fern/15 text-fern border-fern/20",
    ember: "bg-ember/15 text-ember border-ember/20",
    river: "bg-river/15 text-river border-river/20",
    stone: "bg-stone/15 text-stone border-stone/20",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-pill border px-2.5 py-0.5 text-[10.5px] font-medium ${styles[color]}`}
    >
      {children}
    </span>
  );
}

export function IconButton({
  children,
  onClick,
  active = false,
  label,
}: {
  children: ReactNode;
  onClick?: () => void;
  active?: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`w-9 h-9 rounded-card flex items-center justify-center transition-all duration-200 ${
        active
          ? "bg-gold/15 text-gold border border-gold/25"
          : "text-inkSoft hover:text-ink hover:bg-white/5 border border-transparent"
      }`}
    >
      {children}
    </button>
  );
}

export function EmptyState({
  emoji = "🌿",
  title,
  message,
  action,
}: {
  emoji?: string;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center py-12 px-6"
    >
      <div className="text-5xl mb-4 opacity-50 animate-float">{emoji}</div>
      <h3 className="text-[15px] font-bold text-ink mb-1.5">{title}</h3>
      <p className="text-[12.5px] text-inkSoft max-w-[260px] leading-relaxed mb-4">
        {message}
      </p>
      {action}
    </motion.div>
  );
}
