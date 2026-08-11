"use client";

import { useState } from "react";
import { Home, Utensils, Info } from "lucide-react";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const formatMoney = (n: number) => toPersianDigits(Math.round(n).toLocaleString("en-US"));

// 1405 allowance rates
const ALLOWANCES_1405 = {
  housing: { daily: 9000000, monthly: 9000000 * 30, marriedMultiplier: 1.5 },   // right maskan
  grocery: { daily: 1400000, monthly: 1400000 * 30 },                           // right khavarbar
  childAllowance: { amount: 7000000 * 30 },  // per child monthly (14M daily * 30)
};

// 1404 allowance rates
const ALLOWANCES_1404 = {
  housing: { daily: 7000000, monthly: 7000000 * 30, marriedMultiplier: 1.5 },
  grocery: { daily: 1000000, monthly: 1000000 * 30 },
  childAllowance: { amount: 5000000 * 30 },
};

export default function HousingAllowanceCalculator() {
  const [year, setYear] = useState<"1404" | "1405">("1405");
  const [isMarried, setIsMarried] = useState(false);
  const [childCount, setChildCount] = useState("0");
  const [isTehran, setIsTehran] = useState(true);
  const [baseSalary, setBaseSalary] = useState("");

  const allowances = year === "1405" ? ALLOWANCES_1405 : ALLOWANCES_1404;
  const children = parseInt(childCount) || 0;
  const salary = parseFloat(baseSalary) || 0;

  // Housing allowance
  const housingBase = allowances.housing.monthly;
  const housingAmount = isMarried ? housingBase * allowances.housing.marriedMultiplier : housingBase;

  // Grocery allowance (same for everyone)
  const groceryAmount = allowances.grocery.monthly;

  // Child allowance
  const childTotal = children * allowances.childAllowance.amount;

  // Total benefits
  const totalBenefits = housingAmount + groceryAmount + childTotal;

  // Total with base salary
  const totalWithSalary = salary + totalBenefits;

  const hasResult = true; // Always show since allowances don't depend on input

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Home className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">محاسبه حق مسکن و مزایا</h2>
      </div>

      <div className="rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/30 p-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-indigo-500 mt-0.5 shrink-0" />
          <div className="text-sm text-indigo-700 dark:text-indigo-300 space-y-1">
            <p>محاسبه حق مسکن، بن کارگری (خواربار) و حق اولاد بر اساس نرخ‌های مصوب سال {toPersianDigits(year)}</p>
            <p>حق مسکن متاهلین: ۱.۵ برابر مجردین</p>
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
          <label className="text-sm font-medium text-foreground">وضعیت تاهل</label>
          <div className="flex gap-2">
            <button
              onClick={() => setIsMarried(false)}
              className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                !isMarried
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-accent"
              }`}
            >
              مجرد
            </button>
            <button
              onClick={() => setIsMarried(true)}
              className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                isMarried
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-accent"
              }`}
            >
              متاهل
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">تعداد فرزندان</label>
          <input
            type="number"
            value={childCount}
            onChange={(e) => setChildCount(e.target.value)}
            min="0"
            max="10"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            dir="ltr"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">حقوق پایه ماهانه (تومان) — اختیاری</label>
          <input
            type="number"
            value={baseSalary}
            onChange={(e) => setBaseSalary(e.target.value)}
            placeholder="برای محاسبه مجموع حقوق"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            dir="ltr"
          />
        </div>
      </div>

      {hasResult && (
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">نوع مزیت</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">مبلغ ماهانه (تومان)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-blue-500" />
                      <span className="text-foreground">حق مسکن {isMarried ? "(متاهل)" : "(مجرد)"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-blue-600" dir="ltr">{formatMoney(housingAmount)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Utensils className="h-4 w-4 text-green-500" />
                      <span className="text-foreground">بن خواربار (کارگری)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-green-600" dir="ltr">{formatMoney(groceryAmount)}</td>
                </tr>
                {children > 0 && (
                  <tr className="border-b border-border">
                    <td className="px-4 py-3 text-foreground">
                      حق اولاد ({toPersianDigits(String(children))} فرزند)
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-purple-600" dir="ltr">{formatMoney(childTotal)}</td>
                  </tr>
                )}
                <tr className="bg-primary/5">
                  <td className="px-4 py-3 font-bold text-primary">مجموع مزایای جانبی</td>
                  <td className="px-4 py-3 font-mono text-lg font-bold text-primary" dir="ltr">{formatMoney(totalBenefits)}</td>
                </tr>
                {salary > 0 && (
                  <tr className="border-t-2 border-primary">
                    <td className="px-4 py-3 font-bold text-foreground">مجموع با حقوق پایه</td>
                    <td className="px-4 py-3 font-mono text-lg font-bold text-foreground" dir="ltr">{formatMoney(totalWithSalary)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <Home className="h-6 w-6 text-blue-500 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">حق مسکن روزانه</p>
              <p className="font-mono font-bold text-foreground" dir="ltr">{formatMoney(allowances.housing.daily)}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <Utensils className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">بن خواربار روزانه</p>
              <p className="font-mono font-bold text-foreground" dir="ltr">{formatMoney(allowances.grocery.daily)}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 text-center">
              <Home className="h-6 w-6 text-purple-500 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground">ضریب متاهلین</p>
              <p className="font-mono font-bold text-foreground">۱.۵x</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
