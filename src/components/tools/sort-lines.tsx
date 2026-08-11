"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { ArrowDownZA, ArrowUpZA, Copy, Trash2, Ruler } from "lucide-react";

type SortMode = "asc" | "desc";
type SortBy = "alpha" | "length";

export default function SortLines() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("asc");
  const [sortBy, setSortBy] = useState<SortBy>("alpha");
  const [copied, setCopied] = useState(false);

  const handleSort = useCallback(() => {
    if (!input.trim()) return;

    const lines = input.split("\n");
    const sorted = [...lines].sort((a, b) => {
      let cmp = 0;
      if (sortBy === "alpha") {
        cmp = a.localeCompare(b, "fa");
      } else {
        cmp = a.length - b.length;
      }
      return sortMode === "desc" ? -cmp : cmp;
    });

    setOutput(sorted.join("\n"));
  }, [input, sortMode, sortBy]);

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
          متن ورودی (هر خط یک آیتم)
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={cn(
            "w-full h-44 rounded-lg border border-border bg-card p-3 text-foreground font-mono text-sm",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
          placeholder={"خطوط خود را وارد کنید...\nهر خط به صورت جداگانه مرتب می‌شود"}
          dir="auto"
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">مرتب‌سازی بر اساس:</span>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setSortBy("alpha")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors",
                sortBy === "alpha"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-muted"
              )}
            >
              حروف الفبا
            </button>
            <button
              onClick={() => setSortBy("length")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium transition-colors border-r border-border",
                sortBy === "length"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-muted"
              )}
            >
              <Ruler className="w-3.5 h-3.5 inline ml-1" />
              طول خط
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">ترتیب:</span>
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setSortMode("asc")}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors",
                sortMode === "asc"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-muted"
              )}
            >
              <ArrowUpZA className="w-3.5 h-3.5" />
              صعودی
            </button>
            <button
              onClick={() => setSortMode("desc")}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 text-xs font-medium transition-colors border-r border-border",
                sortMode === "desc"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-muted"
              )}
            >
              <ArrowDownZA className="w-3.5 h-3.5" />
              نزولی
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleSort}
          disabled={!input.trim()}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          مرتب‌سازی
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
