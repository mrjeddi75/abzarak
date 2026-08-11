"use client";

import { useState } from "react";
import { Wallet, Shield, Receipt, CircleDollarSign, Banknote } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const formatMoney = (n: number) => toPersianDigits(Math.round(n).toLocaleString("en-US"));

export default function SalaryCalculator() {
  const [gross, setGross] = useState("");
  const [insurancePercent, setInsurancePercent] = useState("7");
  const [taxPercent, setTaxPercent] = useState("9");
  const [otherDeductions, setOtherDeductions] = useState("");

  const g = parseFloat(gross) || 0;
  const ins = g * (parseFloat(insurancePercent) || 0) / 100;
  const tax = g * (parseFloat(taxPercent) || 0) / 100;
  const other = parseFloat(otherDeductions) || 0;
  const net = g - ins - tax - other;

  const hasResult = g > 0;

  const rows = [
    { label: "حقوق خام", amount: g, icon: Banknote, color: "text-foreground" },
    { label: "کسر بیمه", amount: -ins, icon: Shield, color: "text-red-500" },
    { label: "کسر مالیات", amount: -tax, icon: Receipt, color: "text-red-500" },
    { label: "سایر کسورات", amount: -other, icon: CircleDollarSign, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wallet className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">محاسبه‌گر حقوق خالص</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">حقوق خام (تومان)</label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            <input type="number" value={gross} onChange={(e) => setGross(e.target.value)} placeholder="مثلاً ۵۰۰۰۰۰۰۰"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none" dir="ltr" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">درصد بیمه (٪)</label>
          <input type="number" value={insurancePercent} onChange={(e) => setInsurancePercent(e.target.value)} placeholder="۷"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" dir="ltr" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">درصد مالیات (٪)</label>
          <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} placeholder="۹"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" dir="ltr" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">سایر کسورات (تومان)</label>
          <input type="number" value={otherDeductions} onChange={(e) => setOtherDeductions(e.target.value)} placeholder="۰"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" dir="ltr" />
        </div>
      </div>

      {hasResult && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">شرح</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">مبلغ (تومان)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 flex items-center gap-2">
                    <row.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-foreground">{row.label}</span>
                  </td>
                  <td className={cn("px-4 py-3 font-mono font-medium", row.color)} dir="ltr">
                    {formatMoney(Math.abs(row.amount))}
                  </td>
                </tr>
              ))}
              <tr className="bg-primary/5">
                <td className="px-4 py-3 flex items-center gap-2">
                  <span className="text-base font-bold text-primary">حقوق خالص</span>
                </td>
                <td className="px-4 py-3 font-mono text-lg font-bold text-primary" dir="ltr">
                  {formatMoney(net)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}