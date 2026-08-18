"use client";

import { useState, useRef, useCallback } from "react";
import {
  Image,
  Upload,
  Download,
  Trash2,
  Loader2,
  SlidersHorizontal,
  Info,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CompressedImage {
  original: File;
  originalSize: number;
  compressedBlob: Blob;
  compressedSize: number;
  preview: string;
  compressedPreview: string;
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

const toPersianDigits = (n: number): string => {
  try { return n.toLocaleString("fa-IR"); } catch { return String(n); }
};

export default function ImageCompressor() {
  const [images, setImages] = useState<CompressedImage[]>([]);
  const [quality, setQuality] = useState(75);
  const [maxWidth, setMaxWidth] = useState(1920);
  const [outputFormat, setOutputFormat] = useState<string>("image/jpeg");
  const [processing, setProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = useCallback(
    (file: File): Promise<CompressedImage | null> => {
      return new Promise((resolve) => {
        const img = new window.Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            URL.revokeObjectURL(url);
            resolve(null);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                URL.revokeObjectURL(url);
                resolve(null);
                return;
              }
              resolve({
                original: file,
                originalSize: file.size,
                compressedBlob: blob,
                compressedSize: blob.size,
                preview: url,
                compressedPreview: URL.createObjectURL(blob),
              });
            },
            outputFormat,
            quality / 100
          );
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(null);
        };

        img.src = url;
      });
    },
    [quality, maxWidth, outputFormat]
  );

  const handleFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) =>
      f.type.startsWith("image/")
    );
    if (validFiles.length === 0) return;

    setProcessing(true);
    const results: CompressedImage[] = [];

    for (const file of validFiles) {
      const result = await compressImage(file);
      if (result) results.push(result);
    }

    setImages((prev) => [...prev, ...results]);
    setProcessing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDownload = (img: CompressedImage, index: number) => {
    const ext = outputFormat === "image/png" ? "png" : outputFormat === "image/webp" ? "webp" : "jpg";
    const name = img.original.name.replace(/\.[^.]+$/, "") + `_compressed.${ext}`;
    const a = document.createElement("a");
    a.href = img.compressedPreview;
    a.download = name;
    a.click();
  };

  const handleDownloadAll = () => {
    images.forEach((img, i) => handleDownload(img, i));
  };

  const handleRemove = (index: number) => {
    setImages((prev) => {
      const item = prev[index];
      if (item) {
        URL.revokeObjectURL(item.preview);
        URL.revokeObjectURL(item.compressedPreview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleClearAll = () => {
    images.forEach((img) => {
      URL.revokeObjectURL(img.preview);
      URL.revokeObjectURL(img.compressedPreview);
    });
    setImages([]);
  };

  const totalOriginal = images.reduce((s, i) => s + i.originalSize, 0);
  const totalCompressed = images.reduce((s, i) => s + i.compressedSize, 0);
  const totalSaved = totalOriginal - totalCompressed;
  const savedPercent =
    totalOriginal > 0
      ? Math.round((totalSaved / totalOriginal) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Image className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">فشرده‌ساز عکس</h2>
      </div>

      {/* Settings */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <SlidersHorizontal className="h-4 w-4 text-primary" />
          تنظیمات فشرده‌سازی
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Quality */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">کیفیت</span>
              <span className="font-medium text-foreground">{toPersianDigits(quality)}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>فشرده</span>
              <span>عالی</span>
            </div>
          </div>

          {/* Max Width */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">حداکثر عرض (px)</span>
              <span className="font-medium text-foreground">{toPersianDigits(maxWidth)}</span>
            </div>
            <select
              value={maxWidth}
              onChange={(e) => setMaxWidth(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={640}>640px</option>
              <option value={1024}>1024px</option>
              <option value={1280}>1280px</option>
              <option value={1920}>1920px</option>
              <option value={2560}>2560px</option>
              <option value={3840}>3840px (4K)</option>
            </select>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">فرمت خروجی</span>
            </div>
            <select
              value={outputFormat}
              onChange={(e) => setOutputFormat(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="image/jpeg">JPEG (حجم کمتر)</option>
              <option value="image/png">PNG (بدون افت کیفیت)</option>
              <option value="image/webp">WebP (حجم بهینه)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "glass-card p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border-2 border-dashed",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-primary/5"
        )}
      >
        {processing ? (
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        ) : (
          <Upload className="h-10 w-10 text-muted-foreground" />
        )}
        <p className="text-sm font-medium text-foreground">
          {processing ? "در حال فشرده‌سازی..." : "عکس‌ها را اینجا بکشید یا کلیک کنید"}
        </p>
        <p className="text-xs text-muted-foreground">فرمت‌های پشتیبانی: JPEG, PNG, WebP, GIF</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Stats Bar */}
      {images.length > 0 && (
        <div className="glass-card glow-effect p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              <span className="font-bold text-foreground">{toPersianDigits(images.length)}</span> عکس
            </span>
            <span className="text-muted-foreground">
              حجم اصلی: <span className="font-medium text-foreground" dir="ltr">{formatSize(totalOriginal)}</span>
            </span>
            <span className="text-muted-foreground">
              حجم فشرده: <span className="font-medium text-emerald-500" dir="ltr">{formatSize(totalCompressed)}</span>
            </span>
            <span className="text-muted-foreground">
              صرفه‌جویی: <span className="font-bold text-primary">{toPersianDigits(savedPercent)}%</span>
              <span className="text-xs" dir="ltr"> ({formatSize(totalSaved)})</span>
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDownloadAll}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="h-3.5 w-3.5" />
              دانلود همه
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Trash2 className="h-3.5 w-3.5" />
              حذف همه
            </button>
          </div>
        </div>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((img, index) => {
            const savedPercent = Math.round(
              ((img.originalSize - img.compressedSize) / img.originalSize) * 100
            );
            return (
              <div key={index} className="glass-card hover-glow p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Previews */}
                  <div className="flex gap-3 flex-1">
                    <div className="flex-1 space-y-1.5">
                      <p className="text-[10px] text-muted-foreground">اصلی</p>
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-background">
                        <img
                          src={img.preview}
                          alt="original"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center" dir="ltr">
                        {formatSize(img.originalSize)}
                      </p>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <span className="text-lg">←</span>
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <p className="text-[10px] text-primary">فشرده‌شده</p>
                      <div className="relative aspect-video rounded-lg overflow-hidden border border-primary/30 bg-background">
                        <img
                          src={img.compressedPreview}
                          alt="compressed"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-xs text-emerald-500 text-center" dir="ltr">
                        {formatSize(img.compressedSize)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center justify-center gap-2">
                    <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5">
                      <Check className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-bold text-primary">
                        {toPersianDigits(savedPercent)}% کاهش
                      </span>
                    </div>
                    <button
                      onClick={() => handleDownload(img, index)}
                      className="rounded-lg border border-border bg-background/50 p-2 transition-colors hover:bg-accent"
                      title="دانلود"
                    >
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleRemove(index)}
                      className="rounded-lg border border-border bg-background/50 p-2 transition-colors hover:bg-destructive/10"
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info */}
      <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/50 p-3 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
        <span>
          تمام فشرده‌سازی‌ها در مرورگر شما انجام می‌شود و هیچ عکسی به سرور ارسال
          نمی‌شود. برای بهترین نتیجه، فرمت JPEG با کیفیت ۷۰-۸۰٪ پیشنهاد می‌شود.
        </span>
      </div>
    </div>
  );
}
