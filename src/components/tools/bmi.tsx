"use client";

import { useState } from "react";
import { Scale, Ruler, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) return { label: "لاغر", color: "bg-blue-500", textColor: "text-blue-500", percent: Math.min((bmi / 40) * 100, 100) };
  if (bmi < 25) return { label: "نرمال", color: "bg-green-500", textColor: "text-green-500", percent: Math.min((bmi / 40) * 100, 100) };
  if (bmi < 30) return { label: "اضافه وزن", color: "bg-yellow-500", textColor: "text-yellow-500", percent: Math.min((bmi / 40) * 100, 100) };
  return { label: "چاق", color: "bg-red-500", textColor: "text-red-500", percent: Math.min((bmi / 40) * 100, 100) };
};

export default function BMICalculator() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");

  const bmi = weight && height ? parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2) : null;
  const category = bmi ? getBMICategory(bmi) : null;
  const heightM = height ? parseFloat(height) / 100 : 0;
  const idealMin = heightM ? (18.5 * heightM * heightM).toFixed(1) : "—";
  const idealMax = heightM ? (24.9 * heightM * heightM).toFixed(1) : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Scale className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">محاسبه‌گر شاخص توده بدنی (BMI)</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">وزن (کیلوگرم)</label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Scale className="h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="مثلاً ۷۰"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              dir="ltr"
            />
            <span className="text-sm text-muted-foreground">kg</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">قد (سانتی‌متر)</label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="مثلاً ۱۷۵"
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
              dir="ltr"
            />
            <span className="text-sm text-muted-foreground">cm</span>
          </div>
        </div>
      </div>

      {bmi && category && (
        <div className="space-y-4 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">شاخص BMI شما</span>
            <span className={cn("text-2xl font-bold", category.textColor)}>
              {toPersianDigits(bmi.toFixed(1))}
            </span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all duration-500", category.color)}
              style={{ width: `${category.percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-blue-500">لاغر</span>
            <span className="text-green-500">نرمال</span>
            <span className="text-yellow-500">اضافه وزن</span>
            <span className="text-red-500">چاق</span>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-md bg-primary/10 p-2">
            <span className="text-sm text-muted-foreground">وضعیت شما:</span>
            <span className={cn("text-lg font-bold", category.textColor)}>{category.label}</span>
          </div>

          <div className="flex items-start gap-2 rounded-md bg-background p-3">
            <Info className="mt-0.5 h-4 w-4 text-primary shrink-0" />
            <p className="text-sm text-muted-foreground">
              محدوده وزن ایده‌آل برای قد شما: {toPersianDigits(idealMin)} تا {toPersianDigits(idealMax)} کیلوگرم
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
