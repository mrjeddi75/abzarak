"use client";

import { useState, useMemo } from "react";
import { Link2, Copy, Check, ArrowDownUp } from "lucide-react";

export default function UrlEncoder() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encoding, setEncoding] = useState<"utf8" | "ascii">("utf8");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input) return "";
    try {
      if (mode === "encode") {
        if (encoding === "ascii") {
          // Only encode non-ASCII safe chars
          return encodeURIComponent(input).replace(
            /[!'()*]/g,
            (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
          );
        }
        return encodeURIComponent(input);
      } else {
        return decodeURIComponent(input);
      }
    } catch (e: any) {
      return `خطا: ${e.message}`;
    }
  }, [input, mode, encoding]);

  const copyResult = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Character analysis
  const analysis = useMemo(() => {
    const encoded = encodeURIComponent(input);
    const originalLen = new TextEncoder().encode(input).length;
    const encodedLen = new TextEncoder().encode(encoded).length;
    const overhead = originalLen > 0 ? ((encodedLen - originalLen) / originalLen * 100) : 0;
    return { originalLen, encodedLen, overhead: overhead.toFixed(1) };
  }, [input]);

  // Common URL examples
  const examples = [
    { label: "فارسی", text: "سلام دنیا" },
    { label: "فاصله و علامت", text: "hello world & test=1" },
    { label: "ایمیل", text: "user@example.com" },
    { label: "پارامتر", text: "name=علی&city=تهران" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link2 className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">رمزگذاری URL</h2>
      </div>

      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode("encode")}
          className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            mode === "encode"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:bg-accent"
          }`}
        >
          رمزگذاری (Encode)
        </button>
        <button
          onClick={() => setMode("decode")}
          className={`flex-1 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            mode === "decode"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:bg-accent"
          }`}
        >
          رمزگشایی (Decode)
        </button>
      </div>

      {/* Examples */}
      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex.label}
            onClick={() => setInput(ex.text)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          {mode === "encode" ? "متن اصلی" : "متن رمزگذاری شده"}
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={mode === "encode" ? "متن خود را وارد کنید..." : "متن رمزگذاری شده را وارد کنید..."}
          rows={4}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          dir="auto"
        />
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">
              {mode === "encode" ? "نتیجه رمزگذاری" : "نتیجه رمزگشایی"}
            </label>
            <button onClick={copyResult} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "کپی شد!" : "کپی نتیجه"}
            </button>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3 min-h-[60px]">
            <p className="font-mono text-sm break-all text-foreground" dir="ltr">{result}</p>
          </div>
        </div>
      )}

      {/* Analysis */}
      {input && mode === "encode" && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <p className="text-xs text-muted-foreground">طول اصلی (بایت)</p>
            <p className="font-mono font-bold text-foreground">{analysis.originalLen}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <p className="text-xs text-muted-foreground">طول رمزگذاری (بایت)</p>
            <p className="font-mono font-bold text-foreground">{analysis.encodedLen}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-3 text-center">
            <p className="text-xs text-muted-foreground">افزایش حجم</p>
            <p className="font-mono font-bold text-primary">{analysis.overhead}%</p>
          </div>
        </div>
      )}

      {/* Character table */}
      {input && mode === "encode" && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/50">
            <p className="text-sm font-medium text-foreground">جدول کاراکترها</p>
          </div>
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border">
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">کاراکتر</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">کد UTF-8</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">رمزگذاری URL</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(new Set(Array.from(input))).slice(0, 50).map((char, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-mono text-foreground">{char === " " ? "(فاصله)" : char}</td>
                    <td className="px-3 py-2 font-mono text-muted-foreground" dir="ltr">
                      U+{char.codePointAt(0)?.toString(16).toUpperCase().padStart(4, "0")}
                    </td>
                    <td className="px-3 py-2 font-mono text-primary" dir="ltr">
                      {encodeURIComponent(char)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
