"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Timer, Play, Pause, RotateCcw, Flag, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const milliseconds = Math.floor((ms % 1000) / 10);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(2, "0")}`;
};

const formatTimerDisplay = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

type Tab = "chronometer" | "countdown";

export default function TimerComponent() {
  const [tab, setTab] = useState<Tab>("chronometer");

  // Chronometer state
  const [chronoElapsed, setChronoElapsed] = useState(0);
  const [chronoRunning, setChronoRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const chronoInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const chronoStartRef = useRef(0);
  const chronoAccumulated = useRef(0);

  // Countdown state
  const [cdMinutes, setCdMinutes] = useState("");
  const [cdSeconds, setCdSeconds] = useState("");
  const [cdRemaining, setCdRemaining] = useState(0);
  const [cdRunning, setCdRunning] = useState(false);
  const [cdFinished, setCdFinished] = useState(false);
  const [cdFlash, setCdFlash] = useState(false);
  const cdInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const cdStartTime = useRef(0);
  const cdTotalDuration = useRef(0);

  // Flash effect when timer finishes
  useEffect(() => {
    if (!cdFinished) return;
    const flashInterval = setInterval(() => {
      setCdFlash((prev) => !prev);
    }, 500);
    return () => clearInterval(flashInterval);
  }, [cdFinished]);

  // Chronometer handlers
  const startChrono = useCallback(() => {
    if (chronoRunning) return;
    chronoStartRef.current = Date.now();
    setChronoRunning(true);
    chronoInterval.current = setInterval(() => {
      const now = Date.now();
      setChronoElapsed(chronoAccumulated.current + (now - chronoStartRef.current));
    }, 10);
  }, [chronoRunning]);

  const stopChrono = useCallback(() => {
    if (!chronoRunning) return;
    chronoAccumulated.current += Date.now() - chronoStartRef.current;
    setChronoRunning(false);
    if (chronoInterval.current) {
      clearInterval(chronoInterval.current);
      chronoInterval.current = null;
    }
  }, [chronoRunning]);

  const resetChrono = useCallback(() => {
    setChronoRunning(false);
    setChronoElapsed(0);
    setLaps([]);
    chronoAccumulated.current = 0;
    if (chronoInterval.current) {
      clearInterval(chronoInterval.current);
      chronoInterval.current = null;
    }
  }, []);

  const addLap = useCallback(() => {
    if (!chronoRunning) return;
    setLaps((prev) => [chronoElapsed, ...prev]);
  }, [chronoRunning, chronoElapsed]);

  // Cleanup chronometer on unmount
  useEffect(() => {
    return () => {
      if (chronoInterval.current) clearInterval(chronoInterval.current);
      if (cdInterval.current) clearInterval(cdInterval.current);
    };
  }, []);

  // Countdown handlers
  const startCountdown = useCallback(() => {
    const minutes = parseInt(cdMinutes) || 0;
    const seconds = parseInt(cdSeconds) || 0;
    const totalSeconds = minutes * 60 + seconds;
    if (totalSeconds <= 0) return;

    if (cdRunning) {
      // Pause
      setCdRemaining((prev) => {
        cdTotalDuration.current = prev;
        return prev;
      });
      setCdRunning(false);
      if (cdInterval.current) {
        clearInterval(cdInterval.current);
        cdInterval.current = null;
      }
      return;
    }

    // Start or resume
    const duration = cdRemaining > 0 ? cdRemaining : totalSeconds;
    cdTotalDuration.current = duration;
    cdStartTime.current = Date.now();
    setCdRunning(true);
    setCdFinished(false);
    setCdFlash(false);

    cdInterval.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - cdStartTime.current) / 1000);
      const remaining = cdTotalDuration.current - elapsed;
      if (remaining <= 0) {
        setCdRemaining(0);
        setCdRunning(false);
        setCdFinished(true);
        if (cdInterval.current) {
          clearInterval(cdInterval.current);
          cdInterval.current = null;
        }
      } else {
        setCdRemaining(remaining);
      }
    }, 100);
  }, [cdRunning, cdMinutes, cdSeconds, cdRemaining]);

  const resetCountdown = useCallback(() => {
    setCdRunning(false);
    setCdRemaining(0);
    setCdFinished(false);
    setCdFlash(false);
    if (cdInterval.current) {
      clearInterval(cdInterval.current);
      cdInterval.current = null;
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Timer className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">ساعت‌گذر و تایمر</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-lg border border-border bg-muted p-1">
        <button
          onClick={() => setTab("chronometer")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            tab === "chronometer"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Clock className="h-4 w-4" />
          ساعت‌گذر
        </button>
        <button
          onClick={() => setTab("countdown")}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
            tab === "countdown"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Timer className="h-4 w-4" />
          تایمر
        </button>
      </div>

      {/* Chronometer */}
      {tab === "chronometer" && (
        <div className="space-y-4">
          <div
            className={cn(
              "rounded-lg border border-border bg-card p-6 text-center"
            )}
          >
            <p className="font-mono text-5xl font-bold tabular-nums text-foreground" dir="ltr">
              {formatTime(chronoElapsed)}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {!chronoRunning ? (
              <button
                onClick={startChrono}
                className="flex items-center gap-2 rounded-lg bg-green-500/10 px-6 py-2.5 text-sm font-medium text-green-500 transition-colors hover:bg-green-500/20"
              >
                <Play className="h-4 w-4" />
                شروع
              </button>
            ) : (
              <button
                onClick={stopChrono}
                className="flex items-center gap-2 rounded-lg bg-yellow-500/10 px-6 py-2.5 text-sm font-medium text-yellow-500 transition-colors hover:bg-yellow-500/20"
              >
                <Pause className="h-4 w-4" />
                توقف
              </button>
            )}
            <button
              onClick={addLap}
              disabled={!chronoRunning}
              className="flex items-center gap-2 rounded-lg bg-primary/10 px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-40 disabled:pointer-events-none"
            >
              <Flag className="h-4 w-4" />
              دور
            </button>
            <button
              onClick={resetChrono}
              className="flex items-center gap-2 rounded-lg bg-red-500/10 px-6 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
            >
              <RotateCcw className="h-4 w-4" />
              ریست
            </button>
          </div>

          {/* Laps */}
          {laps.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="mb-3 text-sm font-medium text-foreground">دورها</h3>
              <div className="max-h-60 space-y-2 overflow-y-auto">
                {laps.map((lapTime, index) => {
                  const prevLap = laps[index + 1] || 0;
                  const diff = lapTime - prevLap;
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md bg-background px-3 py-2 text-sm"
                    >
                      <span className="text-muted-foreground">
                        دور {toPersianDigits(String(laps.length - index))}
                      </span>
                      <span className="font-mono tabular-nums text-muted-foreground" dir="ltr">
                        +{formatTime(diff)}
                      </span>
                      <span className="font-mono tabular-nums text-foreground font-medium" dir="ltr">
                        {formatTime(lapTime)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Countdown Timer */}
      {tab === "countdown" && (
        <div className="space-y-4">
          {!cdRunning && cdRemaining === 0 && !cdFinished && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">دقیقه</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={cdMinutes}
                  onChange={(e) => setCdMinutes(e.target.value)}
                  placeholder="00"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-2xl font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">ثانیه</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={cdSeconds}
                  onChange={(e) => setCdSeconds(e.target.value)}
                  placeholder="00"
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-2xl font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  dir="ltr"
                />
              </div>
            </div>
          )}

          <div
            className={cn(
              "rounded-lg border border-border bg-card p-6 text-center transition-colors",
              cdFlash && "bg-red-500/20 border-red-500/50"
            )}
          >
            {cdFinished ? (
              <>
                <p className="font-mono text-5xl font-bold tabular-nums text-red-500" dir="ltr">
                  00:00:00
                </p>
                <p className="mt-2 text-sm text-red-500 font-medium">زمان به پایان رسید!</p>
              </>
            ) : (
              <p className={cn(
                "font-mono text-5xl font-bold tabular-nums",
                cdRemaining <= 10 && cdRunning ? "text-red-500" : "text-foreground"
              )} dir="ltr">
                {cdRemaining > 0
                  ? formatTimerDisplay(cdRemaining)
                  : "00:00:00"}
              </p>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={startCountdown}
              disabled={cdFinished || (cdRemaining === 0 && !parseInt(cdMinutes) && !parseInt(cdSeconds))}
              className={cn(
                "flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors",
                cdRunning
                  ? "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                  : "bg-green-500/10 text-green-500 hover:bg-green-500/20",
                "disabled:opacity-40 disabled:pointer-events-none"
              )}
            >
              {cdRunning ? (
                <>
                  <Pause className="h-4 w-4" />
                  توقف
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  شروع
                </>
              )}
            </button>
            <button
              onClick={resetCountdown}
              className="flex items-center gap-2 rounded-lg bg-red-500/10 px-6 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/20"
            >
              <RotateCcw className="h-4 w-4" />
              ریست
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
