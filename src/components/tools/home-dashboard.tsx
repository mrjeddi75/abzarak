"use client";

import { useState, useEffect } from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";
import { toolCategories } from "@/lib/tools-config";
import { useAppStore } from "@/lib/store";
import { getJalaliToday, jalaliMonthNames } from "@/lib/jalali";

function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon className={className} /> : null;
}

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const categoryGradients: Record<string, string> = {
  calc: "from-blue-500/20 to-indigo-500/20 dark:from-blue-500/10 dark:to-indigo-500/10",
  conv: "from-emerald-500/20 to-teal-500/20 dark:from-emerald-500/10 dark:to-teal-500/10",
  text: "from-orange-500/20 to-amber-500/20 dark:from-orange-500/10 dark:to-amber-500/10",
  dev: "from-violet-500/20 to-purple-500/20 dark:from-violet-500/10 dark:to-purple-500/10",
  css: "from-pink-500/20 to-rose-500/20 dark:from-pink-500/10 dark:to-rose-500/10",
  util: "from-cyan-500/20 to-sky-500/20 dark:from-cyan-500/10 dark:to-sky-500/10",
  network: "from-green-500/20 to-lime-500/20 dark:from-green-500/10 dark:to-lime-500/10",
  weather: "from-sky-500/20 to-blue-500/20 dark:from-sky-500/10 dark:to-blue-500/10",
  datetime: "from-amber-500/20 to-yellow-500/20 dark:from-amber-500/10 dark:to-yellow-500/10",
  encrypt: "from-red-500/20 to-orange-500/20 dark:from-red-500/10 dark:to-orange-500/10",
};

const categoryIcons: Record<string, string> = {
  calc: "Calculator",
  conv: "ArrowRightLeft",
  text: "Type",
  dev: "Code",
  css: "Paintbrush",
  util: "Wrench",
  network: "Globe",
  weather: "CloudSun",
  datetime: "Clock",
  encrypt: "Shield",
};

export default function HomeDashboard() {
  const [time, setTime] = useState("");
  const [weekday, setWeekday] = useState<string>("");
  const { setActiveTool, setActiveCategory, activeCategory, theme, toggleTheme } = useAppStore();

  const today = getJalaliToday();
  const day = today[2];
  const month = today[1];
  const year = today[0];
  const monthName = jalaliMonthNames[month - 1];

  const nonHomeCategories = toolCategories.filter((c) => c.id !== "home");
  const allTools = toolCategories.flatMap((cat) => cat.tools);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleString("fa-IR", {
          timeZone: "Asia/Tehran",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setWeekday(
        now.toLocaleString("fa-IR", {
          timeZone: "Asia/Tehran",
          weekday: "long",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const parts = time.split(":");
  const hours = parts[0] || "00";
  const minutes = parts[1] || "00";
  const seconds = parts[2] || "00";

  const stats = [
    { label: "ابزار فعال", value: toPersianDigits(String(allTools.length)), icon: "Layers" },
    { label: "دسته‌بندی", value: toPersianDigits(String(nonHomeCategories.length)), icon: "Grid3X3" },
    { label: "نسخه", value: toPersianDigits("5"), icon: "Rocket" },
  ];

  return (
    <div className="space-y-6">
      {/* Apple-style Clock */}
      <div className="animate-fade-in-up">
        <div className="glass-card glow-effect p-6 sm:p-10 overflow-hidden relative">
          {/* Ambient gradient orbs */}
          <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-violet-500/5 blur-3xl pointer-events-none" />

          <div className="relative flex flex-col items-center">
            {/* Date pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/60 text-muted-foreground text-sm mb-6 backdrop-blur-sm">
              <span>{weekday}</span>
              <span className="text-foreground/40">|</span>
              <span className="font-medium text-foreground/80">
                {toPersianDigits(String(day))} {monthName} {toPersianDigits(String(year))}
              </span>
            </div>

            {/* Main time display — Apple typography style */}
            <div className="flex items-center justify-center gap-0.5 font-light tracking-tighter select-none" style={{ fontFamily: "'SF Pro Display', 'Vazirmatn', -apple-system, system-ui, sans-serif" }}>
              <span className="text-7xl sm:text-8xl md:text-9xl text-foreground leading-none" style={{ fontWeight: 200 }}>
                {hours}
              </span>
              <span className="text-7xl sm:text-8xl md:text-9xl text-foreground/25 leading-none animate-blink" style={{ fontWeight: 100 }}>
                :
              </span>
              <span className="text-7xl sm:text-8xl md:text-9xl text-foreground leading-none" style={{ fontWeight: 200 }}>
                {minutes}
              </span>
            </div>

            {/* Seconds — thin, Apple Watch style */}
            <div className="mt-3 flex items-center gap-1.5">
              <div className="h-1 w-1 rounded-full bg-primary/40 animate-pulse" />
              <span className="text-base sm:text-lg font-light text-muted-foreground tabular-nums tracking-widest" style={{ fontWeight: 300 }}>
                {seconds}
              </span>
              <span className="text-[11px] font-light text-muted-foreground/50 ml-1" style={{ fontWeight: 300 }}>ثانیه</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Tiles */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up stagger-1">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="glass-card hover-glow p-4 text-center transition-all duration-300"
          >
            <ToolIcon name={stat.icon} className="h-5 w-5 text-primary mx-auto mb-2" />
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Categories Grid */}
      <div className="animate-fade-in-up stagger-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">دسته‌بندی ابزارها</h2>
          <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-secondary">
            {toPersianDigits(String(allTools.length))} ابزار
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {nonHomeCategories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "glass-card hover-glow p-4 text-right transition-all duration-300 animate-scale-in",
                `stagger-${Math.min(idx + 3, 10)}`,
                `bg-gradient-to-br ${categoryGradients[cat.id] || "from-primary/10 to-primary/5"}`
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <ToolIcon name={categoryIcons[cat.id] || cat.icon} className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground bg-background/40 px-2 py-0.5 rounded-full">
                  {toPersianDigits(String(cat.tools.length))}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground">{cat.name}</p>
              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                {cat.tools.slice(0, 2).map((t) => t.name).join("، ")}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Category Detail View */}
      {activeCategory && (() => {
        const cat = nonHomeCategories.find((c) => c.id === activeCategory);
        if (!cat) return null;
        return (
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <LucideIcons.ArrowRight className="h-4 w-4" />
                <span>بازگشت</span>
              </button>
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <ToolIcon name={categoryIcons[cat.id] || cat.icon} className="h-4 w-4" />
                </div>
                <h2 className="text-base font-bold text-foreground">{cat.name}</h2>
                <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-secondary">
                  {toPersianDigits(String(cat.tools.length))} ابزار
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="glass-card hover-glow p-4 text-right transition-all duration-200 flex items-center gap-3"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ToolIcon name={tool.icon} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{tool.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{tool.description}</p>
                  </div>
                  <LucideIcons.ChevronLeft className="h-4 w-4 text-muted-foreground/50 shrink-0 mr-auto" />
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Quick Access - Popular Tools */}
      <div className="animate-fade-in-up stagger-3">
        <h2 className="text-base font-bold text-foreground mb-4">دسترسی سریع</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: "date-converter", icon: "CalendarDays", label: "تبدیل تاریخ" },
            { id: "password-generator", icon: "KeyRound", label: "رمز عبور" },
            { id: "color-converter", icon: "Palette", label: "تبدیل رنگ" },
            { id: "regex-tester", icon: "Code2", label: "تستر Regex" },
            { id: "word-counter", icon: "Hash", label: "شمارنده کلمات" },
            { id: "hash-generator", icon: "Fingerprint", label: "هش مولد" },
            { id: "speed-test", icon: "Gauge", label: "تست سرعت" },
            { id: "unit-converter", icon: "Ruler", label: "تبدیل واحد" },
          ].map((tool, idx) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={cn(
                "flex items-center gap-2.5 glass-card p-3 text-right transition-all duration-200 hover:bg-accent hover-glow",
                `animate-fade-in-up stagger-${Math.min(idx + 4, 10)}`
              )}
            >
              <ToolIcon name={tool.icon} className="h-4 w-4 text-primary shrink-0" />
              <span className="text-xs font-medium text-foreground truncate">
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
