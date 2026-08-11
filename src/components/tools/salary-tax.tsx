"use client";

import { useState } from "react";
import { FileText, Calculator, Info } from "lucide-react";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const formatMoney = (n: number) => toPersianDigits(Math.round(n).toLocaleString("en-US"));

// Year 1404 tax brackets (IRAN)
const TAX_BRACKETS_1404 = [
  { max: 120000000, rate: 0, min: 0 },
  { max: 165000000, rate: 0.10, min: 120000000 },
  { max: 270000000, rate: 0.15, min: 165000000 },
  { max: 420000000, rate: 0.20, min: 270000000 },
  { max: Infinity, rate: 0.30, min: 420000000 },
];

const TAX_BRACKETS_1405 = [
  { max: 150000000, rate: 0, min: 0 },
  { max: 210000000, rate: 0.10, min: 150000000 },
  { max: 360000000, rate: 0.15, min: 210000000 },
  { max: 540000000, rate: 0.20, min: 360000000 },
  { max: Infinity, rate: 0.30, min: 540000000 },
];

const EXEMPTION_1404 = 120000000;
const EXEMPTION_1405 = 150000000;

export default function SalaryTaxCalculator() {
  const [year, setYear] = useState<"1404" | "1405">("1404");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [dependents, setDependents] = useState("0");
  const [showDetails, setShowDetails] = useState(false);

  const brackets = year === "1404" ? TAX_BRACKETS_1404 : TAX_BRACKETS_1405;
  const exemption = year === "1404" ? EXEMPTION_1404 : EXEMPTION_1405;

  const salary = parseFloat(monthlySalary) || 0;
  const dep = parseInt(dependents) || 0;
  const annualSalary = salary * 12;

  // Dependents exemption: 1.5 million per dependent (1404), 1.8 million (1405)
  const dependentExemption = dep * (year === "1404" ? 1500000 : 1800000);
  const totalExemption = exemption + dependentExemption;

  // Taxable income is monthly, but brackets are annual
  const annualTaxable = Math.max(0, annualSalary - totalExemption);

  // Calculate annual tax
  let annualTax = 0;
  let bracketDetails: { range: string; rate: number; amount: number }[] = [];

  for (const bracket of brackets) {
    if (annualTaxable <= bracket.min) break;
    const taxableInBracket = Math.min(annualTaxable, bracket.max) - bracket.min;
    const taxInBracket = taxableInBracket * bracket.rate;
    annualTax += taxInBracket;
    bracketDetails.push({
      range: bracket.max === Infinity
        ? `بالاتر از ${formatMoney(bracket.min)}`
        : `${formatMoney(bracket.min)} - ${formatMoney(bracket.max)}`,
      rate: bracket.rate * 100,
      amount: taxInBracket,
    });
  }

  const monthlyTax = annualTax / 12;
  const effectiveRate = annualSalary > 0 ? (annualTax / annualSalary) * 100 : 0;

  // Standard insurance deduction (7% employee share)
  const insuranceDeduction = salary * 0.07;
  const netSalary = salary - insuranceDeduction - monthlyTax;

  const hasResult = salary > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">محاسبه مالیات حقوق</h2>
      </div>

      <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-4">
        <div className="flex items-start gap-2">
          <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
          <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <p>محاسبه بر اساس جدول مالیات حقوق سال {toPersianDigits(year)} و قانون مالیات‌های مستقیم ایران</p>
            <p>معافیت سال {toPersianDigits(year)}: {formatMoney(exemption / 1000000)} میلیون تومان سالانه</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">سال مالیاتی</label>
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
          <label className="text-sm font-medium text-foreground">حقوق و مزایای مشمول ماهانه (تومان)</label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Calculator className="h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              placeholder="مثلاً ۵۰۰۰۰۰۰۰"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              dir="ltr"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">تعداد افراد تحت تکفل</label>
          <input
            type="number"
            value={dependents}
            onChange={(e) => setDependents(e.target.value)}
            min="0"
            max="10"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            dir="ltr"
          />
        </div>

        <div className="space-y-2 flex items-end">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {showDetails ? "پنهان کردن جزئیات" : "نمایش جزئیات پله‌های مالیاتی"}
          </button>
        </div>
      </div>

      {hasResult && (
        <>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">شرح</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">مبلغ ماهانه (تومان)</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">مبلغ سالانه (تومان)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-foreground">حقوق و مزایای مشمول</td>
                  <td className="px-4 py-3 font-mono" dir="ltr">{formatMoney(salary)}</td>
                  <td className="px-4 py-3 font-mono" dir="ltr">{formatMoney(annualSalary)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-foreground">معافیت مالیاتی</td>
                  <td className="px-4 py-3 font-mono text-green-600" dir="ltr">-{formatMoney(totalExemption / 12)}</td>
                  <td className="px-4 py-3 font-mono text-green-600" dir="ltr">-{formatMoney(totalExemption)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-foreground">درآمد مشمول مالیات</td>
                  <td className="px-4 py-3 font-mono" dir="ltr">{formatMoney(Math.max(0, annualTaxable / 12))}</td>
                  <td className="px-4 py-3 font-mono" dir="ltr">{formatMoney(annualTaxable)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-red-500 font-medium">کسر بیمه (۷٪ سهم بیمه‌گذار)</td>
                  <td className="px-4 py-3 font-mono text-red-500" dir="ltr">-{formatMoney(insuranceDeduction)}</td>
                  <td className="px-4 py-3 font-mono text-red-500" dir="ltr">-{formatMoney(insuranceDeduction * 12)}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-3 text-red-500 font-medium">مالیات ماهانه</td>
                  <td className="px-4 py-3 font-mono text-red-500" dir="ltr">-{formatMoney(monthlyTax)}</td>
                  <td className="px-4 py-3 font-mono text-red-500" dir="ltr">-{formatMoney(annualTax)}</td>
                </tr>
                <tr className="bg-primary/5">
                  <td className="px-4 py-3 text-base font-bold text-primary">حقوق خالص پرداختی</td>
                  <td className="px-4 py-3 font-mono text-lg font-bold text-primary" dir="ltr">{formatMoney(netSalary)}</td>
                  <td className="px-4 py-3 font-mono text-lg font-bold text-primary" dir="ltr">{formatMoney(netSalary * 12)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Effective rate */}
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-sm text-muted-foreground">نرخ موثر مالیاتی</p>
            <p className="text-3xl font-bold text-primary font-mono" dir="ltr">{effectiveRate.toFixed(1)}%</p>
          </div>

          {/* Bracket details */}
          {showDetails && bracketDetails.length > 0 && (
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/50">
                <p className="font-medium text-foreground">جزئیات محاسبه بر اساس پله‌های مالیاتی</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-2 text-right font-medium text-muted-foreground">محدوده سالانه (تومان)</th>
                    <th className="px-4 py-2 text-center font-medium text-muted-foreground">نرخ</th>
                    <th className="px-4 py-2 text-left font-medium text-muted-foreground">مالیات (تومان)</th>
                  </tr>
                </thead>
                <tbody>
                  {bracketDetails.map((b, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-4 py-2 font-mono text-foreground" dir="ltr">{b.range}</td>
                      <td className="px-4 py-2 text-center font-mono text-foreground">{b.rate}%</td>
                      <td className="px-4 py-2 font-mono text-foreground" dir="ltr">{formatMoney(b.amount)}</td>
                    </tr>
                  ))}
                  <tr className="bg-primary/5">
                    <td className="px-4 py-2 font-bold text-primary">جمع مالیات سالانه</td>
                    <td className="px-4 py-2"></td>
                    <td className="px-4 py-2 font-mono font-bold text-primary" dir="ltr">{formatMoney(annualTax)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
