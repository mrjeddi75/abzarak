"use client";

import { useState } from "react";
import { ArrowLeftRight, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryKey = "length" | "weight" | "temperature";

const categories: Record<CategoryKey, { label: string; units: { label: string; value: string }[] }> = {
  length: {
    label: "طول",
    units: [
      { label: "متر", value: "meter" },
      { label: "کیلومتر", value: "km" },
      { label: "سانتی‌متر", value: "cm" },
      { label: "میلی‌متر", value: "mm" },
      { label: "مایل", value: "mile" },
      { label: "یارد", value: "yard" },
      { label: "فوت", value: "foot" },
      { label: "اینچ", value: "inch" },
    ],
  },
  weight: {
    label: "وزن",
    units: [
      { label: "کیلوگرم", value: "kg" },
      { label: "گرم", value: "g" },
      { label: "میلی‌گرم", value: "mg" },
      { label: "تن", value: "ton" },
      { label: "پوند", value: "pound" },
      { label: "اونس", value: "ounce" },
    ],
  },
  temperature: {
    label: "دما",
    units: [
      { label: "سلسیوس", value: "celsius" },
      { label: "فارنهایت", value: "fahrenheit" },
      { label: "کلوین", value: "kelvin" },
    ],
  },
};

// Conversion factors to base unit (meter for length, kg for weight)
const lengthToMeter: Record<string, number> = {
  meter: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  mile: 1609.344,
  yard: 0.9144,
  foot: 0.3048,
  inch: 0.0254,
};

const weightToKg: Record<string, number> = {
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  ton: 1000,
  pound: 0.453592,
  ounce: 0.0283495,
};

const convertTemperature = (value: number, from: string, to: string): number => {
  let celsius: number;
  if (from === "celsius") celsius = value;
  else if (from === "fahrenheit") celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15;

  if (to === "celsius") return celsius;
  if (to === "fahrenheit") return celsius * (9 / 5) + 32;
  return celsius + 273.15;
};

export default function UnitConverter() {
  const [category, setCategory] = useState<CategoryKey>("length");
  const [fromUnit, setFromUnit] = useState("meter");
  const [toUnit, setToUnit] = useState("km");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const handleCategoryChange = (cat: CategoryKey) => {
    setCategory(cat);
    const units = categories[cat].units;
    setFromUnit(units[0].value);
    setToUnit(units[1].value);
    setInputValue("");
    setResult(null);
  };

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    if (result !== null) {
      setInputValue(result);
    }
    setResult(null);
  };

  const handleConvert = () => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setResult(null);
      return;
    }

    let converted: number;
    if (category === "length") {
      const base = val * lengthToMeter[fromUnit];
      converted = base / lengthToMeter[toUnit];
    } else if (category === "weight") {
      const base = val * weightToKg[fromUnit];
      converted = base / weightToKg[toUnit];
    } else {
      converted = convertTemperature(val, fromUnit, toUnit);
    }

    setResult(parseFloat(converted.toFixed(10)).toString());
  };

  const currentUnits = categories[category].units;
  const fromLabel = currentUnits.find((u) => u.value === fromUnit)?.label || fromUnit;
  const toLabel = currentUnits.find((u) => u.value === toUnit)?.label || toUnit;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Ruler className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تبدیل واحد</h2>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        {/* Category tabs */}
        <div className="flex gap-2">
          {(Object.keys(categories) as CategoryKey[]).map((key) => (
            <button
              key={key}
              onClick={() => handleCategoryChange(key)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors border",
                category === key
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-foreground hover:bg-accent"
              )}
            >
              {categories[key].label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">مقدار</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setResult(null);
            }}
            placeholder="مقدار را وارد کنید"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            dir="ltr"
          />
        </div>

        {/* From / To units */}
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-foreground">از</label>
            <select
              value={fromUnit}
              onChange={(e) => {
                setFromUnit(e.target.value);
                setResult(null);
              }}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {currentUnits.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            className="mb-0.5 rounded-lg border border-border p-2.5 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeftRight className="h-5 w-5" />
          </button>

          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-foreground">به</label>
            <select
              value={toUnit}
              onChange={(e) => {
                setToUnit(e.target.value);
                setResult(null);
              }}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {currentUnits.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Convert button */}
        <button
          onClick={handleConvert}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          تبدیل کن
        </button>

        {/* Result */}
        {result !== null && (
          <div className="rounded-lg border border-border bg-background p-4 text-center">
            <p className="text-sm text-muted-foreground">
              {inputValue} {fromLabel}
            </p>
            <p className="mt-1 text-2xl font-bold text-primary" dir="ltr">
              {result} {toLabel}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
