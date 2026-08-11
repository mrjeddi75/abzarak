"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Hash, Copy, RefreshCw, Loader2 } from "lucide-react";

type HashResult = {
  name: string;
  value: string;
} | null;

async function computeHash(algorithm: string, text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [sha1, setSha1] = useState("");
  const [sha256, setSha256] = useState("");
  const [sha512, setSha512] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const generateHashes = useCallback(async () => {
    if (!input) return;
    setLoading(true);
    try {
      const [s1, s256, s512] = await Promise.all([
        computeHash("SHA-1", input),
        computeHash("SHA-256", input),
        computeHash("SHA-512", input),
      ]);
      setSha1(s1);
      setSha256(s256);
      setSha512(s512);
    } catch {
      setSha1("");
      setSha256("");
      setSha512("");
    }
    setLoading(false);
  }, [input]);

  const handleCopy = async (value: string, idx: number) => {
    await navigator.clipboard.writeText(value);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const hashes: { name: string; value: string; idx: number }[] = [
    { name: "SHA-1", value: sha1, idx: 0 },
    { name: "SHA-256", value: sha256, idx: 1 },
    { name: "SHA-512", value: sha512, idx: 2 },
  ];

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
            "w-full h-32 rounded-lg border border-border bg-card p-3 text-foreground font-mono text-sm",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
          placeholder="متن خود را برای تولید هش وارد کنید..."
          dir="auto"
        />
      </div>

      <button
        onClick={generateHashes}
        disabled={!input || loading}
        className={cn(
          "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
          "bg-primary text-primary-foreground hover:bg-primary/90",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <RefreshCw className="w-4 h-4" />
        )}
        تولید هش
      </button>

      {hashes.some((h) => h.value) && (
        <div className="space-y-3">
          {hashes.map(
            (h) =>
              h.value && (
                <div
                  key={h.name}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {h.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(h.value, h.idx)}
                      className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      {copiedIdx === h.idx ? "کپی شد!" : "کپی"}
                    </button>
                  </div>
                  <div
                    className={cn(
                      "w-full rounded-lg border border-border bg-card p-3 font-mono text-xs text-foreground break-all",
                      "select-all"
                    )}
                    dir="ltr"
                  >
                    {h.value}
                  </div>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
