"use client";

import { useState } from "react";
import { Square, RectangleHorizontal, Circle, Triangle, Pentagon } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

type Shape = "square" | "rectangle" | "circle" | "triangle" | "trapezoid";

const shapes: { key: Shape; label: string; icon: React.ElementType }[] = [
  { key: "square", label: "مربع", icon: Square },
  { key: "rectangle", label: "مستطیل", icon: RectangleHorizontal },
  { key: "circle", label: "دایره", icon: Circle },
  { key: "triangle", label: "مثلث", icon: Triangle },
  { key: "trapezoid", label: "ذوزنقه", icon: Pentagon },
];

type InputField = { key: string; label: string; placeholder: string };

const shapeInputs: Record<Shape, InputField[]> = {
  square: [{ key: "side", label: "ضلع", placeholder: "مثلاً ۵" }],
  rectangle: [
    { key: "length", label: "طول", placeholder: "مثلاً ۱۰" },
    { key: "width", label: "عرض", placeholder: "مثلاً ۵" },
  ],
  circle: [{ key: "radius", label: "شعاع", placeholder: "مثلاً ۳" }],
  triangle: [
    { key: "a", label: "ضلع اول", placeholder: "ضلع a" },
    { key: "b", label: "ضلع دوم", placeholder: "ضلع b" },
    { key: "c", label: "ضلع سوم", placeholder: "ضلع c" },
  ],
  trapezoid: [
    { key: "a", label: "قاعده بالا", placeholder: "a" },
    { key: "b", label: "قاعده پایین", placeholder: "b" },
    { key: "h", label: "ارتفاع", placeholder: "h" },
    { key: "side1", label: "بغل چپ", placeholder: "بغل" },
    { key: "side2", label: "بغل راست", placeholder: "بغل" },
  ],
};

export default function AreaCalculator() {
  const [shape, setShape] = useState<Shape>("square");
  const [values, setValues] = useState<Record<string, string>>({});

  const v = (k: string) => parseFloat(values[k]) || 0;

  const calc = () => {
    switch (shape) {
      case "square": {
        const s = v("side");
        return { area: s * s, perimeter: 4 * s };
      }
      case "rectangle": {
        const l = v("length"), w = v("width");
        return { area: l * w, perimeter: 2 * (l + w) };
      }
      case "circle": {
        const r = v("radius");
        return { area: Math.PI * r * r, perimeter: 2 * Math.PI * r };
      }
      case "triangle": {
        const a = v("a"), b = v("b"), c = v("c");
        const s = (a + b + c) / 2;
        const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));
        return { area, perimeter: a + b + c };
      }
      case "trapezoid": {
        const a = v("a"), b = v("b"), h = v("h"), s1 = v("side1"), s2 = v("side2");
        return { area: ((a + b) / 2) * h, perimeter: a + b + s1 + s2 };
      }
    }
  };

  const result = calc();
  const inputs = shapeInputs[shape];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Square className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">محاسبه‌گر مساحت و محیط</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {shapes.map((s) => (
          <button
            key={s.key}
            onClick={() => { setShape(s.key); setValues({}); }}
            className={cn(
              "flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors",
              shape === s.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-foreground hover:bg-accent"
            )}
          >
            <s.icon className="h-4 w-4" />
            {s.label}
          </button>
        ))}
      </div>

      <div className={cn("grid gap-4", inputs.length > 2 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2")}>
        {inputs.map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-sm font-medium text-foreground">{field.label}</label>
            <input
              type="number"
              value={values[field.key] || ""}
              onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
              placeholder={field.placeholder}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              dir="ltr"
            />
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">مساحت</p>
          <p className="text-2xl font-bold text-primary" dir="ltr">{toPersianDigits(result.area.toFixed(4))}</p>
          <p className="text-xs text-muted-foreground">مربع واحد</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">محیط</p>
          <p className="text-2xl font-bold text-green-500" dir="ltr">{toPersianDigits(result.perimeter.toFixed(4))}</p>
          <p className="text-xs text-muted-foreground">واحد</p>
        </div>
      </div>
    </div>
  );
}
