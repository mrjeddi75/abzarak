"use client";

import { useState } from "react";
import { Banknote, Percent, Calendar, TrendingUp, Coins, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const formatNumber = (n: number) => {
  return toPersianDigits(Math.round(n).toLocaleString("en-US"));
};

export default function InterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [months, setMonths] = useState("");

  const p = parseFloat(principal) || 0;
  const r = parseFloat(rate) || 0;
  const m = parseInt(months) || 0;

  const monthlyRate = r / 100 / 12;
  const totalProfit = monthlyRate > 0
    ? p * (Math.pow(1 + monthlyRate, m) - 1)
    : p * (r / 100) * (m / 12);
  const monthlyProfit = m > 0 ? totalProfit / m : 0;
  const totalAmount = p + totalProfit;

  const hasResult = p > 0 && r > 0 && m > 0;

  const cards = [
    {
      icon: Coins,
      label: "سود ماهانه",
      value: hasResult ? `${formatNumber(monthlyProfit)} تومان` : "—",
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      icon: TrendingUp,
      label: "کل سود",
      value: hasResult ? `${formatNumber(totalProfit)} تومان` : "—",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Wallet,
      label: "مبلغ نهایی",
      value: hasResult ? `${formatNumber(totalAmount)} تومان` : "—",
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Banknote className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">محاسبه‌گر سود بانکی</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">مبلغ اصلی (تومان)</label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Banknote className="h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="مثلاً ۱۰۰۰۰۰۰۰۰"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              dir="ltr"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">نرخ سود سالانه (٪)</label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Percent className="h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="مثلاً ۲۵"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              dir="ltr"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">مدت (ماه)</label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="مثلاً ۱۲"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card, i) => (
          <div key={i} className={cn("rounded-lg border border-border bg-card p-4 space-y-2")}>
            <div className={cn("flex items-center gap-2", card.bg, "w-fit rounded-md p-2")}>
              <card.icon className={cn("h-5 w-5", card.color)} />
            </div>
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className={cn("text-lg font-bold", card.color)}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
