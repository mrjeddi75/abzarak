"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, RotateCcw, Square, Sun, Moon } from "lucide-react";

export default function ShadowGenerator() {
  const [offsetX, setOffsetX] = useState(4);
  const [offsetY, setOffsetY] = useState(4);
  const [blur, setBlur] = useState(12);
  const [spread, setSpread] = useState(0);
  const [color, setColor] = useState("#6366f1");
  const [opacity, setOpacity] = useState(25);
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
  };

  const shadowValue = `${inset ? "inset " : ""}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${hexToRgba(color, opacity)}`;

  const cssCode = `box-shadow: ${shadowValue};`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setOffsetX(4);
    setOffsetY(4);
    setBlur(12);
    setSpread(0);
    setColor("#6366f1");
    setOpacity(25);
    setInset(false);
  };

  const sliders = [
    { label: "افقی (X)", value: offsetX, setter: setOffsetX, min: -50, max: 50 },
    { label: "عمودی (Y)", value: offsetY, setter: setOffsetY, min: -50, max: 50 },
    { label: "تاری (Blur)", value: blur, setter: setBlur, min: 0, max: 100 },
    { label: "گسترش (Spread)", value: spread, setter: setSpread, min: -50, max: 50 },
    { label: "شفافیت (%)", value: opacity, setter: setOpacity, min: 0, max: 100 },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="glass-card p-5 space-y-4">
          {sliders.map((s) => (
            <div key={s.label} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">{s.label}</label>
                <input
                  type="number"
                  value={s.value}
                  onChange={(e) => s.setter(parseInt(e.target.value) || 0)}
                  className={cn(
                    "w-16 rounded border border-border bg-card p-1 text-foreground text-xs text-center",
                    "focus:outline-none focus:ring-1 focus:ring-primary/50"
                  )}
                  min={s.min}
                  max={s.max}
                />
              </div>
              <input
                type="range"
                value={s.value}
                onChange={(e) => s.setter(parseInt(e.target.value))}
                min={s.min}
                max={s.max}
                className="w-full accent-primary"
              />
            </div>
          ))}

          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">رنگ سایه</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-border"
              />
              <span className="text-xs font-mono text-muted-foreground" dir="ltr">
                {color}
              </span>
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer mr-auto">
              <input
                type="checkbox"
                checked={inset}
                onChange={(e) => setInset(e.target.checked)}
                className="rounded border-border accent-primary"
              />
              <span className="text-xs">سایه داخلی (Inset)</span>
            </label>
          </div>
        </div>

        {/* Dual Preview */}
        <div className="space-y-4">
          {/* Light preview */}
          <div className="glass-card p-4 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Sun className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">پیش‌نمایش حالت روشن</span>
            </div>
            <div className="rounded-xl bg-white p-8 flex items-center justify-center min-h-[150px]">
              <div
                style={{ boxShadow: shadowValue }}
                className="w-24 h-24 rounded-lg bg-primary/20 border border-primary/30"
              />
            </div>
          </div>

          {/* Dark preview */}
          <div className="glass-card p-4 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">پیش‌نمایش حالت تاریک</span>
            </div>
            <div className="rounded-xl bg-gray-800 p-8 flex items-center justify-center min-h-[150px]">
              <div
                style={{ boxShadow: shadowValue }}
                className="w-24 h-24 rounded-lg bg-primary/20 border border-primary/30"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CSS Code */}
      <div className="glass-card p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Square className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">کد CSS</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "کپی شد!" : "کپی"}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              بازنشانی
            </button>
          </div>
        </div>
        <pre
          className={cn(
            "rounded-lg border border-border bg-card p-4 font-mono text-sm text-foreground select-all",
            "focus:outline-none"
          )}
          dir="ltr"
        >
          {cssCode}
        </pre>
      </div>
    </div>
  );
}
