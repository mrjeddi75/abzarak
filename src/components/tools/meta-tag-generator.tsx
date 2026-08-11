"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Code2, Copy, RotateCcw } from "lucide-react";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = useCallback(() => {
    const tags: string[] = [];

    if (title) {
      tags.push(`<title>${title}</title>`);
      tags.push(`<meta name="title" content="${title}" />`);
      tags.push(`<meta property="og:title" content="${title}" />`);
      tags.push(`<meta name="twitter:title" content="${title}" />`);
    }
    if (description) {
      tags.push(`<meta name="description" content="${description}" />`);
      tags.push(`<meta property="og:description" content="${description}" />`);
      tags.push(`<meta name="twitter:description" content="${description}" />`);
    }
    if (keywords) {
      tags.push(`<meta name="keywords" content="${keywords}" />`);
    }
    if (author) {
      tags.push(`<meta name="author" content="${author}" />`);
    }
    if (canonicalUrl) {
      tags.push(`<link rel="canonical" href="${canonicalUrl}" />`);
      tags.push(`<meta property="og:url" content="${canonicalUrl}" />`);
    }
    if (ogImage) {
      tags.push(`<meta property="og:image" content="${ogImage}" />`);
      tags.push(`<meta name="twitter:image" content="${ogImage}" />`);
    }
    tags.push(`<meta property="og:type" content="website" />`);
    tags.push(`<meta name="twitter:card" content="summary_large_image" />`);

    setGeneratedCode(tags.join("\n"));
  }, [title, description, keywords, author, canonicalUrl, ogImage]);

  const handleCopy = async () => {
    if (!generatedCode) return;
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setKeywords("");
    setAuthor("");
    setCanonicalUrl("");
    setOgImage("");
    setGeneratedCode("");
  };

  const fields = [
    { label: "عنوان صفحه (Title)", value: title, setter: setTitle, placeholder: "عنوان وبسایت شما" },
    { label: "توضیحات (Description)", value: description, setter: setDescription, placeholder: "توضیح کوتاه درباره صفحه" },
    { label: "کلمات کلیدی (Keywords)", value: keywords, setter: setKeywords, placeholder: "کلمه۱, کلمه۲, کلمه۳" },
    { label: "نویسنده (Author)", value: author, setter: setAuthor, placeholder: "نام نویسنده" },
    { label: "آدرس اصلی (Canonical URL)", value: canonicalUrl, setter: setCanonicalUrl, placeholder: "https://example.com/page" },
    { label: "تصویر OG (og:image)", value: ogImage, setter: setOgImage, placeholder: "https://example.com/image.jpg" },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.label} className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
            <input
              type="text"
              value={f.value}
              onChange={(e) => f.setter(e.target.value)}
              className={cn(
                "w-full rounded-lg border border-border bg-card p-2.5 text-foreground text-sm",
                "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              )}
              placeholder={f.placeholder}
              dir="auto"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleGenerate}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90"
          )}
        >
          <Code2 className="w-4 h-4" />
          تولید متا تگ‌ها
        </button>
        <button
          onClick={handleReset}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
            "bg-card border border-border text-foreground hover:bg-muted"
          )}
        >
          <RotateCcw className="w-4 h-4" />
          بازنشانی
        </button>
      </div>

      {generatedCode && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">کد تولید شده</label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copied ? "کپی شد!" : "کپی"}
            </button>
          </div>
          <pre
            className={cn(
              "w-full rounded-lg border border-border bg-card p-4 text-foreground font-mono text-xs overflow-x-auto",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
            dir="ltr"
          >
            {generatedCode}
          </pre>
        </div>
      )}
    </div>
  );
}
