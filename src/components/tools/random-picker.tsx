"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Dices, Shuffle, Trophy, Sparkles, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

type Tab = "number" | "lottery";

export default function RandomPicker() {
  const [tab, setTab] = useState<Tab>("number");

  // Random number state
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [numberResults, setNumberResults] = useState<number[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const spinInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lottery state
  const [itemsText, setItemsText] = useState("");
  const [winnerCount, setWinnerCount] = useState("1");
  const [winners, setWinners] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentHighlight, setCurrentHighlight] = useState<string>("");
  const drawInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (spinInterval.current) clearInterval(spinInterval.current);
      if (drawInterval.current) clearInterval(drawInterval.current);
    };
  }, []);

  const generateRandomNumbers = useCallback(() => {
    const minVal = parseInt(min) || 0;
    const maxVal = parseInt(max) || 100;
    const countVal = Math.min(parseInt(count) || 1, 100);

    if (minVal > maxVal) return;
    if (countVal < 1) return;

    setIsSpinning(true);
    let tick = 0;
    const totalTicks = 20;

    spinInterval.current = setInterval(() => {
      tick++;
      const tempResults: number[] = [];
      for (let i = 0; i < countVal; i++) {
        tempResults.push(Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal);
      }
      setNumberResults(tempResults);

      if (tick >= totalTicks) {
        if (spinInterval.current) clearInterval(spinInterval.current);
        setIsSpinning(false);

        // Generate final unique results if possible
        const finalResults: number[] = [];
        const range = maxVal - minVal + 1;
        const uniqueCount = Math.min(countVal, range);
        const available = Array.from({ length: range }, (_, i) => minVal + i);
        for (let i = available.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [available[i], available[j]] = [available[j], available[i]];
        }
        for (let i = 0; i < uniqueCount; i++) {
          finalResults.push(available[i]);
        }
        setNumberResults(finalResults);
      }
    }, 80);
  }, [min, max, count]);

  const drawWinners = useCallback(() => {
    const items = itemsText
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (items.length === 0) return;

    const winnerCountVal = Math.min(parseInt(winnerCount) || 1, items.length);

    setIsDrawing(true);
    setWinners([]);
    let tick = 0;
    const totalTicks = 25;

    drawInterval.current = setInterval(() => {
      tick++;
      const randomIndex = Math.floor(Math.random() * items.length);
      setCurrentHighlight(items[randomIndex]);

      if (tick >= totalTicks) {
        if (drawInterval.current) clearInterval(drawInterval.current);
        setIsDrawing(false);
        setCurrentHighlight("");

        // Pick winners
        const shuffled = [...items];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        setWinners(shuffled.slice(0, winnerCountVal));
      }
    }, 80);
  }, [itemsText, winnerCount]);

  const resetNumber = () => {
    setNumberResults([]);
  };

  const resetLottery = () => {
    setWinners([]);
    setCurrentHighlight("");
    if (drawInterval.current) clearInterval(drawInterval.current);
    setIsDrawing(false);
  };

  const itemCount = itemsText
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Dices className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تصادفی و قرعه‌کشی</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
        <button
          onClick={() => setTab("number")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            tab === "number"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Shuffle className="h-4 w-4" />
          عدد تصادفی
        </button>
        <button
          onClick={() => setTab("lottery")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            tab === "lottery"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Trophy className="h-4 w-4" />
          قرعه‌کشی
        </button>
      </div>

      {/* Random Number Generator */}
      {tab === "number" && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">حداقل</label>
              <input
                type="number"
                value={min}
                onChange={(e) => setMin(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">حداکثر</label>
              <input
                type="number"
                value={max}
                onChange={(e) => setMax(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">تعداد</label>
              <input
                type="number"
                min="1"
                max="100"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                dir="ltr"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={generateRandomNumbers}
              disabled={isSpinning}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Dices className="h-4 w-4" />
              {isSpinning ? "در حال تولید..." : "تولید عدد"}
            </button>
            {numberResults.length > 0 && (
              <button
                onClick={resetNumber}
                className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
              >
                <RotateCcw className="h-4 w-4" />
                پاک کردن
              </button>
            )}
          </div>

          {numberResults.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-sm font-medium text-foreground">نتایج</h3>
              <div className="flex flex-wrap gap-2">
                {numberResults.map((num, index) => (
                  <span
                    key={index}
                    className={cn(
                      "inline-flex items-center justify-center rounded-lg bg-primary/10 px-4 py-2 font-mono text-lg font-bold text-primary",
                      isSpinning && "animate-pulse"
                    )}
                    dir="ltr"
                  >
                    {toPersianDigits(String(num))}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lottery / Raffle */}
      {tab === "lottery" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                آیتم‌ها (هر آیتم در یک خط)
              </label>
              {itemsText.trim().length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {toPersianDigits(String(itemCount))} آیتم
                </span>
              )}
            </div>
            <textarea
              value={itemsText}
              onChange={(e) => setItemsText(e.target.value)}
              placeholder={"علی\nمریم\nرضا\nزهرا\nحسین\nفاطمه"}
              rows={6}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
            />
          </div>

          <div className="flex items-end gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">تعداد برنده</label>
              <input
                type="number"
                min="1"
                max="50"
                value={winnerCount}
                onChange={(e) => setWinnerCount(e.target.value)}
                className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                dir="ltr"
              />
            </div>
            <button
              onClick={drawWinners}
              disabled={isDrawing || itemCount === 0}
              className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Trophy className="h-4 w-4" />
              {isDrawing ? "در حال قرعه‌کشی..." : "قرعه‌کشی"}
            </button>
            {winners.length > 0 && (
              <button
                onClick={resetLottery}
                className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
              >
                <RotateCcw className="h-4 w-4" />
                مجدد
              </button>
            )}
          </div>

          {/* Spinning animation display */}
          {isDrawing && currentHighlight && (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-6 text-center">
              <Sparkles className="mx-auto mb-2 h-8 w-8 animate-spin text-primary" />
              <p className="text-2xl font-bold text-primary animate-pulse">
                {currentHighlight}
              </p>
            </div>
          )}

          {/* Winners display */}
          {winners.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-sm font-medium text-foreground">🏆 برنده(گان)</h3>
              <div className="space-y-2">
                {winners.map((winner, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center gap-3 rounded-lg p-3",
                      index === 0
                        ? "bg-yellow-500/10 border border-yellow-500/20"
                        : "bg-background"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold",
                        index === 0
                          ? "bg-yellow-500 text-yellow-950"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {toPersianDigits(String(index + 1))}
                    </span>
                    <span
                      className={cn(
                        "text-base font-medium",
                        index === 0 ? "text-yellow-600 dark:text-yellow-400" : "text-foreground"
                      )}
                    >
                      {winner}
                    </span>
                    {index === 0 && (
                      <Trophy className="mr-auto h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
