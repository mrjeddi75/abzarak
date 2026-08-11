"use client";

import { useState, useMemo } from "react";
import { FileCode, Copy, Check } from "lucide-react";

export default function JwtDecoder() {
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!token.trim()) return null;
    const parts = token.trim().split(".");
    if (parts.length < 2 || parts.length > 3) return { error: "فرمت توکن JWT نامعتبر است. باید ۳ بخش با نقطه جدا شده باشد." };

    try {
      const headerJson = atob(parts[0].replace(/-/g, "+").replace(/_/g, "/"));
      const header = JSON.parse(headerJson);

      const payloadJson = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
      const payload = JSON.parse(payloadJson);

      const signature = parts[2] || "";

      // Check expiration
      const now = Math.floor(Date.now() / 1000);
      const exp = payload.exp;
      const iat = payload.iat;
      const nbf = payload.nbf;

      let status: "valid" | "expired" | "not-yet" = "valid";
      let statusText = "معتبر";
      let timeRemaining = "";

      if (exp) {
        if (now > exp) {
          status = "expired";
          statusText = "منقضی شده";
          const diff = now - exp;
          timeRemaining = `${diff} ثانیه پیش منقضی شده`;
        } else {
          const diff = exp - now;
          const days = Math.floor(diff / 86400);
          const hours = Math.floor((diff % 86400) / 3600);
          const mins = Math.floor((diff % 3600) / 60);
          timeRemaining = `${days} روز و ${hours} ساعت و ${mins} دقیقه مانده`;
        }
      }

      return {
        header,
        payload,
        signature,
        status,
        statusText,
        timeRemaining,
        issuedAt: iat ? new Date(iat * 1000).toLocaleString("fa-IR") : "",
        expiresAt: exp ? new Date(exp * 1000).toLocaleString("fa-IR") : "",
        notBefore: nbf ? new Date(nbf * 1000).toLocaleString("fa-IR") : "",
        decodedPayload: JSON.stringify(payload, null, 2),
        decodedHeader: JSON.stringify(header, null, 2),
      };
    } catch {
      return { error: "خطا در رمزگشایی توکن. مطمئن شوید توکن معتبر است." };
    }
  }, [token]);

  const copyJson = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const colorize = (part: "header" | "payload" | "signature", tokenStr: string) => {
    const parts = tokenStr.split(".");
    if (parts.length < 2) return tokenStr;
    if (part === "header") return `<span class="text-red-500">${parts[0]}</span>.<span class="text-muted-foreground">${parts.slice(1).join(".")}</span>`;
    if (part === "payload") return `<span class="text-muted-foreground">${parts[0]}</span>.<span class="text-purple-500">${parts[1]}</span>.<span class="text-muted-foreground">${parts[2] || ""}</span>`;
    return `<span class="text-muted-foreground">${parts[0]}.${parts[1]}</span>.<span class="text-blue-500">${parts[2] || ""}</span>`;
  };

  const examples = [
    { label: "نمونه توکن", value: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFsaSIsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileCode className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">دیکودر JWT</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex.label}
            onClick={() => setToken(ex.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">توکن JWT</label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIi..."
          rows={4}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          dir="ltr"
        />
      </div>

      {/* Colorized token */}
      {token && result && !result.error && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">بخش‌های توکن</p>
          <div className="flex gap-2 flex-wrap text-xs font-mono" dir="ltr">
            <button
              onClick={() => copyJson(atob(token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/")))}
              className="rounded-md border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-2 py-1 text-red-600 dark:text-red-400"
            >
              Header (سرآیند)
            </button>
            <button
              onClick={() => copyJson(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))}
              className="rounded-md border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 px-2 py-1 text-purple-600 dark:text-purple-400"
            >
              Payload (بار داده)
            </button>
            <div className="rounded-md border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 px-2 py-1 text-blue-600 dark:text-blue-400">
              Signature (امضا)
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {result?.error && (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3">
          <p className="text-sm text-red-600 dark:text-red-400">{result.error}</p>
        </div>
      )}

      {/* Decoded */}
      {result && !result.error && (
        <div className="space-y-4">
          {/* Status */}
          {result.status && (
            <div className={`rounded-lg border p-4 text-center ${
              result.status === "valid" ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30" :
              result.status === "expired" ? "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30" :
              "border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30"
            }`}>
              <p className={`text-lg font-bold ${
                result.status === "valid" ? "text-green-600" : result.status === "expired" ? "text-red-600" : "text-amber-600"
              }`}>
                {result.statusText}
              </p>
              {result.timeRemaining && <p className="text-sm text-muted-foreground mt-1">{result.timeRemaining}</p>}
            </div>
          )}

          {/* Header */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-red-50 dark:bg-red-950/30">
              <span className="text-sm font-medium text-red-600">Header</span>
              <button onClick={() => copyJson(result.decodedHeader || "")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "کپی شد!" : "کپی"}
              </button>
            </div>
            <pre className="px-4 py-3 font-mono text-sm text-foreground overflow-x-auto" dir="ltr">{result.decodedHeader}</pre>
          </div>

          {/* Payload */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-purple-50 dark:bg-purple-950/30">
              <span className="text-sm font-medium text-purple-600">Payload</span>
              <button onClick={() => copyJson(result.decodedPayload || "")} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                <Copy className="h-3 w-3" />
                کپی
              </button>
            </div>
            <pre className="px-4 py-3 font-mono text-sm text-foreground overflow-x-auto" dir="ltr">{result.decodedPayload}</pre>
          </div>

          {/* Claims */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {result.issuedAt && (
              <div className="rounded-lg border border-border bg-card p-3 text-center">
                <p className="text-xs text-muted-foreground">تاریخ صدور (iat)</p>
                <p className="font-mono text-sm text-foreground">{result.issuedAt}</p>
              </div>
            )}
            {result.expiresAt && (
              <div className="rounded-lg border border-border bg-card p-3 text-center">
                <p className="text-xs text-muted-foreground">تاریخ انقضا (exp)</p>
                <p className="font-mono text-sm text-foreground">{result.expiresAt}</p>
              </div>
            )}
            {result.notBefore && (
              <div className="rounded-lg border border-border bg-card p-3 text-center">
                <p className="text-xs text-muted-foreground">فعال از (nbf)</p>
                <p className="font-mono text-sm text-foreground">{result.notBefore}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
