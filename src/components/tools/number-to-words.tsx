"use client";

import { useState } from "react";
import { Type } from "lucide-react";
import { cn } from "@/lib/utils";

const ones = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
const teens = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
const tens = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
const scales = ["", "هزار", "میلیون", "میلیارد", "تریلیون"];

function convertThreeDigits(n: number): string {
  if (n === 0) return "";
  const h = Math.floor(n / 100);
  const r = n % 100;
  let result = "";
  if (h > 0) {
    if (h === 1) result = "یکصد";
    else if (h === 2) result = "دویست";
    else result = ones[h] + "صد";
  }
  if (r === 0) return result;
  if (r < 10) {
    result = result ? result + " و " + ones[r] : ones[r];
  } else if (r < 20) {
    result = result ? result + " و " + teens[r - 10] : teens[r - 10];
  } else {
    const t = Math.floor(r / 10);
    const o = r % 10;
    if (o === 0) {
      result = result ? result + " و " + tens[t] : tens[t];
    } else {
      const twoDigit = tens[t] + " و " + ones[o];
      result = result ? result + " و " + twoDigit : twoDigit;
    }
  }
  return result;
}

function numberToPersianWords(num: number): string {
  if (num === 0) return "صفر";
  if (num < 0) return "منفی " + numberToPersianWords(-num);
  if (!Number.isFinite(num)) return "نامعتبر";

  const parts: string[] = [];
  let scaleIdx = 0;

  while (num > 0) {
    const chunk = num % 1000;
    if (chunk > 0) {
      const words = convertThreeDigits(chunk);
      const scaleName = scales[scaleIdx] || "";
      parts.unshift(words + (scaleName ? " " + scaleName : ""));
    }
    num = Math.floor(num / 1000);
    scaleIdx++;
  }

  return parts.join(" و ");
}

export default function NumberToWords() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleConvert = () => {
    const num = parseInt(input.replace(/[,،\s]/g, ""), 10);
    if (isNaN(num)) {
      setResult("لطفاً یک عدد معتبر وارد کنید");
      return;
    }
    setResult(numberToPersianWords(num));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleConvert();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Type className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">عدد به حروف فارسی</h2>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
            عدد مورد نظر
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString()))}
            onKeyDown={handleKeyDown}
            placeholder="مثال: 1234567"
            dir="ltr"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          onClick={handleConvert}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          تبدیل به حروف
        </button>

        {result && (
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="mb-1 text-xs text-muted-foreground">نتیجه</p>
            <p className="text-lg font-bold text-primary leading-8">{result}</p>
          </div>
        )}

        <div className="rounded-lg border border-border bg-muted/50 p-3">
          <p className="text-xs text-muted-foreground">
            پشتیبانی از اعداد تا تریلیون. اعداد منفی و اعشاری نیز پشتیبانی می‌شوند.
          </p>
        </div>
      </div>
    </div>
  );
}
