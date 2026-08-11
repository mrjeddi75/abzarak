"use client";

import { useState, useEffect } from "react";
import { Calendar, Cake, Hourglass, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { jalaliToGregorian, gregorianToJalali } from "@/lib/jalali";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

export default function AgeCalculator() {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const jy = parseInt(year) || 0;
  const jm = parseInt(month) || 0;
  const jd = parseInt(day) || 0;

  const hasInput = jy > 0 && jm > 0 && jd > 0;

  let ageYears = 0, ageMonths = 0, ageDays = 0;
  let totalDays = 0;
  let nextBirthdayDays = 0;
  let nextBirthdayStr = "";

  if (hasInput) {
    const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd);
    const birth = new Date(gy, gm - 1, gd);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    // Approximate age in years/months/days
    let yDiff = today.getFullYear() - birth.getFullYear();
    let mDiff = today.getMonth() - birth.getMonth();
    let dDiff = today.getDate() - birth.getDate();
    if (dDiff < 0) { mDiff--; const prev = new Date(today.getFullYear(), today.getMonth(), 0); dDiff += prev.getDate(); }
    if (mDiff < 0) { yDiff--; mDiff += 12; }
    ageYears = yDiff;
    ageMonths = mDiff;
    ageDays = dDiff;

    // Next birthday (Shamsi)
    const [todayJy, todayJm, todayJd] = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
    let nextJy = todayJy;
    if (todayJm > jm || (todayJm === jm && todayJd >= jd)) nextJy++;
    const [nextBdayGy, nextBdayGm, nextBdayGd] = jalaliToGregorian(nextJy, jm, jd);
    const nextBday = new Date(nextBdayGy, nextBdayGm - 1, nextBdayGd);
    nextBirthdayDays = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    nextBirthdayStr = `${toPersianDigits(String(nextJy))}/${toPersianDigits(String(jm).padStart(2, "0"))}/${toPersianDigits(String(jd).padStart(2, "0"))}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">محاسبه‌گر دقیق سن</h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">سال شمسی</label>
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="۱۳۷۰"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" dir="ltr" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">ماه</label>
          <input type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="۱ تا ۱۲"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" dir="ltr" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">روز</label>
          <input type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} placeholder="۱ تا ۳۱"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" dir="ltr" />
        </div>
      </div>

      {hasInput && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <div className="flex items-center gap-2"><Cake className="h-5 w-5 text-primary" /><span className="font-bold text-foreground">سن شما</span></div>
            <div className="flex gap-4 text-center">
              <div className="flex-1"><p className="text-2xl font-bold text-primary">{toPersianDigits(String(ageYears))}</p><p className="text-xs text-muted-foreground">سال</p></div>
              <div className="flex-1"><p className="text-2xl font-bold text-green-500">{toPersianDigits(String(ageMonths))}</p><p className="text-xs text-muted-foreground">ماه</p></div>
              <div className="flex-1"><p className="text-2xl font-bold text-blue-500">{toPersianDigits(String(ageDays))}</p><p className="text-xs text-muted-foreground">روز</p></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
              <Hourglass className="h-5 w-5 text-muted-foreground shrink-0" />
              <div><p className="text-sm text-muted-foreground">کل روزهای زندگی</p><p className="text-lg font-bold text-foreground">{toPersianDigits(totalDays.toLocaleString())} روز</p></div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
              <Gift className="h-5 w-5 text-yellow-500 shrink-0" />
              <div><p className="text-sm text-muted-foreground">تا تولد بعدی</p><p className="text-lg font-bold text-yellow-500">{toPersianDigits(String(nextBirthdayDays))} روز</p><p className="text-xs text-muted-foreground">{nextBirthdayStr}</p></div>
            </div>
            <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
              <div><p className="text-sm text-muted-foreground">کل هفته‌ها</p><p className="text-lg font-bold text-foreground">{toPersianDigits(Math.floor(totalDays / 7).toLocaleString())} هفته</p></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}