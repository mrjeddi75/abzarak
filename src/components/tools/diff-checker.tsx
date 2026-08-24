'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, Copy, Check } from 'lucide-react';
import { toPersianDigits } from '@/lib/jalali';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  text: string;
}

function computeDiff(textA: string, textB: string): DiffLine[] {
  const linesA = textA.split('\n');
  const linesB = textB.split('\n');
  const result: DiffLine[] = [];
  const maxLen = Math.max(linesA.length, linesB.length);
  
  for (let i = 0; i < maxLen; i++) {
    const lineA = i < linesA.length ? linesA[i] : null;
    const lineB = i < linesB.length ? linesB[i] : null;
    
    if (lineA !== null && lineB !== null && lineA === lineB) {
      result.push({ type: 'unchanged', text: lineA });
    } else {
      if (lineA !== null) {
        result.push({ type: 'removed', text: lineA });
      }
      if (lineB !== null) {
        result.push({ type: 'added', text: lineB });
      }
    }
  }
  
  return result;
}

function computeWordDiff(textA: string, textB: string): { added: number; removed: number; unchanged: number } {
  const wordsA = new Set(textA.split(/\s+/).filter(Boolean));
  const wordsB = new Set(textB.split(/\s+/).filter(Boolean));
  
  let unchanged = 0;
  wordsA.forEach(w => { if (wordsB.has(w)) unchanged++; });
  
  const added = wordsB.size - unchanged;
  const removed = wordsA.size - unchanged;
  
  return { added: Math.max(0, added), removed: Math.max(0, removed), unchanged };
}

export default function DiffChecker() {
  const [textA, setTextA] = useState('');
  const [textB, setTextB] = useState('');
  const [mode, setMode] = useState<'line' | 'word' | 'char'>('line');
  const [showDiff, setShowDiff] = useState(false);
  const [copied, setCopied] = useState(false);

  const diffResult = useMemo(() => {
    if (!showDiff) return [];
    return computeDiff(textA, textB);
  }, [textA, textB, showDiff]);

  const wordStats = useMemo(() => {
    return computeWordDiff(textA, textB);
  }, [textA, textB]);

  const charDiff = useMemo(() => {
    let common = 0;
    const maxLen = Math.max(textA.length, textB.length);
    const minLen = Math.min(textA.length, textB.length);
    for (let i = 0; i < minLen; i++) {
      if (textA[i] === textB[i]) common++;
    }
    return {
      same: common,
      different: maxLen - common,
      similarity: maxLen > 0 ? Math.round((common / maxLen) * 100) : 100,
    };
  }, [textA, textB]);

  const stats = useMemo(() => {
    const linesA = textA.split('\n').length;
    const linesB = textB.split('\n').length;
    const wordsA = textA.split(/\s+/).filter(Boolean).length;
    const wordsB = textB.split(/\s+/).filter(Boolean).length;
    return { linesA, linesB, wordsA, wordsB };
  }, [textA, textB]);

  const addedCount = diffResult.filter(d => d.type === 'added').length;
  const removedCount = diffResult.filter(d => d.type === 'removed').length;
  const unchangedCount = diffResult.filter(d => d.type === 'unchanged').length;

  const handleCopy = async () => {
    const output = diffResult.map(d => {
      const prefix = d.type === 'added' ? '+ ' : d.type === 'removed' ? '- ' : '  ';
      return prefix + d.text;
    }).join('\n');
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputCls = 'w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]';

  return (
    <div className="space-y-4">
      {/* Mode Selector */}
      <div className="glass-card glow-effect p-4">
        <div className="flex flex-wrap gap-2">
          {([
            { key: 'line' as const, label: 'تفاوت خط به خط' },
            { key: 'word' as const, label: 'تفاوت کلماتی' },
            { key: 'char' as const, label: 'تفاوت کاراکتری' },
          ]).map((m) => (
            <Button
              key={m.key}
              variant={mode === m.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setMode(m.key); setShowDiff(false); }}
            >
              {m.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Text Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card glow-effect p-4">
          <h3 className="text-lg font-bold mb-2">متن اول (اصلی)</h3>
          <textarea
            value={textA}
            onChange={(e) => { setTextA(e.target.value); setShowDiff(false); }}
            placeholder="متن اول را وارد کنید..."
            className={`${inputCls} min-h-[200px] resize-y text-base font-mono`}
            dir="auto"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {toPersianDigits(stats.linesA)} خط | {toPersianDigits(stats.wordsA)} کلمه | {toPersianDigits(textA.length)} کاراکتر
          </p>
        </div>

        <div className="glass-card glow-effect p-4">
          <h3 className="text-lg font-bold mb-2">متن دوم (تغییر یافته)</h3>
          <textarea
            value={textB}
            onChange={(e) => { setTextB(e.target.value); setShowDiff(false); }}
            placeholder="متن دوم را وارد کنید..."
            className={`${inputCls} min-h-[200px] resize-y text-base font-mono`}
            dir="auto"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {toPersianDigits(stats.linesB)} خط | {toPersianDigits(stats.wordsB)} کلمه | {toPersianDigits(textB.length)} کاراکتر
          </p>
        </div>
      </div>

      {/* Compare Button */}
      <Button onClick={() => setShowDiff(true)} className="w-full lg:w-auto" disabled={!textA && !textB}>
        <ArrowLeftRight className="h-4 w-4 ml-2" />
        مقایسه متون
      </Button>

      {/* Results */}
      {showDiff && (
        <div className="space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="glass-card glow-effect p-4 text-center">
              <p className="text-2xl font-bold text-emerald-500">+{toPersianDigits(mode === 'line' ? addedCount : mode === 'word' ? wordStats.added : charDiff.different)}</p>
              <p className="text-xs text-muted-foreground mt-1">اضافه شده</p>
            </div>
            <div className="glass-card glow-effect p-4 text-center">
              <p className="text-2xl font-bold text-red-500">-{toPersianDigits(mode === 'line' ? removedCount : mode === 'word' ? wordStats.removed : charDiff.different)}</p>
              <p className="text-xs text-muted-foreground mt-1">حذف شده</p>
            </div>
            <div className="glass-card glow-effect p-4 text-center">
              <p className="text-2xl font-bold text-primary">{toPersianDigits(mode === 'line' ? unchangedCount : mode === 'word' ? wordStats.unchanged : charDiff.same)}</p>
              <p className="text-xs text-muted-foreground mt-1">بدون تغییر</p>
            </div>
            <div className="glass-card glow-effect p-4 text-center">
              <p className="text-2xl font-bold text-primary">{toPersianDigits(mode === 'char' ? charDiff.similarity : mode === 'word' ? (textA.split(/\s+/).filter(Boolean).length > 0 ? Math.round((wordStats.unchanged / Math.max(textA.split(/\s+/).filter(Boolean).length, textB.split(/\s+/).filter(Boolean).length)) * 100) : 100) : (diffResult.length > 0 ? Math.round((unchangedCount / diffResult.length) * 100) : 100))}%</p>
              <p className="text-xs text-muted-foreground mt-1">شباهت</p>
            </div>
          </div>

          {/* Char mode */}
          {mode === 'char' && (
            <div className="glass-card glow-effect p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">تفاوت کاراکتری</h3>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 ml-1" /> : <Copy className="h-4 w-4 ml-1" />}
                  کپی
                </Button>
              </div>
              <div className="bg-[var(--muted)] rounded-lg p-4 font-mono text-sm leading-relaxed overflow-x-auto" dir="auto">
                {Array.from({ length: Math.max(textA.length, textB.length) }).map((_, i) => {
                  const charA = textA[i] || '';
                  const charB = textB[i] || '';
                  const isSame = charA === charB && charA !== '';
                  const isEmpty = charA === '' || charB === '';
                  return (
                    <span
                      key={i}
                      className={
                        isSame
                          ? ''
                          : isEmpty
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : 'bg-red-500/20 text-red-600 dark:text-red-400'
                      }
                    >
                      {charB || charA}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Word mode */}
          {mode === 'word' && (
            <div className="glass-card glow-effect p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">تفاوت کلماتی</h3>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 ml-1" /> : <Copy className="h-4 w-4 ml-1" />}
                  کپی
                </Button>
              </div>
              <div className="bg-[var(--muted)] rounded-lg p-4 text-sm leading-loose" dir="auto">
                {textB.split(/(\s+)/).map((word, i) => {
                  const cleanWord = word.replace(/\s+/g, '');
                  const isOnlySpaces = /^\s+$/.test(word);
                  if (isOnlySpaces) return <span key={i}>{word}</span>;
                  const inA = textA.split(/\s+/).includes(cleanWord);
                  return (
                    <span
                      key={i}
                      className={inA ? '' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium'}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                <span className="inline-block bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded ml-2">کلمات اضافه شده</span>
              </div>
            </div>
          )}

          {/* Line mode */}
          {mode === 'line' && (
            <div className="glass-card glow-effect p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">تفاوت خط به خط</h3>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 ml-1" /> : <Copy className="h-4 w-4 ml-1" />}
                  کپی
                </Button>
              </div>
              <div className="bg-[var(--muted)] rounded-lg p-4 font-mono text-sm leading-relaxed overflow-x-auto" dir="ltr">
                {diffResult.length === 0 ? (
                  <p className="text-muted-foreground text-center">متنی برای مقایسه وجود ندارد</p>
                ) : (
                  diffResult.map((line, i) => (
                    <div
                      key={i}
                      className={`px-2 py-0.5 border-r-2 ${
                        line.type === 'added'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500'
                          : line.type === 'removed'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500'
                          : 'border-transparent'
                      }`}
                    >
                      <span className="inline-block w-5 opacity-50">
                        {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                      </span>
                      {line.text || ' '}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 bg-emerald-500/20 rounded border border-emerald-500" />
                  خط اضافه شده
                </span>
                <span className="flex items-center gap-1">
                  <span className="inline-block w-3 h-3 bg-red-500/20 rounded border border-red-500" />
                  خط حذف شده
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}