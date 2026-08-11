"use client";

import { useState } from "react";
import { Shield, Heart, Info } from "lucide-react";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const formatMoney = (n: number) => toPersianDigits(Math.round(n).toLocaleString("en-US"));

// 1405 rates
const RATES_1405 = {
  minDaily: 3713500,
  minMonthly: 3713500 * 30,
  employeeRate: 0.07,     // 7%
  employerRate: 0.23,     // 23% (20% insurance + 3% unemployment)
  totalRate: 0.30,        // 30%
  maxInsurable: 3713500 * 10, // ceiling for insurance
};

export default function InsuranceCalculator() {
  const [salary, setSalary] = useState("");
  const [customRate, setCustomRate] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const sal = parseFloat(salary) || 0;
  const custom = parseFloat(customRate) || 0;

  const insurableSalary = Math.min(sal, RATES_1405.maxInsurable);
  const employeeRate = useCustom ? custom / 100 : RATES_1405.employeeRate;
  const employerRate = useCustom ? (custom * 23 / 7) / 100 : RATES_1405.employerRate;
  const totalRate = employeeRate + employerRate;

  const employeeDeduction = insurableSalary * employeeRate;
  const employerDeduction = insurableSalary * employerRate;
  const totalDeduction = insurableSalary * totalRate;

  // Monthly and yearly
  const employeeMonthly = employeeDeduction;
  const employerMonthly = employerDeduction;
  const totalMonthly = totalDeduction;
  const employeeYearly = employeeMonthly * 12;
  const employerYearly = employerMonthly * 12;
  const totalYearly = totalMonthly * 12;

  const hasResult = sal > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">محاسبه بیمه تامین اجتماعی</h2>
      </div>

      <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
          <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <p>سهم بیمه‌گذار (کارگر): ۷٪ | سهم کارفرما: ۲۳٪ | جمع: ۳۰٪</p>
            <p>حداکثر حقوق مشمول بیمه: ۱۰ برابر حداقل دستمزد روزانه</p>
            <p>حداقل دستمزد روزانه {toPersianDigits("1405")}: {formatMoney(RATES_1405.minDaily)} تومان</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">حقوق و مزایای مشمول بیمه (تومان/ماهانه)</label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Heart className="h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="مثلاً ۵۰۰۰۰۰۰۰"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              dir="ltr"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <input
              type="checkbox"
              checked={useCustom}
              onChange={(e) => setUseCustom(e.target.checked)}
              className="rounded border-border"
            />
            استفاده از درصد سفارشی
          </label>
          <input
            type="number"
            value={customRate}
            onChange={(e) => setCustomRate(e.target.value)}
            placeholder="مثلاً ۷"
            disabled={!useCustom}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            dir="ltr"
          />
        </div>
      </div>

      {hasResult && (
        <div className="space-y-4">
          {/* Ceiling check */}
          {sal > RATES_1405.maxInsurable && (
            <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3">
              <p className="text-sm text-amber-700 dark:text-amber-300">
                حقوق شما از سقف مشمولیت بیمه بیشتر است. حقوق مشمول: {formatMoney(RATES_1405.maxInsurable)} تومان
              </p>
            </div>
          )}

          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">شرح</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">ماهانه (تومان)</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">سالانه (تومان)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-foreground">حقوق مشمول بیمه</td>
                  <td className="px-4 py-3 font-mono" dir="ltr">{formatMoney(insurableSalary)}</td>
                  <td className="px-4 py-3 font-mono" dir="ltr">{formatMoney(insurableSalary * 12)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      <span className="text-foreground">سهم بیمه‌گذار ({(employeeRate * 100).toFixed(0)}٪)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-blue-600" dir="ltr">{formatMoney(employeeMonthly)}</td>
                  <td className="px-4 py-3 font-mono text-blue-600" dir="ltr">{formatMoney(employeeYearly)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      <span className="text-foreground">سهم کارفرما ({(employerRate * 100).toFixed(0)}٪)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-purple-600" dir="ltr">{formatMoney(employerMonthly)}</td>
                  <td className="px-4 py-3 font-mono text-purple-600" dir="ltr">{formatMoney(employerYearly)}</td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary"></span>
                      <span className="font-bold text-primary">جمع کل ({(totalRate * 100).toFixed(0)}٪)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-lg font-bold text-primary" dir="ltr">{formatMoney(totalMonthly)}</td>
                  <td className="px-4 py-3 font-mono text-lg font-bold text-primary" dir="ltr">{formatMoney(totalYearly)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Employer breakdown */}
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium text-foreground mb-3">تفکیک سهم کارفرما</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-border p-3">
                <p className="text-muted-foreground">بیمه年老 و ازکارافتادگی (۲۰٪)</p>
                <p className="font-mono font-medium text-foreground" dir="ltr">{formatMoney(insurableSalary * 0.20)}</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <p className="text-muted-foreground">بیمه بیکاری (۳٪)</p>
                <p className="font-mono font-medium text-foreground" dir="ltr">{formatMoney(insurableSalary * 0.03)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
