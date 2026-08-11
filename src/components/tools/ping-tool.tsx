"use client";

import { useState } from "react";
import {
  Activity,
  Loader2,
  Wifi,
  WifiOff,
  Clock,
  Zap,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Preset websites ──────────────────────────────────────────────────────────
const presetSites = [
  { domain: "google.com", label: "گوگل" },
  { domain: "digikala.com", label: "دیجی‌کالا" },
  { domain: "cloudflare.com", label: "کلودفلر" },
  { domain: "wikipedia.org", label: "ویکی‌پدیا" },
  { domain: "github.com", label: "گیت‌هاب" },
  { domain: "iran.ir", label: "ایران" },
  { domain: "yahoo.com", label: "یاهو" },
  { domain: "bing.com", label: "بینگ" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface PingResult {
  domain: string;
  success: boolean;
  time: number;
  timestamp: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────
const toPersianDigits = (n: number): string => n.toLocaleString("fa-IR");

const getNowTime = (): string => {
  return new Date().toLocaleTimeString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const pingUrl = async (
  url: string
): Promise<{ success: boolean; time: number }> => {
  const start = performance.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    await fetch(`https://${url}`, {
      mode: "no-cors",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const end = performance.now();
    return { success: true, time: Math.round(end - start) };
  } catch {
    const end = performance.now();
    return { success: false, time: Math.round(end - start) };
  }
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function PingTool() {
  const [customDomain, setCustomDomain] = useState("");
  const [results, setResults] = useState<PingResult[]>([]);
  const [pinging, setPinging] = useState<Set<string>>(new Set());
  const [pingAll, setPingAll] = useState(false);

  const handlePing = async (domain: string) => {
    const d = domain.trim();
    if (!d || pinging.has(d)) return;

    setPinging((prev) => new Set(prev).add(d));

    const res = await pingUrl(d);

    setResults((prev) => [
      { domain: d, success: res.success, time: res.time, timestamp: getNowTime() },
      ...prev,
    ]);

    setPinging((prev) => {
      const next = new Set(prev);
      next.delete(d);
      return next;
    });
  };

  const handlePingAll = async () => {
    setPingAll(true);
    for (const site of presetSites) {
      await handlePing(site.domain);
    }
    setPingAll(false);
  };

  const handleCustomPing = () => {
    const d = customDomain.trim();
    if (d) {
      handlePing(d);
    }
  };

  const getStatusColor = (success: boolean) =>
    success ? "text-emerald-500" : "text-red-500";

  const getStatusBg = (success: boolean) =>
    success ? "bg-emerald-500/10 border-emerald-500/20" : "bg-red-500/10 border-red-500/20";

  const getSpeedLabel = (ms: number) => {
    if (ms < 100) return { label: "سریع", color: "text-emerald-500" };
    if (ms < 300) return { label: "متوسط", color: "text-amber-500" };
    return { label: "کند", color: "text-red-500" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Activity className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">پینگ</h2>
      </div>

      <div className="glass-card p-5 sm:p-6 space-y-5">
        {/* Preset tiles */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">
            سایت‌های پیش‌فرض
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {presetSites.map((site) => {
              const isPinging = pinging.has(site.domain);
              const existing = results.find((r) => r.domain === site.domain);
              return (
                <button
                  key={site.domain}
                  onClick={() => handlePing(site.domain)}
                  disabled={isPinging || pingAll}
                  className={cn(
                    "glass-card hover-glow p-3 text-center transition-all",
                    "hover:border-primary/30",
                    existing && existing.success
                      ? "border-emerald-500/30"
                      : existing && !existing.success
                        ? "border-red-500/30"
                        : "",
                    (isPinging || pingAll) && "opacity-60 cursor-not-allowed"
                  )}
                >
                  {isPinging ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto" />
                  ) : (
                    <Globe className="h-5 w-5 mx-auto mb-1.5 text-muted-foreground" />
                  )}
                  <p className="text-sm font-medium text-foreground">
                    {site.label}
                  </p>
                  <p
                    className="text-xs font-mono text-muted-foreground mt-0.5"
                    dir="ltr"
                  >
                    {site.domain}
                  </p>
                  {existing && (
                    <div
                      className={cn(
                        "mt-2 rounded-md px-2 py-1 text-xs font-medium",
                        getStatusBg(existing.success),
                        getStatusColor(existing.success)
                      )}
                    >
                      {existing.success ? (
                        <span className="flex items-center justify-center gap-1">
                          <Wifi className="h-3 w-3" />
                          {toPersianDigits(existing.time)} میلی‌ثانیه
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1">
                          <WifiOff className="h-3 w-3" />
                          قطع
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Ping all button */}
          <button
            onClick={handlePingAll}
            disabled={pingAll || pinging.size > 0}
            className="mt-3 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {pingAll || pinging.size > 0 ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            پینگ همه سایت‌ها
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Custom domain input */}
        <div>
          <p className="text-sm font-medium text-foreground mb-3">
            دامنه یا آدرس دلخواه
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="مثلاً example.com"
              dir="ltr"
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => e.key === "Enter" && handleCustomPing()}
            />
            <button
              onClick={handleCustomPing}
              disabled={!customDomain.trim() || pinging.has(customDomain.trim())}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {pinging.has(customDomain.trim()) ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "پینگ"
              )}
            </button>
          </div>
        </div>

        {/* Results list */}
        {results.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              نتایج ({toPersianDigits(results.length)} مورد)
            </p>
            <div className="space-y-2">
              {results.map((r, i) => {
                const speed = getSpeedLabel(r.time);
                return (
                  <div
                    key={`${r.domain}-${i}`}
                    className={cn(
                      "glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-in-up",
                      "stagger-" + Math.min(i + 1, 10)
                    )}
                  >
                    {/* Status icon */}
                    <div
                      className={cn(
                        "flex items-center justify-center h-10 w-10 rounded-lg shrink-0",
                        r.success
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-red-500/10 text-red-500"
                      )}
                    >
                      {r.success ? (
                        <Wifi className="h-5 w-5" />
                      ) : (
                        <WifiOff className="h-5 w-5" />
                      )}
                    </div>

                    {/* Domain & status */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium text-foreground font-mono truncate"
                        dir="ltr"
                      >
                        {r.domain}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {r.success ? "آنلاین" : "آفلاین"}
                      </p>
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center gap-4 sm:gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          <span className="text-xs">زمان</span>
                        </div>
                        <p
                          className={cn(
                            "text-sm font-bold mt-0.5",
                            speed.color
                          )}
                        >
                          {toPersianDigits(r.time)}
                          <span className="text-xs font-normal text-muted-foreground mr-1">
                            ms
                          </span>
                        </p>
                      </div>

                      <div className="text-center">
                        <span className="text-xs text-muted-foreground">
                          سرعت
                        </span>
                        <p
                          className={cn(
                            "text-xs font-bold mt-0.5",
                            speed.color
                          )}
                        >
                          {speed.label}
                        </p>
                      </div>

                      <div className="text-center">
                        <span className="text-xs text-muted-foreground">
                          ساعت
                        </span>
                        <p className="text-xs font-medium text-foreground mt-0.5">
                          {r.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty state */}
        {results.length === 0 && !pingAll && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Activity className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              یک سایت را انتخاب کنید یا آدرس دلخواه وارد کنید
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
