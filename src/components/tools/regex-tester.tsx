"use client";

import { useState, useMemo } from "react";
import { Code2, Copy, Check, Trash2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [showGroups, setShowGroups] = useState(false);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!pattern || !testString) return { matches: [], error: null, groups: [] };

    try {
      const regex = new RegExp(pattern, flags);
      const matches: { match: string; index: number; groups: string[] }[] = [];
      const groupNames: string[] = [];

      // Find all group names from pattern
      const groupRegex = /\(\?<(\w+)>/g;
      let g;
      while ((g = groupRegex.exec(pattern)) !== null) {
        groupNames.push(g[1]);
      }

      if (flags.includes("g")) {
        let match;
        let safeCount = 0;
        while ((match = regex.exec(testString)) !== null && safeCount < 1000) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match[0].length === 0) regex.lastIndex++;
          safeCount++;
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      return { matches, error: null, groups: groupNames };
    } catch (e: any) {
      return { matches: [], error: e.message, groups: [] };
    }
  }, [pattern, flags, testString]);

  // Highlighted text
  const highlightedParts = useMemo(() => {
    if (!pattern || !testString || result.error) return [{ text: testString, isMatch: false }];

    try {
      const regex = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
      const parts: { text: string; isMatch: boolean }[] = [];
      let lastIndex = 0;
      let match;
      let safeCount = 0;

      while ((match = regex.exec(testString)) !== null && safeCount < 1000) {
        if (match.index > lastIndex) {
          parts.push({ text: testString.slice(lastIndex, match.index), isMatch: false });
        }
        parts.push({ text: match[0], isMatch: true });
        lastIndex = regex.lastIndex;
        if (match[0].length === 0) regex.lastIndex++;
        safeCount++;
      }
      if (lastIndex < testString.length) {
        parts.push({ text: testString.slice(lastIndex), isMatch: false });
      }
      return parts.length > 0 ? parts : [{ text: testString, isMatch: false }];
    } catch {
      return [{ text: testString, isMatch: false }];
    }
  }, [pattern, flags, testString, result.error]);

  const copyPattern = () => {
    navigator.clipboard.writeText(`/${pattern}/${flags}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const commonPatterns = [
    { name: "ایمیل", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
    { name: "شماره تلفن ایران", pattern: "09[0-9]{9}" },
    { name: "کد ملی", pattern: "[0-9]{10}" },
    { name: "شماره کارت بانکی", pattern: "[0-9]{16}" },
    { name: "آدرس IP", pattern: "\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b" },
    { name: "URL", pattern: "https?://[^\\s]+" },
    { name: "عدد فارسی", pattern: "[۰-۹]+" },
  ];

  const flagOptions = [
    { flag: "g", label: "Global", desc: "جستجوی همه موارد" },
    { flag: "i", label: "Case Insensitive", desc: "بدون حساسیت به حروف" },
    { flag: "m", label: "Multiline", desc: "چندخطی" },
    { flag: "s", label: "DotAll", desc: "نقطه شامل خط جدید" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Code2 className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تستر Regex</h2>
      </div>

      {/* Common patterns */}
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium text-foreground mb-3">الگوهای پرکاربرد</p>
        <div className="flex flex-wrap gap-2">
          {commonPatterns.map((p) => (
            <button
              key={p.name}
              onClick={() => setPattern(p.pattern)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">الگوی Regex</label>
          <button onClick={copyPattern} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? "کپی شد!" : "کپی الگو"}
          </button>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2" dir="ltr">
          <span className="text-muted-foreground">/</span>
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="الگوی خود را وارد کنید..."
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-mono"
          />
          <span className="text-muted-foreground">/</span>
          <input
            type="text"
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="gi"
            className="w-12 bg-transparent text-primary font-mono text-center focus:outline-none"
          />
        </div>
      </div>

      {/* Flags */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">پرچم‌ها (Flags)</label>
        <div className="flex flex-wrap gap-2">
          {flagOptions.map((f) => (
            <button
              key={f.flag}
              onClick={() => {
                setFlags(prev =>
                  prev.includes(f.flag)
                    ? prev.replace(f.flag, "")
                    : prev + f.flag
                );
              }}
              className={cn(
                "rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
                flags.includes(f.flag)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-accent"
              )}
            >
              <span className="font-mono font-bold">{f.flag}</span> — {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Test string */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">متن آزمایش</label>
        <textarea
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          placeholder="متن خود را اینجا وارد کنید تا الگو روی آن تست شود..."
          rows={4}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
        />
      </div>

      {/* Error */}
      {result.error && (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3">
          <p className="text-sm text-red-600 dark:text-red-400 font-mono" dir="ltr">{result.error}</p>
        </div>
      )}

      {/* Highlighted result */}
      {testString && pattern && !result.error && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">نتیجه با highlight</label>
          <div className="rounded-lg border border-border bg-background p-3 min-h-[60px] whitespace-pre-wrap break-all text-sm leading-7" dir="auto">
            {highlightedParts.map((part, i) => (
              <span
                key={i}
                className={
                  part.isMatch
                    ? "bg-yellow-300 dark:bg-yellow-600 text-black dark:text-white rounded px-0.5"
                    : ""
                }
              >
                {part.text}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Match details */}
      {result.matches.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              موارد یافت شده ({toPersianDigits(String(result.matches.length))} مورد)
            </label>
          </div>
          <div className="rounded-lg border border-border bg-card overflow-hidden max-h-60 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0">
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">#</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">متن</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">موقعیت</th>
                </tr>
              </thead>
              <tbody>
                {result.matches.map((m, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                    <td className="px-3 py-2 font-mono text-foreground" dir="ltr">{m.match || "(خالی)"}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground" dir="ltr">{m.index}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cheat sheet */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Info className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">راهنمای سریع Regex</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          {[
            [".", "هر کاراکتر"],
            ["\\d", "عدد"],
            ["\\w", "حرف یا عدد"],
            ["\\s", "فاصله"],
            ["^", "شروع"],
            ["$", "پایان"],
            ["*", "صفر یا بیشتر"],
            ["+", "یک یا بیشتر"],
            ["?", "صفر یا یک"],
            ["{n,m}", "n تا m بار"],
            ["[abc]", "یکی از"],
            ["(a|b)", "a یا b"],
            ["\\b", "مرز کلمه"],
            ["(?=x)", "پیش‌نما"],
            ["(?!x)", "منفی پیش‌نما"],
          ].map(([sym, desc]) => (
            <div key={sym} className="rounded border border-border bg-background px-2 py-1.5">
              <span className="text-primary font-bold">{sym}</span>
              <span className="text-muted-foreground mr-1">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};
