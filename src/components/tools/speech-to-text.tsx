"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Copy,
  Check,
  Trash2,
  Download,
  Info,
  AlertCircle,
  Globe,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (n: number): string => {
  try { return n.toLocaleString("fa-IR"); } catch { return String(n); }
};

const LANGUAGES = [
  { code: "fa-IR", label: "فارسی" },
  { code: "en-US", label: "انگلیسی (آمریکا)" },
  { code: "en-GB", label: "انگلیسی (بریتانیا)" },
  { code: "ar-SA", label: "عربی" },
  { code: "tr-TR", label: "ترکی" },
  { code: "de-DE", label: "آلمانی" },
  { code: "fr-FR", label: "فرانسوی" },
  { code: "es-ES", label: "اسپانیایی" },
  { code: "zh-CN", label: "چینی" },
  { code: "ja-JP", label: "ژاپنی" },
];

interface TranscriptLine {
  id: string;
  text: string;
  time: string;
}

export default function SpeechToText() {
  const [isRecording, setIsRecording] = useState(false);
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [language, setLanguage] = useState("fa-IR");
  const [interimText, setInterimText] = useState("");
  const [copied, setCopied] = useState(false);
  const [notSupported, setNotSupported] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  // Check support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setNotSupported(true);
    }
  }, []);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const getTimestamp = (): string => {
    if (startTimeRef.current === 0) return "00:00";
    const diff = Math.floor((Date.now() - startTimeRef.current) / 1000);
    return formatTime(diff);
  };

  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += transcript;
        } else {
          interim += transcript;
        }
      }

      if (finalText) {
        const newLine: TranscriptLine = {
          id: Date.now().toString(),
          text: finalText.trim(),
          time: getTimestamp(),
        };
        setLines((prev) => [...prev, newLine]);
        setInterimText("");
      } else {
        setInterimText(interim);
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error !== "aborted") {
        console.error("Speech recognition error:", event.error);
      }
      stopRecording();
    };

    recognition.onend = () => {
 // Auto-restart if still recording (continuous mode stops after silence)
      if (recognitionRef.current) {
        try {
          recognition.start();
        } catch {
          stopRecording();
        }
      }
    };

    recognitionRef.current = recognition;
    startTimeRef.current = Date.now();
    setIsRecording(true);
    setElapsed(0);

    timerRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    try {
      recognition.start();
    } catch {
      stopRecording();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null;
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setIsRecording(false);
    setInterimText("");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const copyAll = async () => {
    const allText = lines.map((l) => l.text).join("\n");
    if (!allText) return;
    try {
      await navigator.clipboard.writeText(allText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const downloadTxt = () => {
    const allText = lines.map((l) => `[${l.time}] ${l.text}`).join("\n");
    if (!allText) return;
    const blob = new Blob([allText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "abzarak-transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    if (isRecording) stopRecording();
    setLines([]);
    setInterimText("");
    setElapsed(0);
  };

  const wordCount = lines.reduce((s, l) => s + l.text.split(/\s+/).filter(Boolean).length, 0);
  const totalChars = lines.reduce((s, l) => s + l.text.length, 0);

  if (notSupported) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Mic className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-bold text-foreground">تبدیل صوت به متن</h2>
        </div>
        <div className="glass-card p-6 flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <p className="text-sm font-medium text-foreground">مرورگر شما از تشخیص صوت پشتیبانی نمی‌کند</p>
          <p className="text-xs text-muted-foreground">
            لطفاً از Google Chrome نسخه ۳۳ یا بالاتر استفاده کنید.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Mic className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-bold text-foreground">تبدیل صوت به متن</h2>
      </div>

      {/* Controls */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Language selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isRecording}
            className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>

          {/* Record button */}
          <button
            onClick={toggleRecording}
            className={cn(
              "flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all",
              isRecording
                ? "bg-destructive text-white hover:bg-destructive/90 animate-pulse"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            )}
          >
            {isRecording ? (
              <>
                <MicOff className="h-5 w-5" />
                توقف ({formatTime(elapsed)})
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                شروع ضبط
              </>
            )}
          </button>

          {/* Live indicator */}
          {isRecording && (
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs text-red-500 font-medium">در حال ضبط...</span>
            </div>
          )}
        </div>
      </div>

      {/* Interim text (live preview) */}
      {interimText && (
        <div className="glass-card p-4">
          <p className="text-sm text-muted-foreground italic">{interimText}</p>
        </div>
      )}

      {/* Transcript Results */}
      <div className="glass-card p-5 space-y-3 min-h-[200px]">
        {lines.length === 0 && !interimText ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Mic className="h-10 w-10 text-muted-foreground/30 mb-3" />
            <p className="text-sm text-muted-foreground">
              روی «شروع ضبط» کلیک کنید و شروع به صحبت کنید
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {lines.map((line) => (
              <div
                key={line.id}
                className="flex gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/20 transition-colors animate-fade-in-up"
              >
                <span className="text-[10px] font-mono text-primary shrink-0 pt-0.5" dir="ltr">
                  {line.time}
                </span>
                <p className="text-sm text-foreground leading-relaxed">{line.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions Bar */}
      {lines.length > 0 && (
        <div className="glass-card glow-effect p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>
              <span className="font-bold text-foreground">{toPersianDigits(lines.length)}</span> خط
            </span>
            <span>
              <span className="font-bold text-foreground">{toPersianDigits(wordCount)}</span> کلمه
            </span>
            <span>
              <span className="font-bold text-foreground">{toPersianDigits(totalChars)}</span> کاراکتر
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyAll}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "کپی شد!" : "کپی متن"}
            </button>
            <button
              onClick={downloadTxt}
              className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Download className="h-3.5 w-3.5" />
              دانلود TXT
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" />
              پاک کردن
            </button>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/50 p-3 text-xs text-muted-foreground leading-relaxed">
        <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
        <span>
          این ابزار از Web Speech API مرورگر استفاده می‌کند. بهترین عملکرد در
          Google Chrome نسخه ۳۳ به بالا. دقت تشخیص به زبان انتخاب‌شده و وضوح صدا
          بستگی دارد. هیچ صدایی به سرور ارسال نمی‌شود.
        </span>
      </div>
    </div>
  );
}
