"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Search, Replace, ReplaceAll, ArrowRight } from "lucide-react";

export default function FindReplace() {
  const [text, setText] = useState("");
  const [findStr, setFindStr] = useState("");
  const [replaceStr, setReplaceStr] = useState("");
  const [result, setResult] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(-1);
  const [caseSensitive, setCaseSensitive] = useState(false);

  const countMatches = useCallback(
    (input: string) => {
      if (!findStr || !input) {
        setMatchCount(0);
        setCurrentMatch(-1);
        return 0;
      }
      const flags = caseSensitive ? "g" : "gi";
      const escaped = findStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, flags);
      const matches = input.match(regex);
      const count = matches ? matches.length : 0;
      setMatchCount(count);
      return count;
    },
    [findStr, caseSensitive]
  );

  const handleFindNext = useCallback(() => {
    const input = result || text;
    if (!findStr || !input) return;
    const flags = caseSensitive ? "g" : "gi";
    const escaped = findStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, flags);
    let nextIdx = currentMatch + 1;
    if (nextIdx >= matchCount) nextIdx = 0;
    setCurrentMatch(nextIdx);
    countMatches(input);
  }, [findStr, text, result, caseSensitive, currentMatch, matchCount, countMatches]);

  const handleReplace = useCallback(() => {
    const input = result || text;
    if (!findStr || !input) return;
    const flags = caseSensitive ? "" : "i";
    const escaped = findStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, flags);
    const newResult = input.replace(regex, replaceStr);
    setResult(newResult);
    countMatches(newResult);
  }, [findStr, replaceStr, text, result, caseSensitive, countMatches]);

  const handleReplaceAll = useCallback(() => {
    const input = result || text;
    if (!findStr || !input) return;
    const flags = caseSensitive ? "g" : "gi";
    const escaped = findStr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, flags);
    const newResult = input.replace(regex, replaceStr);
    setResult(newResult);
    countMatches(newResult);
  }, [findStr, replaceStr, text, result, caseSensitive, countMatches]);

  const handleTextChange = (value: string) => {
    setText(value);
    setResult("");
    setMatchCount(0);
    setCurrentMatch(-1);
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          متن ورودی
        </label>
        <textarea
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          className={cn(
            "w-full h-40 rounded-lg border border-border bg-card p-3 text-foreground",
            "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          )}
          placeholder="متن خود را اینجا وارد کنید..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            جستجو برای
          </label>
          <input
            type="text"
            value={findStr}
            onChange={(e) => {
              setFindStr(e.target.value);
              setMatchCount(0);
              setCurrentMatch(-1);
            }}
            className={cn(
              "w-full rounded-lg border border-border bg-card p-3 text-foreground",
              "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
            placeholder="عبارت جستجو..."
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            جایگزینی با
          </label>
          <input
            type="text"
            value={replaceStr}
            onChange={(e) => setReplaceStr(e.target.value)}
            className={cn(
              "w-full rounded-lg border border-border bg-card p-3 text-foreground",
              "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
            placeholder="عبارت جایگزین..."
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="rounded border-border"
          />
          حساس به حروف بزرگ و کوچک
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleFindNext}
          disabled={!findStr}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            "bg-primary text-primary-foreground hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Search className="w-4 h-4" />
          جستجوی بعدی
        </button>
        <button
          onClick={handleReplace}
          disabled={!findStr}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            "bg-card border border-border text-foreground hover:bg-muted",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Replace className="w-4 h-4" />
          جایگزینی
        </button>
        <button
          onClick={handleReplaceAll}
          disabled={!findStr}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            "bg-card border border-border text-foreground hover:bg-muted",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <ReplaceAll className="w-4 h-4" />
          جایگزینی همه
        </button>

        {matchCount > 0 && (
          <span className="text-sm text-muted-foreground mr-auto">
            {matchCount} نتیجه یافت شد
            {currentMatch >= 0 && (
              <span className="text-primary mr-1">
                (نتیجه {currentMatch + 1})
              </span>
            )}
          </span>
        )}
      </div>

      {result && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            نتیجه
          </label>
          <textarea
            value={result}
            readOnly
            className={cn(
              "w-full h-40 rounded-lg border border-border bg-card p-3 text-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary/50"
            )}
          />
        </div>
      )}
    </div>
  );
}
