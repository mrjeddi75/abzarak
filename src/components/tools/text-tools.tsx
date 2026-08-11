"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Copy,
  Check,
  Trash2,
  Play,
  RemoveFormatting,
  AlignLeft,
  Scissors,
  Type,
  EyeOff,
} from "lucide-react";

interface Operation {
  id: string;
  label: string;
  icon: React.ElementType;
  fn: (text: string) => string;
}

const removeExtraSpaces = (text: string) => text.replace(/ {2,}/g, " ");

const removeEmptyLines = (text: string) =>
  text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .join("\n");

const trimAllLines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .join("\n");

const normalizeSpaces = (text: string) => text.replace(/[\t ]+/g, " ");

const removeInvisibleChars = (text: string) =>
  text
    .replace(/[\u200B\u200C\u200D\u200E\u200F\uFEFF\u00AD\u2060\u2061\u2062\u2063\u2064]/g, "")
    .replace(/[\u200B\u200C\u200D\u200E\u200F\uFEFF\u00AD]/g, "");

const operations: Operation[] = [
  {
    id: "extra-spaces",
    label: "حذف فاصله‌های اضافی",
    icon: RemoveFormatting,
    fn: removeExtraSpaces,
  },
  {
    id: "empty-lines",
    label: "حذف خطوط خالی",
    icon: AlignLeft,
    fn: removeEmptyLines,
  },
  {
    id: "trim-lines",
    label: "حذف فاصله‌های ابتدا و انتهای خط",
    icon: Scissors,
    fn: trimAllLines,
  },
  {
    id: "normalize",
    label: "نرمال‌سازی فاصله‌ها",
    icon: Type,
    fn: normalizeSpaces,
  },
  {
    id: "invisible",
    label: "حذف کاراکترهای نامرئی",
    icon: EyeOff,
    fn: removeInvisibleChars,
  },
];

function getTextStats(text: string) {
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = text ? text.split("\n").length : 0;
  return { chars, words, lines };
}

const toPersianNum = (n: number): string => {
  const digits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return n.toString().replace(/[0-9]/g, (d) => digits[parseInt(d)]);
};

export default function TextTools() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeOps, setActiveOps] = useState<Set<string>>(new Set());

  const toggleOp = (id: string) => {
    setActiveOps((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleApply = useCallback(() => {
    if (activeOps.size === 0) {
      setOutput("");
      return;
    }
    let result = input;
    for (const op of operations) {
      if (activeOps.has(op.id)) {
        result = op.fn(result);
      }
    }
    setOutput(result);
    setCopied(false);
  }, [input, activeOps]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setCopied(false);
  };

  const inputStats = getTextStats(input);
  const outputStats = getTextStats(output);

  return (
    <div className="space-y-6" dir="rtl">
      <h3 className="text-lg font-bold text-foreground">ابزارهای متنی</h3>

      <div className="glass-card p-4 space-y-3">
        <span className="text-xs font-medium text-muted-foreground">
          عملیات‌ها را انتخاب کنید:
        </span>
        <div className="flex flex-wrap gap-2">
          {operations.map((op) => {
            const isActive = activeOps.has(op.id);
            return (
              <button
                key={op.id}
                onClick={() => toggleOp(op.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition-all",
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/30"
                )}
              >
                <op.icon className="h-3.5 w-3.5" />
                <span>{op.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={handleApply}
            disabled={activeOps.size === 0 || !input}
            className={cn(
              "flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all",
              activeOps.size > 0 && input
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Play className="h-4 w-4" />
            اجرای عملیات
          </button>
          <button
            onClick={handleClear}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-all"
          >
            <Trash2 className="h-4 w-4" />
            پاک کردن
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="glass-card p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              ورودی
            </label>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span>حرف: {toPersianNum(inputStats.chars)}</span>
              <span>کلمه: {toPersianNum(inputStats.words)}</span>
              <span>خط: {toPersianNum(inputStats.lines)}</span>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="متن خود را وارد کنید..."
            dir="auto"
            rows={12}
            className={cn(
              "w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/30"
            )}
          />
        </div>

        <div className="glass-card p-4 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              خروجی
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span>حرف: {toPersianNum(outputStats.chars)}</span>
                <span>کلمه: {toPersianNum(outputStats.words)}</span>
                <span>خط: {toPersianNum(outputStats.lines)}</span>
              </div>
              <button
                onClick={handleCopy}
                disabled={!output}
                className={cn(
                  "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors",
                  "text-muted-foreground hover:text-foreground",
                  "disabled:opacity-40"
                )}
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copied ? "کپی شد!" : "کپی خروجی"}
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="نتیجه اینجا نمایش داده می‌شود..."
            dir="auto"
            rows={12}
            className={cn(
              "w-full resize-none rounded-lg border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground",
              "placeholder:text-muted-foreground",
              "focus:outline-none"
            )}
          />
        </div>
      </div>
    </div>
  );
}
