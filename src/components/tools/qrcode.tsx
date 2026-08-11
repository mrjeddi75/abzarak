"use client";

import { useState } from "react";
import { QrCode, Download, Copy, Check, Link, Type } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [size, setSize] = useState("200");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const qrUrl = text.trim()
    ? `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(text.trim())}&size=${size}x${size}&margin=10&charset-source=UTF-8`
    : "";

  const isValidUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleGenerate = () => {
    if (!text.trim()) {
      setError("لطفاً متن یا لینک خود را وارد کنید");
      return;
    }
    setError("");
  };

  const handleDownload = async () => {
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(qrUrl, "_blank");
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(text.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sizeOptions = [
    { label: "کوچک", value: "150" },
    { label: "متوسط", value: "200" },
    { label: "بزرگ", value: "300" },
    { label: "خیلی بزرگ", value: "400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <QrCode className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تولید کد QR</h2>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          متن یا لینک
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            {text.trim() && isValidUrl(text.trim()) ? (
              <Link className="h-4 w-4 text-primary" />
            ) : (
              <Type className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setError(""); }}
            placeholder="متن، URL یا هر متنی را وارد کنید..."
            rows={3}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 pr-10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
            dir="auto"
          />
        </div>
      </div>

      {/* Size Options */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">اندازه تصویر</label>
        <div className="flex flex-wrap gap-2">
          {sizeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSize(opt.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                size === opt.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {opt.label} ({opt.value}×{opt.value})
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <QrCode className="h-4 w-4" />
        تولید کد QR
      </button>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* QR Code Display */}
      {qrUrl && !error && (
        <div className="space-y-4">
          <div className="flex justify-center rounded-lg border border-border bg-card p-6">
            <img
              src={qrUrl}
              alt="QR Code"
              className="rounded-md"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-lg bg-green-500/10 px-4 py-2 text-sm font-medium text-green-500 transition-colors hover:bg-green-500/20"
            >
              <Download className="h-4 w-4" />
              دانلود تصویر
            </button>
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "کپی شد!" : "کپی متن"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
