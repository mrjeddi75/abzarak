"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Palette } from "lucide-react";

function hexToHsl(hex: string): [number, number, number] {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const toHex = (x: number) =>
    Math.round(Math.max(0, Math.min(1, x)) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}

type PaletteType =
  | "complementary"
  | "analogous"
  | "triadic"
  | "monochromatic"
  | "splitComplementary";

const paletteTabs: { key: PaletteType; label: string }[] = [
  { key: "complementary", label: "مکمل" },
  { key: "analogous", label: "هم‌جوار" },
  { key: "triadic", label: "سه‌گانه" },
  { key: "monochromatic", label: "تک‌رنگ" },
  { key: "splitComplementary", label: "شکافته" },
];

function getContrastText(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#1a2332" : "#ffffff";
}

export default function ColorPalette() {
  const [baseColor, setBaseColor] = useState("#6366f1");
  const [hexInput, setHexInput] = useState("#6366f1");
  const [activeTab, setActiveTab] = useState<PaletteType>("complementary");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const handleHexInput = (value: string) => {
    setHexInput(value);
    if (/^#[0-9a-fA-F]{6}$/.test(value)) {
      setBaseColor(value);
    }
  };

  const handleColorPicker = (value: string) => {
    setBaseColor(value);
    setHexInput(value);
  };

  const [h, s, l] = useMemo(() => hexToHsl(baseColor), [baseColor]);

  const palettes = useMemo(() => {
    const clamp = (val: number, min: number, max: number) =>
      Math.max(min, Math.min(max, val));

    return {
      complementary: [
        hslToHex(h, s, clamp(l + 20, 0, 95)),
        baseColor,
        hslToHex(h, s, clamp(l - 15, 5, 100)),
        hslToHex((h + 180) % 360, s, clamp(l + 10, 0, 95)),
        hslToHex((h + 180) % 360, s, clamp(l - 15, 5, 100)),
      ],
      analogous: [
        hslToHex((h - 40 + 360) % 360, s, l),
        hslToHex((h - 20 + 360) % 360, s, l),
        baseColor,
        hslToHex((h + 20) % 360, s, l),
        hslToHex((h + 40) % 360, s, l),
      ],
      triadic: [
        baseColor,
        hslToHex(h, clamp(s - 10, 0, 100), clamp(l + 15, 0, 95)),
        hslToHex((h + 120) % 360, s, l),
        hslToHex((h + 240) % 360, s, l),
        hslToHex((h + 240) % 360, clamp(s - 10, 0, 100), clamp(l + 15, 0, 95)),
      ],
      monochromatic: [
        hslToHex(h, s, clamp(l + 30, 0, 95)),
        hslToHex(h, s, clamp(l + 15, 0, 95)),
        baseColor,
        hslToHex(h, s, clamp(l - 15, 5, 100)),
        hslToHex(h, s, clamp(l - 30, 5, 100)),
      ],
      splitComplementary: [
        hslToHex(h, s, clamp(l + 15, 0, 95)),
        baseColor,
        hslToHex(h, s, clamp(l - 15, 5, 100)),
        hslToHex((h + 150) % 360, s, l),
        hslToHex((h + 210) % 360, s, l),
      ],
    };
  }, [h, s, l, baseColor]);

  const handleCopy = async (color: string) => {
    await navigator.clipboard.writeText(color.toUpperCase());
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const currentPalette = palettes[activeTab];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="glass-card p-5 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            رنگ پایه
          </span>
        </div>
        <input
          type="color"
          value={baseColor}
          onChange={(e) => handleColorPicker(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer border border-border"
        />
        <input
          type="text"
          value={hexInput}
          onChange={(e) => handleHexInput(e.target.value)}
          className={cn(
            "w-28 rounded-lg border border-border bg-card p-2 text-sm font-mono text-foreground text-center",
            "focus:outline-none focus:ring-1 focus:ring-primary/50"
          )}
          dir="ltr"
          placeholder="#6366f1"
        />
      </div>

      <div className="glass-card p-2 flex flex-wrap gap-2">
        {paletteTabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === key
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="glass-card p-5 space-y-3">
        <span className="text-xs font-medium text-muted-foreground">
          پالت {paletteTabs.find((t) => t.key === activeTab)?.label}
        </span>
        <div className="flex gap-3">
          {currentPalette.map((color) => {
            const textColor = getContrastText(color);
            const isCopied = copiedColor === color;
            return (
              <button
                key={color}
                onClick={() => handleCopy(color)}
                className="flex-1 group relative rounded-xl overflow-hidden border border-border transition-all hover:scale-[1.03] min-h-[130px] flex flex-col items-center justify-end pb-3"
              >
                <div
                  className="absolute inset-0"
                  style={{ backgroundColor: color }}
                />
                <div
                  className="relative z-10 flex flex-col items-center gap-1.5"
                  style={{ color: textColor }}
                >
                  <span className="text-[11px] font-mono font-medium">
                    {color.toUpperCase()}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] flex items-center gap-1 transition-opacity",
                      isCopied ? "opacity-100" : "opacity-0 group-hover:opacity-70"
                    )}
                  >
                    <Copy className="w-3 h-3" />
                    {isCopied ? "کپی شد!" : "کپی"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
