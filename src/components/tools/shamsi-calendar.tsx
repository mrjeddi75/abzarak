"use client";

import { useState, useMemo } from "react";
import { CalendarDays, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getJalaliToday,
  jalaliMonthNames,
  getJalaliMonthDays,
  getFirstDayOfMonth,
} from "@/lib/jalali";

// ─── Holiday data ────────────────────────────────────────────────────────────
// Key format: "month-day" (Jalali month, day)
const holidays: Record<string, string> = {
  "1-1": "نوروز",
  "1-2": "نوروز",
  "1-3": "نوروز",
  "1-4": "نوروز",
  "1-12": "روز جمهوری اسلامی",
  "1-13": "سیزده‌بدر",
  "3-14": "رحلت امام خمینی",
  "3-15": "قیام ۱۵ خرداد",
  "6-1": "استقلال",
  "6-31": "آخرین روز شهریور",
  "11-22": "پیروزی انقلاب اسلامی",
  "12-29": "ملی شدن صنعت نفت",
};

// ─── Season definitions ─────────────────────────────────────────────────────
const seasons = [
  {
    name: "بهار",
    months: [1, 2, 3],
    gradient: "from-emerald-500 to-green-600",
    icon: "🌸",
  },
  {
    name: "تابستان",
    months: [4, 5, 6],
    gradient: "from-amber-400 to-orange-500",
    icon: "☀️",
  },
  {
    name: "پاییز",
    months: [7, 8, 9],
    gradient: "from-orange-500 to-amber-700",
    icon: "🍂",
  },
  {
    name: "زمستان",
    months: [10, 11, 12],
    gradient: "from-blue-400 to-indigo-600",
    icon: "❄️",
  },
];

// ─── Weekday abbreviations ───────────────────────────────────────────────────
const weekDayAbbr = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const toPersianNum = (n: number): string => n.toLocaleString("fa-IR");

const getHoliday = (month: number, day: number): string | undefined => {
  return holidays[`${month}-${day}`];
};

// ─── Year range ──────────────────────────────────────────────────────────────
const MIN_YEAR = 1300;
const MAX_YEAR = 1420;
const yearRange = Array.from(
  { length: MAX_YEAR - MIN_YEAR + 1 },
  (_, i) => MIN_YEAR + i
);

// ─── Component ────────────────────────────────────────────────────────────────
export default function ShamsiCalendar() {
  const today = getJalaliToday();
  const [selectedYear, setSelectedYear] = useState(today[0]);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Compute all month grids for the selected year
  const monthGrids = useMemo(() => {
    const grids: {
      month: number;
      daysInMonth: number;
      firstDayOfWeek: number;
      weeks: (number | null)[][];
    }[] = [];

    for (let m = 1; m <= 12; m++) {
      const daysInMonth = getJalaliMonthDays(selectedYear, m);
      const firstDayOfWeek = getFirstDayOfMonth(selectedYear, m);

      // Build day cells: null for empty slots before the first day
      const cells: (number | null)[] = [];
      for (let i = 0; i < firstDayOfWeek; i++) {
        cells.push(null);
      }
      for (let d = 1; d <= daysInMonth; d++) {
        cells.push(d);
      }

      // Split into weeks (rows of 7)
      const weeks: (number | null)[][] = [];
      for (let i = 0; i < cells.length; i += 7) {
        weeks.push(cells.slice(i, i + 7));
      }

      grids.push({ month: m, daysInMonth, firstDayOfWeek, weeks });
    }

    return grids;
  }, [selectedYear]);

  // Find the grid for a given month
  const getGrid = (month: number) => monthGrids.find((g) => g.month === month);

  // Determine if today
  const isToday = (month: number, day: number) => {
    return (
      day === today[2] &&
      month === today[1] &&
      selectedYear === today[0]
    );
  };

  // Determine if selected
  const isSelected = (month: number, day: number) => {
    return selectedMonth === month && selectedDay === day;
  };

  // Handle day click
  const handleDayClick = (month: number, day: number) => {
    setSelectedMonth(month);
    setSelectedDay(day);
  };

  // Get selected holiday info
  const selectedHoliday = useMemo(() => {
    if (selectedMonth !== null && selectedDay !== null) {
      return getHoliday(selectedMonth, selectedDay);
    }
    return undefined;
  }, [selectedMonth, selectedDay]);

  const goToPrevYear = () => {
    if (selectedYear > MIN_YEAR) setSelectedYear((y) => y - 1);
  };

  const goToNextYear = () => {
    if (selectedYear < MAX_YEAR) setSelectedYear((y) => y + 1);
  };

  const goToToday = () => {
    const [ty, tm, td] = getJalaliToday();
    setSelectedYear(ty);
    setSelectedMonth(tm);
    setSelectedDay(td);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CalendarDays className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تقویم شمسی</h2>
      </div>

      {/* Main container */}
      <div className="glass-card p-4 sm:p-6 space-y-6">
        {/* Year selector */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={goToNextYear}
            disabled={selectedYear >= MAX_YEAR}
            className="rounded-lg border border-border p-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="سال بعد"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="rounded-lg border border-border bg-card px-4 py-2 text-base font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer text-center min-w-[100px]"
              dir="rtl"
            >
              {yearRange.map((y) => (
                <option key={y} value={y}>
                  {toPersianNum(y)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={goToPrevYear}
            disabled={selectedYear <= MIN_YEAR}
            className="rounded-lg border border-border p-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="سال قبل"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        {/* Today button */}
        <div className="flex justify-center">
          <button
            onClick={goToToday}
            className="rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
          >
            برو به امروز
          </button>
        </div>

        {/* Seasons & Months Grid */}
        <div className="space-y-6">
          {seasons.map((season, si) => (
            <div key={season.name}>
              {/* Season Header */}
              <div
                className={cn(
                  "rounded-lg bg-gradient-to-l px-4 py-2.5 mb-3",
                  season.gradient
                )}
              >
                <span className="text-white font-bold text-sm sm:text-base">
                  {season.icon} {season.name}{" "}
                  {season.months.map((m) => jalaliMonthNames[m - 1]).join(" – ")}
                </span>
              </div>

              {/* Months grid within season */}
              <div
                className={cn(
                  "grid gap-3",
                  si === 0 || si === 3
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                )}
              >
                {season.months.map((monthIdx) => {
                  const grid = getGrid(monthIdx)!;
                  return (
                    <MonthCard
                      key={monthIdx}
                      monthIndex={monthIdx}
                      weeks={grid.weeks}
                      isToday={isToday}
                      isSelected={isSelected}
                      getHoliday={getHoliday}
                      onDayClick={handleDayClick}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Selected day / holiday info */}
        <div className="mt-4 rounded-lg border border-border bg-card/50 p-4 text-center min-h-[56px] flex flex-col items-center justify-center">
          {selectedMonth !== null && selectedDay !== null ? (
            <>
              <p className="text-sm font-medium text-foreground">
                {toPersianNum(selectedDay)}{" "}
                {jalaliMonthNames[selectedMonth - 1]}{" "}
                {toPersianNum(selectedYear)}
              </p>
              {selectedHoliday && (
                <p className="mt-1 text-sm font-bold text-red-500">
                  🎉 {selectedHoliday}
                </p>
              )}
              {!selectedHoliday && isToday(selectedMonth, selectedDay) && (
                <p className="mt-1 text-xs text-primary font-medium">
                  ✨ امروز
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              یک روز از تقویم را انتخاب کنید
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Month Card Sub-component ────────────────────────────────────────────────
function MonthCard({
  monthIndex,
  weeks,
  isToday,
  isSelected,
  getHoliday,
  onDayClick,
}: {
  monthIndex: number;
  weeks: (number | null)[][];
  isToday: (month: number, day: number) => boolean;
  isSelected: (month: number, day: number) => boolean;
  getHoliday: (month: number, day: number) => string | undefined;
  onDayClick: (month: number, day: number) => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-card/80 p-3 transition-all hover:shadow-md">
      {/* Month name header */}
      <div className="text-center mb-2">
        <span className="text-sm font-bold text-foreground">
          {jalaliMonthNames[monthIndex - 1]}
        </span>
      </div>

      {/* Weekday abbreviations */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {weekDayAbbr.map((abbr, i) => (
          <div
            key={i}
            className="text-center text-[10px] font-medium text-muted-foreground leading-4"
          >
            {abbr}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            if (day === null) {
              return (
                <div
                  key={`${wi}-${di}`}
                  className="h-7 w-full"
                />
              );
            }

            const today = isToday(monthIndex, day);
            const selected = isSelected(monthIndex, day);
            const holiday = getHoliday(monthIndex, day);

            return (
              <button
                key={`${wi}-${di}`}
                onClick={() => onDayClick(monthIndex, day)}
                className={cn(
                  "h-7 w-full flex items-center justify-center rounded-md text-[11px] leading-none transition-all cursor-pointer",
                  // Base styles
                  "hover:bg-accent/70",
                  // Selected
                  selected
                    ? "bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-sm ring-1 ring-primary/30"
                    : // Holiday
                      holiday
                        ? "text-red-500 dark:text-red-400 font-semibold"
                        : // Today
                          today
                          ? "bg-primary/15 text-primary font-bold ring-1 ring-primary/30"
                          : // Normal day
                            "text-foreground"
                )}
                title={holiday || undefined}
              >
                {toPersianNum(day)}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
