"use client";

import { useState } from "react";
import { Clock, Info, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const DAYS = [
  { key: "sat", label: "شنبه" },
  { key: "sun", label: "یکشنبه" },
  { key: "mon", label: "دوشنبه" },
  { key: "tue", label: "سه‌شنبه" },
  { key: "wed", label: "چهارشنبه" },
  { key: "thu", label: "پنجشنبه" },
  { key: "fri", label: "جمعه" },
];

const HOURS = Array.from({ length: 24 }, (_, i) => i);

// Engagement score 1-10 based on Instagram general data for Iranian audience
const engagementData: Record<string, number[]> = {
  sat: [2, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 7, 5, 6, 7, 8, 8, 7, 6, 7, 9, 9, 8, 4],
  sun: [2, 1, 1, 1, 1, 2, 3, 5, 6, 7, 7, 6, 5, 6, 7, 8, 8, 7, 7, 8, 9, 9, 7, 4],
  mon: [2, 1, 1, 1, 1, 2, 3, 5, 6, 7, 7, 7, 5, 6, 7, 8, 8, 7, 6, 7, 9, 8, 7, 4],
  tue: [2, 1, 1, 1, 1, 2, 3, 5, 6, 7, 8, 7, 5, 6, 7, 8, 8, 7, 6, 7, 9, 9, 7, 4],
  wed: [2, 1, 1, 1, 1, 2, 3, 5, 6, 7, 7, 7, 5, 6, 7, 8, 9, 8, 7, 8, 9, 9, 8, 4],
  thu: [2, 1, 1, 1, 1, 2, 3, 5, 6, 7, 8, 7, 5, 6, 7, 8, 9, 9, 8, 9, 10, 10, 8, 5],
  fri: [3, 2, 1, 1, 1, 2, 3, 4, 5, 6, 6, 6, 5, 6, 7, 7, 7, 7, 7, 8, 9, 9, 8, 6],
};

const getScoreColor = (score: number): string => {
  if (score >= 8) return "bg-emerald-500/80";
  if (score >= 6) return "bg-emerald-400/60";
  if (score >= 4) return "bg-amber-400/60";
  if (score >= 2) return "bg-orange-400/50";
  return "bg-red-400/40";
};

const getScoreLabel = (score: number): string => {
  if (score >= 9) return "عالی";
  if (score >= 7) return "خوب";
  if (score >= 5) return "متوسط";
  if (score >= 3) return "ضعیف";
  return "بسیار کم";
};

const toPersianDigits = (n: number): string => {
  try { return n.toLocaleString("fa-IR"); } catch { return String(n); }
};

export default function InstagramPostTime() {
  const [selectedDay, setSelectedDay] = useState("thu");
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const dayData = engagementData[selectedDay] || [];
  const maxScore = Math.max(...dayData);

  // Find best times across all days
  const bestTimesAll = DAYS.map((d) => {
    const scores = engagementData[d.key];
    const maxS = Math.max(...scores);
    const bestHours = scores
      .map((s, i) => ({ hour: i, score: s }))
      .filter((x) => x.score === maxS);
    return { day: d.label, hours: bestHours, score: maxS };
  })
    .sort((a, b) => b.score - a.score);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">بهترین زمان پست اینستاگرام</h2>
      </div>

      {/* Day selector */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <CalendarDays className="h-4 w-4 text-primary" />
          انتخاب روز
        </div>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((d) => (
            <button
              key={d.key}
              onClick={() => { setSelectedDay(d.key); setSelectedHour(null); }}
              className={cn(
                "rounded-lg px-4 py-2 text-sm transition-all",
                selectedDay === d.key
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-primary/30"
              )}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Heatmap */}
      <div className="glass-card glow-effect p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">نقشه تعامل ساعتی</span>
          <span className="text-xs text-muted-foreground">
            {DAYS.find((d) => d.key === selectedDay)?.label}
          </span>
        </div>

        {/* Hour labels */}
        <div className="overflow-x-auto">
          <div className="grid grid-cols-12 gap-1.5 min-w-[500px]">
            {HOURS.filter((_, i) => i < 12).map((h) => (
              <div key={h} className="text-center text-[9px] text-muted-foreground pb-1">
                {toPersianDigits(h)}:۰۰
              </div>
            ))}
          </div>

          {/* AM row */}
          <div className="grid grid-cols-12 gap-1.5 min-w-[500px]">
            {HOURS.filter((_, i) => i < 12).map((h) => {
              const score = dayData[h] || 0;
              return (
                <button
                  key={h}
                  onClick={() => setSelectedHour(h)}
                  className={cn(
                    "aspect-square rounded-md transition-all flex items-center justify-center text-[9px] font-bold",
                    getScoreColor(score),
                    selectedHour === h && "ring-2 ring-primary ring-offset-1 ring-offset-background"
                  )}
                  title={`${toPersianDigits(h)}:۰۰ — ${getScoreLabel(score)}`}
                >
                  {toPersianDigits(score)}
                </button>
              );
            })}
          </div>

          {/* PM hour labels */}
          <div className="grid grid-cols-12 gap-1.5 min-w-[500px] mt-1">
            {HOURS.filter((_, i) => i >= 12).map((h) => (
              <div key={h} className="text-center text-[9px] text-muted-foreground pb-1">
                {toPersianDigits(h)}:۰۰
              </div>
            ))}
          </div>

          {/* PM row */}
          <div className="grid grid-cols-12 gap-1.5 min-w-[500px]">
            {HOURS.filter((_, i) => i >= 12).map((h) => {
              const score = dayData[h] || 0;
              return (
                <button
                  key={h}
                  onClick={() => setSelectedHour(h)}
                  className={cn(
                    "aspect-square rounded-md transition-all flex items-center justify-center text-[9px] font-bold",
                    getScoreColor(score),
                    selectedHour === h && "ring-2 ring-primary ring-offset-1 ring-offset-background"
                  )}
                  title={`${toPersianDigits(h)}:۰۰ — ${getScoreLabel(score)}`}
                >
                  {toPersianDigits(score)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500/80"></span>عالی (۸+)
          </div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-400/60"></span>خوب (۶-۷)
          </div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-400/60"></span>متوسط (۴-۵)
          </div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-400/50"></span>ضعیف (۲-۳)
          </div>
          <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400/40"></span>بسیار کم (۱)
          </div>
        </div>
      </div>

      {/* Selected hour detail */}
      {selectedHour !== null && (
        <div className="glass-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                ساعت {toPersianDigits(selectedHour)}:۰۰ — {DAYS.find((d) => d.key === selectedDay)?.label}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                امتیاز تعامل: <span className={cn("font-bold", (dayData[selectedHour] || 0) >= 7 ? "text-emerald-500" : (dayData[selectedHour] || 0) >= 5 ? "text-amber-500" : "text-orange-500")}>{toPersianDigits(dayData[selectedHour] || 0)}/۱۰</span>
                — {getScoreLabel(dayData[selectedHour] || 0)}
              </p>
            </div>
            <div className={cn("rounded-full px-4 py-2 text-sm font-bold", (dayData[selectedHour] || 0) >= 8 ? "bg-emerald-500/10 text-emerald-500" : (dayData[selectedHour] || 0) >= 6 ? "bg-amber-500/10 text-amber-500" : "bg-orange-500/10 text-orange-500")}>
              {getScoreLabel(dayData[selectedHour] || 0)}
            </div>
          </div>
        </div>
      )}

      {/* Best times across week */}
      <div className="glass-card p-5 space-y-3">
        <span className="text-sm font-medium text-foreground">بهترین زمان‌ها در هفته</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {bestTimesAll.slice(0, 7).map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center justify-between rounded-lg border p-3 transition-all",
                idx < 3 ? "border-primary/30 bg-primary/5" : "border-border"
              )}
            >
              <div>
                <p className="text-sm font-medium text-foreground">{item.day}</p>
                <p className="text-xs text-muted-foreground" dir="ltr">
                  {item.hours.map((h) => `${String(h.hour).padStart(2, "0")}:00`).join(" و ")}
                </p>
              </div>
              <div className={cn("rounded-full px-3 py-1 text-xs font-bold", item.score >= 8 ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>
                {toPersianDigits(item.score)}/۱۰
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/50 p-3 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
        <span>
          این داده‌ها بر اساس آمار عمومی تعامل کاربران ایرانی در اینستاگرام تخمین زده شده‌اند.
          بهترین زمان نهایی بسته به مخاطب شما ممکن است متفاوت باشد. بررسی Insights پیج خودتان را فراموش نکنید.
        </span>
      </div>
    </div>
  );
}