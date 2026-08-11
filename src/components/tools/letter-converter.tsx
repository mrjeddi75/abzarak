"use client";

import { useState } from "react";
import { ArrowRightLeft, Languages } from "lucide-react";
import { cn } from "@/lib/utils";

const persianToEnglish: Record<string, string> = {
  "ا": "A",
  "آ": "A",
  "أ": "A",
  "ب": "B",
  "پ": "P",
  "ت": "T",
  "ث": "S",
  "ج": "J",
  "چ": "CH",
  "ح": "H",
  "خ": "KH",
  "د": "D",
  "ذ": "Z",
  "ر": "R",
  "ز": "Z",
  "ژ": "ZH",
  "س": "S",
  "ش": "SH",
  "ص": "S",
  "ض": "Z",
  "ط": "T",
  "ظ": "Z",
  "ع": "A",
  "غ": "GH",
  "ف": "F",
  "ق": "GH",
  "ک": "K",
  "گ": "G",
  "ل": "L",
  "م": "M",
  "ن": "N",
  "و": "V",
  "ه": "H",
  "ی": "Y",
  "ئ": "EE",
  "ة": "H",
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
  " ": " ",
  "\n": "\n",
};

const englishToPersian: Record<string, string> = {
  "a": "ا", "b": "ب", "c": "ک", "d": "د", "e": "ه",
  "f": "ف", "g": "گ", "h": "ه", "i": "ی", "j": "ج",
  "k": "ک", "l": "ل", "m": "م", "n": "ن", "o": "و",
  "p": "پ", "q": "ق", "r": "ر", "s": "س", "t": "ت",
  "u": "و", "v": "و", "w": "و", "x": "کس", "y": "ی",
  "z": "ز",
  "ch": "چ", "sh": "ش", "kh": "خ", "zh": "ژ", "gh": "غ",
  "0": "۰", "1": "۱", "2": "۲", "3": "۳", "4": "۴",
  "5": "۵", "6": "۶", "7": "۷", "8": "۸", "9": "۹",
};

const convertPersianToEnglish = (text: string): string => {
  let result = "";
  const chars = Array.from(text);
  let i = 0;
  while (i < chars.length) {
    const ch = chars[i];
    if (persianToEnglish[ch] !== undefined) {
      result += persianToEnglish[ch];
    } else {
      result += ch;
    }
    i++;
  }
  return result;
};

const convertEnglishToPersian = (text: string): string => {
  let result = "";
  let i = 0;
  while (i < text.length) {
    // Check 2-char combos first
    const twoChar = text.substring(i, i + 2).toLowerCase();
    if (englishToPersian[twoChar]) {
      result += englishToPersian[twoChar];
      i += 2;
      continue;
    }
    const ch = text[i].toLowerCase();
    if (englishToPersian[ch]) {
      result += englishToPersian[ch];
    } else {
      result += text[i];
    }
    i++;
  }
  return result;
};

export default function LetterConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"fa2en" | "en2fa">("fa2en");

  const handleConvert = () => {
    if (direction === "fa2en") {
      setOutput(convertPersianToEnglish(input));
    } else {
      setOutput(convertEnglishToPersian(input));
    }
  };

  const handleSwapDirection = () => {
    const newDir = direction === "fa2en" ? "en2fa" : "fa2en";
    setDirection(newDir);
    setInput(output);
    setOutput(input);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Languages className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تبدیل حروف</h2>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        {/* Direction toggle */}
        <div className="flex items-center justify-center gap-3">
          <span
            className={cn(
              "text-sm font-medium",
              direction === "fa2en" ? "text-primary" : "text-muted-foreground"
            )}
          >
            فارسی به انگلیسی
          </span>
          <button
            onClick={handleSwapDirection}
            className="rounded-lg border border-border p-2 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </button>
          <span
            className={cn(
              "text-sm font-medium",
              direction === "en2fa" ? "text-primary" : "text-muted-foreground"
            )}
          >
            انگلیسی به فارسی
          </span>
        </div>

        {/* Input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            متن ورودی
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              direction === "fa2en"
                ? "متن فارسی را وارد کنید..."
                : "Enter English text..."
            }
            dir={direction === "fa2en" ? "rtl" : "ltr"}
            className="w-full min-h-[120px] rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        {/* Convert button */}
        <button
          onClick={handleConvert}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          تبدیل کن
        </button>

        {/* Output */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">
            متن خروجی
          </label>
          <textarea
            value={output}
            readOnly
            placeholder="نتیجه اینجا نمایش داده می‌شود..."
            dir={direction === "fa2en" ? "ltr" : "rtl"}
            className="w-full min-h-[120px] rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:outline-none resize-y"
          />
        </div>
      </div>
    </div>
  );
}
