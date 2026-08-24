"use client";

import { useState, useEffect, useCallback } from "react";
import { Bitcoin, ArrowRightLeft, Loader2, RefreshCw, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (n: number): string => n.toLocaleString("fa-IR");

const popularCryptos = [
  { id: "bitcoin", symbol: "BTC", name: "بیت‌کوین" },
  { id: "ethereum", symbol: "ETH", name: "اتریوم" },
  { id: "tether", symbol: "USDT", name: "تتر" },
  { id: "binancecoin", symbol: "BNB", name: "بایننس کوین" },
  { id: "solana", symbol: "SOL", name: "سولانا" },
  { id: "ripple", symbol: "XRP", name: "ریپل" },
  { id: "cardano", symbol: "ADA", name: "کاردانو" },
  { id: "dogecoin", symbol: "DOGE", name: "دوج‌کوین" },
  { id: "polkadot", symbol: "DOT", name: "پولکادات" },
  { id: "tron", symbol: "TRX", name: "ترون" },
  { id: "litecoin", symbol: "LTC", name: "لایت‌کوین" },
  { id: "avalanche-2", symbol: "AVAX", name: "آوالانچ" },
];

const fiatCurrencies = [
  { code: "USD", name: "دلار آمریکا" },
  { code: "EUR", name: "یورو" },
  { code: "GBP", name: "پوند" },
  { code: "TRY", name: "لیر ترکیه" },
  { code: "AED", name: "درهم امارات" },
];

interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  image: string;
}

export default function CryptoConverter() {
  const [cryptoList, setCryptoList] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fromCrypto, setFromCrypto] = useState("bitcoin");
  const [amount, setAmount] = useState("");
  const [toCurrency, setToCurrency] = useState("USD");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const ids = popularCryptos.map((c) => c.id).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=20&page=1&sparkline=false&price_change_percentage=24h`
      );
      if (!res.ok) throw new Error("خطا در دریافت اطلاعات");
      const data: CryptoData[] = await res.json();
      setCryptoList(data);
      setLastUpdated(new Date().toLocaleTimeString("fa-IR"));
    } catch {
      setError("خطا در دریافت قیمت‌ها. لطفاً اتصال اینترنت را بررسی و دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const selectedCrypto = cryptoList.find((c) => c.id === fromCrypto);
  const priceUSD = selectedCrypto?.current_price || 0;
  const amountNum = parseFloat(amount) || 0;

  // USD to target fiat
  const getUsdToFiat = (usd: number): number => {
    if (toCurrency === "USD") return usd;
    const rate =
      cryptoList.find((c) => c.id === "tether")?.current_price || 1;
    if (toCurrency === "USD") return usd;
    // Use approximate rates (can be enhanced with an API)
    const rates: Record<string, number> = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      TRY: 32.5,
      AED: 3.67,
    };
    return usd * (rates[toCurrency] || 1);
  };

  const resultValue = getUsdToFiat(priceUSD * amountNum);
  const change24h = selectedCrypto?.price_change_percentage_24h || 0;

  const selectedFiat = fiatCurrencies.find((f) => f.code === toCurrency);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Bitcoin className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تبدیل رمزارز</h2>
      </div>

      {/* Converter Card */}
      <div className="glass-card glow-effect p-5 sm:p-6 space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* From */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground mb-1.5">
              از رمزارز
            </label>
            <select
              value={fromCrypto}
              onChange={(e) => setFromCrypto(e.target.value)}
              disabled={loading}
              className="w-full h-10 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              {popularCryptos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.symbol})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="مقدار"
              dir="ltr"
              className="w-full h-10 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            />
          </div>

          {/* To */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground mb-1.5">
              به ارز
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full h-10 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
            >
              {fiatCurrencies.map((f) => (
                <option key={f.code} value={f.code}>
                  {f.name} ({f.code})
                </option>
              ))}
            </select>
            <div className="w-full h-10 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm flex items-center">
              <span className="text-muted-foreground">
                {amountNum > 0
                  ? `${toPersianDigits(Math.round(resultValue))} ${toCurrency}`
                  : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Swap icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
          </div>
        </div>

        {/* Selected crypto info */}
        {selectedCrypto && (
          <div className="glass-card p-4 space-y-2">
            <div className="flex items-center gap-3">
              <img
                src={selectedCrypto.image}
                alt={selectedCrypto.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">
                  {selectedCrypto.name} ({selectedCrypto.symbol.toUpperCase()})
                </p>
                <p className="text-xs text-muted-foreground">
                  قیمت فعلی: ${toPersianDigits(Math.round(selectedCrypto.current_price))}
                </p>
              </div>
              <div
                className={cn(
                  "text-sm font-medium px-2 py-1 rounded",
                  change24h >= 0
                    ? "text-green-500 bg-green-500/10"
                    : "text-red-500 bg-red-500/10"
                )}
              >
                {change24h >= 0 ? "+" : ""}
                {change24h.toFixed(2)}%
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground">در حال دریافت قیمت‌ها...</p>
        </div>
      )}

      {/* Price Table */}
      {cryptoList.length > 0 && !loading && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">لیست قیمت رمزارزها</p>
            {lastUpdated && (
              <button
                onClick={fetchPrices}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                بروزرسانی ({lastUpdated})
              </button>
            )}
          </div>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-right p-3 text-xs font-medium text-muted-foreground">رمزارز</th>
                    <th className="text-right p-3 text-xs font-medium text-muted-foreground">قیمت (USD)</th>
                    <th className="text-right p-3 text-xs font-medium text-muted-foreground">تغییر ۲۴ ساعت</th>
                    <th className="text-right p-3 text-xs font-medium text-muted-foreground hidden sm:table-cell">بازار</th>
                  </tr>
                </thead>
                <tbody>
                  {cryptoList.map((coin) => (
                    <tr
                      key={coin.id}
                      onClick={() => setFromCrypto(coin.id)}
                      className={cn(
                        "border-b border-border/30 last:border-0 cursor-pointer transition-colors hover:bg-accent/50",
                        fromCrypto === coin.id && "bg-primary/5"
                      )}
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <img src={coin.image} alt={coin.symbol} className="w-6 h-6 rounded-full" />
                          <div>
                            <p className="font-medium text-foreground text-xs">{coin.symbol.toUpperCase()}</p>
                            <p className="text-[10px] text-muted-foreground">{coin.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-xs text-foreground" dir="ltr">
                        ${coin.current_price.toLocaleString(undefined, { maximumFractionDigits: coin.current_price < 1 ? 6 : 2 })}
                      </td>
                      <td className="p-3">
                        <span
                          className={cn(
                            "text-xs font-medium",
                            coin.price_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
                          )}
                        >
                          {coin.price_change_percentage_24h >= 0 ? "+" : ""}
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                      </td>
                      <td className="p-3 text-xs text-muted-foreground hidden sm:table-cell" dir="ltr">
                        ${coin.market_cap.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/50 p-3 text-xs text-muted-foreground leading-relaxed">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
            <span>داده‌ها از CoinGecko دریافت شده و نرخ ارزها تقریبی هستند. برای معاملات واقعی به صرافی‌های معتبر مراجعه کنید.</span>
          </div>
        </div>
      )}
    </div>
  );
}
