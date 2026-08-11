"use client";

import { useState, useRef } from "react";
import { Image, Upload, Copy, Check, X, FileImage, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "۰ بایت";
  const units = ["بایت", "کیلوبایت", "مگابایت", "گیگابایت"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);
  return toPersianDigits(size.toFixed(i === 0 ? 0 : 2)) + " " + units[i];
};

export default function ImageToBase64() {
  const [base64String, setBase64String] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [base64Size, setBase64Size] = useState(0);
  const [copied, setCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("لطفاً فقط فایل تصویری انتخاب کنید");
      return;
    }

    setError("");
    setFileName(file.name);
    setOriginalSize(file.size);

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64String(result);
      setBase64Size(result.length);
    };
    reader.onerror = () => {
      setError("خطا در خواندن فایل");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(base64String);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setBase64String("");
    setPreviewUrl("");
    setFileName("");
    setOriginalSize(0);
    setBase64Size(0);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const sizeIncrease = originalSize > 0 ? ((base64Size / originalSize - 1) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Image className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تبدیل تصویر به Base64</h2>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors",
          dragActive
            ? "border-primary bg-primary/5"
            : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
        )}
      >
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full",
          dragActive ? "bg-primary/10" : "bg-muted"
        )}>
          <Upload className={cn("h-6 w-6", dragActive ? "text-primary" : "text-muted-foreground")} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            فایل تصویری را بکشید و رها کنید
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            یا کلیک کنید تا فایل را انتخاب کنید
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {/* Results */}
      {(previewUrl || base64String) && (
        <div className="space-y-4">
          {/* File Info & Preview */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">پیش‌نمایش</label>
              <div className="flex items-center justify-center rounded-lg border border-border bg-card p-4 min-h-[200px]">
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="پیش‌نمایش"
                    className="max-h-64 max-w-full rounded-md object-contain"
                  />
                )}
              </div>
            </div>

            {/* File Info */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">اطلاعات فایل</label>
              <div className="rounded-lg border border-border bg-card p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <FileImage className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">نام فایل</p>
                    <p className="text-sm text-foreground truncate">{fileName}</p>
                  </div>
                </div>

                {/* Original Size */}
                <div className="flex items-start gap-3">
                  <HardDrive className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">حجم فایل اصلی</p>
                    <p className="text-sm text-foreground">{formatFileSize(originalSize)}</p>
                  </div>
                </div>

                {/* Base64 Size */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-4 w-4 items-center justify-center text-[10px] font-mono text-muted-foreground shrink-0">B64</span>
                  <div>
                    <p className="text-xs text-muted-foreground">حجم Base64 (کاراکتر)</p>
                    <p className="text-sm text-foreground">{formatFileSize(base64Size)}</p>
                  </div>
                </div>

                {/* Size Ratio */}
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-4 w-4 items-center justify-center shrink-0">
                    <span className="text-[10px]">↕</span>
                  </span>
                  <div>
                    <p className="text-xs text-muted-foreground">افزایش حجم</p>
                    <p className={cn(
                      "text-sm font-medium",
                      parseFloat(sizeIncrease) > 40 ? "text-yellow-500" : "text-green-500"
                    )}>
                      ≈ {toPersianDigits(sizeIncrease)}٪
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Base64 Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">خروجی Base64</label>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!base64String}
                  className="flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-40"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "کپی شد!" : "کپی"}
                </button>
                <button
                  onClick={handleClear}
                  className="flex items-center gap-1.5 rounded-md bg-red-500/10 px-3 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/20"
                >
                  <X className="h-3.5 w-3.5" />
                  پاک کردن
                </button>
              </div>
            </div>
            <textarea
              readOnly
              value={base64String}
              placeholder="Base64 encoding اینجا نمایش داده می‌شود..."
              rows={6}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:outline-none resize-y"
              dir="ltr"
            />
          </div>
        </div>
      )}
    </div>
  );
}
