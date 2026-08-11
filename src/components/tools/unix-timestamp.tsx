"use client";

import { useState, useEffect } from "react";
import { Clock, RefreshCw, Copy, Check } from "lucide-react";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

export default function UnixTimestamp() {
  const [currentTimestamp, setCurrentTimestamp] = useState(0);
  const [inputTimestamp, setInputTimestamp] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [inputTime, setInputTime] = useState("00:00:00");
  const [unit, setUnit] = useState<"seconds" | "milliseconds">("seconds");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const update = () => setCurrentTimestamp(Math.floor(Date.now() / 1000));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const timestampToDate = (ts: number) => {
    const ms = unit === "seconds" ? ts * 1000 : ts;
    const d = new Date(ms);
    if (isNaN(d.getTime())) return null;
    return {
      local: d.toLocaleString("fa-IR"),
      utc: d.toUTCString(),
      iso: d.toISOString(),
      jalali: d.toLocaleDateString("fa-IR-u-ca-persian", {
        year: "numeric", month: "long", day: "numeric", weekday: "long",
      }),
      relative: getRelativeTime(d),
    };
  };

  const getRelativeTime = (d: Date) => {
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / 1000;
    const absDiff = Math.abs(diff);
    const direction = diff > 0 ? "پیش" : "بعد";
    if (absDiff < 60) return `${toPersianDigits(String(Math.round(absDiff)))} ثانیه ${direction}`;
    if (absDiff < 3600) return `${toPersianDigits(String(Math.round(absDiff / 60)))} دقیقه ${direction}`;
    if (absDiff < 86400) return `${toPersianDigits(String(Math.round(absDiff / 3600)))} ساعت ${direction}`;
    if (absDiff < 2592000) return `${toPersianDigits(String(Math.round(absDiff / 86400)))} روز ${direction}`;
    if (absDiff < 31536000) return `${toPersianDigits(String(Math.round(absDiff / 2592000)))} ماه ${direction}`;
    return `${toPersianDigits(String(Math.round(absDiff / 31536000)))} سال ${direction}`;
  };

  const ts = parseFloat(inputTimestamp) || 0;
  const converted = ts > 0 ? timestampToDate(ts) : null;

  const dateToTimestamp = () => {
    if (!inputDate) return 0;
    const dt = new Date(`${inputDate}T${inputTime || "00:00:00"}`);
    return isNaN(dt.getTime()) ? 0 : Math.floor(dt.getTime() / 1000);
  };

  const manualTs = dateToTimestamp();

  const copyTimestamp = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presets = [
    { label: "۱ ساعت بعد", offset: 3600 },
    { label: "۱ روز بعد", offset: 86400 },
    { label: "۱ هفته بعد", offset: 604800 },
    { label: "۱ ماه بعد", offset: 2592000 },
    { label: "۱ سال بعد", offset: 31536000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تبدیل یونیکس تایم‌استمپ</h2>
      </div>

      {/* Current timestamp */}
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">تایم‌استمپ فعلی (زنده)</p>
        <div className="flex items-center justify-center gap-3">
          <p className="text-4xl font-mono font-bold text-primary tabular-nums" dir="ltr">
            {currentTimestamp}
          </p>
          <button onClick={() => copyTimestamp(String(currentTimestamp))} className="text-muted-foreground hover:text-foreground">
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>
        <p className="text-sm text-foreground mt-2">{new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })}</p>
      </div>

      {/* Unit toggle */}
      <div className="flex gap-2">
        {(["seconds", "milliseconds"] as const).map((u) => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              unit === u ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-accent"
            }`}
          >
            {u === "seconds" ? "ثانیه" : "میلی‌ثانیه"}
          </button>
        ))}
      </div>

      {/* Timestamp to Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">تبدیل تایم‌استمپ به تاریخ</label>
        <input
          type="number"
          value={inputTimestamp}
          onChange={(e) => setInputTimestamp(e.target.value)}
          placeholder="تایم‌استمپ را وارد کنید..."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
          dir="ltr"
        />
        {converted && (
          <div className="space-y-2 rounded-lg border border-border bg-card overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
              {[
                ["تاریخ و ساعت محلی", converted.local],
                ["تاریخ شمسی", converted.jalali],
                ["فرمت UTC", converted.utc],
                ["فرمت ISO 8601", converted.iso],
                ["نسبت به الان", converted.relative],
              ].map(([label, value]) => (
                <div key={label} className="bg-card p-3 sm:col-span-1">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="font-mono text-sm text-foreground mt-1" dir="ltr">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Presets */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">تایم‌استمپ‌های پیش‌فرض</label>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.label}
              onClick={() => setInputTimestamp(String(currentTimestamp + p.offset))}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Date to Timestamp */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">تبدیل تاریخ به تایم‌استمپ</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="time"
            value={inputTime}
            onChange={(e) => setInputTime(e.target.value)}
            step="1"
            className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {inputDate && manualTs > 0 && (
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <p className="text-sm text-muted-foreground">تایم‌استمپ</p>
            <p className="text-2xl font-mono font-bold text-primary" dir="ltr">{manualTs}</p>
            <p className="text-xs text-muted-foreground mt-1">میلی‌ثانیه: {manualTs * 1000}</p>
          </div>
        )}
      </div>
    </div>
  );
}
