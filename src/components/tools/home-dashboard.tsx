"use client";

import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { toolCategories } from "@/lib/tools-config";
import { useAppStore } from "@/lib/store";
import { getJalaliToday, jalaliToGregorian, jalaliMonthNames, toPersianDigits } from "@/lib/jalali";

function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon className={className} /> : null;
}

const categoryMeta: Record<string, { gradient: string; icon: string; accent: string }> = {
  calc:     { gradient: "from-blue-500 to-indigo-600",    icon: "Calculator",      accent: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  conv:     { gradient: "from-emerald-500 to-teal-600",   icon: "ArrowRightLeft",   accent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  text:     { gradient: "from-amber-500 to-orange-600",   icon: "Type",            accent: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  dev:      { gradient: "from-violet-500 to-purple-600",   icon: "Code",            accent: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  css:      { gradient: "from-pink-500 to-rose-600",      icon: "Paintbrush",      accent: "bg-pink-500/10 text-pink-400 border-pink-500/20" },
  util:     { gradient: "from-cyan-500 to-sky-600",       icon: "Wrench",          accent: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  network:  { gradient: "from-green-500 to-lime-600",     icon: "Globe",           accent: "bg-green-500/10 text-green-400 border-green-500/20" },
  weather:  { gradient: "from-sky-400 to-blue-600",       icon: "CloudSun",        accent: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  datetime: { gradient: "from-yellow-500 to-amber-600",   icon: "Clock",           accent: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
  encrypt:  { gradient: "from-red-500 to-orange-600",     icon: "Shield",          accent: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function SecondsRing({ seconds }: { seconds: number }) {
  const pct = (seconds / 60) * 100;
  const r = 54;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r={r} fill="none" stroke="var(--border)" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
      <circle
        cx="60" cy="60" r={r} fill="none"
        stroke="url(#secGrad)" strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={offset}
        className="transition-all duration-1000 ease-linear"
      />
      <defs>
        <linearGradient id="secGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--gradient-start)" />
          <stop offset="100%" stopColor="var(--gradient-end)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function HomeDashboard() {
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const { setActiveTool, setActiveCategory, activeCategory, theme, toggleTheme } = useAppStore();

  const nonHomeCategories = toolCategories.filter((c) => c.id !== "home");
  const allTools = toolCategories.flatMap((cat) => cat.tools);

  useEffect(() => {
    setMounted(true);
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const timeStr = mounted ? now.toLocaleString("fa-IR", { timeZone: "Asia/Tehran", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }) : "";
  const weekday = mounted ? now.toLocaleString("fa-IR", { timeZone: "Asia/Tehran", weekday: "long" }) : "";
  const parts = timeStr.split(":");
  const hours = parts[0] || "--";
  const minutes = parts[1] || "--";
  const seconds = parts[2] || "00";
  const secNum = mounted ? (parseInt(seconds) || 0) : 0;

  const jToday = getJalaliToday();
  const gToday = jalaliToGregorian(jToday[0], jToday[1], jToday[2]);
  const gregorianMonth = mounted ? now.toLocaleString("en-US", { timeZone: "Asia/Tehran", month: "long" }) : "";
  const gregorianDay = mounted ? now.toLocaleString("en-US", { timeZone: "Asia/Tehran", day: "numeric" }) : "";
  const gregorianYear = mounted ? now.toLocaleString("en-US", { timeZone: "Asia/Tehran", year: "numeric" }) : "";

  const featuredTools = [
    { id: "date-converter", icon: "CalendarDays", label: "تبدیل تاریخ" },
    { id: "password-generator", icon: "KeyRound", label: "رمز عبور" },
    { id: "color-converter", icon: "Palette", label: "تبدیل رنگ" },
    { id: "speed-test", icon: "Gauge", label: "تست سرعت" },
    { id: "word-counter", icon: "Hash", label: "شمارنده" },
    { id: "hash-generator", icon: "Fingerprint", label: "هش مولد" },
  ];

  return (
    <div className="space-y-5">
      {/* ===== HERO: Clock + Dates ===== */}
      <div className="animate-fade-in-up">
        <div className="glass-card glow-effect overflow-hidden relative">
          {/* Background mesh gradient */}
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-56 h-56 rounded-full bg-gradient-to-tr from-sky-500/20 to-cyan-500/10 blur-3xl" />
          </div>

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Clock Ring */}
              <div className="relative w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] shrink-0">
                <SecondsRing seconds={secNum} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-extralight text-foreground tracking-tight" style={{ fontFamily: "'SF Pro Display', 'Vazirmatn', system-ui, sans-serif" }}>
                    {hours}<span className="animate-blink text-foreground/30">:</span>{minutes}
                  </span>
                  <span className="text-[11px] text-muted-foreground/60 mt-0.5 tabular-nums tracking-wider">
                    {seconds} <span className="text-[9px]">ثانیه</span>
                  </span>
                </div>
              </div>

              {/* Big Time Display + Weekday */}
              <div className="flex-1 text-center lg:text-right">
                <div className="flex items-center justify-center lg:justify-end gap-1 select-none" style={{ fontFamily: "'SF Pro Display', 'Vazirmatn', system-ui, sans-serif" }}>
                  <span className="text-5xl sm:text-6xl md:text-7xl font-extralight text-foreground leading-none tracking-tighter">
                    {hours}
                  </span>
                  <span className="text-5xl sm:text-6xl md:text-7xl font-extralight text-foreground/20 leading-none animate-blink">:</span>
                  <span className="text-5xl sm:text-6xl md:text-7xl font-extralight text-foreground leading-none tracking-tighter">
                    {minutes}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{weekday}</p>
              </div>
            </div>

            {/* Divider */}
            <div className="my-5 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {/* Dual Date Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Shamsi */}
              <div className="flex items-center gap-3 rounded-xl bg-primary/[0.06] border border-primary/10 p-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
                  <LucideIcons.Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-primary/70 uppercase tracking-wider mb-0.5">شمسی — جلالی</p>
                  <p className="text-sm font-bold text-foreground">
                    {toPersianDigits(jToday[2])} {jalaliMonthNames[jToday[1] - 1]} {toPersianDigits(jToday[0])}
                  </p>
                </div>
              </div>
              {/* Gregorian */}
              <div className="flex items-center gap-3 rounded-xl bg-secondary/60 border border-border/40 p-3.5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                  <LucideIcons.CalendarDays className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider mb-0.5">Gregorian — میلادی</p>
                  <p className="text-sm font-bold text-foreground ltr" dir="ltr">
                    {gregorianDay} {gregorianMonth} {gregorianYear}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Stats Row ===== */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up stagger-1">
        {[
          { label: "ابزار فعال", value: toPersianDigits(String(allTools.length)), icon: "Layers", color: "text-blue-400" },
          { label: "دسته‌بندی", value: toPersianDigits(String(nonHomeCategories.length)), icon: "Grid3X3", color: "text-emerald-400" },
          { label: "نسخه", value: toPersianDigits("5"), icon: "Rocket", color: "text-amber-400" },
        ].map((s, i) => (
          <div key={i} className="glass-card p-3.5 text-center transition-all duration-300 hover-glow">
            <ToolIcon name={s.icon} className={cn("h-5 w-5 mx-auto mb-1.5", s.color)} />
            <p className="text-lg font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ===== Categories — Bento Grid ===== */}
      {!activeCategory && (
        <div className="animate-fade-in-up stagger-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground">دسته‌بندی ابزارها</h2>
            <span className="text-[10px] text-muted-foreground px-2.5 py-1 rounded-full bg-secondary font-medium">
              {toPersianDigits(String(allTools.length))} ابزار
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {nonHomeCategories.map((cat, idx) => {
              const meta = categoryMeta[cat.id] || { gradient: "from-gray-500 to-gray-600", icon: "Box", accent: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "group glass-card p-4 text-right transition-all duration-300 hover-glow animate-scale-in relative overflow-hidden",
                    `stagger-${Math.min(idx + 2, 10)}`
                  )}
                >
                  {/* Hover gradient overlay */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    meta.gradient
                  )} style={{ opacity: 0 }} />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300",
                        meta.accent
                      )}>
                        <ToolIcon name={meta.icon || cat.icon} className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground bg-background/50 group-hover:bg-white/20 px-2 py-0.5 rounded-full transition-colors duration-300">
                        {toPersianDigits(String(cat.tools.length))}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-foreground group-hover:text-white transition-colors duration-300">{cat.name}</p>
                    <p className="text-[11px] text-muted-foreground group-hover:text-white/70 transition-colors duration-300 mt-1 line-clamp-1">
                      {cat.tools.slice(0, 3).map((t) => t.name).join(" ، ")}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== Category Detail View ===== */}
      {activeCategory && (() => {
        const cat = nonHomeCategories.find((c) => c.id === activeCategory);
        if (!cat) return null;
        const meta = categoryMeta[cat.id] || { gradient: "from-gray-500 to-gray-600", icon: "Box", accent: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
        return (
          <div className="animate-fade-in-up">
            {/* Back header */}
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <LucideIcons.ArrowRight className="h-4 w-4" />
                <span>بازگشت</span>
              </button>
              <div className="flex items-center gap-2">
                <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg border", meta.accent)}>
                  <ToolIcon name={meta.icon || cat.icon} className="h-3.5 w-3.5" />
                </div>
                <h2 className="text-sm font-bold text-foreground">{cat.name}</h2>
                <span className="text-[10px] text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                  {toPersianDigits(String(cat.tools.length))} ابزار
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.tools.map((tool, idx) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={cn(
                    "glass-card hover-glow p-4 text-right transition-all duration-200 flex items-center gap-3 animate-fade-in-up",
                    `stagger-${Math.min(idx + 1, 10)}`
                  )}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ToolIcon name={tool.icon} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground truncate">{tool.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{tool.description}</p>
                  </div>
                  <LucideIcons.ChevronLeft className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* ===== Featured Quick Access ===== */}
      <div className="animate-fade-in-up stagger-3">
        <h2 className="text-sm font-bold text-foreground mb-3">دسترسی سریع</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {featuredTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="glass-card hover-glow flex flex-col items-center gap-2 p-3 transition-all duration-200 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                <ToolIcon name={tool.icon} className="h-4.5 w-4.5" />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors truncate w-full text-center">
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}