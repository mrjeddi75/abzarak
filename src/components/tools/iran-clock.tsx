"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { getJalaliToday, jalaliMonthNames } from "@/lib/jalali";

export default function IranClock() {
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();

      const timeStr = now.toLocaleString("fa-IR", {
        timeZone: "Asia/Tehran",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });

      const [year, month, day] = getJalaliToday();
      const weekDay = now.toLocaleDateString("fa-IR", {
        timeZone: "Asia/Tehran",
        weekday: "long",
      });
      const dateText = `${weekDay}، ${day} ${jalaliMonthNames[month - 1]} ${year}`;

      setTime(timeStr);
      setDateStr(dateText);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">ساعت ایران</h2>
      </div>

      <div className="rounded-lg border border-border bg-card p-8">
        <div className="flex flex-col items-center gap-6">
          <div
            className={cn(
              "text-6xl sm:text-7xl font-mono font-bold tabular-nums tracking-wider text-foreground"
            )}
          >
            {time}
          </div>
          <div className="h-px w-48 bg-border" />
          <div className="text-center">
            <p className="text-lg font-medium text-foreground">{dateStr}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              منطقه زمانی: آسیا/تهران (Asia/Tehran)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
