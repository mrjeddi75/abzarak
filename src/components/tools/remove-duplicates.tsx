"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Copy, Trash2, ArrowLeftRight } from "lucide-react";

export default function RemoveDuplicates() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [removedCount, setRemovedCount] = useState(0);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleRemoveDuplicates = useCallback(() => {
    if (!input.trim()) return;

    const lines = input.split("\n");
    const seen = new Set<string>();
    const unique: string[] = [];

    for (const line of lines) {
      const processed = trimLines ? line.trim() : line;
      const key = caseSensitive ? processed : processed.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(trimLines ? processed : line);
      }
    }

    setRemovedCount(lines.length - unique.length);
    setOutput(unique.join("\n"));
  }, [input, caseSensitive, trimLines]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setRemovedCount(0);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          متن ورودی (هر خط یک آیتم)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={cn(
            "w-full h-48 rounded-lg border border-border bg-card p-3 text-foreground font-mono text-sm",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
          placeholder={"خط اول\nخط دوم\nخط اول (تکراری)\nخط دوم (تکراری)"}
          dir="auto"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded border-border"
          />
          حساس به حروف بزرگ و کوچک
        </label>
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={trimLines}
            onChange={(e) => setTrimLines(e.target.checked)}
            className="rounded border-border"
          />
          حذف فاصله‌های اضافی ابتدا و انتها
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleRemoveDuplicates}
          disabled={!input.trim()}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <ArrowLeftRight className="w-4 h-4" />
          حذف تکراری‌ها
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

        {removedCount > 0 && (
          <span className="text-sm text-primary font-medium">
            {removedCount} خط تکراری حذف شد
          </span>
        )}
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
              "w-full h-48 rounded-lg border border-border bg-card p-3 text-foreground font-mono text-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
            dir="auto"
          />
        </div>
      )}
    </div>
  );
}
