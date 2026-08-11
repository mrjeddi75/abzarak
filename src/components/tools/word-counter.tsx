"use client";

import { useState } from "react";
import { Hash, Type, AlignRight, Pilcrow } from "lucide-react";
import { cn } from "@/lib/utils";

export default function WordCounter() {
  const [text, setText] = useState("");

  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim() === "" ? [] : text.trim().split(/\s+/);
  const wordCount = words.length;
  const sentences = text.trim() === "" ? [] : text.split(/[.!?؟。]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length;
  const paragraphs = text.trim() === "" ? [] : text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const paragraphCount = paragraphs.length;

  const stats = [
    { icon: <Type className="h-4 w-4" />, label: "کاراکتر (با فاصله)", value: charCount },
    { icon: <Type className="h-4 w-4" />, label: "کاراکتر (بدون فاصله)", value: charCountNoSpaces },
    { icon: <Hash className="h-4 w-4" />, label: "کلمه", value: wordCount },
    { icon: <AlignRight className="h-4 w-4" />, label: "جمله", value: sentenceCount },
    { icon: <Pilcrow className="h-4 w-4" />, label: "پاراگراف", value: paragraphCount },
  ];

  const toPersianDigits = (n: number) => n.toLocaleString("fa-IR");

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Hash className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">شمارنده کلمات</h2>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg border border-border bg-background p-3"
              )}
            >
              <div className="text-muted-foreground">{stat.icon}</div>
              <p className="text-2xl font-bold text-primary">{toPersianDigits(stat.value)}</p>
              <p className="text-xs text-muted-foreground text-center">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="متن خود را اینجا بنویسید یا وارد کنید..."
          className="w-full min-h-[200px] rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          dir="rtl"
        />
      </div>
    </div>
  );
}
