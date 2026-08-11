"use client";

import { useState, useMemo } from "react";
import { HardDrive, Copy, Check } from "lucide-react";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

type DataUnit = "B" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "bit" | "Kbit" | "Mbit" | "Gbit";

const UNITS: { id: DataUnit; label: string; multiplier: number }[] = [
  { id: "bit", label: "بیت", multiplier: 1 },
  { id: "B", label: "بایت", multiplier: 8 },
  { id: "Kbit", label: "کیلوبیت", multiplier: 1000 },
  { id: "KB", label: "کیلوبایت", multiplier: 8 * 1024 },
  { id: "Mbit", label: "مگابیت", multiplier: 1000 * 1000 },
  { id: "MB", label: "مگابایت", multiplier: 8 * 1024 * 1024 },
  { id: "Gbit", label: "گیگابیت", multiplier: 1000 * 1000 * 1000 },
  { id: "GB", label: "گیگابایت", multiplier: 8 * 1024 * 1024 * 1024 },
  { id: "TB", label: "ترابایت", multiplier: 8 * 1024 * 1024 * 1024 * 1024 },
  { id: "PB", label: "پتابایت", multiplier: 8 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 },
  { id: "EB", label: "اگزابایت", multiplier: 8 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 * 1024 },
];

// Simpler approach using bytes as base
const BYTE_UNITS = [
  { id: "B", label: "بایت (B)", factor: 1 },
  { id: "KB", label: "کیلوبایت (KB)", factor: 1024 },
  { id: "MB", label: "مگابایت (MB)", factor: 1024 ** 2 },
  { id: "GB", label: "گیگابایت (GB)", factor: 1024 ** 3 },
  { id: "TB", label: "ترابایت (TB)", factor: 1024 ** 4 },
  { id: "PB", label: "پتابایت (PB)", factor: 1024 ** 5 },
];

const BIT_UNITS = [
  { id: "bit", label: "بیت (bit)", factor: 0.125 },
  { id: "Kbit", label: "کیلوبیت (Kbit)", factor: 128 },
  { id: "Mbit", label: "مگابیت (Mbit)", factor: 128 * 1024 },
  { id: "Gbit", label: "گیگابیت (Gbit)", factor: 128 * 1024 ** 2 },
];

const ALL_UNITS = [...BYTE_UNITS, ...BIT_UNITS];

export default function DataUnitConverter() {
  const [value, setValue] = useState("");
  const [fromUnit, setFromUnit] = useState<string>("MB");
  const [mode, setMode] = useState<"binary" | "decimal">("binary");

  const conversions = useMemo(() => {
    const num = parseFloat(value) || 0;
    if (num === 0) return null;

    const baseFactor = mode === "binary" ? 1024 : 1000;

    // Find source unit factor (in bytes)
    const srcUnit = ALL_UNITS.find(u => u.id === fromUnit);
    if (!srcUnit) return null;

    // Convert to bytes first
    const bytes = num * srcUnit.factor;

    // Then convert to all other units
    const results: { id: string; label: string; value: number; formatted: string }[] = [];

    for (const unit of BYTE_UNITS) {
      const factor = mode === "binary" ? 1024 ** BYTE_UNITS.indexOf(unit) : 1000 ** BYTE_UNITS.indexOf(unit);
      const converted = bytes / factor;
      results.push({
        id: unit.id,
        label: unit.label,
        value: converted,
        formatted: converted < 0.01 ? converted.toExponential(4) : converted.toLocaleString("en-US", { maximumFractionDigits: 6 }),
      });
    }

    return results;
  }, [value, fromUnit, mode]);

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
  };

  // Common presets
  const presets = [
    { label: "یک فایل متنی", value: "1024", unit: "KB" },
    { label: "یک عکس", value: "3", unit: "MB" },
    { label: "یک فیلم", value: "1.5", unit: "GB" },
    { label: "یک بازی", value: "50", unit: "GB" },
    { label: "سرعت اینترنت", value: "50", unit: "Mbit" },
    { label: "هارد دیسک ۱ ترابایت", value: "1", unit: "TB" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <HardDrive className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تبدیل واحد داده</h2>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button
            key={p.label}
            onClick={() => { setValue(p.value); setFromUnit(p.unit); }}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">مقدار</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="مقدار را وارد کنید..."
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-lg"
            dir="ltr"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">واحد مبدأ</label>
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {ALL_UNITS.map((u) => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Mode */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("binary")}
          className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            mode === "binary" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-accent"
          }`}
        >
          دودویی (۱۰۲۴)
        </button>
        <button
          onClick={() => setMode("decimal")}
          className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            mode === "decimal" ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-foreground hover:bg-accent"
          }`}
        >
          ده‌دهی (۱۰۰۰)
        </button>
      </div>

      {/* Results */}
      {conversions && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">نتیجه تبدیل</p>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {conversions.map((r, i) => (
              <div
                key={r.id}
                className={`flex items-center justify-between px-4 py-3 ${
                  r.id === fromUnit ? "bg-primary/5" : ""
                } ${i < conversions.length - 1 ? "border-b border-border" : ""}`}
              >
                <span className="text-sm text-foreground">{r.label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-foreground" dir="ltr">{r.formatted}</span>
                  <button
                    onClick={() => copyValue(r.formatted)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick reference */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium text-foreground mb-3">راهنمای سریع</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded border border-border bg-background p-2">
            <span className="font-bold text-primary">1 بایت</span> = ۸ بیت
          </div>
          <div className="rounded border border-border bg-background p-2">
            <span className="font-bold text-primary">1 کیلوبایت</span> = ۱۰۲۴ بایت
          </div>
          <div className="rounded border border-border bg-background p-2">
            <span className="font-bold text-primary">۱ مگابایت</span> = ۱۰۲۴ کیلوبایت
          </div>
          <div className="rounded border border-border bg-background p-2">
            <span className="font-bold text-primary">۱ گیگابایت</span> = ۱۰۲۴ مگابایت
          </div>
        </div>
      </div>
    </div>
  );
}
