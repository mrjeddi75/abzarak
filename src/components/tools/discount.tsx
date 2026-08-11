"use client";

import { useState } from "react";
import { Tag, ArrowDown, CircleDollarSign, TrendingDown, BadgePercent } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const formatMoney = (n: number) =>
  toPersianDigits(Math.round(n).toLocaleString("en-US"));

export default function DiscountCalculator() {
  const [price, setPrice] = useState("");
  const [d1, setD1] = useState("");
  const [d2, setD2] = useState("");
  const [d3, setD3] = useState("");

  const originalPrice = parseFloat(price) || 0;
  const disc1 = parseFloat(d1) || 0;
  const disc2 = parseFloat(d2) || 0;
  const disc3 = parseFloat(d3) || 0;

  const priceAfter1 = originalPrice * (1 - disc1 / 100);
  const priceAfter2 = priceAfter1 * (1 - disc2 / 100);
  const priceAfter3 = priceAfter2 * (1 - disc3 / 100);
  const totalDiscount = originalPrice - priceAfter3;

  const hasPrice = originalPrice > 0;
  const hasDiscount = disc1 > 0 || disc2 > 0 || disc3 > 0;

  const levels = [
    { label: "تخفیف ۱", value: d1, setter: setD1, after: priceAfter1, prev: originalPrice },
    { label: "تخفیف ۲", value: d2, setter: setD2, after: priceAfter2, prev: priceAfter1 },
    { label: "تخفیف ۳", value: d3, setter: setD3, after: priceAfter3, prev: priceAfter2 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Tag className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">ماشین‌حساب تخفیف</h2>
      </div>

      {/* Original price */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          قیمت اصلی (تومان)
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <CircleDollarSign className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="مثلاً ۵۰۰۰۰۰"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
            dir="ltr"
            min="0"
          />
        </div>
      </div>

      {/* Discount levels */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-foreground flex items-center gap-2">
          <BadgePercent className="h-4 w-4 text-primary" />
          سطوح تخفیف (درصد)
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {levels.map((level) => (
            <div key={level.label} className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {level.label} (٪)
              </label>
              <input
                type="number"
                value={level.value}
                onChange={(e) => level.setter(e.target.value)}
                placeholder="۰"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                dir="ltr"
                min="0"
                max="100"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrow separator */}
      <div className="flex justify-center">
        <ArrowDown className="h-5 w-5 text-muted-foreground" />
      </div>

      {/* Results */}
      {hasPrice && (
        <div className="grid gap-4 sm:grid-cols-3">
          {levels.map((level, i) => {
            const isActive = hasDiscount && (i === 0 && disc1 > 0) ||
              (i === 1 && (disc1 > 0 || disc2 > 0)) ||
              (i === 2 && (disc1 > 0 || disc2 > 0 || disc3 > 0));

            const saved = level.prev - level.after;
            const pctDiscount = level.prev > 0
              ? ((saved / level.prev) * 100).toFixed(1)
              : "0";

            return (
              <div
                key={level.label}
                className={cn(
                  "rounded-lg border p-4 transition-colors",
                  isActive
                    ? "border-primary/30 bg-primary/5"
                    : "border-border bg-card"
                )}
              >
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  قیمت بعد از {level.label}
                </p>
                <p
                  className="text-xl font-bold text-foreground"
                  dir="ltr"
                >
                  {formatMoney(level.after)}
                </p>
                <p className="text-xs text-muted-foreground mt-1" dir="ltr">
                  {isActive
                    ? `(${toPersianDigits(pctDiscount)}٪ تخفیف = ${formatMoney(saved)} تومان)`
                    : "بدون تخفیف"}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Summary cards */}
      {hasPrice && hasDiscount && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="text-sm font-medium text-red-400 flex items-center gap-2 mb-1">
              <TrendingDown className="h-4 w-4" />
              مبلغ کل تخفیف
            </p>
            <p className="text-2xl font-bold text-red-400" dir="ltr">
              {formatMoney(totalDiscount)} تومان
            </p>
            <p className="text-xs text-muted-foreground mt-1" dir="ltr">
              {toPersianDigits(
                (originalPrice > 0
                  ? ((totalDiscount / originalPrice) * 100).toFixed(1)
                  : "0"
                )
              )}
              ٪ از قیمت اصلی
            </p>
          </div>

          <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
            <p className="text-sm font-medium text-primary flex items-center gap-2 mb-1">
              <CircleDollarSign className="h-4 w-4" />
              قیمت نهایی
            </p>
            <p className="text-2xl font-bold text-primary" dir="ltr">
              {formatMoney(priceAfter3)} تومان
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              قیمت بعد از اعمال همه تخفیف‌ها
            </p>
          </div>
        </div>
      )}

      {hasPrice && !hasDiscount && (
        <div className="rounded-lg border border-border bg-muted/50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            حداقل یک تخفیف وارد کنید تا نتایج محاسبه شوند.
          </p>
        </div>
      )}
    </div>
  );
}
