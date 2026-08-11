"use client";

import { useState } from "react";
import { Percent, ArrowLeftRight, ArrowRightLeft, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

type Mode = "of" | "is" | "change";

const tabs: { key: Mode; label: string; icon: React.ElementType }[] = [
  { key: "of", label: "X٪ از Y", icon: Percent },
  { key: "is", label: "X چند ٪ از Y؟", icon: ArrowLeftRight },
  { key: "change", label: "تغییر درصدی", icon: TrendingUp },
];

export default function PercentCalculator() {
  const [mode, setMode] = useState<Mode>("of");
  const [x, setX] = useState("");
  const [y, setY] = useState("");

  const xNum = parseFloat(x) || 0;
  const yNum = parseFloat(y) || 0;

  let result = "—";
  if (mode === "of" && yNum > 0) {
    result = toPersianDigits(((xNum / 100) * yNum).toFixed(4));
  } else if (mode === "is" && xNum > 0) {
    result = toPersianDigits(((xNum / yNum) * 100).toFixed(4)) + " ٪";
  } else if (mode === "change" && yNum !== 0) {
    const change = ((xNum - yNum) / Math.abs(yNum)) * 100;
    const sign = change >= 0 ? "+" : "";
    result = sign + toPersianDigits(change.toFixed(4)) + " ٪";
  }

  const inputLabels: Record<Mode, { x: string; y: string }> = {
    of: { x: "درصد (X)", y: "عدد (Y)" },
    is: { x: "عدد (X)", y: "مقدار کل (Y)" },
    change: { x: "مقدار جدید", y: "مقدار قدیم" },
  };

  const descriptions: Record<Mode, string> = {
    of: "X٪ از Y چند می‌شود؟",
    is: "X چند درصد از Y است؟",
    change: "درصد تغییر از Y به X چقدر است؟",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Percent className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">محاسبه‌گر درصد</h2>
      </div>

      <div className="flex gap-2 rounded-lg bg-muted p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setMode(tab.key); setX(""); setY(""); }}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              mode === tab.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">{descriptions[mode]}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{inputLabels[mode].x}</label>
          <input
            type="number"
            value={x}
            onChange={(e) => setX(e.target.value)}
            placeholder="X"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            dir="ltr"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{inputLabels[mode].y}</label>
          <input
            type="number"
            value={y}
            onChange={(e) => setY(e.target.value)}
            placeholder="Y"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            dir="ltr"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">نتیجه</p>
        <p className="text-3xl font-bold text-primary dir-ltr" dir="ltr">{result}</p>
      </div>
    </div>
  );
}
