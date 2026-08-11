"use client";

import { useState, useEffect } from "react";
import { Globe, Loader2, AlertCircle, MapPin, Copy, Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface IPResult {
  ip: string;
  country: string;
  country_code: string;
  city: string;
  region: string;
  isp: string;
  latitude: number;
  longitude: number;
  timezone: { id: string };
  postal: string;
  connection: {
    asn: number;
    org: string;
  };
}

export default function IPLookup() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<IPResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const lookup = async (q?: string) => {
    const target = q || query.trim();
    if (!target) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`https://ipwho.is/${encodeURIComponent(target)}`);
      const data = await res.json();

      if (data.success === false) {
        setError(data.message || "خطا در دریافت اطلاعات");
        return;
      }

      setResult(data);
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    lookup();
  }, []);

  const handleCopy = async () => {
    if (!result?.ip) return;
    try {
      await navigator.clipboard.writeText(result.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback - ignore
    }
  };

  const toPersianDigits = (n: number) => n.toLocaleString("fa-IR");

  const fields = result
    ? [
        { label: "شهر", value: result.city || "—" },
        { label: "منطقه", value: result.region || "—" },
        { label: "کشور", value: result.country || "—" },
        { label: "ارائه‌دهنده اینترنت (ISP)", value: result.isp || "—" },
        { label: "عرض جغرافیایی", value: result.latitude != null ? toPersianDigits(result.latitude) : "—" },
        { label: "طول جغرافیایی", value: result.longitude != null ? toPersianDigits(result.longitude) : "—" },
        { label: "منطقه زمانی", value: result.timezone?.id || "—" },
        { label: "کد پستی", value: result.postal || "—" },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Globe className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">استعلام IP</h2>
      </div>

      {/* Large IP Display with Copy */}
      {(result || initialLoading || loading) && (
        <div className="glass-card glow-effect p-6 flex flex-col items-center gap-4">
          {initialLoading || (loading && !result) ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                در حال دریافت اطلاعات آی‌پی شما...
              </p>
            </div>
          ) : result ? (
            <>
              <p className="text-sm text-muted-foreground">آدرس آی‌پی شما</p>
              <div className="flex items-center gap-3">
                <span
                  className="text-3xl font-mono font-bold text-foreground tracking-wide"
                  dir="ltr"
                >
                  {result.ip}
                </span>
                <button
                  onClick={handleCopy}
                  className="rounded-lg border border-border bg-background/50 p-2.5 transition-colors hover:bg-accent"
                  title="کپی آدرس IP"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <Copy className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-xs font-medium text-green-500 animate-fade-in">
                  کپی شد!
                </p>
              )}
            </>
          ) : null}
        </div>
      )}

      {/* Manual IP Input */}
      <div className="glass-card p-5 space-y-4">
        <p className="text-sm font-medium text-muted-foreground">
          جستجوی آی‌پی دلخواه
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="آدرس IP را وارد کنید (مثلاً 8.8.8.8)"
            dir="ltr"
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => e.key === "Enter" && lookup()}
          />
          <button
            onClick={() => lookup()}
            disabled={loading}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "استعلام"
            )}
          </button>
        </div>

        <button
          onClick={() => {
            setQuery("");
            lookup();
          }}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-60"
        >
          <MapPin className="h-4 w-4" />
          نمایش آی‌پی من
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Detail Cards */}
      {result && !loading && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">
            جزئیات کامل
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label} className="glass-card hover-glow p-4">
                <p className="text-xs text-muted-foreground mb-1">{field.label}</p>
                <p
                  className="text-sm font-medium text-foreground"
                  dir="ltr"
                >
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
