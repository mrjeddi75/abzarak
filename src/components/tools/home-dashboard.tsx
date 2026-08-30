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

export default function HomeDashboard() {
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);
  const { setActiveTool, setActiveCategory, activeCategory } = useAppStore();

  const nonHomeCategories = toolCategories.filter((c) => c.id !== "home");
  const allTools = toolCategories.flatMap((cat) => cat.tools);

  useEffect(() => {
    setMounted(true);
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Time — Tehran timezone, monospace LTR
  const timeStr = mounted
    ? now.toLocaleString("en-GB", { timeZone: "Asia/Tehran", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
    : "00:00:00";
  const weekday = mounted
    ? now.toLocaleString("fa-IR", { timeZone: "Asia/Tehran", weekday: "long" })
    : "—";

  // Shamsi date
  const jToday = getJalaliToday();
  const shamsiStr = `${toPersianDigits(jToday[2])} ${jalaliMonthNames[jToday[1] - 1]} ${toPersianDigits(jToday[0])}`;
  const shamsiShort = `${toPersianDigits(jToday[0])}/${toPersianDigits(String(jToday[1]).padStart(2, "0"))}/${toPersianDigits(String(jToday[2]).padStart(2, "0"))}`;

  // Gregorian date
  const gMonth = mounted ? now.toLocaleString("en-US", { timeZone: "Asia/Tehran", month: "long" }) : "";
  const gDay = mounted ? now.getDate() : "";
  const gYear = mounted ? now.getFullYear() : "";
  const miladiStr = mounted ? `${gDay} ${gMonth} ${gYear}` : "—";
  const miladiShort = mounted ? `${gYear}/${String(now.getMonth() + 1).padStart(2, "0")}/${String(gDay).padStart(2, "0")}` : "—";

  const featuredTools = [
    { id: "bmi", icon: "Scale", label: "BMI", color: "text-purple-400" },
    { id: "unit-converter", icon: "Ruler", label: "تبدیل واحد", color: "text-emerald-400" },
    { id: "password-generator", icon: "KeyRound", label: "رمز عبور", color: "text-yellow-400" },
    { id: "color-converter", icon: "Palette", label: "رنگ", color: "text-pink-400" },
    { id: "speed-test", icon: "Gauge", label: "تست سرعت", color: "text-cyan-400" },
    { id: "word-counter", icon: "Hash", label: "شمارنده", color: "text-orange-400" },
  ];

  return (
    <div className="space-y-4">
      {/* ===== v7-Style Stats ===== */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-black text-primary">{toPersianDigits(String(allTools.length))}</p>
          <p className="text-[10px] text-muted-foreground mt-1">ابزار کاربردی</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-black text-purple-400">{toPersianDigits(String(nonHomeCategories.length))}</p>
          <p className="text-[10px] text-muted-foreground mt-1">دسته‌بندی</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-3xl font-black text-emerald-400">{toPersianDigits("0")}</p>
          <p className="text-[10px] text-muted-foreground mt-1">نیاز به API</p>
        </div>
      </div>

      {/* ===== v7-Style Clock ===== */}
      <div className="glass-card p-8 text-center relative overflow-hidden animate-fade-in-up stagger-1">
        {/* gradient overlay from top */
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <p className="text-xs text-muted-foreground mb-2 relative z-10">ساعت ایران</p>
        <p
          className="text-7xl font-black font-mono text-foreground relative z-10 tracking-wider"
          dir="ltr"
          style={{ fontVariantNumeric: "tabular-nums", textAlign: "center" }}
        >
          {timeStr}
        </p>
        <p className="text-sm text-muted-foreground mt-3 relative z-10">{weekday}</p>
      </div>

      {/* ===== v7-Style 3 Date Cards (Shamsi + Miladi) ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in-up stagger-2">
        {/* Shamsi */}
        <div className="glass-card border-primary/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-primary font-bold">تاریخ شمسی</p>
            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-lg font-mono">
              {shamsiShort}
            </span>
          </div>
          <p className="text-sm font-bold text-foreground leading-6">{shamsiStr}</p>
        </div>
        {/* Miladi */}
        <div className="glass-card border-emerald-500/10 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-emerald-400 font-bold">تاریخ میلادی</p>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-lg font-mono" dir="ltr">
              {miladiShort}
            </span>
          </div>
          <p className="text-sm font-bold text-foreground leading-6" dir="ltr" style={{ textAlign: "left" }}>
            {miladiStr}
          </p>
        </div>
      </div>

      {/* ===== v7-Style Quick Access ===== */}
      <div className="animate-fade-in-up stagger-3">
        <p className="text-xs text-muted-foreground mb-3">دسترسی سریع</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {featuredTools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="glass-card hover-glow p-3 text-center transition-all duration-200"
            >
              <ToolIcon name={tool.icon} className={cn("w-5 h-5 mx-auto mb-1.5", tool.color)} />
              <p className="text-[10px] text-muted-foreground">{tool.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ===== Categories Grid ===== */}
      {!activeCategory && (
        <div className="animate-fade-in-up stagger-4">
          <p className="text-xs text-muted-foreground mb-3">دسته‌بندی ابزارها</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {nonHomeCategories.map((cat, idx) => {
              const meta = categoryMeta[cat.id] || { gradient: "from-gray-500 to-gray-600", icon: "Box", accent: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "glass-card p-4 text-right transition-all duration-300 hover-glow animate-scale-in",
                    `stagger-${Math.min(idx + 5, 10)}`
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", meta.accent)}>
                      <ToolIcon name={meta.icon || cat.icon} className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {toPersianDigits(String(cat.tools.length))}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{cat.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                    {cat.tools.slice(0, 3).map((t) => t.name).join(" ، ")}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== Category Detail ===== */}
      {activeCategory && (() => {
        const cat = nonHomeCategories.find((c) => c.id === activeCategory);
        if (!cat) return null;
        const meta = categoryMeta[cat.id] || { gradient: "from-gray-500 to-gray-600", icon: "Box", accent: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
        return (
          <div className="animate-fade-in-up">
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
    </div>
  );
}