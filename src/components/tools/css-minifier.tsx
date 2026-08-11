"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { FileCode, Copy, Trash2 } from "lucide-react";

export default function CssMinifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [minifiedSize, setMinifiedSize] = useState(0);
  const [copied, setCopied] = useState(false);

  const minify = useCallback((code: string): string => {
    let result = code;
    // Remove multi-line comments
    result = result.replace(/\/\*[\s\S]*?\*\//g, "");
    // Remove single-line comments
    result = result.replace(/\/\/.*$/gm, "");
    // Remove newlines and extra whitespace
    result = result.replace(/\s+/g, " ");
    // Remove spaces around special characters
    result = result.replace(/\s*([{}:;,>~+])\s*/g, "$1");
    // Remove last semicolons before closing braces
    result = result.replace(/;}/g, "}");
    // Remove leading/trailing whitespace
    result = result.trim();
    return result;
  }, []);

  const handleMinify = useCallback(() => {
    if (!input.trim()) return;
    const result = minify(input);
    setOutput(result);
    setOriginalSize(new Blob([input]).size);
    setMinifiedSize(new Blob([result]).size);
  }, [input, minify]);

  const reductionPercent =
    originalSize > 0
      ? Math.round(((originalSize - minifiedSize) / originalSize) * 100)
      : 0;

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setOriginalSize(0);
    setMinifiedSize(0);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} بایت`;
    return `${(bytes / 1024).toFixed(2)} کیلوبایت`;
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          کد CSS/JS ورودی
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={cn(
            "w-full h-48 rounded-lg border border-border bg-card p-3 text-foreground font-mono text-sm",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
          placeholder="body {\n  margin: 0;\n  padding: 20px;\n  background-color: #fff;\n}"
          dir="ltr"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleMinify}
          disabled={!input.trim()}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <FileCode className="w-4 h-4" />
          فشرده‌سازی
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

        {reductionPercent > 0 && (
          <span className="text-sm text-green-500 font-medium">
            {reductionPercent}% کاهش حجم ({formatSize(originalSize)} → {formatSize(minifiedSize)})
          </span>
        )}
      </div>

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">نتیجه</label>
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
            dir="ltr"
          />
        </div>
      )}
    </div>
  );
}
