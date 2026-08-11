"use client";

import { useState } from "react";
import { Lock, Unlock, Copy, Check, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const encode = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch {
      setOutput("خطا در کدگذاری");
    }
  };

  const decode = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input))));
    } catch {
      setOutput("خطا در رمزگشایی — متن ورودی معتبر نیست");
    }
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Lock className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">کدگذاری و رمزگشایی Base64</h2>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">متن ورودی</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="متن خود را وارد کنید..."
          rows={5}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none font-mono text-sm"
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={encode}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Lock className="h-4 w-4" />
          کدگذاری (Encode)
        </button>
        <button
          onClick={decode}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          <Unlock className="h-4 w-4" />
          رمزگشایی (Decode)
        </button>
      </div>

      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-muted-foreground" />
              <label className="text-sm font-medium text-foreground">نتیجه</label>
            </div>
            <button onClick={copyOutput} className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-muted-foreground hover:bg-accent transition-colors">
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              {copied ? "کپی شد" : "کپی"}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            rows={5}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-foreground resize-none font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}