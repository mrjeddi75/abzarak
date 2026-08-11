"use client";

import { useState } from "react";
import { Gift, Calendar, Info } from "lucide-react";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const formatMoney = (n: number) => toPersianDigits(Math.round(n).toLocaleString("en-US"));

// 1405 daily minimum wage (tomans)
const MIN_DAILY_1405 = 3713500;
const MIN_MONTHLY_1405 = MIN_DAILY_1405 * 30;

// Senavat base daily 1405
const SANAVAT_DAILY_1405 = 150000;

export default function EidiSanavatCalculator() {
  const [year, setYear] = useState<"1404" | "1405">("1405");
  const [baseSalary, setBaseSalary] = useState("");
  const [workDays, setWorkDays] = useState("365");
  const [childrenCount, setChildrenCount] = useState("0");

  const salary = parseFloat(baseSalary) || 0;
  const days = parseFloat(workDays) || 0;
  const children = parseInt(childrenCount) || 0;

  // Eidi calculation
  // Minimum: 2 * daily min wage * (work_days / 365)
  // Maximum: 3 * daily min wage * (work_days / 365)
  // Actual: 1 month base salary (last month) * (work_days / 365)

  const minEidi = 2 * MIN_DAILY_1405 * (days / 365);
  const maxEidi = 3 * MIN_DAILY_1405 * (days / 365);

  // If user provides salary, calculate actual eidi
  const actualEidi = salary > 0
    ? Math.min(Math.max(minEidi, salary * (days / 365)), maxEidi)
    : 0;

  // Sanavat calculation
  // Senavat = daily sanavat base * work years (max 1 year per employment)
  // We calculate based on days worked
  const sanavatPerDay = salary > 0 ? salary / 30 : MIN_DAILY_1405;
  const sanavatDailyBase = year === "1405" ? SANAVAT_DAILY_1405 : 94000;
  const sanavatAmount = sanavatDailyBase * (days > 30 ? 1 : days / 30);

  const hasResult = days > 0;

  // Eidi tax exemption (up to ceiling)
  const eidiTaxExempt = actualEidi <= maxEidi;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Gift className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">محاسبه عیدی و سنوات</h2>
      </div>

      <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
            <p>بر اساس قانون کار ایران، عیدی معادل دو تا سه برابر حداقل دستمزد روزانه برای ۳۰ روز محاسبه می‌شود.</p>
            <p>حداقل عیدی: ۲ برابر حداقل دستمزد روزانه</p>
            <p>حداکثر عیدی: ۳ برابر حداقل دستمزد روزانه</p>
            <p>حق سنوات معادل یک ماه حقوق پایه برای هر سال کارکرد (حداقل ۹۰ روز کارکرد)</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">سال</label>
          <div className="flex gap-2">
            {(["1404", "1405"] as const).map((y) => (
              <button
                key={y}
                onClick={() => setYear(y)}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  year === y
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-accent"
                }`}
              >
                {toPersianDigits(y)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">حقوق پایه ماهانه (تومان) — اختیاری</label>
          <input
            type="number"
            value={baseSalary}
            onChange={(e) => setBaseSalary(e.target.value)}
            placeholder="اگر خالی باشد حداقل دستمزد در نظر گرفته می‌شود"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">تعداد روزهای کارکرد در سال</label>
          <input
            type="number"
            value={workDays}
            onChange={(e) => setWorkDays(e.target.value)}
            placeholder="۳۶۵"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">تعداد فرزند (برای محاسبه حق عائله‌مندی)</label>
          <input
            type="number"
            value={childrenCount}
            onChange={(e) => setChildrenCount(e.target.value)}
            min="0"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            dir="ltr"
          />
        </div>
      </div>

      {hasResult && (
        <div className="space-y-4">
          {/* Eidi Section */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/50 flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <p className="font-medium text-foreground">محاسبه عیدی</p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-muted-foreground">حداقل دستمزد روزانه (تومان)</td>
                  <td className="px-4 py-3 font-mono text-foreground" dir="ltr">{formatMoney(MIN_DAILY_1405)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-muted-foreground">حداقل عیدی (۲ برابر)</td>
                  <td className="px-4 py-3 font-mono text-green-600" dir="ltr">{formatMoney(minEidi)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-muted-foreground">حداکثر عیدی (۳ برابر)</td>
                  <td className="px-4 py-3 font-mono text-red-500" dir="ltr">{formatMoney(maxEidi)}</td>
                </tr>
                {salary > 0 && (
                  <tr className="border-b border-border bg-primary/5">
                    <td className="px-4 py-3 font-bold text-primary">عیدی قابل پرداخت</td>
                    <td className="px-4 py-3 font-mono text-lg font-bold text-primary" dir="ltr">{formatMoney(actualEidi)}</td>
                  </tr>
                )}
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-muted-foreground">وضعیت مالیات عیدی</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                      معاف از مالیات
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sanavat Section */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/50 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <p className="font-medium text-foreground">محاسبه حق سنوات</p>
            </div>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-muted-foreground">پایه سنوات روزانه (تومان)</td>
                  <td className="px-4 py-3 font-mono text-foreground" dir="ltr">{formatMoney(sanavatDailyBase)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-muted-foreground">مزد روزانه شغل (تومان)</td>
                  <td className="px-4 py-3 font-mono text-foreground" dir="ltr">{formatMoney(sanavatPerDay)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-muted-foreground">روزهای کارکرد</td>
                  <td className="px-4 py-3 font-mono text-foreground" dir="ltr">{toPersianDigits(String(Math.round(days)))} روز</td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="px-4 py-3 font-bold text-primary">حق سنوات</td>
                  <td className="px-4 py-3 font-mono text-lg font-bold text-primary" dir="ltr">{formatMoney(sanavatAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          {salary > 0 && (
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">مجموع دریافتی (عیدی + سنوات)</p>
              <p className="text-3xl font-bold text-primary font-mono" dir="ltr">
                {formatMoney(actualEidi + sanavatAmount)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">تومان</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
