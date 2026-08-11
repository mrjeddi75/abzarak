"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ListOrdered, Copy, Trash2 } from "lucide-react";

export default function LineNumbers() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [startNum, setStartNum] = useState(1);
  const [step, setStep] = useState(1);
  const [zeroPad, setZeroPad] = useState(false);
  const [padWidth, setPadWidth] = useState(3);
  const [separator, setSeparator] = useState(". ");
  const [copied, setCopied] = useState(false);

  const handleApply = useCallback(() => {
    if (!input.trim()) return;

    const lines = input.split("\n");
    const totalLines = lines.length;
    const lastNum = startNum + (totalLines - 1) * step;
    const autoPad = zeroPad ? String(lastNum).length : 0;
    const pad = Math.max(autoPad, padWidth);

    const numbered = lines.map((line, i) => {
      const num = startNum + i * step;
      const numStr = zeroPad ? String(num).padStart(pad, "0") : String(num);
      return `${numStr}${separator}${line}`;
    });

    setOutput(numbered.join("\n"));
  }, [input, startNum, step, zeroPad, padWidth, separator]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          متن ورودی
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={cn(
            "w-full h-44 rounded-lg border border-border bg-card p-3 text-foreground font-mono text-sm",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
          placeholder={"خط اول\nخط دوم\nخط سوم"}
          dir="auto"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">شماره شروع</label>
          <input
            type="number"
            value={startNum}
            onChange={(e) => setStartNum(Math.max(0, parseInt(e.target.value) || 0))}
            className={cn(
              "w-full rounded-lg border border-border bg-card p-2 text-foreground text-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">گام</label>
          <input
            type="number"
            value={step}
            onChange={(e) => setStep(Math.max(1, parseInt(e.target.value) || 1))}
            className={cn(
              "w-full rounded-lg border border-border bg-card p-2 text-foreground text-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">جداکننده</label>
          <input
            type="text"
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className={cn(
              "w-full rounded-lg border border-border bg-card p-2 text-foreground text-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">عرض پدینگ</label>
          <input
            type="number"
            value={padWidth}
            onChange={(e) => setPadWidth(Math.max(1, parseInt(e.target.value) || 1))}
            disabled={!zeroPad}
            className={cn(
              "w-full rounded-lg border border-border bg-card p-2 text-foreground text-sm",
              "disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
        <input
          type="checkbox"
          checked={zeroPad}
          onChange={(e) => setZeroPad(e.target.checked)}
          className="rounded border-border"
        />
        صفر ابتدای اعداد (مثلاً 001، 002)
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleApply}
          disabled={!input.trim()}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <ListOrdered className="w-4 h-4" />
          افزودن شماره خط
        </button>
        <button
          onClick={handleClear}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-card border border-border text-foreground hover:bg-muted"
          )}
        >
          <Trash2 className="w-4 h-4" />
          پاک کردن
        </button>
      </div>

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              نتیجه
            </label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "کپی شد!" : "کپی"}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            className={cn(
              "w-full h-44 rounded-lg border border-border bg-card p-3 text-foreground font-mono text-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
            dir="auto"
          />
        </div>
      )}
    </div>
  );
}
