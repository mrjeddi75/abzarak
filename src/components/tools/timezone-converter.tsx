"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Clock, Globe, Plus, X } from "lucide-react";

interface City {
  name: string;
  timezone: string;
  flag: string;
}

const allCities: City[] = [
  { name: "تهران", timezone: "Asia/Tehran", flag: "🇮🇷" },
  { name: "نیویورک", timezone: "America/New_York", flag: "🇺🇸" },
  { name: "لندن", timezone: "Europe/London", flag: "🇬🇧" },
  { name: "برلین", timezone: "Europe/Berlin", flag: "🇩🇪" },
  { name: "پاریس", timezone: "Europe/Paris", flag: "🇫🇷" },
  { name: "توکیو", timezone: "Asia/Tokyo", flag: "🇯🇵" },
  { name: "سیدنی", timezone: "Australia/Sydney", flag: "🇦🇺" },
  { name: "پکن", timezone: "Asia/Shanghai", flag: "🇨🇳" },
  { name: "مسکو", timezone: "Europe/Moscow", flag: "🇷🇺" },
  { name: "استانبول", timezone: "Europe/Istanbul", flag: "🇹🇷" },
  { name: "دبی", timezone: "Asia/Dubai", flag: "🇦🇪" },
  { name: "دهلی", timezone: "Asia/Kolkata", flag: "🇮🇳" },
  { name: "ریاض", timezone: "Asia/Riyadh", flag: "🇸🇦" },
  { name: "سئول", timezone: "Asia/Seoul", flag: "🇰🇷" },
  { name: "سائوپائولو", timezone: "America/Sao_Paulo", flag: "🇧🇷" },
  { name: "تورنتو", timezone: "America/Toronto", flag: "🇨🇦" },
];

const defaultSelected = ["Asia/Tehran", "America/New_York", "Europe/London", "Asia/Tokyo", "Asia/Dubai"];

function getTimeForZone(timezone: string) {
  return new Date().toLocaleString("fa-IR", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function getDateForZone(timezone: string) {
  return new Date().toLocaleString("fa-IR", {
    timeZone: timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getOffsetLabel(timezone: string) {
  const now = new Date();
  const utcStr = now.toLocaleString("en-US", { timeZone: "UTC" });
  const tzStr = now.toLocaleString("en-US", { timeZone: timezone });
  const diff = (new Date(tzStr).getTime() - new Date(utcStr).getTime()) / (1000 * 60 * 60);
  const sign = diff >= 0 ? "+" : "";
  return `UTC${sign}${diff}`;
}

function CityCard({
  city,
  onRemove,
}: {
  city: City;
  onRemove?: () => void;
}) {
  const [time, setTime] = useState(getTimeForZone(city.timezone));
  const [date, setDate] = useState(getDateForZone(city.timezone));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTimeForZone(city.timezone));
      setDate(getDateForZone(city.timezone));
    }, 1000);
    return () => clearInterval(id);
  }, [city.timezone]);

  return (
    <div className="glass-card hover-glow p-4 flex flex-col gap-2 animate-scale-in relative group">
      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg bg-red-500/10 p-1 text-red-500 hover:bg-red-500/20 cursor-pointer"
          title="حذف"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{city.flag}</span>
          <span className="text-sm font-semibold text-foreground">{city.name}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {getOffsetLabel(city.timezone)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span
          className="text-xl font-bold tabular-nums text-foreground"
          dir="ltr"
        >
          {time}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
  );
}

export default function TimezoneConverter() {
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(defaultSelected);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const selectedCities = allCities.filter((c) =>
    selectedTimezones.includes(c.timezone)
  );

  const availableCities = allCities.filter(
    (c) => !selectedTimezones.includes(c.timezone)
  );

  const addCity = (tz: string) => {
    setSelectedTimezones((prev) => [...prev, tz]);
    setShowAddMenu(false);
  };

  const removeCity = (tz: string) => {
    setSelectedTimezones((prev) => prev.filter((t) => t !== tz));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">ساعت جهانی</h2>
        </div>
        {availableCities.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              افزودن شهر
            </button>
            {showAddMenu && (
              <div className="absolute top-full left-0 mt-2 z-50 glass-card p-2 min-w-[200px] max-h-[240px] overflow-y-auto animate-scale-in">
                {availableCities.map((city) => (
                  <button
                    key={city.timezone}
                    onClick={() => addCity(city.timezone)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent cursor-pointer"
                  >
                    <span>{city.flag}</span>
                    <span>{city.name}</span>
                    <span className="mr-auto text-xs text-muted-foreground">
                      {getOffsetLabel(city.timezone)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tehran hero card */}
      {selectedTimezones.includes("Asia/Tehran") && (
        <div className="glass-card glow-effect p-8 text-center border-primary/30 animate-pulse-glow">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold text-primary">
              🇮🇷 تهران — ساعت ایران
            </span>
          </div>
          <TehranClock />
        </div>
      )}

      {/* Other cities grid (exclude Tehran since it's shown above) */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {selectedCities
          .filter((c) => c.timezone !== "Asia/Tehran")
          .map((city) => (
            <CityCard
              key={city.timezone}
              city={city}
              onRemove={
                city.timezone !== "Asia/Tehran"
                  ? () => removeCity(city.timezone)
                  : undefined
              }
            />
          ))}
      </div>

      {selectedTimezones.length === 0 && (
        <div className="glass-card p-10 flex flex-col items-center justify-center text-muted-foreground text-sm gap-3">
          <Globe className="h-10 w-10 opacity-20" />
          <p>هیچ شهری انتخاب نشده. از دکمه «افزودن شهر» استفاده کنید.</p>
        </div>
      )}
    </div>
  );
}

function TehranClock() {
  const [time, setTime] = useState(getTimeForZone("Asia/Tehran"));
  const [date, setDate] = useState(getDateForZone("Asia/Tehran"));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(getTimeForZone("Asia/Tehran"));
      setDate(getDateForZone("Asia/Tehran"));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <span
        className="text-5xl font-bold tabular-nums tracking-tight text-foreground"
        dir="ltr"
      >
        {time}
      </span>
      <span className="text-sm text-muted-foreground mt-1">{date}</span>
    </>
  );
}
