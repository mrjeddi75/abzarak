"use client";

import { useState } from "react";
import {
  Route,
  Loader2,
  Play,
  MapPin,
  Server,
  Globe,
  CircleDot,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface HopResult {
  hop: number;
  ip: string;
  location: string;
  latency: number;
  type: "local" | "isp" | "regional" | "gateway" | "destination";
}

// ─── Simulated route data generators ──────────────────────────────────────────
const iranianISPs = [
  "شرکت ارتباطات زیرساخت ایران",
  "ایران‌تلکام",
  "مخابرات ایران",
  "شاتل",
  "پارس‌آنلاین",
  "رایتل",
  "همراه اول",
  "ایرانسل",
];

const iranianCities = [
  "تهران",
  "اصفهان",
  "شیراز",
  "مشهد",
  "تبریز",
  "اهواز",
  "کرج",
  "قم",
];

const regionalHubs = [
  "فرانکفورت، آلمان",
  "آمستردام، هلند",
  "لندن، انگلستان",
  "میلان، ایتالیا",
  "پاریس، فرانسه",
];

const gateways = [
  "دبی، امارات",
  "استانبول، ترکیه",
  "دهلی، هند",
  "سنگاپور",
];

const generateRandomIP = (): string => {
  const octet = () => Math.floor(Math.random() * 254) + 1;
  return `${octet()}.${octet()}.${octet()}.${octet()}`;
};

const generateRandomLatency = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const isIranianDomain = (domain: string): boolean => {
  const iranianTLDs = [".ir", ".co.ir", ".ac.ir", ".org.ir"];
  return iranianTLDs.some((tld) => domain.endsWith(tld));
};

const generateHops = (domain: string): HopResult[] => {
  const hops: HopResult[] = [];
  const isIranian = isIranianDomain(domain);
  const totalHops = isIranian
    ? Math.floor(Math.random() * 3) + 5
    : Math.floor(Math.random() * 3) + 7;

  // Hop 1: Your Location (router)
  hops.push({
    hop: 1,
    ip: generateRandomIP(),
    location: "مودم / روتر شما",
    latency: generateRandomLatency(1, 3),
    type: "local",
  });

  // Hop 2: ISP
  hops.push({
    hop: 2,
    ip: generateRandomIP(),
    location: iranianISPs[Math.floor(Math.random() * iranianISPs.length)],
    latency: generateRandomLatency(5, 15),
    type: "isp",
  });

  // Hops 3-4: Regional hubs within Iran
  const iranHops = isIranian ? 3 : 2;
  for (let i = 0; i < iranHops; i++) {
    const cityIdx = Math.floor(Math.random() * iranianCities.length);
    hops.push({
      hop: hops.length + 1,
      ip: generateRandomIP(),
      location:
        i === 0
          ? `مرکز داده ${iranianCities[cityIdx]}`
          : `سوئیچ ${iranianCities[(cityIdx + 2) % iranianCities.length]}`,
      latency: generateRandomLatency(10 + i * 5, 25 + i * 8),
      type: "regional",
    });
  }

  if (!isIranian) {
    // International gateway
    const gw = gateways[Math.floor(Math.random() * gateways.length)];
    hops.push({
      hop: hops.length + 1,
      ip: generateRandomIP(),
      location: `دروازه بین‌المللی — ${gw}`,
      latency: generateRandomLatency(40, 70),
      type: "gateway",
    });

    // European/Regional hub
    const hub = regionalHubs[Math.floor(Math.random() * regionalHubs.length)];
    hops.push({
      hop: hops.length + 1,
      ip: generateRandomIP(),
      location: `مرکز تبادل ترافیک — ${hub}`,
      latency: generateRandomLatency(70, 120),
      type: "regional",
    });

    // Additional hops
    while (hops.length < totalHops - 1) {
      hops.push({
        hop: hops.length + 1,
        ip: generateRandomIP(),
        location: `نقطه واسط ${hops.length - 2}`,
        latency: generateRandomLatency(80 + hops.length * 10, 140 + hops.length * 10),
        type: "regional",
      });
    }
  }

  // Final hop: Destination
  hops.push({
    hop: hops.length + 1,
    ip: generateRandomIP(),
    location: `مقصد — ${domain}`,
    latency: isIranian
      ? generateRandomLatency(20, 50)
      : generateRandomLatency(100, 250),
    type: "destination",
  });

  return hops;
};

// ─── Helper ───────────────────────────────────────────────────────────────────
const toPersianDigits = (n: number): string => n.toLocaleString("fa-IR");

const getHopIcon = (type: HopResult["type"]) => {
  switch (type) {
    case "local":
      return <CircleDot className="h-5 w-5" />;
    case "isp":
      return <Server className="h-5 w-5" />;
    case "regional":
      return <MapPin className="h-5 w-5" />;
    case "gateway":
      return <Globe className="h-5 w-5" />;
    case "destination":
      return <Route className="h-5 w-5" />;
  }
};

const getHopColor = (type: HopResult["type"]) => {
  switch (type) {
    case "local":
      return "text-blue-500 bg-blue-500/10 border-blue-500/20";
    case "isp":
      return "text-violet-500 bg-violet-500/10 border-violet-500/20";
    case "regional":
      return "text-amber-500 bg-amber-500/10 border-amber-500/20";
    case "gateway":
      return "text-cyan-500 bg-cyan-500/10 border-cyan-500/20";
    case "destination":
      return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  }
};

const getHopLabel = (type: HopResult["type"]) => {
  switch (type) {
    case "local":
      return "محلی";
    case "isp":
      return "اینترنت";
    case "regional":
      return "مرکزی";
    case "gateway":
      return "دروازه";
    case "destination":
      return "مقصد";
  }
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function TracerouteTool() {
  const [domain, setDomain] = useState("");
  const [hops, setHops] = useState<HopResult[]>([]);
  const [running, setRunning] = useState(false);
  const [visibleHops, setVisibleHops] = useState(0);

  const handleStart = async () => {
    const d = domain.trim();
    if (!d) return;

    const generatedHops = generateHops(d);
    setHops(generatedHops);
    setRunning(true);
    setVisibleHops(0);

    // Reveal hops one by one with animation
    for (let i = 0; i < generatedHops.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 300));
      setVisibleHops(i + 1);
    }

    setRunning(false);
  };

  const totalLatency =
    hops.length > 0 ? hops[hops.length - 1].latency : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Route className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تریس‌روت</h2>
      </div>

      <div className="glass-card p-5 sm:p-6 space-y-5">
        {/* Info note */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary/80 leading-relaxed">
          ⚠️ تریس‌روت واقعی از مرورگر امکان‌پذیر نیست. این ابزار یک شبیه‌سازی
          آموزشی از مسیر شبکه تا مقصد ارائه می‌دهد.
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="نام دامنه را وارد کنید (مثلاً google.com)"
            dir="ltr"
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => e.key === "Enter" && handleStart()}
          />
          <button
            onClick={handleStart}
            disabled={!domain.trim() || running}
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال بررسی...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                شروع
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {hops.length > 0 && (
          <div className="space-y-3">
            {/* Summary bar */}
            {visibleHops >= hops.length && (
              <div className="glass-card p-3 flex flex-wrap items-center justify-between gap-3 animate-fade-in">
                <div className="text-sm text-foreground">
                  <span className="text-muted-foreground">مقصد: </span>
                  <span className="font-mono" dir="ltr">
                    {domain}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    تعداد هامپ: {toPersianDigits(hops.length)}
                  </span>
                  <span>
                    تأخیر کل: {toPersianDigits(totalLatency)} میلی‌ثانیه
                  </span>
                </div>
              </div>
            )}

            {/* Hops list */}
            <div className="relative">
              {/* Vertical line connecting hops */}
              <div
                className="absolute right-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary/30 via-primary/20 to-emerald-500/30"
                style={{
                  height: `${Math.max((visibleHops - 1) * 80, 0)}px`,
                  transition: "height 0.4s ease",
                }}
              />

              <div className="space-y-3">
                {hops.slice(0, visibleHops).map((hop, i) => {
                  const colorClasses = getHopColor(hop.type);
                  const isLast = hop.type === "destination";

                  return (
                    <div
                      key={`${hop.hop}-${i}`}
                      className={cn(
                        "glass-card p-4 flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-in-up",
                        "stagger-" + Math.min(i + 1, 10),
                        isLast && "border-emerald-500/30"
                      )}
                    >
                      {/* Hop number + icon */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div
                          className={cn(
                            "flex items-center justify-center h-10 w-10 rounded-lg border",
                            colorClasses
                          )}
                        >
                          {getHopIcon(hop.type)}
                        </div>
                        <div className="text-center min-w-[32px]">
                          <p className="text-lg font-bold text-primary">
                            {toPersianDigits(hop.hop)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {getHopLabel(hop.type)}
                          </p>
                        </div>
                      </div>

                      {/* Location & IP */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {hop.location}
                        </p>
                        <p
                          className="text-xs font-mono text-muted-foreground mt-0.5"
                          dir="ltr"
                        >
                          {hop.ip}
                        </p>
                      </div>

                      {/* Latency */}
                      <div
                        className={cn(
                          "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-bold shrink-0",
                          hop.latency < 20
                            ? "bg-emerald-500/10 text-emerald-500"
                            : hop.latency < 80
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-red-500/10 text-red-500"
                        )}
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                        {toPersianDigits(hop.latency)}
                        <span className="text-[10px] font-normal mr-0.5">
                          ms
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator while running */}
                {running && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse pl-14">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    در حال بررسی هامپ {toPersianDigits(visibleHops + 1)}...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {hops.length === 0 && !running && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Route className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">
              نام دامنه‌ای را وارد کنید تا مسیر شبکه نمایش داده شود
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
