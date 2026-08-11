"use client";

import { useState, useEffect } from "react";
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  Wind,
  Thermometer,
  Loader2,
  MapPin,
  CloudSunRain,
  Droplets,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

// ─── ToolIcon helper ──────────────────────────────────────────────────────────
function ToolIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as any)[name];
  return Icon ? <Icon className={className} /> : null;
}

// ─── City data ────────────────────────────────────────────────────────────────
const cities = [
  { name: "تهران", lat: 35.6892, lon: 51.389 },
  { name: "اصفهان", lat: 32.6546, lon: 51.668 },
  { name: "شیراز", lat: 29.5918, lon: 52.5837 },
  { name: "مشهد", lat: 36.2605, lon: 59.6168 },
  { name: "تبریز", lat: 38.08, lon: 46.2919 },
  { name: "اهواز", lat: 31.3183, lon: 48.6706 },
  { name: "کرمانشاه", lat: 34.3148, lon: 47.0648 },
  { name: "رشت", lat: 37.2795, lon: 49.588 },
  { name: "کرج", lat: 35.7329, lon: 50.9937 },
  { name: "قم", lat: 34.6416, lon: 50.8746 },
  { name: "ارومیه", lat: 37.5528, lon: 45.0756 },
  { name: "یزد", lat: 31.8954, lon: 54.3596 },
  { name: "کرمان", lat: 30.283, lon: 57.003 },
  { name: "بندرعباس", lat: 27.1833, lon: 56.2666 },
  { name: "ساری", lat: 36.5633, lon: 53.0601 },
  { name: "همدان", lat: 34.7981, lon: 48.5146 },
];

// ─── Weather code mapping ─────────────────────────────────────────────────────
const weatherCodes: Record<
  number,
  { desc: string; icon: string }
> = {
  0: { desc: "آفتابی", icon: "Sun" },
  1: { desc: "کمی ابری", icon: "CloudSun" },
  2: { desc: "ابری", icon: "Cloud" },
  3: { desc: "ابری شدید", icon: "Cloud" },
  45: { desc: "مه‌آلود", icon: "CloudFog" },
  48: { desc: "مه یخ‌زده", icon: "CloudFog" },
  51: { desc: "باران سبک", icon: "CloudDrizzle" },
  53: { desc: "باران متوسط", icon: "CloudRain" },
  55: { desc: "باران شدید", icon: "CloudRain" },
  61: { desc: "باران کمی", icon: "CloudRain" },
  63: { desc: "باران متوسط", icon: "CloudRain" },
  65: { desc: "باران شدید", icon: "CloudRain" },
  71: { desc: "برف سبک", icon: "Snowflake" },
  73: { desc: "برف متوسط", icon: "Snowflake" },
  75: { desc: "برف شدید", icon: "Snowflake" },
  95: { desc: "رعد و برق", icon: "CloudLightning" },
};

const getWeatherInfo = (code: number) => {
  return (
    weatherCodes[code] || { desc: "نامشخص", icon: "Cloud" }
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface WeatherData {
  current: {
    temperature: number;
    windspeed: number;
    weathercode: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
}

// ─── Helper ───────────────────────────────────────────────────────────────────
const toPersianDigits = (n: number): string => n.toLocaleString("fa-IR");

const getDayName = (dateStr: string, index: number): string => {
  if (index === 0) return "امروز";
  if (index === 1) return "فردا";
  const dayNames = [
    "یکشنبه",
    "دوشنبه",
    "سه‌شنبه",
    "چهارشنبه",
    "پنجشنبه",
    "جمعه",
    "شنبه",
  ];
  const date = new Date(dateStr + "T00:00:00");
  return dayNames[date.getDay()];
};

const getTempColor = (temp: number): string => {
  if (temp >= 40) return "text-red-500";
  if (temp >= 30) return "text-orange-500";
  if (temp >= 20) return "text-amber-500";
  if (temp >= 10) return "text-emerald-500";
  if (temp >= 0) return "text-cyan-500";
  return "text-blue-500";
};

const getWindLabel = (speed: number): string => {
  if (speed < 10) return "آرام";
  if (speed < 20) return "ملایم";
  if (speed < 35) return "متوسط";
  if (speed < 55) return "بادی";
  return "طوفانی";
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Weather() {
  const [selectedCity, setSelectedCity] = useState<(typeof cities)[0] | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (city: (typeof cities)[0]) => {
    setSelectedCity(city);
    setLoading(true);
    setError("");
    setWeatherData(null);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Asia/Tehran&forecast_days=3`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("خطا در دریافت اطلاعات");
      const data = await res.json();
      setWeatherData(data as WeatherData);
    } catch {
      setError("خطا در دریافت اطلاعات آب‌وهوا. لطفاً اتصال اینترنت خود را بررسی کنید.");
    } finally {
      setLoading(false);
    }
  };

  // Auto-select Tehran on mount
  useEffect(() => {
    fetchWeather(cities[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentWeather = weatherData?.current
    ? getWeatherInfo(weatherData.current.weathercode)
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CloudSun className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">هواشناسی ایران</h2>
      </div>

      <div className="glass-card p-5 sm:p-6 space-y-5">
        {/* City tiles */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
          {cities.map((city) => {
            const isSelected = selectedCity?.name === city.name;
            return (
              <button
                key={city.name}
                onClick={() => fetchWeather(city)}
                disabled={loading}
                className={cn(
                  "glass-card hover-glow p-2.5 text-center transition-all",
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : "hover:border-primary/20",
                  loading && "opacity-60 cursor-not-allowed"
                )}
              >
                <MapPin
                  className={cn(
                    "h-4 w-4 mx-auto mb-1",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <p
                  className={cn(
                    "text-xs font-medium leading-tight",
                    isSelected ? "text-primary" : "text-foreground"
                  )}
                >
                  {city.name}
                </p>
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
            <p className="text-sm text-muted-foreground">
              در حال دریافت اطلاعات آب‌وهوای {selectedCity?.name}...
            </p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
            {error}
          </div>
        )}

        {/* Weather data */}
        {weatherData && !loading && selectedCity && (
          <div className="space-y-4 animate-fade-in-up">
            {/* Current weather card */}
            <div className="glass-card glow-effect p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-5">
                {/* Big icon & temp */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-20 w-20 rounded-2xl bg-primary/10 text-primary">
                    {currentWeather && (
                      <ToolIcon
                        name={currentWeather.icon}
                        className="h-10 w-10"
                      />
                    )}
                  </div>
                  <div>
                    <p
                      className={cn(
                        "text-4xl sm:text-5xl font-bold",
                        getTempColor(weatherData.current.temperature)
                      )}
                    >
                      {toPersianDigits(weatherData.current.temperature)}
                      <span className="text-lg font-normal text-muted-foreground mr-1">
                        °C
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedCity.name} — {currentWeather?.desc}
                    </p>
                  </div>
                </div>

                {/* Details grid */}
                <div className="flex-1 grid grid-cols-2 gap-3 w-full sm:w-auto">
                  <div className="rounded-lg bg-background/60 border border-border p-3 text-center">
                    <Wind className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                    <p className="text-lg font-bold text-foreground">
                      {toPersianDigits(weatherData.current.windspeed)}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      کیلومتر بر ساعت
                    </p>
                    <p className="text-[10px] font-medium text-primary mt-0.5">
                      {getWindLabel(weatherData.current.windspeed)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-background/60 border border-border p-3 text-center">
                    <Thermometer className="h-5 w-5 mx-auto text-muted-foreground mb-1" />
                    <p className="text-lg font-bold text-foreground">
                      {weatherData.daily.temperature_2m_max[0] != null &&
                      weatherData.daily.temperature_2m_min[0] != null
                        ? `${toPersianDigits(weatherData.daily.temperature_2m_min[0])} ~ ${toPersianDigits(weatherData.daily.temperature_2m_max[0])}`
                        : "—"}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      دامنه دمای امروز
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-day forecast */}
            <div>
              <p className="text-sm font-medium text-foreground mb-3">
                پیش‌بینی ۳ روزه
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {weatherData.daily.time.map((date, i) => {
                  const dayInfo = getWeatherInfo(weatherData.daily.weathercode[i]);
                  const maxTemp = weatherData.daily.temperature_2m_max[i];
                  const minTemp = weatherData.daily.temperature_2m_min[i];
                  return (
                    <div
                      key={date}
                      className={cn(
                        "glass-card hover-glow p-4 text-center transition-all",
                        i === 0 && "border-primary/20"
                      )}
                    >
                      <p className="text-xs font-medium text-primary mb-2">
                        {getDayName(date, i)}
                      </p>
                      <div className="flex items-center justify-center h-10 w-10 mx-auto rounded-lg bg-primary/10 text-primary mb-2">
                        <ToolIcon
                          name={dayInfo.icon}
                          className="h-6 w-6"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {dayInfo.desc}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-bold",
                            getTempColor(maxTemp)
                          )}
                        >
                          {toPersianDigits(maxTemp)}°
                        </span>
                        <span className="text-xs text-muted-foreground">/</span>
                        <span
                          className={cn(
                            "text-sm font-medium text-muted-foreground",
                            getTempColor(minTemp)
                          )}
                        >
                          {toPersianDigits(minTemp)}°
                        </span>
                      </div>
                      {/* Temp bar visual */}
                      <div className="mt-2 h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-l from-orange-400 to-cyan-400"
                          style={{
                            width: `${Math.min(100, Math.max(10, ((maxTemp + 10) / 55) * 100))}%`,
                            marginRight: "auto",
                            marginLeft: `${Math.min(100, Math.max(0, ((minTemp + 10) / 55) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Humidity / extra info note */}
            <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/50 p-3 text-xs text-muted-foreground leading-relaxed">
              <Droplets className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
              <span>
                داده‌ها از سرویس رایگان Open-Meteo دریافت شده و ممکن است با
                واقعیت تفاوت جزئی داشته باشد. برای اطلاعات دقیق‌تر به سایت
                سازمان هواشناسی مراجعه کنید.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
