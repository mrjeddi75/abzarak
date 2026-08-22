"use client";

import { useState } from "react";
import { Heart, MessageCircle, Bookmark, Share2, Users, BarChart3, Info, TrendingUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (n: number): string => {
  try { return n.toLocaleString("fa-IR"); } catch { return String(n); }
};

const PLATFORMS = [
  { id: "instagram", label: "اینستاگرام", benchmarks: { good: 3, great: 6 } },
  { id: "tiktok", label: "تیک‌تاک", benchmarks: { good: 4, great: 8 } },
  { id: "youtube", label: "یوتیوب", benchmarks: { good: 2, great: 5 } },
  { id: "twitter", label: "ایکس (توییتر)", benchmarks: { good: 1, great: 3 } },
];

interface PostData {
  likes: string;
  comments: string;
  saves: string;
  shares: string;
  views: string;
  followers: string;
}

export default function EngagementCalculator() {
  const [platform, setPlatform] = useState("instagram");
  const [posts, setPosts] = useState<PostData[]>([{ likes: "", comments: "", saves: "", shares: "", views: "", followers: "" }]);
  const [showViews, setShowViews] = useState(false);

  const currentBench = PLATFORMS.find((p) => p.id === platform)!.benchmarks;

  const num = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;

  const calcEngagement = (post: PostData) => {
    const followers = num(post.followers);
    if (followers === 0) return null;

    const likes = num(post.likes);
    const comments = num(post.comments);
    const saves = num(post.saves);
    const shares = num(post.shares);

    let rate: number;
    if (showViews && num(post.views) > 0) {
      rate = ((likes + comments + saves + shares) / num(post.views)) * 100;
    } else {
      rate = ((likes + comments + saves + shares) / followers) * 100;
    }

    return {
      rate: Math.min(rate, 100),
      likes,
      comments,
      saves,
      shares,
      total: likes + comments + saves + shares,
    };
  };

  const results = posts.map((p) => calcEngagement(p));
  const avgRate = results.filter(Boolean).length > 0
    ? results.reduce((s, r) => s + (r ? r.rate : 0), 0) / results.filter(Boolean).length
    : 0;

  const getRating = (rate: number) => {
    if (rate >= currentBench.great) return { label: "عالی", color: "text-emerald-500", bg: "bg-emerald-500/10" };
    if (rate >= currentBench.good) return { label: "خوب", color: "text-amber-500", bg: "bg-amber-500/10" };
    return { label: "ضعیف", color: "text-red-500", bg: "bg-red-500/10" };
  };

  const updatePost = (index: number, field: keyof PostData, value: string) => {
    setPosts((prev) => {
      const arr = [...prev];
      arr[index] = { ...arr[index], [field]: value.replace(/[^0-9]/g, "") };
      return arr;
    });
  };

  const addPost = () => {
    setPosts((prev) => [...prev, { likes: "", comments: "", saves: "", shares: "", views: "", followers: prev[0]?.followers || "" }]);
  };

  const removePost = (index: number) => {
    if (posts.length <= 1) return;
    setPosts((prev) => prev.filter((_, i) => i !== index));
  };

  const inputField = (label: string, icon: React.ReactNode, value: string, onChange: (v: string) => void, placeholder: string) => (
    <div className="space-y-1">
      <label className="text-[10px] text-muted-foreground flex items-center gap-1">{icon} {label}</label>
      <input
        type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} dir="ltr"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">محاسبه‌گر نرخ تعامل</h2>
      </div>

      {/* Platform & Settings */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id} onClick={() => setPlatform(p.id)}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs transition-all",
                  platform === p.id ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:border-primary/30"
                )}
              >{p.label}</button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer mr-auto">
            <input type="checkbox" checked={showViews} onChange={(e) => setShowViews(e.target.checked)} className="accent-primary" />
            محاسبه بر اساس بازدید (Views)
          </label>
        </div>

        {/* Benchmark info */}
        <div className="flex gap-3 text-[10px]">
          <span className="rounded-full bg-emerald-500/10 text-emerald-500 px-3 py-1">عالی: {toPersianDigits(currentBench.great)}%+</span>
          <span className="rounded-full bg-amber-500/10 text-amber-500 px-3 py-1">خوب: {toPersianDigits(currentBench.good)}%+</span>
          <span className="rounded-full bg-red-500/10 text-red-500 px-3 py-1">ضعیف: زیر {toPersianDigits(currentBench.good)}%</span>
        </div>
      </div>

      {/* Post inputs */}
      {posts.map((post, idx) => {
        const result = results[idx];
        const rating = result ? getRating(result.rate) : null;
        return (
          <div key={idx} className="glass-card hover-glow p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">پست {toPersianDigits(idx + 1)}</span>
            <div className="flex items-center gap-2">
              {result && (
                <span className={cn("rounded-full px-3 py-1 text-xs font-bold", rating?.bg, rating?.color)}>
                  {rating?.label} — {result.rate.toFixed(2)}%
                </span>
              )}
              {posts.length > 1 && (
                <button onClick={() => removePost(idx)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <ArrowDown className="h-4 w-4 rotate-180" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {inputField("دنبال‌کننده", <Users className="h-3 w-3" />, post.followers, (v) => updatePost(idx, "followers", v), "10000")}
            {inputField("لایک", <Heart className="h-3 w-3" />, post.likes, (v) => updatePost(idx, "likes", v), "500")}
            {inputField("کامنت", <MessageCircle className="h-3 w-3" />, post.comments, (v) => updatePost(idx, "comments", v), "50")}
            {inputField("ذخیره", <Bookmark className="h-3 w-3" />, post.saves, (v) => updatePost(idx, "saves", v), "100")}
            {inputField("اشتراک", <Share2 className="h-3 w-3" />, post.shares, (v) => updatePost(idx, "shares", v), "20")}
            {showViews && inputField("بازدید", <TrendingUp className="h-3 w-3" />, post.views, (v) => updatePost(idx, "views", v), "5000")}
          </div>

          {/* Mini bar */}
          {result && (
            <div className="space-y-1">
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", result.rate >= currentBench.great ? "bg-emerald-500" : result.rate >= currentBench.good ? "bg-amber-500" : "bg-red-500")}
                  style={{ width: Math.min(result.rate * 5, 100) + "%" }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>کل تعاملات: {toPersianDigits(result.total)}</span>
                <span>نرخ: {result.rate.toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>
        );
      })}

      {/* Add post button */}
      <button
        onClick={addPost}
        className="w-full glass-card hover-glow p-3 text-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        + افزودن پست دیگر برای میانگین‌گیری
      </button>

      {/* Average */}
      {results.filter(Boolean).length > 0 && (
        <div className="glass-card glow-effect p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">میانگین نرخ تعامل</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {toPersianDigits(results.filter(Boolean).length)} پست — {PLATFORMS.find((p) => p.id === platform)?.label}
              </p>
            </div>
            <div className="text-left">
              <p className={cn("text-3xl font-bold", getRating(avgRate).color)}>{avgRate.toFixed(2)}%</p>
              <p className={cn("text-xs font-medium", getRating(avgRate).color)}>{getRating(avgRate).label}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/50 p-3 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
        <span>
          نرخ تعامل = (لایک + کامنت + ذخیره + اشتراک) / دنبال‌کننده × ۱۰۰.
          میانگین جهانی اینستاگرام حدود ۱.۵٪ تا ۳٪ است. نرخ بالای ۶٪ عالی محسوب می‌شود.
        </span>
      </div>
    </div>
  );
}
