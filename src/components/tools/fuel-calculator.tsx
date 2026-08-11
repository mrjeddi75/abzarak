"use client";

import { useState } from "react";
import { Fuel, DollarSign, Route } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const formatNumber = (n: number): string => {
  return toPersianDigits(n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 }));
};

export default function FuelCalculator() {
  const [kilometers, setKilometers] = useState("");
  const [liters, setLiters] = useState("");
  const [pricePerLiter, setPricePerLiter] = useState("");

  const km = parseFloat(kilometers) || 0;
  const ltr = parseFloat(liters) || 0;
  const price = parseFloat(pricePerLiter) || 0;

  const consumptionPer100 = km > 0 ? (ltr / km) * 100 : 0;
  const totalCost = price > 0 ? ltr * price : 0;

  const hasValidInput = km > 0 && ltr > 0;

  const getStatus = () => {
    if (!hasValidInput) return null;
    if (consumptionPer100 < 6) return { label: "اقتصادی", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" };
    if (consumptionPer100 <= 8) return { label: "متوسط", color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/30" };
    return { label: "پرمصرف", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" };
  };

  const status = getStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Fuel className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">محاسبه‌گر مصرف سوخت</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Inputs */}
        <div className="glass-card glow-effect p-6 space-y-5">
          {/* Kilometers */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Route className="h-4 w-4 text-primary" />
              کیلومتر طی شده
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--background)]/60 px-3 py-2.5">
              <input
                type="number"
                min="0"
                value={kilometers}
                onChange={(e) => setKilometers(e.target.value)}
                placeholder="مثلاً ۴۵۰"
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                dir="ltr"
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">کیلومتر</span>
            </div>
          </div>

          {/* Liters consumed */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Fuel className="h-4 w-4 text-primary" />
              مقدار سوخت مصرفی
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--background)]/60 px-3 py-2.5">
              <input
                type="number"
                min="0"
                step="0.1"
                value={liters}
                onChange={(e) => setLiters(e.target.value)}
                placeholder="مثلاً ۳۶"
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                dir="ltr"
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">لیتر</span>
            </div>
          </div>

          {/* Fuel price per liter (optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              قیمت هر لیتر سوخت
              <span className="text-xs text-muted-foreground font-normal">(اختیاری)</span>
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--glass-border)] bg-[var(--background)]/60 px-3 py-2.5">
              <input
                type="number"
                min="0"
                value={pricePerLiter}
                onChange={(e) => setPricePerLiter(e.target.value)}
                placeholder="مثلاً ۱۰۰۰۰"
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                dir="ltr"
              />
              <span className="text-xs text-muted-foreground whitespace-nowrap">تومان/لیتر</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {hasValidInput && status && (
            <>
              {/* Main consumption result */}
              <div className={cn(
                "glass-card glow-effect p-6 text-center animate-scale-in",
                status.border
              )}>
                <p className="text-sm text-muted-foreground mb-2">مصرف سوخت در هر ۱۰۰ کیلومتر</p>
                <p className={cn("text-4xl font-bold tabular-nums", status.color)} dir="ltr">
                  {toPersianDigits(consumptionPer100.toFixed(2))}
                </p>
                <p className="text-sm text-muted-foreground mt-1">لیتر / ۱۰۰ کیلومتر</p>
                <div className={cn(
                  "mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                  status.bg, status.color
                )}>
                  {status.label === "اقتصادی" && "✅ "}
                  {status.label === "متوسط" && "⚠️ "}
                  {status.label === "پرمصرف" && "🔴 "}
                  {status.label}
                </div>
              </div>

              {/* Breakdown card */}
              <div className="glass-card p-5 space-y-3 animate-fade-in-up">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">مسافت طی شده</span>
                  <span className="text-foreground font-medium" dir="ltr">
                    {toPersianDigits(km.toString())} km
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">سوخت مصرفی</span>
                  <span className="text-foreground font-medium" dir="ltr">
                    {toPersianDigits(ltr.toFixed(1))} L
                  </span>
                </div>
                <div className="border-t border-[var(--glass-border)] flex items-center justify-between text-sm font-bold">
                  <span className="text-foreground">مصرف در ۱۰۰ کیلومتر</span>
                  <span className={status.color} dir="ltr">
                    {toPersianDigits(consumptionPer100.toFixed(2))} L
                  </span>
                </div>

                {price > 0 && (
                  <>
                    <div className="border-t border-[var(--glass-border)]" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">قیمت هر لیتر</span>
                      <span className="text-foreground font-medium" dir="ltr">
                        {formatNumber(price)} تومان
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="text-foreground">هزینه کل سوخت</span>
                      <span className="text-primary" dir="ltr">
                        {formatNumber(Math.round(totalCost))} تومان
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">هزینه هر کیلومتر</span>
                      <span className="text-foreground font-medium" dir="ltr">
                        {toPersianDigits((totalCost / km).toFixed(0))} تومان
                      </span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {!hasValidInput && (
            <div className="glass-card p-10 flex flex-col items-center justify-center text-muted-foreground text-sm gap-3">
              <Fuel className="h-10 w-10 opacity-20" />
              <p>کیلومتر طی شده و مقدار سوخت مصرفی را وارد کنید</p>
              <div className="text-xs space-y-1 text-center mt-2">
                <p className={"text-green-500"}>کمتر از ۶ لیتر: اقتصادی ✅</p>
                <p className={"text-yellow-500"}>۶ تا ۸ لیتر: متوسط ⚠️</p>
                <p className={"text-red-500"}>بیشتر از ۸ لیتر: پرمصرف 🔴</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
