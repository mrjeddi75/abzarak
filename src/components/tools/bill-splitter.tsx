"use client";

import { useState } from "react";
import { Calculator, Users, Plus, Trash2, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Person {
  id: number;
  name: string;
  customAmount: string; // empty string means equal split
}

const toPersianDigits = (str: string) => {
  const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return str.replace(/[0-9]/g, (d) => persianDigits[parseInt(d)]);
};

const formatCurrency = (amount: number): string => {
  return toPersianDigits(
    amount.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
  );
};

let nextId = 1;

export default function BillSplitter() {
  const [totalBill, setTotalBill] = useState("");
  const [peopleCount, setPeopleCount] = useState("");
  const [persons, setPersons] = useState<Person[]>([]);
  const [useCustom, setUseCustom] = useState(false);
  const [copied, setCopied] = useState(false);

  const bill = parseFloat(totalBill) || 0;
  const numPeople = parseInt(peopleCount) || 0;

  const equalShare = numPeople > 0 ? bill / numPeople : 0;

  // Custom amounts
  const customTotal = persons.reduce(
    (sum, p) => sum + (parseFloat(p.customAmount) || 0),
    0
  );
  const remainingCustom = bill - customTotal;
  const customPeopleWithAmount = persons.filter(
    (p) => p.customAmount.trim() !== ""
  ).length;
  const customPeopleNoAmount = persons.length - customPeopleWithAmount;
  const equalShareCustom =
    customPeopleNoAmount > 0 && remainingCustom > 0
      ? remainingCustom / customPeopleNoAmount
      : 0;

  const hasValidInput = bill > 0 && numPeople > 0;
  const hasValidCustom =
    bill > 0 && persons.length > 0 && customTotal > 0;

  const generatePersons = () => {
    const count = numPeople;
    if (count < 1) return;
    const newPersons: Person[] = [];
    for (let i = 0; i < count; i++) {
      newPersons.push({
        id: nextId++,
        name: `شخص ${toPersianDigits(String(i + 1))}`,
        customAmount: "",
      });
    }
    setPersons(newPersons);
  };

  const addPerson = () => {
    const idx = persons.length + 1;
    setPersons([
      ...persons,
      {
        id: nextId++,
        name: `شخص ${toPersianDigits(String(idx))}`,
        customAmount: "",
      },
    ]);
    setPeopleCount(String(persons.length + 1));
  };

  const removePerson = (id: number) => {
    const updated = persons.filter((p) => p.id !== id);
    setPersons(updated);
    setPeopleCount(String(updated.length));
  };

  const updatePerson = (id: number, field: "name" | "customAmount", value: string) => {
    setPersons(persons.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const copyResult = () => {
    let text: string;
    if (useCustom && hasValidCustom) {
      const lines = persons.map((p) => {
        const amt =
          p.customAmount.trim() !== ""
            ? parseFloat(p.customAmount) || 0
            : equalShareCustom;
        return `${p.name}: ${formatCurrency(Math.round(amt))} تومان`;
      });
      text = `مجموع: ${formatCurrency(Math.round(bill))} تومان\n${lines.join("\n")}\nمبلغ باقی‌مانده: ${formatCurrency(Math.round(remainingCustom))} تومان`;
    } else {
      text = `مجموع: ${formatCurrency(Math.round(bill))} تومان\nتعداد نفرات: ${toPersianDigits(String(numPeople))} نفر\nسهم هر نفر: ${formatCurrency(Math.round(equalShare))} تومان`;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPersonShare = (p: Person): number => {
    if (!useCustom) return equalShare;
    if (p.customAmount.trim() !== "") return parseFloat(p.customAmount) || 0;
    return equalShareCustom;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Calculator className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">دنگ‌محاس</h2>
      </div>

      {/* Inputs */}
      <div className="glass-card p-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Total Bill */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              مبلغ کل (تومان)
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              <input
                type="number"
                min="0"
                value={totalBill}
                onChange={(e) => setTotalBill(e.target.value)}
                placeholder="مثلاً ۵۰۰,۰۰۰"
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                dir="ltr"
              />
              <span className="text-xs text-muted-foreground">تومان</span>
            </div>
          </div>

          {/* Number of People */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              تعداد افراد
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5">
              <Users className="h-4 w-4 text-muted-foreground" />
              <input
                type="number"
                min="1"
                value={peopleCount}
                onChange={(e) => setPeopleCount(e.target.value)}
                placeholder="مثلاً ۴"
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                dir="ltr"
              />
              <span className="text-xs text-muted-foreground">نفر</span>
            </div>
          </div>
        </div>

        {/* Toggle Custom Mode */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (!useCustom) {
                generatePersons();
              }
              setUseCustom(true);
            }}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              useCustom
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            مبلغ دلخواه هر شخص
          </button>
          <button
            onClick={() => setUseCustom(false)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              !useCustom
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            تقسیم مساوی
          </button>
        </div>
      </div>

      {/* Simple Equal Split Result */}
      {!useCustom && hasValidInput && (
        <div className="space-y-3">
          {/* Summary Cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="glass-card hover-glow p-5 text-center">
              <p className="mb-1 text-xs text-muted-foreground">مبلغ کل</p>
              <p className="text-2xl font-bold text-foreground" dir="ltr">
                {formatCurrency(Math.round(bill))}
              </p>
              <p className="text-xs text-muted-foreground">تومان</p>
            </div>
            <div className="glass-card glow-effect gradient-border p-5 text-center">
              <p className="mb-1 text-xs text-muted-foreground">
                سهم هر نفر ({toPersianDigits(String(numPeople))} نفر)
              </p>
              <p className="text-2xl font-bold gradient-text" dir="ltr">
                {formatCurrency(Math.round(equalShare))}
              </p>
              <p className="text-xs text-muted-foreground">تومان</p>
            </div>
          </div>

          {/* Breakdown */}
          <div className="glass-card p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">مجموع صورتحساب</span>
              <span className="text-foreground" dir="ltr">
                {formatCurrency(Math.round(bill))} تومان
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                تعداد افراد
              </span>
              <span className="text-foreground">
                {toPersianDigits(String(numPeople))} نفر
              </span>
            </div>
            <div className="mt-2 border-t border-border pt-2 flex items-center justify-between text-sm font-medium">
              <span className="text-foreground">سهم هر نفر</span>
              <span className="text-primary" dir="ltr">
                {formatCurrency(Math.round(equalShare))} تومان
              </span>
            </div>
          </div>

          {/* Copy Button */}
          <button
            onClick={copyResult}
            className="flex items-center gap-2 rounded-lg glass-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "کپی شد!" : "کپی نتیجه"}
          </button>
        </div>
      )}

      {/* Custom Amounts Mode */}
      {useCustom && (
        <div className="space-y-3">
          {/* Person List */}
          {persons.map((person) => (
            <div
              key={person.id}
              className="glass-card hover-glow p-4 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <div className="flex-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) =>
                    updatePerson(person.id, "name", e.target.value)
                  }
                  className="w-full sm:w-36 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="نام شخص"
                />
                <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    value={person.customAmount}
                    onChange={(e) =>
                      updatePerson(person.id, "customAmount", e.target.value)
                    }
                    className="w-32 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                    dir="ltr"
                    placeholder="مبلغ (خالی = مساوی)"
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    تومان
                  </span>
                </div>
              </div>
              {hasValidCustom && (
                <div className="flex items-center gap-3">
                  <span
                    className="text-sm font-bold text-primary whitespace-nowrap"
                    dir="ltr"
                  >
                    {formatCurrency(Math.round(getPersonShare(person)))} تومان
                  </span>
                </div>
              )}
              <button
                onClick={() => removePerson(person.id)}
                className="self-start sm:self-center rounded-lg border border-border p-2 text-muted-foreground transition-colors hover:border-red-500/50 hover:text-red-500"
                title="حذف"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* Add Person */}
          <button
            onClick={addPerson}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border glass-card px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Plus className="h-4 w-4" />
            افزودن شخص
          </button>

          {/* Custom Results Summary */}
          {hasValidCustom && (
            <div className="space-y-3">
              <div className="glass-card p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">مجموع صورتحساب</span>
                  <span className="text-foreground" dir="ltr">
                    {formatCurrency(Math.round(bill))} تومان
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    مجموع مبالغ دلخواه
                  </span>
                  <span className="text-foreground" dir="ltr">
                    {formatCurrency(Math.round(customTotal))} تومان
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    افراد بدون مبلغ دلخواه
                  </span>
                  <span className="text-foreground">
                    {toPersianDigits(String(customPeopleNoAmount))} نفر
                  </span>
                </div>
                <div className="border-t border-border pt-2 flex items-center justify-between text-sm font-medium">
                  <span className="text-foreground">مبلغ باقی‌مانده</span>
                  <span
                    className={cn(
                      "font-bold",
                      Math.abs(remainingCustom) < 1
                        ? "text-green-500"
                        : remainingCustom > 0
                        ? "text-primary"
                        : "text-red-500"
                    )}
                    dir="ltr"
                  >
                    {formatCurrency(Math.round(remainingCustom))} تومان
                  </span>
                </div>
                {customPeopleNoAmount > 0 && remainingCustom > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      سهم هر نفر باقی‌مانده
                    </span>
                    <span className="text-primary" dir="ltr">
                      {formatCurrency(Math.round(equalShareCustom))} تومان
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={copyResult}
                className="flex items-center gap-2 rounded-lg glass-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "کپی شد!" : "کپی نتیجه"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
