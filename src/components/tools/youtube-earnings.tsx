"use client";

import { useState } from "react";
import { Youtube, Info, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const NICHES = [
  { id: "tech", label: "تکنولوژی", cpmMin: 4, cpmMax: 12 },
  { id: "finance", label: "مالی و سرمایه‌گذاری", cpmMin: 8, cpmMax: 25 },
  { id: "education", label: "آموزش", cpmMin: 5, cpmMax: 15 },
  { id: "gaming", label: "گیمینگ", cpmMin: 2, cpmMax: 8 },
  { id: "vlog", label: "ولاگ", cpmMin: 1, cpmMax: 5 },
  { id: "cooking", label: "آشپزی", cpmMin: 2, cpmMax: 7 },
  { id: "fitness", label: "فیتنس و سلامت", cpmMin: 3, cpmMax: 10 },
  { id: "entertainment", label: "سرگرمی", cpmMin: 1, cpmMax: 6 },
  { id: "beauty", label: "زیبایی", cpmMin: 3, cpmMax: 12 },
  { id: "travel", label: "سفر", cpmMin: 2, cpmMax: 8 },
  { id: "music", label: "موسیقی", cpmMin: 0.5, cpmMax: 3 },
  { id: "other", label: "سایر", cpmMin: 1, cpmMax: 8 },
];

const CURRENCIES = [
  { id: "usd", label: "دلار آمریکا", symbol: "$", rate: 1 },
  { id: "eur", label: "یورو", symbol: "€", rate: 0.92 },
  { id: "irr", label: "تومان", symbol: "T", rate: 85000 },
];

const toPersianDigits = (n: number): string => {
  try { return n.toLocaleString("fa-IR"); } catch { return String(n); }
};

const formatMoney = (amount: number, currency: typeof CURRENCIES[0]): string => {
  const converted = amount * currency.rate;
  if (currency.id === "irr") {
    if (converted >= 1e9) return currency.symbol + toPersianDigits(Math.round(converted / 1e9)) + " میلیارد";
    if (converted >= 1e6) return currency.symbol + toPersianDigits(Math.round(converted / 1e6)) + " میلیون";
    return currency.symbol + toPersianDigits(Math.round(converted));
  }
  if (converted >= 1e6) return currency.symbol + (converted / 1e6).toFixed(1) + "M";
  if (converted >= 1e3) return currency.symbol + (converted / 1e3).toFixed(1) + "K";
  return currency.symbol + converted.toFixed(2);
};

export default function YoutubeEarnings() {
  const [views, setViews] = useState("");
  const [niche, setNiche] = useState("tech");
  const [customCpmMin, setCustomCpmMin] = useState("");
  const [customCpmMax, setCustomCpmMax] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [currency, setCurrency] = useState("usd");
  const [revenueSplit, setRevenueSplit] = useState(55);

  const nicheData = NICHES.find((n) => n.id === niche)!;
  const cpmMin = useCustom ? parseFloat(customCpmMin) || 0 : nicheData.cpmMin;
  const cpmMax = useCustom ? parseFloat(customCpmMax) || 0 : nicheData.cpmMax;
  const viewsNum = parseFloat(views) || 0;
  const currencyData = CURRENCIES.find((c) => c.id === currency)!;

  const calc = (cpm: number) => (viewsNum / 1000) * cpm * (revenueSplit / 100);

  const low = calc(cpmMin);
  const mid = calc((cpmMin + cpmMax) / 2);
  const high = calc(cpmMax);

  const periods = [
    { label: "ماهانه", mult: 1 },
    { label: "هفتگی", mult: 1 / 4.33 },
    { label: "روزانه", mult: 1 / 30 },
    { label: "سالانه", mult: 12 },
  ];

  const barData = NICHES.map((n) => ({
    label: n.label,
    low: calc(n.cpmMin),
    high: calc(n.cpmMax),
  }));
  const maxBar = Math.max(...barData.map((b) => b.high), 1);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Youtube className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">محاسبه درآمد یوتیوب</h2>
      </div>

      {/* Input */}
      <div className="glass-card p-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">بازدید ماهانه</label>
            <input
              type="text" value={views} onChange={(e) => setViews(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="مثلاً: 100000"
              dir="ltr"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">دسته‌بندی محتوا</label>
            <select
              value={niche} onChange={(e) => setNiche(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {NICHES.map((n) => (
                <option key={n.id} value={n.id}>{n.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">واحد پول</label>
            <select
              value={currency} onChange={(e) => setCurrency(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CURRENCIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-foreground">سهم شما از درآمد (%)</label>
              <span className="text-xs text-muted-foreground">پیش‌فرض ۵۵٪</span>
            </div>
            <input
              type="range" min={40} max={100} value={revenueSplit} onChange={(e) => setRevenueSplit(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="text-center text-xs text-muted-foreground">{toPersianDigits(revenueSplit)}٪</div>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input type="checkbox" checked={useCustom} onChange={(e) => setUseCustom(e.target.checked)} className="accent-primary" />
          استفاده از CPM دلخواه
        </label>

        {useCustom && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">حداقل CPM ($)</label>
              <input type="text" value={customCpmMin} onChange={(e) => setCustomCpmMin(e.target.value)} placeholder="2" dir="ltr" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">حداکثر CPM ($)</label>
              <input type="text" value={customCpmMax} onChange={(e) => setCustomCpmMax(e.target.value)} placeholder="10" dir="ltr" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          بازه CPM: <span className="font-medium text-foreground" dir="ltr">${cpmMin} - ${cpmMax}</span> (هزار بازدید)
        </p>
      </div>

      {/* Results */}
      {viewsNum > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-card glow-effect p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">حداقل</p>
              <p className="text-2xl font-bold text-amber-500">{formatMoney(low, currencyData)}</p>
              <p className="text-[10px] text-muted-foreground mt-1">ماهانه</p>
            </div>
            <div className="glass-card glow-effect p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">تقریبی</p>
              <p className="text-2xl font-bold text-primary">{formatMoney(mid, currencyData)}</p>
              <p className="text-[10px] text-muted-foreground mt-1">ماهانه</p>
            </div>
            <div className="glass-card glow-effect p-5 text-center">
              <p className="text-xs text-muted-foreground mb-1">حداکثر</p>
              <p className="text-2xl font-bold text-emerald-500">{formatMoney(high, currencyData)}</p>
              <p className="text-[10px] text-muted-foreground mt-1">ماهانه</p>
            </div>
          </div>

          <div className="glass-card p-5 space-y-3">
            <span className="text-sm font-medium text-foreground">جدول درآمد دوره‌ای</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {periods.map((p) => (
                <div key={p.label} className="rounded-lg border border-border p-3 text-center space-y-1">
                  <p className="text-xs text-muted-foreground">{p.label}</p>
                  <p className="text-sm font-bold text-emerald-500">{formatMoney(mid * p.mult, currencyData)}</p>
                  <p className="text-[10px] text-muted-foreground">تا {formatMoney(high * p.mult, currencyData)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <BarChart3 className="h-4 w-4 text-primary" />
              مقایسه دسته‌بندی‌ها
            </div>
            <div className="space-y-2">
              {barData.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28 shrink-0 truncate">{item.label}</span>
                  <div className="flex-1 h-5 rounded bg-background border border-border overflow-hidden relative">
                    <div
                      className="h-full rounded bg-gradient-to-l from-primary/80 to-primary/40 transition-all"
                      style={{ width: Math.max((item.high / maxBar) * 100, 2) + "%" }}
                    />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-24 text-left truncate" dir="ltr">
                    {formatMoney(item.high, currencyData)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/50 p-3 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
        <span>
          CPM (هزینه به ازای هزار نمایش) بسته به کشور مخاطبان و دسته‌بندی محتوا متفاوت است.
          این محاسبه تقریبی است و درآمد واقعی ممکن است متفاوت باشد.
        </span>
      </div>
    </div>
  );
}
