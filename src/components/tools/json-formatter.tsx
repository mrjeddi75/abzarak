"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Braces, Minimize2, CheckCircle2, AlertCircle, Copy, Trash2 } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleFormat = useCallback(() => {
    clearMessages();
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setSuccess("JSON با موفقیت فرمت شد");
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON نامعتبر است");
      setOutput("");
    }
  }, [input]);

  const handleMinify = useCallback(() => {
    clearMessages();
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setSuccess("JSON با موفقیت فشرده شد");
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON نامعتبر است");
      setOutput("");
    }
  }, [input]);

  const handleValidate = useCallback(() => {
    clearMessages();
    try {
      JSON.parse(input);
      setSuccess("JSON معتبر است");
    } catch (e) {
      setError(e instanceof Error ? e.message : "JSON نامعتبر است");
    }
  }, [input]);

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    clearMessages();
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          JSON ورودی
        </label>
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            clearMessages();
          }}
          className={cn(
            "w-full h-48 rounded-lg border border-border bg-card p-3 text-foreground font-mono text-sm",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
          placeholder='{"key": "value"}'
          dir="ltr"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleFormat}
          disabled={!input.trim()}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Braces className="w-4 h-4" />
          فرمت
        </button>
        <button
          onClick={handleMinify}
          disabled={!input.trim()}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-card border border-border text-foreground hover:bg-muted",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Minimize2 className="w-4 h-4" />
          فشرده‌سازی
        </button>
        <button
          onClick={handleValidate}
          disabled={!input.trim()}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-card border border-border text-foreground hover:bg-muted",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <CheckCircle2 className="w-4 h-4" />
          اعتبارسنجی
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

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <span dir="ltr">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

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
