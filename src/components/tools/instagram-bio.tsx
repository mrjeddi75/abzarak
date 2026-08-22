"use client";

import { useState } from "react";
import { Instagram, Copy, Check, RefreshCw, Sparkles, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const STYLES = [
  { id: "minimal", label: "مینیمال", icon: "✨" },
  { id: "professional", label: "حرفه‌ای", icon: "💼" },
  { id: "creative", label: "خلاقانه", icon: "🎨" },
  { id: "emoji", label: "ایموجی‌دار", icon: "😊" },
];

const SEPARATORS = ["•", "✦", "|", "⟡", "◆", "♡", "→", "★"];

const FONTS = ["معمولی", "𝑩𝒐𝒍𝒅", "𝕮𝖔𝖔𝖑", "𝒯𝒽𝒾𝓃", "Sᴍᴀʟʟ"];

const ROLES = [
  "برنامه‌نویس", "طراح UI/UX", "عکاس", "تولیدکننده محتوا",
  "بلاگر", "پادکستر", "آشپز", "ورزشکار",
  "نویسنده", "هنرمند", "موسیقیدان", "کارآفرین",
  "دانشجو", "معلم", "مهندس", "طراح گرافیک",
  "دیجیتال مارکتر", "سئو کار", "فریلنسر", "تحلیلگر داده",
];

const applyFont = (text: string, fontIndex: number): string => {
  if (fontIndex === 0) return text;
  const map: Record<string, string> = {};
  const boldMap: Record<string, string> = {
    a: "𝒂", b: "𝒃", c: "𝒄", d: "𝒅", e: "𝒆", f: "𝒇", g: "𝒈",
    h: "𝒉", i: "𝒊", j: "𝒋", k: "𝒌", l: "𝒍", m: "𝒎", n: "𝒏",
    o: "𝒐", p: "𝒑", q: "𝒒", r: "𝒓", s: "𝒔", t: "𝒕",
    u: "𝒖", v: "𝒗", w: "𝒘", x: "𝒙", y: "𝒚", z: "𝒛",
    A: "𝑨", B: "𝑩", C: "𝑪", D: "𝑫", E: "𝑬", F: "𝑭", G: "𝑮",
    H: "𝑯", I: "𝑰", J: "𝑱", K: "𝑲", L: "𝑳", M: "𝑴", N: "𝑵",
    O: "𝑶", P: "𝑷", Q: "𝑸", R: "𝑹", S: "𝑺", T: "𝑻",
    U: "𝑼", V: "𝑽", W: "𝑾", X: "𝑿", Y: "𝒀", Z: "𝒁",
  };
  const coolMap: Record<string, string> = {
    a: "𝖆", b: "𝖇", c: "𝖈", d: "𝖉", e: "𝖊", f: "𝖋", g: "𝖌",
    h: "𝖍", i: "𝖎", j: "𝖏", k: "𝖐", l: "𝖑", m: "𝖒", n: "𝖓",
    o: "𝖔", p: "𝖕", q: "𝖖", r: "𝖗", s: "𝖘", t: "𝖙",
    u: "𝖚", v: "𝖛", w: "𝖜", x: "𝖝", y: "𝖞", z: "𝖟",
    A: "𝕬", B: "𝕭", C: "𝕮", D: "𝕯", E: "𝕰", F: "𝕱", G: "𝕲",
    H: "𝕳", I: "𝕴", J: "𝕵", K: "𝕶", L: "𝕷", M: "𝕸", N: "𝕹",
    O: "𝕺", P: "𝕻", Q: "𝕼", R: "𝕽", S: "𝕾", T: "𝕿",
    U: "𝖀", V: "𝖁", W: "𝖂", X: "𝖃", Y: "𝖄", Z: "𝖅",
  };
  const thinMap: Record<string, string> = {
    a: "𝒶", b: "𝒷", c: "𝒸", d: "𝒹", e: "ℯ", f: "𝒻", g: "ℊ",
    h: "𝒽", i: "𝒾", j: "𝒿", k: "𝓀", l: "𝓁", m: "𝓂", n: "𝓃",
    o: "ℴ", p: "𝓅", q: "𝓆", r: "𝓇", s: "𝓈", t: "𝓉",
    u: "𝓊", v: "𝓋", w: "𝓌", x: "𝓍", y: "𝓎", z: "𝓏",
    A: "𝒜", B: "ℬ", C: "𝒞", D: "𝒟", E: "ℰ", F: "ℱ", G: "𝒢",
    H: "ℋ", I: "ℐ", J: "𝒥", K: "𝒦", L: "ℒ", M: "ℳ", N: "𝒩",
    O: "𝒪", P: "𝒫", Q: "𝒬", R: "ℛ", S: "𝒮", T: "𝒯",
    U: "𝒰", V: "𝒱", W: "𝒲", X: "𝒳", Y: "𝒴", Z: "𝒵",
  };
  const smallMap: Record<string, string> = {
    a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ",
    h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ",
    o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "ꜱ", t: "ᴛ",
    u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
    A: "ᴬ", B: "ᴮ", C: "ᶜ", D: "ᴰ", E: "ᴱ", F: "ᶠ", G: "ᴳ",
    H: "ᴴ", I: "ᴵ", J: "ᴶ", K: "ᴷ", L: "ᴸ", M: "ᴹ", N: "ᴺ",
    O: "ᴼ", P: "ᴾ", Q: "Q", R: "ᴿ", S: "ˢ", T: "ᵀ",
    U: "ᵁ", V: "ⱽ", W: "ᵂ", X: "ˣ", Y: "ʸ", Z: "ᶻ",
  };
  const maps = [boldMap, coolMap, thinMap, smallMap];
  const selectedMap = maps[fontIndex - 1] || {};
  return text
    .split("")
    .map((ch) => selectedMap[ch] || ch)
    .join("");
};

const generateBio = (
  name: string,
  role: string,
  customRole: string,
  interests: string,
  cta: string,
  separator: string,
  style: string
): string[] => {
  const r = customRole || role;
  const interestList = interests
    .split(/[،,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const lines: string[] = [];

  if (style === "minimal") {
    if (name) lines.push(name);
    if (r) lines.push(r);
    if (interestList.length > 0) {
      lines.push(interestList.join(" " + separator + " "));
    }
    if (cta) lines.push("" + cta);
  } else if (style === "professional") {
    if (name) lines.push("📌 " + name);
    if (r) lines.push("💼 " + r);
    if (interestList.length > 0) {
      lines.push("🔑 " + interestList.join(" | "));
    }
    if (cta) lines.push("📩 " + cta);
  } else if (style === "creative") {
    if (name) lines.push("✧ " + name + " ✧");
    if (r) lines.push("" + r + " " + separator);
    if (interestList.length > 0) {
      lines.push(interestList.map((i) => "  ‎" + i).join("\n"));
    }
    if (cta) lines.push("" + separator + " " + cta);
  } else if (style === "emoji") {
    if (name) lines.push("🌟 " + name + " 🌟");
    if (r) lines.push("" + r);
    if (interestList.length > 0) {
      const emojis = ["❤️", "💜", "💙", "💚", "🧡", "💛", "🤍", "🖤"];
      lines.push(
        interestList
          .map((i, idx) => emojis[idx % emojis.length] + " " + i)
          .join("\n")
      );
    }
    if (cta) lines.push("👇 " + cta);
  }

  return lines;
};

export default function InstagramBio() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [interests, setInterests] = useState("");
  const [cta, setCta] = useState("");
  const [separator, setSeparator] = useState("•");
  const [style, setStyle] = useState("minimal");
  const [fontIndex, setFontIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [bioLines, setBioLines] = useState<string[]>([]);

  const handleGenerate = () => {
    const lines = generateBio(name, role, customRole, interests, cta, separator, style);
    setBioLines(lines);
  };

  const handleRandomize = () => {
    const randomSep = SEPARATORS[Math.floor(Math.random() * SEPARATORS.length)];
    const randomStyle = STYLES[Math.floor(Math.random() * STYLES.length)].id;
    setSeparator(randomSep);
    setStyle(randomStyle);
  };

  const handleCopy = async () => {
    const text = bioLines.map((line) => applyFont(line, fontIndex)).join("\n");
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Instagram className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تولیدکننده بیو اینستاگرام</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="glass-card p-5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">نام یا نام مستعار</label>
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="مثلاً: علی"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">شغل یا تخصص</label>
            <select
              value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">انتخاب کنید...</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <input
              type="text" value={customRole} onChange={(e) => setCustomRole(e.target.value)}
              placeholder="یا شغل خود را بنویسید..."
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              علاقه‌مندی‌ها <span className="text-muted-foreground font-normal">(با کاما جدا کنید)</span>
            </label>
            <input
              type="text" value={interests} onChange={(e) => setInterests(e.target.value)}
              placeholder="مثلاً: تکنولوژی، فوتبال، آشپزی"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              لینک یا دعوت به اقدام (CTA)
            </label>
            <input
              type="text" value={cta} onChange={(e) => setCta(e.target.value)}
              placeholder="مثلاً: linktr.ee/ali"
              dir="ltr"
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Style */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">سبک</label>
            <div className="grid grid-cols-4 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id} onClick={() => setStyle(s.id)}
                  className={cn(
                    "rounded-lg border p-2 text-xs text-center transition-all",
                    style === s.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <div className="text-lg mb-0.5">{s.icon}</div>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Separator */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">جداکننده</label>
            <div className="flex flex-wrap gap-2">
              {SEPARATORS.map((sep) => (
                <button
                  key={sep} onClick={() => setSeparator(sep)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm transition-all",
                    separator === sep
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/30 text-muted-foreground"
                  )}
                >
                  {sep}
                </button>
              ))}
            </div>
          </div>

          {/* Font */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">فونت</label>
            <select
              value={fontIndex} onChange={(e) => setFontIndex(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {FONTS.map((f, i) => (
                <option key={i} value={i}>{f}</option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Sparkles className="h-4 w-4" />
              تولید بیو
            </button>
            <button
              onClick={handleRandomize}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              title="تصادفی"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div className="glass-card glow-effect p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-foreground">پیش‌نمایش بیو</span>
              {bioLines.length > 0 && (
                <button
                  onClick={handleCopy}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all",
                    copied
                      ? "border-green-500/30 bg-green-500/10 text-green-500"
                      : "border-border hover:border-primary/30 text-muted-foreground"
                  )}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "کپی شد!" : "کپی"}
                </button>
              )}
            </div>

            {/* Phone mockup */}
            <div className="mx-auto max-w-[280px] rounded-2xl border border-border bg-background p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-lg text-primary">
                  {name ? name.charAt(0) : "?"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">
                    {name ? applyFont(name, fontIndex) : "نام شما"}
                  </p>
                  {bioLines.length > 0 ? (
                    <div className="text-[10px] text-muted-foreground mt-0.5 whitespace-pre-line leading-relaxed">
                      {bioLines
                        .filter((_, i) => i > 0)
                        .map((line) => applyFont(line, fontIndex))
                        .join("\n")}
                    </div>
                  ) : (
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      بیو اینجا نمایش داده می‌شود...
                    </p>
                  )}
                </div>
              </div>

              {/* Stats mockup */}
              <div className="flex justify-center gap-8 pt-2 border-t border-border">
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">۰</p>
                  <p className="text-[10px] text-muted-foreground">پست</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">۰</p>
                  <p className="text-[10px] text-muted-foreground">دنبال‌کننده</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-foreground">۰</p>
                  <p className="text-[10px] text-muted-foreground">دنبال‌شده</p>
                </div>
              </div>
            </div>

            {/* Text output */}
            {bioLines.length > 0 && (
              <div className="mt-4 rounded-lg bg-background/60 border border-border p-3">
                <p className="text-[10px] text-muted-foreground mb-1.5">متن بیو (برای کپی):</p>
                <p className="text-xs text-foreground whitespace-pre-line leading-relaxed font-mono">
                  {bioLines.map((line) => applyFont(line, fontIndex)).join("\n")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/50 p-3 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
        <span>بیو اینستاگرام حداکثر ۱۵۰ کاراکتر است. سعی کنید بیوی کوتاه و جذاب بنویسید.</span>
      </div>
    </div>
  );
}
