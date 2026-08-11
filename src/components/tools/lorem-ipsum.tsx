"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FileText, RefreshCw, Copy, Check } from "lucide-react";

const persianParagraphs: string[] = [
  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد. کتاب‌های زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می‌طلبد.",

  "تا با نرم‌افزارها شناخت بیشتری را برای طراحان رایانه‌ای علی‌الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد. در این صورت می‌توان امید داشت که تمام و دشواری موجود در ارائه راهکارها و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساساً مورد استفاده قرار گیرد.",

  "از آنجا که لورم ایپسوم به عنوان متن آزمایشی و استاندارد صنعت چاپ از قرن پانزدهم میلادی تاکنون مورد استفاده قرار گرفته است، این متن نه تنها الگوی ثابتی در طول این سال‌ها بوده، بلکه با پیشرفت تکنولوژی و تغییرات در ابزارهای چاپ و صفحه‌آرایی، به شکل‌های مختلفی بازنویسی و تطبیق داده شده است.",

  "طراحان وب‌سایت و توسعه‌دهندگان نرم‌افزار همواره به دنبال ابزارهایی هستند که بتوانند با استفاده از آن‌ها، ظاهر و احساس نهایی محصول خود را به بهترین شکل ممکن به نمایش بگذارند. استفاده از متن‌های واقعی در مراحل اولیه طراحی ممکن است باعث حواس‌پرتی مخاطب شود و تمرکز را از عناصر بصری و ساختاری صفحه دور سازد.",

  "در دنیای دیجیتال امروز، تجربه کاربری یکی از مهم‌ترین عوامل موفقیت یک محصول آنلاین است. متن‌های جایگزین مانند لورم ایپسوم به طراحان اجازه می‌دهند تا ساختار کلی صفحه را بدون نگرانی از محتوای نهایی بسنجند و اصلاحات لازم را پیش از تولید محتوای واقعی اعمال نمایند. این رویکرد هم زمان و هزینه را کاهش می‌دهد و هم کیفیت نهایی را بالا می‌برد.",

  "زبان فارسی با دارا بودن قدمتی چند هزار ساله، یکی از غنی‌ترین زبان‌های جهان از نظر ادبیات و表达能力 است. استفاده از متن‌های فارسی در طراحی وب‌سایت‌ها و اپلیکیشن‌ها، اهمیت ویژه‌ای دارد زیرا ویژگی‌های منحصر به فرد این زبان مانند نوشتن از راست به چپ و حروف پیوسته، چالش‌های خاصی را برای طراحان ایجاد می‌کند.",

  "با گسترش روزافزون استفاده از اینترنت و فضای مجازی در ایران و کشورهای فارسی‌زبان، نیاز به ابزارها و منابعی که از زبان فارسی پشتیبانی کنند، بیش از پیش احساس می‌شود. تولید محتوا، طراحی رابط کاربری و توسعه نرم‌افزارهای بومی همگی نیازمند درک عمیقی از ساختار و زیبایی‌شناسی زبان فارسی هستند.",
];

function generateParagraphs(count: number): string {
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(persianParagraphs[i % persianParagraphs.length]);
  }
  return result.join("\n\n");
}

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    setText(generateParagraphs(count));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[var(--color-foreground)]">
            تعداد پاراگراف
          </label>
          <select
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className={cn(
              "rounded-lg border px-4 py-2.5 text-sm",
              "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)]"
            )}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          className={cn(
            "flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium",
            "text-[var(--color-primary-foreground)] transition-colors",
            "hover:bg-[var(--color-primary)]/90"
          )}
        >
          <FileText className="h-4 w-4" />
          تولید متن
        </button>

        <button
          onClick={handleGenerate}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium",
            "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)]",
            "transition-colors hover:bg-[var(--color-accent)]"
          )}
        >
          <RefreshCw className="h-4 w-4" />
          تصادفی
        </button>

        {text && (
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium",
              "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-card-foreground)]",
              "transition-colors hover:bg-[var(--color-accent)]"
            )}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "کپی شد!" : "کپی متن"}
          </button>
        )}
      </div>

      {/* Output */}
      {text ? (
        <div
          className={cn(
            "rounded-xl border p-6 leading-8",
            "border-[var(--color-border)] bg-[var(--color-card)]",
            "text-[var(--color-card-foreground)]"
          )}
          dir="rtl"
        >
          {text.split("\n\n").map((paragraph, index) => (
            <p
              key={index}
              className={cn(
                index < text.split("\n").length - 1 && "mb-6"
              )}
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-16",
            "border-[var(--color-border)] text-[var(--color-muted-foreground)]"
          )}
        >
          <FileText className="h-10 w-10" />
          <p className="text-sm">
            تعداد پاراگراف مورد نظر را انتخاب کرده و دکمه «تولید متن» را بزنید
          </p>
        </div>
      )}
    </div>
  );
}
