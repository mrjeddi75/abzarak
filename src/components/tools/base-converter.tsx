"use client";

import { useState, useMemo } from "react";
import { Binary, Copy, Check, RefreshCw } from "lucide-react";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

type Base = "decimal" | "binary" | "octal" | "hex";

const BASE_CONFIG: Record<Base, { label: string; prefix: string; base: number; example: string }> = {
  decimal: { label: "ده‌دهی (Decimal)", prefix: "", base: 10, example: "255" },
  binary: { label: "دودویی (Binary)", prefix: "0b", base: 2, example: "11111111" },
  octal: { label: "هشت‌هشتی (Octal)", prefix: "0o", base: 8, example: "377" },
  hex: { label: "شانزده‌شانزدهی (Hex)", prefix: "0x", base: 16, example: "FF" },
};

export default function BaseConverter() {
  const [inputValue, setInputValue] = useState("");
  const [inputBase, setInputBase] = useState<Base>("decimal");
  const [bitWidth, setBitWidth] = useState<"8" | "16" | "32" | "64" | "none">("none");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const conversions = useMemo(() => {
    if (!inputValue.trim()) return null;

    try {
      // Clean prefix
      let cleaned = inputValue.trim();
      if (cleaned.startsWith("0b") || cleaned.startsWith("0B")) {
        cleaned = cleaned.slice(2);
        if (inputBase !== "binary") setInputBase("binary");
      } else if (cleaned.startsWith("0o") || cleaned.startsWith("0O")) {
        cleaned = cleaned.slice(2);
        if (inputBase !== "octal") setInputBase("octal");
      } else if (cleaned.startsWith("0x") || cleaned.startsWith("0X")) {
        cleaned = cleaned.slice(2);
        if (inputBase !== "hex") setInputBase("hex");
      }

      const decimal = parseInt(cleaned, BASE_CONFIG[inputBase].base);
      if (isNaN(decimal)) return { error: "مقدار نامعتبر است" };

      const big = BigInt(cleaned.toLowerCase().startsWith("0x") ? "0x" + cleaned.replace("0x", "") : cleaned);
      let num: bigint;
      if (inputBase === "binary") num = BigInt("0b" + cleaned);
      else if (inputBase === "octal") num = BigInt("0o" + cleaned);
      else if (inputBase === "hex") num = BigInt("0x" + cleaned);
      else num = BigInt(cleaned);

      if (!isFinite(Number(decimal)) && num > BigInt(Number.MAX_SAFE_INTEGER)) {
        return {
          decimal: num.toString(10),
          binary: num.toString(2),
          octal: num.toString(8),
          hex: num.toString(16).toUpperCase(),
        };
      }

      const result: Record<string, string> = {
        decimal: num.toString(10),
        binary: num.toString(2),
        octal: num.toString(8),
        hex: num.toString(16).toUpperCase(),
      };

      // Apply bit width padding
      if (bitWidth !== "none") {
        const bits = parseInt(bitWidth);
        result.binary = result.binary.padStart(bits, "0");
        // For hex, pad to appropriate length
        const hexLen = bits / 4;
        result.hex = result.hex.padStart(hexLen, "0");
        // For octal
        const octLen = Math.ceil(bits / 3);
        result.octal = result.octal.padStart(octLen, "0");
      }

      return result;
    } catch {
      return { error: "خطا در تبدیل. مطمئن شوید مقدار وارد شده صحیح است." };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, inputBase, bitWidth]);

  const copyToClipboard = (value: string, field: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Bit visualization for binary
  const binaryStr = conversions?.binary || "";
  const bitGroups = useMemo(() => {
    if (!binaryStr || binaryStr.length > 64) return null;
    const padded = binaryStr.padStart(Math.ceil(binaryStr.length / 8) * 8, "0");
    const groups: string[] = [];
    for (let i = 0; i < padded.length; i += 8) {
      groups.push(padded.slice(i, i + 8));
    }
    return groups;
  }, [binaryStr]);

  const bases: Base[] = ["decimal", "binary", "octal", "hex"];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Binary className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تبدیل مبنای اعداد</h2>
      </div>

      {/* Input */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium text-foreground">مقدار ورودی</label>
          <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
            <Binary className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="عدد خود را وارد کنید..."
              className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none font-mono text-lg"
              dir="ltr"
            />
            <button
              onClick={() => { setInputValue(""); }}
              className="text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">مبنای ورودی</label>
          <div className="grid grid-cols-2 gap-2">
            {bases.map((b) => (
              <button
                key={b}
                onClick={() => setInputBase(b)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  inputBase === b
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-accent"
                }`}
              >
                {BASE_CONFIG[b].label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">عرض بیت</label>
          <div className="grid grid-cols-5 gap-2">
            {(["none", "8", "16", "32", "64"] as const).map((w) => (
              <button
                key={w}
                onClick={() => setBitWidth(w)}
                className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${
                  bitWidth === w
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-foreground hover:bg-accent"
                }`}
              >
                {w === "none" ? "بدون" : `${w} بیت`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {conversions?.error && (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{conversions.error}</p>
        </div>
      )}

      {/* Results */}
      {conversions && !conversions.error && (
        <div className="space-y-3">
          {bases.map((b) => (
            <div key={b} className="rounded-lg border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-muted/50">
                <span className="text-sm font-medium text-foreground">{BASE_CONFIG[b].label}</span>
                <button
                  onClick={() => copyToClipboard(conversions[b] || "", b)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {copiedField === b ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copiedField === b ? "کپی شد!" : "کپی"}
                </button>
              </div>
              <div className="px-4 py-3">
                <p className="font-mono text-lg text-foreground break-all" dir="ltr">
                  <span className="text-muted-foreground">{BASE_CONFIG[b].prefix}</span>
                  <span className="font-bold">{conversions[b]}</span>
                </p>
              </div>
            </div>
          ))}

          {/* Bit visualization */}
          {bitGroups && bitGroups.length <= 8 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm font-medium text-foreground mb-3">نمایش بیت‌ها</p>
              <div className="flex flex-wrap gap-1 justify-center" dir="ltr">
                {bitGroups.map((group, gi) => (
                  <div key={gi} className="flex flex-col items-center gap-1">
                    <div className="flex gap-0.5">
                      {group.split("").map((bit, bi) => (
                        <span
                          key={bi}
                          className={`inline-flex h-7 w-7 items-center justify-center rounded text-xs font-mono font-bold ${
                            bit === "1"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {bit}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {((gi + 1) * 8 - 1)}-{gi * 8}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick reference */}
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-sm font-medium text-foreground mb-3">مقادیر رایج</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { dec: 0, name: "صفر" },
                { dec: 127, name: "Max 8-bit signed" },
                { dec: 255, name: "Max 8-bit" },
                { dec: 65535, name: "Max 16-bit" },
                { dec: 2147483647, name: "Max 32-bit signed" },
                { dec: 4294967295, name: "Max 32-bit" },
              ].map((v) => (
                <button
                  key={v.dec}
                  onClick={() => setInputValue(String(v.dec))}
                  className="rounded border border-border bg-background px-2 py-1.5 text-xs text-foreground hover:bg-accent transition-colors text-left"
                  dir="ltr"
                >
                  <p className="font-mono font-bold text-primary">{v.dec.toLocaleString()}</p>
                  <p className="text-muted-foreground">{v.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
