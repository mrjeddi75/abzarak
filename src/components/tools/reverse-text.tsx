"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { RotateCcw, Copy, Trash2, Type, AlignRight, ListOrdered } from "lucide-react";

type ReverseMode = "all" | "lines" | "words" | "lineOrder";

const modes: { key: ReverseMode; label: string; icon: React.ReactNode }[] = [
  { key: "all", label: "برعکس کل متن", icon: <RotateCcw className="w-4 h-4" /> },
  { key: "lines", label: "برعکس هر خط", icon: <Type className="w-4 h-4" /> },
  { key: "words", label: "برعکس هر کلمه", icon: <AlignRight className="w-4 h-4" /> },
  { key: "lineOrder", label: "برعکس ترتیب خطوط", icon: <ListOrdered className="w-4 h-4" /> },
];

export default function ReverseText() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ReverseMode>("all");
  const [copied, setCopied] = useState(false);

  const reverseStr = (s: string) => Array.from(s).reverse().join("");

  const handleReverse = useCallback(() => {
    if (!input) return;

    let result = "";

    switch (mode) {
      case "all":
        result = reverseStr(input);
        break;
      case "lines":
        result = input
          .split("\n")
          .map((line) => reverseStr(line))
          .join("\n");
        break;
      case "words":
        result = input
          .split("\n")
          .map((line) =>
            line
              .split(/(\s+)/)
              .map((word) => (/^\s+$/.test(word) ? word : reverseStr(word)))
              .join("")
          )
          .join("\n");
        break;
      case "lineOrder":
        result = input.split("\n").reverse().join("\n");
        break;
    }

    setOutput(result);
  }, [input, mode]);

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
            "w-full h-40 rounded-lg border border-border bg-card p-3 text-foreground",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
          placeholder="متن خود را اینجا وارد کنید..."
          dir="auto"
        />
      </div>

      <div className="space-y-3">
        <span className="text-sm font-medium text-foreground">نوع برعکس‌سازی:</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              className={cn(
                "flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors border",
                mode === m.key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:bg-muted"
              )}
            >
              {m.icon}
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleReverse}
          disabled={!input}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <RotateCcw className="w-4 h-4" />
          برعکس کردن
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
              "w-full h-40 rounded-lg border border-border bg-card p-3 text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
            dir="auto"
          />
        </div>
      )}
    </div>
  );
}
