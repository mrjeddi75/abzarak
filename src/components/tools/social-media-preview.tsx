"use client";

import { useState } from "react";
import { Eye, Info, ImagePlus, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const PLATFORMS = [
  { id: "twitter", label: "ایکس (توییتر)", color: "#000000", maxChars: 280, icon: "X" },
  { id: "linkedin", label: "لینکدین", color: "#0A66C2", maxChars: 3000, icon: "in" },
  { id: "instagram", label: "اینستاگرام", color: "#E4405F", maxChars: 2200, icon: "IG" },
  { id: "facebook", label: "فیسبوک", color: "#1877F2", maxChars: 63206, icon: "f" },
];

const toPersianDigits = (n: number): string => {
  try { return n.toLocaleString("fa-IR"); } catch { return String(n); }
};

export default function SocialMediaPreview() {
  const [text, setText] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [linkTitle, setLinkTitle] = useState("");
  const [linkDesc, setLinkDesc] = useState("");
  const [linkDomain, setLinkDomain] = useState("");
  const [platform, setPlatform] = useState("twitter");
  const [hasImage, setHasImage] = useState(true);
  const [hasLink, setHasLink] = useState(false);

  const current = PLATFORMS.find((p) => p.id === platform)!;
  const charCount = text.length;
  const charPercent = Math.min((charCount / current.maxChars) * 100, 100);
  const isOverLimit = charCount > current.maxChars;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Eye className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">پیش‌نمایش پست شبکه‌های اجتماعی</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="glass-card p-5 space-y-4">
          {/* Platform tabs */}
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs transition-all",
                  platform === p.id
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-primary/30"
                )}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Display name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">نام نمایشی</label>
            <input
              type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)}
              placeholder="علی محمدی"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">نام کاربری</label>
            <input
              type="text" value={username} onChange={(e) => setUsername(e.target.value)}
              placeholder="ali_mhd"
              dir="ltr"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Post text */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium text-foreground">متن پست</label>
              <span className={cn("text-xs", isOverLimit ? "text-red-500 font-bold" : "text-muted-foreground")}>
                {toPersianDigits(charCount)} / {toPersianDigits(current.maxChars)}
              </span>
            </div>
            <textarea
              value={text} onChange={(e) => setText(e.target.value)}
              placeholder="متن پست خود را بنویسید..."
              rows={4}
              className={cn(
                "w-full rounded-lg border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 resize-none",
                isOverLimit ? "border-red-500" : "border-border"
              )}
            />
            <div className="h-1.5 rounded-full bg-border overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", isOverLimit ? "bg-red-500" : charPercent > 80 ? "bg-amber-500" : "bg-primary")}
                style={{ width: Math.min(charPercent, 100) + "%" }}
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={hasImage} onChange={(e) => setHasImage(e.target.checked)} className="accent-primary" />
              تصویر
            </label>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={hasLink} onChange={(e) => setHasLink(e.target.checked)} className="accent-primary" />
              لینک
            </label>
          </div>

          {/* Link preview fields */}
          {hasLink && (
            <div className="space-y-3 p-3 rounded-lg border border-border bg-background/50">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <LinkIcon className="h-4 w-4 text-primary" />
                پیش‌نمایش لینک
              </div>
              <input type="text" value={linkTitle} onChange={(e) => setLinkTitle(e.target.value)} placeholder="عنوان لینک" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="text" value={linkDesc} onChange={(e) => setLinkDesc(e.target.value)} placeholder="توضیحات لینک" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              <input type="text" value={linkDomain} onChange={(e) => setLinkDomain(e.target.value)} placeholder="example.com" dir="ltr" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          )}
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="glass-card glow-effect p-5">
            <span className="text-sm font-medium text-foreground mb-4 block">پیش‌نمایش — {current.label}</span>

            <div className="max-w-[340px] mx-auto">
              {/* Twitter/X */}
              {platform === "twitter" && (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="p-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                        {displayName ? displayName.charAt(0) : "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-bold text-foreground truncate">{displayName || "نام شما"}</p>
                          <svg className="h-4 w-4 text-primary shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81C14.67 2.63 13.43 1.75 12 1.75s-2.67.88-3.34 2.19c-1.39-.46-2.9-.2-3.91.81s-1.27 2.52-.81 3.91C2.63 9.33 1.75 10.57 1.75 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.9.81 3.91s2.52 1.27 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.07 4.83l-3.54-3.54 1.41-1.41 2.12 2.12 4.24-4.24 1.41 1.41-5.64 5.66z"/></svg>
                        </div>
                        <p className="text-xs text-muted-foreground" dir="ltr">@{username || "username"}</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{text || "متن پست شما اینجا نمایش داده می‌شود..."}</p>
                    {hasImage && (
                      <div className="rounded-xl border border-border bg-muted/30 h-48 flex items-center justify-center">
                        <ImagePlus className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    )}
                    {hasLink && (
                      <div className="rounded-xl border border-border overflow-hidden">
                        <div className="h-24 bg-muted/30 flex items-center justify-center">
                          <ImagePlus className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                        <div className="p-3 bg-background/50">
                          <p className="text-xs text-muted-foreground" dir="ltr">{linkDomain || "example.com"}</p>
                          <p className="text-sm font-medium text-foreground mt-0.5 truncate">{linkTitle || "عنوان لینک"}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{linkDesc || "توضیحات لینک"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* LinkedIn */}
              {platform === "linkedin" && (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="p-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="h-12 w-12 rounded-full bg-[#0A66C2]/20 flex items-center justify-center text-sm font-bold text-[#0A66C2] shrink-0">
                        {displayName ? displayName.charAt(0) : "?"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{displayName || "نام شما"}</p>
                        <p className="text-xs text-muted-foreground">عنوان شغلی شما</p>
                        <p className="text-[10px] text-muted-foreground">just now</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{text || "متن پست شما اینجا نمایش داده می‌شود..."}</p>
                    {hasImage && (
                      <div className="rounded-lg border border-border bg-muted/30 h-48 flex items-center justify-center">
                        <ImagePlus className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    )}
                    {hasLink && (
                      <div className="rounded-lg border border-border overflow-hidden">
                        <div className="h-20 bg-muted/30 flex items-center justify-center">
                          <ImagePlus className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-muted-foreground" dir="ltr">{linkDomain || "example.com"}</p>
                          <p className="text-sm font-medium text-foreground mt-0.5 truncate">{linkTitle || "عنوان لینک"}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{linkDesc || "توضیحات لینک"}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-4 pt-2 border-t border-border text-xs text-muted-foreground">
                      <span>لایک</span><span>کامنت</span><span>ریپوست</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Instagram */}
              {platform === "instagram" && (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="flex gap-3 p-4">
                    <div className="h-8 w-8 rounded-full bg-[#E4405F]/20 flex items-center justify-center text-xs font-bold text-[#E4405F] shrink-0">
                      {displayName ? displayName.charAt(0) : "?"}
                    </div>
                    <p className="text-sm font-bold text-foreground">{displayName || "نام شما"}</p>
                  </div>
                  {hasImage && (
                    <div className="aspect-square bg-muted/30 flex items-center justify-center">
                      <ImagePlus className="h-12 w-12 text-muted-foreground/40" />
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <div className="flex gap-3 text-sm">
                      <span>♡</span><span>کامنت</span><span>اشتراک</span>
                    </div>
                    <div className="flex gap-2">
                      <p className="text-sm font-bold text-foreground">{displayName || "نام شما"}</p>
                      <p className="text-sm text-foreground">{text || "متن پست شما..."}</p>
                    </div>
                    {hasLink && (
                      <p className="text-sm text-[#00376B]" dir="ltr">{linkDomain || "link in bio"}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Facebook */}
              {platform === "facebook" && (
                <div className="rounded-xl border border-border overflow-hidden">
                  <div className="p-4 space-y-3">
                    <div className="flex gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#1877F2]/20 flex items-center justify-center text-sm font-bold text-[#1877F2] shrink-0">
                        {displayName ? displayName.charAt(0) : "?"}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{displayName || "نام شما"}</p>
                        <p className="text-[10px] text-muted-foreground">just now</p>
                      </div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{text || "متن پست شما اینجا نمایش داده می‌شود..."}</p>
                    {hasImage && (
                      <div className="rounded-lg border border-border bg-muted/30 h-48 flex items-center justify-center">
                        <ImagePlus className="h-8 w-8 text-muted-foreground/40" />
                      </div>
                    )}
                    {hasLink && (
                      <div className="rounded-lg border border-border overflow-hidden">
                        <div className="h-20 bg-muted/30 flex items-center justify-center">
                          <ImagePlus className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                        <div className="p-3">
                          <p className="text-xs text-muted-foreground" dir="ltr">{linkDomain || "example.com"}</p>
                          <p className="text-sm font-medium text-foreground mt-0.5 truncate">{linkTitle || "عنوان لینک"}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{linkDesc || "توضیحات لینک"}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-6 pt-2 border-t border-border text-xs text-muted-foreground">
                      <span>لایک</span><span>کامنت</span><span>اشتراک</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/50 p-3 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
        <span>این پیش‌نمایش تقریبی است و ممکن است با نمایش واقعی در پلتفرم‌ها تفاوت جزئی داشته باشد.</span>
      </div>
    </div>
  );
}
