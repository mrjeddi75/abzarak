"use client";

import { useState, useMemo } from "react";
import { Hash, Copy, Check } from "lucide-react";

export default function ChecksumGenerator() {
  const [input, setInput] = useState("");
  const [algorithm, setAlgorithm] = useState<"sha256" | "sha1" | "sha384" | "sha512">("sha256");
  const [copied, setCopied] = useState<string | null>(null);

  const hash = useMemo(async () => {
    if (!input) return "";
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    try {
      const hashBuffer = await crypto.subtle.digest(algorithm, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      return "خطا در تولید هش";
    }
  }, [input, algorithm]);

  // We need to handle async in useEffect
  const [hashResult, setHashResult] = useState("");
  const [allHashes, setAllHashes] = useState<Record<string, string>>({});

  useMemo(() => {
    const computeHash = async () => {
      if (!input) {
        setHashResult("");
        setAllHashes({});
        return;
      }
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const algorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

      const results: Record<string, string> = {};
      let currentHash = "";

      for (const algo of algorithms) {
        try {
          const hashBuffer = await crypto.subtle.digest(algo, data);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
          results[algo] = hashHex;
          if (algo === algorithm.toUpperCase().replace("-", "")) {
            currentHash = hashHex;
          }
        } catch {
          results[algo] = "خطا";
        }
      }

      // Map algorithm state to correct key
      const keyMap: Record<string, string> = {
        sha1: "SHA-1",
        sha256: "SHA-256",
        sha384: "SHA-384",
        sha512: "SHA-512",
      };
      currentHash = results[keyMap[algorithm]] || "";
      setHashResult(currentHash);
      setAllHashes(results);
    };
    computeHash();
  }, [input, algorithm]);

  const copyHash = (value: string, algo: string) => {
    navigator.clipboard.writeText(value);
    setCopied(algo);
    setTimeout(() => setCopied(null), 2000);
  };

  const examples = [
    { label: "متن فارسی", value: "سلام دنیا" },
    { label: "رمز عبور", value: "MyP@ssw0rd123" },
    { label: "ایمیل", value: "user@example.com" },
  ];

  const algoLabels = [
    { id: "sha1" as const, label: "SHA-1", desc: "۱۶۰ بیت - سریع‌تر" },
    { id: "sha256" as const, label: "SHA-256", desc: "۲۵۶ بیت - امن‌تر" },
    { id: "sha384" as const, label: "SHA-384", desc: "۳۸۴ بیت" },
    { id: "sha512" as const, label: "SHA-512", desc: "۵۱۲ بیت - قوی‌ترین" },
  ];

  const allAlgos = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Hash className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">چک‌سام و هش مولد</h2>
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

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">متن ورودی</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="متن یا رمز عبور خود را وارد کنید..."
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
        />
      </div>

      {/* Algorithm selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">الگوریتم</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {algoLabels.map((a) => (
            <button
              key={a.id}
              onClick={() => setAlgorithm(a.id)}
              className={`rounded-lg border px-3 py-2 text-center transition-colors ${
                algorithm === a.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-accent"
              }`}
            >
              <p className="font-mono text-sm font-bold">{a.label}</p>
              <p className="text-[10px] opacity-70">{a.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {input && (
        <div className="space-y-4">
          {/* Primary result */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              هش {algorithm.toUpperCase()}
            </p>
            <div className="flex items-center justify-center gap-2">
              <p className="font-mono text-sm break-all text-primary font-bold" dir="ltr">{hashResult}</p>
              <button onClick={() => copyHash(hashResult, "primary")} className="shrink-0">
                {copied === "primary" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>
          </div>

          {/* All hashes */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-muted/50">
              <p className="text-sm font-medium text-foreground">تمام الگوریتم‌ها</p>
            </div>
            <div className="divide-y divide-border">
              {allAlgos.map((algo) => (
                <div key={algo} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm font-mono text-muted-foreground w-16 shrink-0">{algo}</span>
                  <p className="font-mono text-xs break-all text-foreground flex-1 mx-2" dir="ltr">{allHashes[algo] || ""}</p>
                  <button onClick={() => copyHash(allHashes[algo] || "", algo)} className="shrink-0">
                    {copied === algo ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* File hash info */}
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium text-foreground mb-2">کاربردهای چک‌سام</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="rounded border border-border bg-background p-2">بررسی صحت فایل‌های دانلودی</div>
              <div className="rounded border border-border bg-background p-2">ذخیره رمز عبور به صورت هش شده</div>
              <div className="rounded border border-border bg-background p-2">امضای دیجیتال و احراز هویت</div>
              <div className="rounded border border-border bg-background p-2">بررسی یکپارچگی داده‌ها</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
