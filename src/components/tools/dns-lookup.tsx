"use client";

import { useState } from "react";
import { Search, Loader2, AlertCircle, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface DNSRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

const RECORD_TYPES = ["A", "AAAA", "MX", "NS", "CNAME", "TXT", "SOA"];

const typeLabels: Record<string, string> = {
  A: "A — آدرس IPv4",
  AAAA: "AAAA — آدرس IPv6",
  MX: "MX — سرور ایمیل",
  NS: "NS — سرور نام",
  CNAME: "CNAME — نام مستعار",
  TXT: "TXT — رکورد متنی",
  SOA: "SOA — شروع Authority",
};

const typeNumbers: Record<string, number> = {
  A: 1,
  NS: 2,
  CNAME: 5,
  SOA: 6,
  MX: 15,
  TXT: 16,
  AAAA: 28,
};

const typeNumbersReverse: Record<number, string> = {
  1: "A",
  2: "NS",
  5: "CNAME",
  6: "SOA",
  15: "MX",
  16: "TXT",
  28: "AAAA",
};

const PRESET_DOMAINS = [
  "google.com",
  "digikala.com",
  "cloudflare.com",
  "wikipedia.org",
  "github.com",
  "apple.com",
  "microsoft.com",
  "yahoo.com",
];

export default function DNSLookup() {
  const [domain, setDomain] = useState("");
  const [recordType, setRecordType] = useState("A");
  const [records, setRecords] = useState<DNSRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const handleLookup = async (overrideDomain?: string) => {
    const d = (overrideDomain ?? domain).trim();
    if (!d) return;

    setLoading(true);
    setError("");
    setRecords([]);

    try {
      const typeNum = typeNumbers[recordType] || 1;
      const res = await fetch(
        `https://dns.google/resolve?name=${encodeURIComponent(d)}&type=${typeNum}`
      );
      const data = await res.json();

      if (data.Status !== 0) {
        const statusMessages: Record<number, string> = {
          1: "خطای فرمت (FORMERR)",
          2: "خطای سرور (SERVFAIL)",
          3: "نام دامنه وجود ندارد (NXDOMAIN)",
          4: "پشتیبانی نمی‌شود (NOTIMP)",
          5: "رفتار رد شد (REFUSED)",
        };
        setError(statusMessages[data.Status] || `خطای ناشناخته (کد: ${data.Status})`);
        return;
      }

      const answers: DNSRecord[] = (data.Answer || []).map((r: DNSRecord) => ({
        name: r.name,
        type: typeNumbersReverse[r.type] || String(r.type),
        TTL: r.TTL,
        data: r.data,
      }));

      setRecords(answers);
    } catch {
      setError("خطا در ارتباط با سرور DNS");
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (preset: string) => {
    setDomain(preset);
    setActivePreset(preset);
    handleLookup(preset);
  };

  const handleInputChange = (value: string) => {
    setDomain(value);
    setActivePreset(null);
  };

  const handleRecordTypeChange = (value: string) => {
    setRecordType(value);
    if (domain.trim()) {
      handleLookup(domain.trim());
    }
  };

  const toPersianDigits = (n: number) => n.toLocaleString("fa-IR");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Search className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">استعلام DNS</h2>
      </div>

      {/* Preset Quick-Select Tiles */}
      <div>
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          وب‌سایت‌های پرکاربرد
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRESET_DOMAINS.map((preset) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className={cn(
                "glass-card hover-glow flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all",
                activePreset === preset
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "text-foreground hover:text-primary"
              )}
            >
              <Globe className="h-4 w-4 shrink-0 opacity-60" />
              <span className="font-mono text-xs sm:text-sm" dir="ltr">
                {preset}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={domain}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="نام دامنه را وارد کنید (مثلاً google.com)"
            dir="ltr"
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
          />
          <select
            value={recordType}
            onChange={(e) => handleRecordTypeChange(e.target.value)}
            className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {RECORD_TYPES.map((t) => (
              <option key={t} value={t}>
                {typeLabels[t]}
              </option>
            ))}
          </select>
          <button
            onClick={() => handleLookup()}
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

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Results Table */}
        {records.length > 0 && (
          <div className="glass-card overflow-x-auto p-1">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    نام
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    نوع
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    TTL
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    داده
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/50 last:border-b-0 hover:bg-accent/50 transition-colors"
                  >
                    <td
                      className="px-4 py-3 font-mono text-foreground"
                      dir="ltr"
                    >
                      {r.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-foreground">
                      {r.type}
                    </td>
                    <td className="px-4 py-3 text-foreground">
                      {toPersianDigits(r.TTL)}
                    </td>
                    <td
                      className="px-4 py-3 font-mono text-foreground break-all"
                      dir="ltr"
                    >
                      {r.data}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!error && !loading && records.length === 0 && domain && (
          <p className="text-center text-sm text-muted-foreground">
            رکوردی یافت نشد.
          </p>
        )}
      </div>
    </div>
  );
}
