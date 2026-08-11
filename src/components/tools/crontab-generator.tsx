"use client";

import { useState, useMemo } from "react";
import { Terminal, Copy, Check } from "lucide-react";

export default function CrontabGenerator() {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");
  const [copied, setCopied] = useState(false);

  const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  const description = useMemo(() => {
    const parts: string[] = [];

    if (minute === "*" && hour === "*" && dayOfMonth === "*" && month === "*" && dayOfWeek === "*") {
      return "هر دقیقه اجرا می‌شود";
    }

    if (minute !== "*") parts.push(`دقیقه ${minute === "0" ? "صفر" : minute}`);
    if (hour !== "*") parts.push(`ساعت ${hour}`);
    if (dayOfMonth !== "*") parts.push(`روز ${dayOfMonth} ماه`);
    if (month !== "*") parts.push(`ماه ${month}`);
    if (dayOfWeek !== "*") {
      const days = ["یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه", "شنبه"];
      const dayNum = parseInt(dayOfWeek);
      if (!isNaN(dayNum) && dayNum >= 0 && dayNum <= 6) {
        parts.push(days[dayNum] || `روز هفته ${dayOfWeek}`);
      } else {
        parts.push(`روز هفته ${dayOfWeek}`);
      }
    }

    if (parts.length > 0) return `اجرای ${parts.join(" و ")}`;
    return "هر دقیقه";
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const nextRuns = useMemo(() => {
    // Calculate next 5 run times (approximate)
    const now = new Date();
    const runs: string[] = [];
    const maxRuns = 5;

    // Simple calculation for common patterns
    if (minute === "*" && hour === "*") {
      for (let i = 1; i <= maxRuns; i++) {
        const d = new Date(now.getTime() + i * 60000);
        runs.push(d.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" }));
      }
    } else if (hour !== "*" && minute !== "*") {
      const h = parseInt(hour);
      const m = parseInt(minute);
      if (!isNaN(h) && !isNaN(m)) {
        for (let i = 0; i < maxRuns; i++) {
          const d = new Date(now);
          d.setHours(h, m, 0, 0);
          if (d <= now) d.setDate(d.getDate() + 1);
          d.setDate(d.getDate() + i);
          runs.push(d.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" }));
        }
      }
    } else {
      for (let i = 1; i <= maxRuns; i++) {
        const d = new Date(now.getTime() + i * 3600000);
        runs.push(d.toLocaleString("fa-IR", { timeZone: "Asia/Tehran" }));
      }
    }

    return runs;
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const copyExpression = () => {
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: "هر دقیقه", m: "*", h: "*", dom: "*", mon: "*", dow: "*" },
    { label: "ساعتی", m: "0", h: "*", dom: "*", mon: "*", dow: "*" },
    { label: "روزانه نیمه‌شب", m: "0", h: "0", dom: "*", mon: "*", dow: "*" },
    { label: "روزانه ساعت ۶", m: "0", h: "6", dom: "*", mon: "*", dow: "*" },
    { label: "ساعت ۹ دوشنبه", m: "0", h: "9", dom: "*", mon: "*", dow: "1" },
    { label: "هر ۵ دقیقه", m: "*/5", h: "*", dom: "*", mon: "*", dow: "*" },
    { label: "هر ۱۵ دقیقه", m: "*/15", h: "*", dom: "*", mon: "*", dow: "*" },
    { label: "هر ۳۰ دقیقه", m: "*/30", h: "*", dom: "*", mon: "*", dow: "*" },
    { label: "ماهانه اول", m: "0", h: "0", dom: "1", mon: "*", dow: "*" },
    { label: "سالانه", m: "0", h: "0", dom: "1", mon: "1", dow: "*" },
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setMinute(p.m);
    setHour(p.h);
    setDayOfMonth(p.dom);
    setMonth(p.mon);
    setDayOfWeek(p.dow);
  };

  const fields = [
    { label: "دقیقه", value: minute, setValue: setMinute, options: ["*", "0", "*/5", "*/15", "*/30"] },
    { label: "ساعت", value: hour, setValue: setHour, options: ["*", "0", "6", "8", "12", "18", "*/2", "*/6"] },
    { label: "روز ماه", value: dayOfMonth, setValue: setDayOfMonth, options: ["*", "1", "15", "*/2"] },
    { label: "ماه", value: month, setValue: setMonth, options: ["*", "1", "6", "12", "*/3", "*/6"] },
    { label: "روز هفته", value: dayOfWeek, setValue: setDayOfWeek, options: ["*", "0", "1", "5", "6", "1-5"] },
  ];

  const weekDays = [
    { value: "0", label: "ش" },
    { value: "1", label: "۱ش" },
    { value: "2", label: "۲ش" },
    { value: "3", label: "۳ش" },
    { value: "4", label: "۴ش" },
    { value: "5", label: "۵ش" },
    { value: "6", label: "ج" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Terminal className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تولیدگر Crontab</h2>
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">الگوهای آماده</p>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Expression */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">عبارت Crontab</p>
        <div className="flex items-center justify-center gap-3">
          <p className="text-3xl font-mono font-bold text-primary" dir="ltr">{expression}</p>
          <button onClick={copyExpression} className="text-muted-foreground hover:text-foreground">
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
        <p className="text-sm text-foreground mt-2">{description}</p>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-foreground">تنظیمات</p>
        {fields.map((field) => (
          <div key={field.label} className="flex items-center gap-3">
            <label className="w-20 text-sm text-muted-foreground shrink-0">{field.label}</label>
            <div className="flex gap-1 flex-wrap flex-1">
              {field.options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => field.setValue(opt)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-mono transition-colors ${
                    field.value === opt
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background text-foreground hover:bg-accent"
                  }`}
                >
                  {opt}
                </button>
              ))}
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
                className="w-16 rounded-md border border-border bg-background px-2 py-1 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary text-center"
                dir="ltr"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Next runs */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/50">
          <p className="text-sm font-medium text-foreground">اجراهای بعدی</p>
        </div>
        <div className="p-4 space-y-2">
          {nextRuns.map((run, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="h-6 w-6 flex items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">{i + 1}</span>
              <span className="font-mono text-foreground" dir="ltr">{run}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reference */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium text-foreground mb-3">راهنمای روزهای هفته</p>
        <div className="flex gap-1 justify-center">
          {weekDays.map((d) => (
            <button
              key={d.value}
              onClick={() => setDayOfWeek(d.value)}
              className={`rounded-md border px-2 py-1 text-xs transition-colors ${
                dayOfWeek === d.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-accent"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
