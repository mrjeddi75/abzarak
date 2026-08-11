"use client";

import { useState, useMemo } from "react";
import { FileCode2, Copy, Check } from "lucide-react";

export default function HtmlMinifier() {
  const [input, setInput] = useState("");
  const [options, setOptions] = useState({
    removeComments: true,
    collapseWhitespace: true,
    removeOptionalTags: false,
    removeAttributeQuotes: false,
  });
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input) return { output: "", saved: 0, percent: 0 };

    let output = input;

    if (options.removeComments) {
      output = output.replace(/<!--[\s\S]*?-->/g, "");
    }

    if (options.collapseWhitespace) {
      output = output.replace(/\s+/g, " ");
      output = output.replace(/>\s+</g, "><");
      output = output.trim();
    }

    if (options.removeOptionalTags) {
      output = output.replace(/<\/?(html|head|body|p|div|span|li|td|tr|th|option|thead|tbody)\b[^>]*>/gi, (match) => {
        if (match.startsWith("</")) return match;
        const tag = match.match(/<\/?(\w+)/)?.[1]?.toLowerCase() || "";
        const optional = ["html", "head", "body", "p", "li", "td", "tr", "th", "option"];
        if (optional.includes(tag) && !match.includes("=")) return match;
        return match;
      });
    }

    if (options.removeAttributeQuotes) {
      output = output.replace(/(\w+)=["']([^"']*)["']/g, (match, attr, val) => {
        if (!/[\s"'=<>&`]/.test(val)) return `${attr}=${val}`;
        return match;
      });
    }

    const originalSize = new TextEncoder().encode(input).length;
    const newSize = new TextEncoder().encode(output).length;
    const saved = originalSize - newSize;
    const percent = originalSize > 0 ? ((saved / originalSize) * 100) : 0;

    return { output, saved, percent };
  }, [input, options]);

  const copyOutput = () => {
    navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    { label: "HTML نمونه", value: `<!DOCTYPE html>\n<html lang="fa">\n<head>\n  <meta charset="UTF-8">\n  <title>تست</title>\n  <!-- این یک کامنت است -->\n</head>\n<body>\n  <div class="container">\n    <h1>سلام دنیا</h1>\n    <p>این یک متن  تستی     است</p>\n  </div>\n</body>\n</html>` },
  ];

  const optionLabels = [
    { key: "removeComments" as const, label: "حذف کامنت‌ها" },
    { key: "collapseWhitespace" as const, label: "فشرده‌سازی فاصله‌ها" },
    { key: "removeOptionalTags" as const, label: "حذف تگ‌های اختیاری" },
    { key: "removeAttributeQuotes" as const, label: "حذف کوتیشن اتریبیوت‌ها" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileCode2 className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">مینی‌فایر HTML</h2>
      </div>

      {/* Examples */}
      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex.label}
            onClick={() => setInput(ex.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-3">
        {optionLabels.map((opt) => (
          <label key={opt.key} className="flex items-center gap-2 text-sm text-foreground">
            <input
              type="checkbox"
              checked={options[opt.key]}
              onChange={(e) => setOptions(prev => ({ ...prev, [opt.key]: e.target.checked }))}
              className="rounded border-border"
            />
            {opt.label}
          </label>
        ))}
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">کد HTML ورودی</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="کد HTML خود را اینجا وارد کنید..."
          rows={6}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          dir="ltr"
        />
      </div>

      {/* Results */}
      {input && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <p className="text-xs text-muted-foreground">حجم اصلی</p>
              <p className="font-mono font-bold text-foreground">{result.output.length > 0 ? (new TextEncoder().encode(input).length) : 0} بایت</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <p className="text-xs text-muted-foreground">حجم فشرده</p>
              <p className="font-mono font-bold text-foreground">{new TextEncoder().encode(result.output).length} بایت</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-3 text-center">
              <p className="text-xs text-muted-foreground">ذخیره شده</p>
              <p className="font-mono font-bold text-green-600">{result.percent.toFixed(1)}%</p>
            </div>
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">کد فشرده شده</label>
              <button onClick={copyOutput} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "کپی شد!" : "کپی"}
              </button>
            </div>
            <textarea
              value={result.output}
              readOnly
              rows={4}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-foreground font-mono text-sm"
              dir="ltr"
            />
          </div>
        </div>
      )}
    </div>
  );
}
