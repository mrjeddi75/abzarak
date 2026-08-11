"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, RotateCcw, Paintbrush } from "lucide-react";

type GradientType = "linear" | "radial";

export default function GradientGenerator() {
  const [color1, setColor1] = useState("#6366f1");
  const [color2, setColor2] = useState("#ec4899");
  const [gradientType, setGradientType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [copied, setCopied] = useState(false);

  const getGradientCSS = () => {
    if (gradientType === "linear") {
      return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    }
    return `radial-gradient(circle, ${color1}, ${color2})`;
  };

  const gradientCSS = getGradientCSS();
  const cssCode = `background: ${gradientCSS};`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    const temp = color1;
    setColor1(color2);
    setColor2(temp);
  };

  const handleReset = () => {
    setColor1("#6366f1");
    setColor2("#ec4899");
    setGradientType("linear");
    setAngle(135);
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Preview */}
      <div
        className="w-full h-48 rounded-lg border border-border"
        style={{ background: gradientCSS }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">رنگ ۱</label>
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-border"
              />
              <span className="text-xs font-mono text-foreground" dir="ltr">
                {color1}
              </span>
            </div>

            <button
              onClick={handleSwap}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="جابجایی رنگ‌ها"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <label className="text-xs text-muted-foreground">رنگ ۲</label>
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-border"
              />
              <span className="text-xs font-mono text-foreground" dir="ltr">
                {color2}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">نوع گرادیان</span>
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setGradientType("linear")}
                className={cn(
                  "flex-1 px-4 py-2 text-xs font-medium transition-colors",
                  gradientType === "linear"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-muted"
                )}
              >
                خطی (Linear)
              </button>
              <button
                onClick={() => setGradientType("radial")}
                className={cn(
                  "flex-1 px-4 py-2 text-xs font-medium transition-colors border-r border-border",
                  gradientType === "radial"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-muted"
                )}
              >
                دایره‌ای (Radial)
              </button>
            </div>
          </div>

          {gradientType === "linear" && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">زاویه</label>
                <span className="text-xs text-foreground">{angle}°</span>
              </div>
              <input
                type="range"
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value))}
                min={0}
                max={360}
                className="w-full accent-primary"
              />
            </div>
          )}
        </div>

        {/* CSS Code */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Paintbrush className="w-4 h-4 text-primary" />
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
              "min-h-[140px] flex items-center"
            )}
            dir="ltr"
          >
            {cssCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
