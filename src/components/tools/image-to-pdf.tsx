"use client";

import { useState, useRef, useCallback } from "react";
import {
  FileImage,
  Upload,
  Download,
  Trash2,
  Loader2,
  GripVertical,
  Image as ImageIcon,
  Info,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageItem {
  id: string;
  file: File;
  preview: string;
  width: number;
  height: number;
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};

const toPersianDigits = (n: number): string => {
  try { return n.toLocaleString("fa-IR"); } catch { return String(n); }
};

const ORIENTATIONS = [
  { value: "portrait", label: "عمودی (A4)" },
  { value: "landscape", label: "افقی (A4)" },
  { value: "fit", label: "مطابق عکس" },
];

const loadDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = URL.createObjectURL(file);
  });
};

export default function ImageToPdf() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [orientation, setOrientation] = useState("portrait");
  const [margin, setMargin] = useState(10);
  const [quality, setQuality] = useState(85);
  const [generating, setGenerating] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = async (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) return;

    const newItems: ImageItem[] = [];
    for (const file of validFiles) {
      const { width, height } = await loadDimensions(file);
      newItems.push({
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        file,
        preview: URL.createObjectURL(file),
        width,
        height,
      });
    }
    setImages((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) addFiles(e.dataTransfer.files);
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((prev) => {
      const arr = [...prev];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return arr;
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  const generatePdf = useCallback(async () => {
    if (images.length === 0) return;
    setGenerating(true);

    try {
      const { jsPDF } = await import("jspdf");

      const pageW = 210;
      const pageH = 297;
      const m = margin;
      const contentW = pageW - 2 * m;
      const contentH = pageH - 2 * m;

      let pdf: any = null;

      for (let idx = 0; idx < images.length; idx++) {
        const img = images[idx];
        const imgData = await readFileAsDataURL(img.file);

        let pw: number, ph: number;
        if (orientation === "portrait") {
          pw = pageW; ph = pageH;
        } else if (orientation === "landscape") {
          pw = pageH; ph = pageW;
        } else {
          // fit to image aspect ratio (max A4)
          if (img.width / img.height > pageW / pageH) {
            pw = pageH; ph = pageW;
          } else {
            pw = pageW; ph = pageH;
          }
        }

        if (idx === 0) {
          pdf = new jsPDF({ orientation: pw > ph ? "l" : "p", unit: "mm", format: [pw, ph] });
        } else {
          pdf.addPage([pw, ph], pw > ph ? "l" : "p");
        }

        const availW = pw - 2 * m;
        const availH = ph - 2 * m;
        const ratio = Math.min(availW / img.width, availH / img.height, 1);
        const drawW = img.width * ratio;
        const drawH = img.height * ratio;
        const x = (pw - drawW) / 2;
        const y = (ph - drawH) / 2;

        pdf.addImage(imgData, "JPEG", x, y, drawW, drawH, undefined, "MEDIUM");
      }

      if (pdf) pdf.save("abzarak-images.pdf");
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setGenerating(false);
    }
  }, [images, orientation, margin]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileImage className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تبدیل عکس به PDF</h2>
      </div>

      {/* Settings */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          تنظیمات PDF
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">جهت صفحه</span>
            <select
              value={orientation}
              onChange={(e) => setOrientation(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {ORIENTATIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">حاشیه (mm)</span>
              <span className="font-medium text-foreground">{toPersianDigits(margin)}</span>
            </div>
            <input
              type="range" min={0} max={40} value={margin}
              onChange={(e) => setMargin(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">کیفیت عکس</span>
              <span className="font-medium text-foreground">{toPersianDigits(quality)}%</span>
            </div>
            <input
              type="range" min={30} max={100} value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      </div>

      {/* Upload */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "glass-card p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border-2 border-dashed",
          dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-primary/5"
        )}
      >
        <Upload className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">عکس‌ها را اینجا بکشید یا کلیک کنید</p>
        <p className="text-xs text-muted-foreground">هر عکس یک صفحه PDF می‌شود — ترتیب قابل تغییر است</p>
        <input
          ref={fileInputRef}
          type="file" accept="image/*" multiple
          onChange={(e) => e.target.files && addFiles(e.target.files)}
          className="hidden"
        />
      </div>

      {/* Generate Button + Count */}
      {images.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            <span className="font-bold text-foreground">{toPersianDigits(images.length)}</span> عکس انتخاب‌شده
          </span>
          <div className="flex gap-2">
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Trash2 className="h-3.5 w-3.5" />
              حذف همه
            </button>
            <button
              onClick={generatePdf}
              disabled={generating}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              ساخت PDF
            </button>
          </div>
        </div>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="glass-card hover-glow p-2 space-y-2 group relative"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden border border-border bg-background">
                <img src={img.preview} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center justify-between px-1">
                <p className="text-[10px] text-muted-foreground truncate max-w-[70%]" dir="ltr">
                  {img.file.name}
                </p>
                <span className="text-[10px] text-muted-foreground" dir="ltr">
                  {img.width}×{img.height}
                </span>
              </div>
              {/* Reorder buttons */}
              <div className="absolute top-3 left-1 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => { e.stopPropagation(); moveImage(index, index - 1); }}
                  disabled={index === 0}
                  className="rounded bg-background/80 border border-border p-1 text-[10px] disabled:opacity-30"
                >↑</button>
                <button
                  onClick={(e) => { e.stopPropagation(); moveImage(index, index + 1); }}
                  disabled={index === images.length - 1}
                  className="rounded bg-background/80 border border-border p-1 text-[10px] disabled:opacity-30"
                >↓</button>
              </div>
              {/* Delete */}
              <button
                onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                className="absolute top-3 right-1 rounded-lg bg-destructive/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-3 w-3 text-white" />
              </button>
              {/* Page number */}
              <div className="absolute bottom-10 left-2 rounded-full bg-primary/90 px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                {toPersianDigits(index + 1)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/50 p-3 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
        <span>
          تبدیل عکس به PDF کاملاً در مرورگر انجام می‌شود. کتابخانه jsPDF در لحظه دانلود و
          استفاده می‌شود و هیچ فایلی به سرور ارسال نمی‌شود.
        </span>
      </div>
    </div>
  );
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
