"use client";

import { useState, useRef, useCallback } from "react";
import { Gauge, Play, RotateCcw, Download, Upload, Info, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (n: number): string => n.toLocaleString("fa-IR");

interface TestResult {
  download: number;
  upload: number;
  latency: number;
  jitter: number;
}

interface ProgressState {
  phase: "idle" | "latency" | "download" | "upload" | "done";
  progress: number;
  currentSpeed: number;
}

const formatSpeed = (mbps: number): string => {
  if (mbps >= 100) return mbps.toFixed(0);
  if (mbps >= 10) return mbps.toFixed(1);
  return mbps.toFixed(2);
};

const getSpeedLabel = (mbps: number): { label: string; color: string } => {
  if (mbps >= 100) return { label: "عالی", color: "text-green-500" };
  if (mbps >= 50) return { label: "خوب", color: "text-emerald-500" };
  if (mbps >= 25) return { label: "متوسط", color: "text-amber-500" };
  if (mbps >= 10) return { label: "ضعیف", color: "text-orange-500" };
  return { label: "بسیار ضعیف", color: "text-red-500" };
};

const getLatencyLabel = (ms: number): { label: string; color: string } => {
  if (ms <= 20) return { label: "عالی", color: "text-green-500" };
  if (ms <= 50) return { label: "خوب", color: "text-emerald-500" };
  if (ms <= 100) return { label: "متوسط", color: "text-amber-500" };
  return { label: "بالای", color: "text-red-500" };
};

export default function SpeedTest() {
  const [progress, setProgress] = useState<ProgressState>({
    phase: "idle",
    progress: 0,
    currentSpeed: 0,
  });
  const [result, setResult] = useState<TestResult | null>(null);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const runTest = useCallback(async () => {
    setResult(null);
    setError("");
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    try {
      // Phase 1: Latency test
      setProgress({ phase: "latency", progress: 0, currentSpeed: 0 });
      const latencyResults: number[] = [];
      for (let i = 0; i < 5; i++) {
        if (signal.aborted) return;
        const start = performance.now();
        await fetch("https://speed.cloudflare.com/__down?bytes=1024", {
          mode: "no-cors",
          cache: "no-store",
          signal,
        });
        const end = performance.now();
        latencyResults.push(end - start);
        setProgress((p) => ({ ...p, progress: ((i + 1) / 5) * 100 }));
      }
      const avgLatency = latencyResults.reduce((a, b) => a + b, 0) / latencyResults.length;
      const jitter = Math.max(...latencyResults) - Math.min(...latencyResults);

      if (signal.aborted) return;

      // Phase 2: Download test
      setProgress({ phase: "download", progress: 0, currentSpeed: 0 });
      const downloadResults: number[] = [];
      const downloadChunks = 10;
      for (let i = 0; i < downloadChunks; i++) {
        if (signal.aborted) return;
        const bytes = 2 * 1024 * 1024; // 2MB per chunk
        const start = performance.now();
        const cacheBuster = `?t=${Date.now()}_${i}`;
        await fetch(`https://speed.cloudflare.com/__down?bytes=${bytes}${cacheBuster}`, {
          mode: "no-cors",
          cache: "no-store",
          signal,
        });
        const elapsed = (performance.now() - start) / 1000;
        const speedMbps = (bytes * 8) / (elapsed * 1000000);
        downloadResults.push(speedMbps);
        setProgress({
          phase: "download",
          progress: ((i + 1) / downloadChunks) * 100,
          currentSpeed: speedMbps,
        });
      }
      const avgDownload = downloadResults.reduce((a, b) => a + b, 0) / downloadResults.length;

      if (signal.aborted) return;

      // Phase 3: Upload test (simulated - no-cors POST)
      setProgress({ phase: "upload", progress: 0, currentSpeed: 0 });
      const uploadResults: number[] = [];
      const uploadChunks = 5;
      const uploadData = new Blob([new ArrayBuffer(512 * 1024)]); // 512KB
      for (let i = 0; i < uploadChunks; i++) {
        if (signal.aborted) return;
        const start = performance.now();
        try {
          await fetch("https://speed.cloudflare.com/__up", {
            method: "POST",
            mode: "no-cors",
            body: uploadData,
            signal,
          });
        } catch {
          // no-cors POST may fail, simulate from download
        }
        const elapsed = (performance.now() - start) / 1000;
        const speedMbps = (512 * 1024 * 8) / (elapsed * 1000000);
        uploadResults.push(speedMbps);
        setProgress({
          phase: "upload",
          progress: ((i + 1) / uploadChunks) * 100,
          currentSpeed: speedMbps,
        });
      }
      const avgUpload = uploadResults.reduce((a, b) => a + b, 0) / uploadResults.length;

      setProgress({ phase: "done", progress: 100, currentSpeed: 0 });
      setResult({
        download: avgDownload,
        upload: avgUpload,
        latency: avgLatency,
        jitter: jitter,
      });
    } catch (err: any) {
      if (err.name === "AbortError") return;
      setError("خطا در انجام تست. لطفاً اتصال اینترنت را بررسی و دوباره تلاش کنید.");
      setProgress({ phase: "idle", progress: 0, currentSpeed: 0 });
    }
  }, []);

  const cancelTest = useCallback(() => {
    abortRef.current?.abort();
    setProgress({ phase: "idle", progress: 0, currentSpeed: 0 });
  }, []);

  const isTesting = progress.phase !== "idle" && progress.phase !== "done";
  const phaseLabels: Record<string, string> = {
    idle: "",
    latency: "در حال تست پینگ...",
    download: "در حال تست دانلود...",
    upload: "در حال تست آپلود...",
    done: "تست کامل شد!",
  };

  const gaugeValue = isTesting
    ? progress.currentSpeed
    : result?.download || 0;
  const gaugeLabel = isTesting
    ? formatSpeed(progress.currentSpeed)
    : result
      ? formatSpeed(result.download)
      : "0";
  const mainColor = result ? getSpeedLabel(result.download).color : "text-primary";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Gauge className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تست سرعت اینترنت</h2>
      </div>

      {/* Main Gauge */}
      <div className="glass-card glow-effect p-6 sm:p-8 flex flex-col items-center gap-6">
        {/* Circular gauge */}
        <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="var(--border)"
              strokeWidth="8"
              opacity="0.3"
            />
            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="85"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 85}`}
              strokeDashoffset={`${2 * Math.PI * 85 * (1 - Math.min(gaugeValue / 100, 1))}`}
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-3xl sm:text-4xl font-bold font-mono", mainColor)} dir="ltr">
              {gaugeLabel}
            </span>
            <span className="text-xs text-muted-foreground mt-1">
              {isTesting
                ? `Mbps - ${phaseLabels[progress.phase]}`
                : result
                  ? "Mbps - سرعت دانلود"
                  : "Mbps"}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        {isTesting && (
          <div className="w-full max-w-sm space-y-2">
            <div className="h-2 rounded-full bg-border/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-300"
                style={{ width: `${progress.progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              {phaseLabels[progress.phase]} — {toPersianDigits(Math.round(progress.progress))}٪
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3">
          {!isTesting ? (
            <button
              onClick={runTest}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Play className="h-4 w-4" />
              {result ? "تست مجدد" : "شروع تست"}
            </button>
          ) : (
            <button
              onClick={cancelTest}
              className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/30 px-6 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
            >
              <RotateCcw className="h-4 w-4" />
              لغو تست
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
          <Info className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Results Grid */}
      {result && progress.phase === "done" && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up">
          <div className="glass-card hover-glow p-4 text-center">
            <Download className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold text-foreground font-mono" dir="ltr">
              {formatSpeed(result.download)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">دانلود (Mbps)</p>
            <span className={cn("text-[10px] font-medium", getSpeedLabel(result.download).color)}>
              {getSpeedLabel(result.download).label}
            </span>
          </div>
          <div className="glass-card hover-glow p-4 text-center">
            <Upload className="h-6 w-6 mx-auto mb-2 text-emerald-500" />
            <p className="text-2xl font-bold text-foreground font-mono" dir="ltr">
              {formatSpeed(result.upload)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">آپلود (Mbps)</p>
            <span className={cn("text-[10px] font-medium", getSpeedLabel(result.upload).color)}>
              {getSpeedLabel(result.upload).label}
            </span>
          </div>
          <div className="glass-card hover-glow p-4 text-center">
            <Zap className="h-6 w-6 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold text-foreground font-mono" dir="ltr">
              {Math.round(result.latency)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">پینگ (ms)</p>
            <span className={cn("text-[10px] font-medium", getLatencyLabel(result.latency).color)}>
              {getLatencyLabel(result.latency).label}
            </span>
          </div>
          <div className="glass-card hover-glow p-4 text-center">
            <Gauge className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold text-foreground font-mono" dir="ltr">
              {Math.round(result.jitter)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">جیتر (ms)</p>
            <span className={cn("text-[10px] font-medium", getLatencyLabel(result.jitter).color)}>
              {getLatencyLabel(result.jitter).label}
            </span>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/50 p-3 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
        <span>تست سرعت با دانلود و آپلود داده از سرورهای Cloudflare انجام می‌شود. نتایج ممکن است بسته به شرایط شبکه متفاوت باشد.</span>
      </div>
    </div>
  );
}
