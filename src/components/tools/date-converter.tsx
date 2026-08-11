"use client";

import { useState } from "react";
import { CalendarRange, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { gregorianToJalali, jalaliToGregorian } from "@/lib/jalali";

// Approximate Hijri conversion (Islamic calendar)
// Using the epoch-based approximation
const GREGORIAN_TO_HIJRI_EPOCH_DIFF = 1948439.5;

const gregorianToHijri = (gy: number, gm: number, gd: number) => {
  // Julian day number for Gregorian date
  const jd = gregorianToJDN(gy, gm, gd);
  // Adjust for Hijri epoch
  const l = Math.floor(jd - 1948440) + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) + Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 = l2 - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const hm = Math.floor((24 * l3) / 709);
  const hd = l3 - Math.floor((709 * hm) / 24);
  const hy = 30 * n + j - 30;
  return { year: hy, month: hm, day: hd };
};

const hijriToGregorian = (hy: number, hm: number, hd: number) => {
  const jd = hijriToJDN(hy, hm, hd);
  return jdnToGregorian(jd);
};

const gregorianToJDN = (gy: number, gm: number, gd: number): number => {
  const a = Math.floor((14 - gm) / 12);
  const y = gy + 4800 - a;
  const m = gm + 12 * a - 3;
  return gd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
};

const jdnToGregorian = (jd: number) => {
  const a = jd + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor(146097 * b / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor(1461 * d / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const day = e - Math.floor((153 * m + 2) / 5) + 1;
  const month = m + 3 - 12 * Math.floor(m / 10);
  const year = 100 * b + d - 4800 + Math.floor(m / 10);
  return { year, month, day };
};

const hijriToJDN = (hy: number, hm: number, hd: number): number => {
  return Math.floor((11 * hy + 3) / 30) + 354 * hy + 30 * hm - Math.floor((hm - 1) / 2) + hd + 1948440 - 385;
};

const hijriMonthNames = [
  "محرم", "صفر", "ربیع‌الاول", "ربیع‌الثانی",
  "جمادی‌الاول", "جمادی‌الثانی", "رجب", "شعبان",
  "رمضان", "شوال", "ذی‌القعده", "ذی‌الحجه",
];

const jalaliMonthNames = [
  "فروردین", "اردیبهشت", "خرداد", "تیر",
  "مرداد", "شهریور", "مهر", "آبان",
  "آذر", "دی", "بهمن", "اسفند",
];

const gregorianMonthNames = [
  "ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن",
  "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر",
];

type DateType = "jalali" | "gregorian" | "hijri";

interface DateInput {
  day: string;
  month: string;
  year: string;
}

function toPersianDigits(n: number) {
  return n.toLocaleString("fa-IR");
}

export default function DateConverter() {
  const [jalali, setJalali] = useState<DateInput>({ day: "", month: "", year: "" });
  const [gregorian, setGregorian] = useState<DateInput>({ day: "", month: "", year: "" });
  const [hijri, setHijri] = useState<DateInput>({ day: "", month: "", year: "" });

  const parseInput = (d: DateInput) => ({
    day: parseInt(d.day) || 0,
    month: parseInt(d.month) || 0,
    year: parseInt(d.year) || 0,
  });

  const handleJalaliConvert = () => {
    const { day, month, year } = parseInput(jalali);
    if (!day || !month || !year) return;
    try {
      const g = jalaliToGregorian(year, month, day);
      setGregorian({ day: String(g[2]), month: String(g[1]), year: String(g[0]) });
      const h = gregorianToHijri(g[0], g[1], g[2]);
      setHijri({ day: String(h.day), month: String(h.month), year: String(h.year) });
    } catch {
      // invalid date
    }
  };

  const handleGregorianConvert = () => {
    const { day, month, year } = parseInput(gregorian);
    if (!day || !month || !year) return;
    try {
      const j = gregorianToJalali(year, month, day);
      setJalali({ day: String(j[2]), month: String(j[1]), year: String(j[0]) });
      const h = gregorianToHijri(year, month, day);
      setHijri({ day: String(h.day), month: String(h.month), year: String(h.year) });
    } catch {
      // invalid date
    }
  };

  const handleHijriConvert = () => {
    const { day, month, year } = parseInput(hijri);
    if (!day || !month || !year) return;
    try {
      const g = hijriToGregorian(year, month, day);
      setGregorian({ day: String(g.day), month: String(g.month), year: String(g.year) });
      const j = gregorianToJalali(g.year, g.month, g.day);
      setJalali({ day: String(j[2]), month: String(j[1]), year: String(j[0]) });
    } catch {
      // invalid date
    }
  };

  const makeDateSection = (
    title: string,
    subtitle: string,
    data: DateInput,
    setData: (d: DateInput) => void,
    monthNames: string[],
    onConvert: () => void
  ) => (
    <div className="rounded-lg border border-border bg-background p-4 space-y-3">
      <div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">روز</label>
          <input
            type="number"
            value={data.day}
            onChange={(e) => setData({ ...data, day: e.target.value })}
            placeholder="۱"  
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">ماه</label>
          <select
            value={data.month}
            onChange={(e) => setData({ ...data, month: e.target.value })}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">انتخاب</option>
            {monthNames.map((name, i) => (
              <option key={i} value={String(i + 1)}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">سال</label>
          <input
            type="number"
            value={data.year}
            onChange={(e) => setData({ ...data, year: e.target.value })}
            placeholder="۱۴۰۴"
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <button
        onClick={onConvert}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <ArrowRight className="h-4 w-4" />
        تبدیل
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CalendarRange className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تبدیل تاریخ</h2>
      </div>

      <div className="space-y-4">
        {makeDateSection(
          "تاریخ شمسی",
          "جلالی / شمسی",
          jalali,
          setJalali,
          jalaliMonthNames,
          handleJalaliConvert
        )}
        {makeDateSection(
          "تاریخ میلادی",
          "Gregorian",
          gregorian,
          setGregorian,
          gregorianMonthNames,
          handleGregorianConvert
        )}
        {makeDateSection(
          "تاریخ قمری",
          "هجری قمری (تقریبی)",
          hijri,
          setHijri,
          hijriMonthNames,
          handleHijriConvert
        )}
      </div>
    </div>
  );
}
