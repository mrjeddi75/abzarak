"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, RotateCcw, Link, Unlink, Square } from "lucide-react";

export default function BorderRadiusGenerator() {
  const [linked, setLinked] = useState(true);
  const [topLeft, setTopLeft] = useState(12);
  const [topRight, setTopRight] = useState(12);
  const [bottomLeft, setBottomLeft] = useState(12);
  const [bottomRight, setBottomRight] = useState(12);
  const [copied, setCopied] = useState(false);

  const handleLinkedChange = (value: number) => {
    setTopLeft(value);
    setTopRight(value);
    setBottomLeft(value);
    setBottomRight(value);
  };

  const borderRadiusValue = `${topLeft}px ${topRight}px ${bottomRight}px ${bottomLeft}px`;
  const cssCode = `border-radius: ${borderRadiusValue};`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    handleLinkedChange(12);
  };

  const corners = [
    { label: "بالا-چپ", value: topLeft, setter: setTopLeft },
    { label: "بالا-راست", value: topRight, setter: setTopRight },
    { label: "پایین-راست", value: bottomRight, setter: setBottomRight },
    { label: "پایین-چپ", value: bottomLeft, setter: setBottomLeft },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">گوشه‌ها</span>
            <button
              onClick={() => setLinked(!linked)}
              className={cn(
                "p-1.5 rounded-lg transition-colors",
                linked
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:bg-muted"
              )}
              title={linked ? "لینک شده" : "جداسازی گوشه‌ها"}
            >
              {linked ? (
                <Link className="w-4 h-4" />
              ) : (
                <Unlink className="w-4 h-4" />
              )}
            </button>
            <span className="text-xs text-muted-foreground">
              {linked ? "همه گوشه‌ها یکسان" : "مستقل"}
            </span>
          </div>

          {linked ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">شعاع</label>
                <input
                  type="number"
                  value={topLeft}
                  onChange={(e) => handleLinkedChange(parseInt(e.target.value) || 0)}
                  className={cn(
                    "w-16 rounded border border-border bg-card p-1 text-foreground text-xs text-center",
                    "focus:outline-none focus:ring-1 focus:ring-primary/50"
                  )}
                  min={0}
                  max={200}
                />
              </div>
              <input
                type="range"
                value={topLeft}
                onChange={(e) => handleLinkedChange(parseInt(e.target.value))}
                min={0}
                max={200}
                className="w-full accent-primary"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {corners.map((c) => (
                <div key={c.label} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-muted-foreground">{c.label}</label>
                    <input
                      type="number"
                      value={c.value}
                      onChange={(e) => c.setter(parseInt(e.target.value) || 0)}
                      className={cn(
                        "w-16 rounded border border-border bg-card p-1 text-foreground text-xs text-center",
                        "focus:outline-none focus:ring-1 focus:ring-primary/50"
                      )}
                      min={0}
                      max={200}
                    />
                  </div>
                  <input
                    type="range"
                    value={c.value}
                    onChange={(e) => c.setter(parseInt(e.target.value))}
                    min={0}
                    max={200}
                    className="w-full accent-primary"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="flex items-center justify-center">
          <div
            className="w-48 h-48 bg-primary/20 border-2 border-primary/40"
            style={{ borderRadius: borderRadiusValue }}
          />
        </div>
      </div>

      {/* CSS Code */}
      <div className="space-y-2">
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
            "rounded-lg border border-border bg-card p-4 font-mono text-sm text-foreground select-all"
          )}
          dir="ltr"
        >
          {cssCode}
        </pre>
      </div>
    </div>
  );
}
