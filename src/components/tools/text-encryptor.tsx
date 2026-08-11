"use client";

import { useState } from "react";
import { Shield, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const caesarCipher = (text: string, shift: number, decrypt: boolean): string => {
  const s = decrypt ? -shift : shift;
  return text
    .split("")
    .map((ch) => {
      const code = ch.charCodeAt(0);
      // Uppercase A-Z
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + s + 26) % 26) + 65);
      }
      // Lowercase a-z
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + s + 26) % 26) + 97);
      }
      return ch;
    })
    .join("");
};

export default function TextEncryptor() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [shift, setShift] = useState(3);
  const [copied, setCopied] = useState(false);

  const handleEncrypt = () => {
    setOutput(caesarCipher(input, shift, false));
    setCopied(false);
  };

  const handleDecrypt = () => {
    setOutput(caesarCipher(input, shift, true));
    setCopied(false);
  };

  const handleEncodeBase64 = () => {
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch {
      setOutput("خطا در کدگذاری");
    }
    setCopied(false);
  };

  const handleDecodeBase64 = () => {
    try {
      setOutput(decodeURIComponent(escape(atob(input.trim()))));
    } catch {
      setOutput("خطا در رمزگشایی — متن ورودی معتبر نیست");
    }
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actions = [
    { label: "رمزگذاری سزار", onClick: handleEncrypt },
    { label: "رمزگشایی سزار", onClick: handleDecrypt },
    { label: "کدگذاری Base64", onClick: handleEncodeBase64 },
    { label: "رمزگشایی Base64", onClick: handleDecodeBase64 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">رمزگذاری متن</h2>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 space-y-4">
        {/* Input */}
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground">متن ورودی</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="متن خود را وارد کنید..."
            className="w-full min-h-[120px] rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-y"
          />
        </div>

        {/* Shift */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-foreground whitespace-nowrap">
            میزان جابجایی (سزار):
          </label>
          <input
            type="number"
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value) || 0)}
            min={1}
            max={25}
            className="w-24 rounded-lg border border-border bg-background px-3 py-2 text-foreground text-center focus:outline-none focus:ring-2 focus:ring-primary"
            dir="ltr"
          />
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className="rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {action.label}
            </button>
          ))}
        </div>

        {/* Output */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-foreground">نتیجه</label>
            {output && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? (
                  <><Check className="h-3.5 w-3.5 text-green-500" /> کپی شد</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> کپی</>
                )}
              </button>
            )}
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="نتیجه اینجا نمایش داده می‌شود..."
            className="w-full min-h-[120px] rounded-lg border border-border bg-background p-4 text-foreground placeholder:text-muted-foreground resize-y"
            dir="ltr"
          />
        </div>
      </div>
    </div>
  );
}
