"use client";

import { useState } from "react";
import { Palette, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

type CopiedKey = "hex" | "rgb" | "hsl" | null;

export default function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6");
  const [copied, setCopied] = useState<CopiedKey>(null);

  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const hexStr = hex.startsWith("#") ? hex : `#${hex}`;
  const rgbStr = rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "—";
  const hslStr = hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "—";

  const copyToClipboard = async (text: string, key: CopiedKey) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const formats = [
    { key: "hex" as const, label: "HEX", value: hexStr },
    { key: "rgb" as const, label: "RGB", value: rgbStr },
    { key: "hsl" as const, label: "HSL", value: hslStr },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Palette className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تبدیل‌کننده رنگ</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">انتخاب رنگ</label>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
              <input
                type="color"
                value={hexStr}
                onChange={(e) => setHex(e.target.value)}
                className="h-10 w-10 cursor-pointer rounded border-0 bg-transparent"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 bg-transparent text-foreground font-mono placeholder:text-muted-foreground focus:outline-none"
                dir="ltr"
              />
            </div>
          </div>

          <div className="space-y-2">
            {formats.map((f) => (
              <div key={f.key} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                <div>
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="font-mono text-sm text-foreground" dir="ltr">{f.value}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(f.value, f.key)}
                  className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                >
                  {copied === f.key ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div
            className="h-48 w-48 rounded-xl border-2 border-border shadow-lg"
            style={{ backgroundColor: hexStr }}
          />
        </div>
      </div>
    </div>
  );
}