"use client";

import { useState } from "react";
import { Calculator, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

interface HistoryEntry {
  expression: string;
  result: string;
}

type BtnDef = { label: string; action: () => void; cls: string };

export default function CalculatorComponent() {
  const [display, setDisplay] = useState("0");
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const append = (value: string) => {
    setDisplay((prev) => {
      if (prev === "0" && value !== "." && value !== "(") return value;
      return prev + value;
    });
  };

  const handleClear = () => setDisplay("0");

  const handleBackspace = () => {
    setDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : "0"));
  };

  const handleNegate = () => {
    const val = parseFloat(display);
    setDisplay(("-" + val).toString());
  };

  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    let r = 1;
    for (let i = 2; i <= n; i++) r *= i;
    return r;
  };

  const handleFunction = (fn: string) => {
    const val = parseFloat(display);
    let result: number;
    switch (fn) {
      case "sin": result = Math.sin((val * Math.PI) / 180); break;
      case "cos": result = Math.cos((val * Math.PI) / 180); break;
      case "tan": result = Math.tan((val * Math.PI) / 180); break;
      case "log": result = Math.log10(val); break;
      case "ln":  result = Math.log(val); break;
      case "sqrt": result = Math.sqrt(val); break;
      case "x2": result = val * val; break;
      case "fact":
        if (val < 0 || val !== Math.floor(val) || val > 170) {
          setDisplay("خطا");
          return;
        }
        result = factorial(val);
        break;
      default:
        return;
    }
    if (!isFinite(result)) {
      setDisplay("خطا");
      return;
    }
    setDisplay(parseFloat(result.toPrecision(12)).toString());
  };

  const handleMemory = (action: string) => {
    const val = parseFloat(display);
    switch (action) {
      case "MC": setMemory(0); break;
      case "MR": setDisplay(memory.toString()); break;
      case "M+": setMemory((prev) => prev + val); break;
      case "M-": setMemory((prev) => prev - val); break;
    }
  };

  const handleEquals = () => {
    try {
      let expr = display
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, String(Math.PI))
        .replace(/(?<![a-zA-Z])e(?![a-zA-Z])/g, String(Math.E))
        .replace(/%/g, "/100");
      const result = Function(`"use strict"; return (${expr})`)();
      if (typeof result !== "number") {
        setDisplay("خطا");
        return;
      }
      if (!isFinite(result) && result !== Infinity && result !== -Infinity) {
        setDisplay("خطا");
        return;
      }
      const resultStr = parseFloat(result.toPrecision(12)).toString();
      setHistory((prev) => [
        { expression: display, result: resultStr },
        ...prev.slice(0, 19),
      ]);
      setDisplay(resultStr);
    } catch {
      setDisplay("خطا");
    }
  };

  const handleHistoryClick = (result: string) => {
    setDisplay(result);
  };

  const btnBase =
    "flex h-11 items-center justify-center rounded-lg border border-[var(--glass-border)] text-sm font-medium transition-all duration-150 hover:scale-[1.03] active:scale-95 cursor-pointer select-none";

  // Memory row
  const memRow: BtnDef[] = [
    { label: "MC", action: () => handleMemory("MC"), cls: "bg-red-500/10 text-red-500 hover:bg-red-500/20" },
    { label: "MR", action: () => handleMemory("MR"), cls: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
    { label: "M+", action: () => handleMemory("M+"), cls: "bg-green-500/10 text-green-500 hover:bg-green-500/20" },
    { label: "M-", action: () => handleMemory("M-"), cls: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20" },
  ];

  // Scientific rows
  const sciRow1: BtnDef[] = [
    { label: "sin", action: () => handleFunction("sin"), cls: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" },
    { label: "cos", action: () => handleFunction("cos"), cls: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" },
    { label: "tan", action: () => handleFunction("tan"), cls: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" },
    { label: "log", action: () => handleFunction("log"), cls: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" },
  ];

  const sciRow2: BtnDef[] = [
    { label: "ln",  action: () => handleFunction("ln"),   cls: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20" },
    { label: "√",   action: () => handleFunction("sqrt"), cls: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20" },
    { label: "x²",  action: () => handleFunction("x2"),   cls: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20" },
    { label: "n!",  action: () => handleFunction("fact"), cls: "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20" },
  ];

  // Constants row
  const constRow: BtnDef[] = [
    { label: "π", action: () => append("π"), cls: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" },
    { label: "e", action: () => append("e"), cls: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" },
    { label: "(", action: () => append("("), cls: "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20" },
    { label: ")", action: () => append(")"), cls: "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20" },
  ];

  // Operator row
  const opRow: BtnDef[] = [
    { label: "C",  action: handleClear,     cls: "bg-red-500/10 text-red-500 hover:bg-red-500/20" },
    { label: "⌫", action: handleBackspace, cls: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20" },
    { label: "%",  action: () => append("%"), cls: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" },
    { label: "÷",  action: () => append("÷"), cls: "bg-primary/10 text-primary hover:bg-primary/20" },
  ];

  // Number / operator grid
  const numRow1: BtnDef[] = [
    { label: "۷", action: () => append("7"), cls: "" },
    { label: "۸", action: () => append("8"), cls: "" },
    { label: "۹", action: () => append("9"), cls: "" },
    { label: "×", action: () => append("×"), cls: "bg-primary/10 text-primary hover:bg-primary/20" },
  ];
  const numRow2: BtnDef[] = [
    { label: "۴", action: () => append("4"), cls: "" },
    { label: "۵", action: () => append("5"), cls: "" },
    { label: "۶", action: () => append("6"), cls: "" },
    { label: "-",  action: () => append("-"), cls: "bg-primary/10 text-primary hover:bg-primary/20" },
  ];
  const numRow3: BtnDef[] = [
    { label: "۱", action: () => append("1"), cls: "" },
    { label: "۲", action: () => append("2"), cls: "" },
    { label: "۳", action: () => append("3"), cls: "" },
    { label: "+", action: () => append("+"), cls: "bg-primary/10 text-primary hover:bg-primary/20" },
  ];
  const numRow4: BtnDef[] = [
    { label: "۰",   action: () => append("0"), cls: "" },
    { label: ".",   action: () => append("."), cls: "" },
    { label: "±",   action: handleNegate, cls: "" },
    { label: "=",   action: handleEquals, cls: "bg-primary text-primary-foreground hover:bg-primary/90" },
  ];

  const renderRow = (row: BtnDef[], prefix: string) => (
    <div className="mb-1.5 grid grid-cols-4 gap-1.5">
      {row.map((btn, i) => (
        <button
          key={`${prefix}-${i}`}
          onClick={btn.action}
          className={cn(btnBase, btn.cls)}
        >
          {btn.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calculator className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">ماشین حساب علمی</h2>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Calculator Grid */}
        <div className="glass-card glow-effect p-5 lg:w-[400px] shrink-0">
          {/* Display */}
          <div className="mb-4 rounded-xl bg-[var(--background)]/60 border border-[var(--glass-border)] p-4">
            {memory !== 0 && (
              <p className="mb-1 text-xs text-primary">M = {toPersianDigits(memory.toString())}</p>
            )}
            <p
              className="text-2xl font-mono font-bold tabular-nums text-foreground truncate"
              dir="ltr"
              title={display}
            >
              {toPersianDigits(display)}
            </p>
          </div>

          {renderRow(memRow, "mem")}
          {renderRow(sciRow1, "s1")}
          {renderRow(sciRow2, "s2")}
          {renderRow(constRow, "c")}
          {renderRow(opRow, "op")}
          {renderRow(numRow1, "n1")}
          {renderRow(numRow2, "n2")}
          {renderRow(numRow3, "n3")}
          {renderRow(numRow4, "n4")}
        </div>

        {/* History Panel */}
        <div className="glass-card glow-effect flex-1 min-h-[200px] flex flex-col">
          <div className="flex items-center justify-between border-b border-[var(--glass-border)] px-4 py-3">
            <h3 className="text-sm font-bold text-foreground">تاریخچه محاسبات</h3>
            {history.length > 0 && (
              <button
                onClick={() => setHistory([])}
                className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/20 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                پاک کردن
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
                <Calculator className="h-8 w-8 opacity-30" />
                <p>هنوز محاسبه‌ای انجام نشده</p>
              </div>
            ) : (
              history.map((entry, i) => (
                <button
                  key={i}
                  onClick={() => handleHistoryClick(entry.result)}
                  className="w-full rounded-lg border border-[var(--glass-border)] bg-[var(--background)]/40 p-3 text-right transition-colors hover:bg-accent cursor-pointer"
                >
                  <p className="text-xs text-muted-foreground truncate" dir="ltr">
                    {toPersianDigits(entry.expression)}
                  </p>
                  <p className="text-base font-bold text-foreground" dir="ltr">
                    = {toPersianDigits(entry.result)}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
