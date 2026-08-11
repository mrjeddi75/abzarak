"use client";

import { useState, useCallback } from "react";
import { Lock, Copy, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let chars = "";
    if (uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (numbers) chars += "0123456789";
    if (symbols) chars += "!@#$%^&*()_+-=[]{}|;:',.<>?/`~";

    if (chars.length === 0) {
      setPassword("");
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }
    setPassword(result);
    setCopied(false);
  }, [length, uppercase, lowercase, numbers, symbols]);

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const options = [
    { label: "حروف بزرگ (A-Z)", checked: uppercase, onChange: setUppercase },
    { label: "حروف کوچک (a-z)", checked: lowercase, onChange: setLowercase },
    { label: "اعداد (0-9)", checked: numbers, onChange: setNumbers },
    { label: "نمادها (!@#$...)", checked: symbols, onChange: setSymbols },
  ];

  const strength = () => {
    let score = 0;
    if (length >= 8) score++;
    if (length >= 16) score++;
    if (length >= 24) score++;
    if (uppercase && lowercase) score++;
    if (numbers) score++;
    if (symbols) score++;
    if (score <= 2) return { label: "ضعیف", color: "bg-red-500" };
    if (score <= 4) return { label: "متوسط", color: "bg-yellow-500" };
    return { label: "قوی", color: "bg-green-500" };
  };

  const str = strength();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Lock className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تولیدکننده رمز عبور</h2>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        {/* Generated password display */}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-background p-3">
          <p
            className="flex-1 break-all font-mono text-sm text-foreground min-h-[24px]"
            dir="ltr"
          >
            {password || "—"}
          </p>
          <button
            onClick={handleCopy}
            disabled={!password}
            className="shrink-0 rounded-md border border-border p-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Strength bar */}
        {password && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">قدرت رمز عبور</span>
              <span className="text-foreground">{str.label}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-border">
              <div className={cn("h-full rounded-full transition-all", str.color)} style={{ width: `${Math.min(100, (password.length / 32) * 100)}%` }} />
            </div>
          </div>
        )}

        {/* Length slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">طول رمز عبور</label>
            <span className="text-sm font-bold text-primary" dir="ltr">
              {length}
            </span>
          </div>
          <input
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>۸</span>
            <span>۶۴</span>
          </div>
        </div>

        {/* Character options */}
        <div className="space-y-3">
          {options.map((opt) => (
            <label
              key={opt.label}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
            >
              <input
                type="checkbox"
                checked={opt.checked}
                onChange={(e) => opt.onChange(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              <span className="text-sm text-foreground">{opt.label}</span>
            </label>
          ))}
        </div>

        {/* Generate button */}
        <button
          onClick={generate}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4" />
          تولید رمز عبور
        </button>
      </div>
    </div>
  );
}
