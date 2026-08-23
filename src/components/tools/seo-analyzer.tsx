'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, CheckCircle2, XCircle, AlertTriangle, Copy, Check } from 'lucide-react';
import { toPersianDigits } from '@/lib/jalali';

interface SEOIssue {
  type: 'success' | 'error' | 'warning';
  title: string;
  description: string;
}

function analyzeTitle(title: string): SEOIssue[] {
  const issues: SEOIssue[] = [];
  if (!title.trim()) {
    issues.push({ type: 'error', title: 'عنوان صفحه خالی است', description: 'عنوان صفحه برای سئو بسیار مهم است. یک عنوان ۵۰ تا ۶۰ کاراکتری بنویسید.' });
  } else {
    if (title.length >= 30 && title.length <= 60) {
      issues.push({ type: 'success', title: 'طول عنوان مناسب', description: `عنوان شما ${title.length} کاراکتر دارد که در محدوده ایده‌آل ۳۰-۶۰ است.` });
    } else if (title.length < 30) {
      issues.push({ type: 'warning', title: 'عنوان کوتاه است', description: `عنوان ${title.length} کاراکتر دارد. بهتر است ۳۰ تا ۶۰ کاراکتر باشد.` });
    } else {
      issues.push({ type: 'warning', title: 'عنوان بلند است', description: `عنوان ${title.length} کاراکتر دارد. در نتایج گوگل احتمالا بریده می‌شود. بهتر است حداکثر ۶۰ کاراکتر باشد.` });
    }
    const wordCount = title.trim().split(/\s+/).length;
    if (wordCount < 3) {
      issues.push({ type: 'warning', title: 'تعداد کلمات عنوان کم است', description: 'عنوان حداقل ۳ کلمه داشته باشد.' });
    }
  }
  return issues;
}

function analyzeMetaDesc(desc: string, keyword: string): SEOIssue[] {
  const issues: SEOIssue[] = [];
  if (!desc.trim()) {
    issues.push({ type: 'error', title: 'توضیحات متا خالی است', description: 'متا دیسکریپشن برای کلیک بیشتر بسیار مهم است. ۱۲۰ تا ۱۶۰ کاراکتر بنویسید.' });
  } else {
    if (desc.length >= 120 && desc.length <= 160) {
      issues.push({ type: 'success', title: 'طول توضیحات مناسب', description: `توضیحات متا ${desc.length} کاراکتر دارد که در محدوده ایده‌آل است.` });
    } else if (desc.length < 120) {
      issues.push({ type: 'warning', title: 'توضیحات کوتاه است', description: `توضیحات ${desc.length} کاراکتر دارد. بهتر است ۱۲۰ تا ۱۶۰ کاراکتر باشد.` });
    } else {
      issues.push({ type: 'warning', title: 'توضیحات بلند است', description: `توضیحات ${desc.length} کاراکتر دارد و در نتایج گوگل بریده می‌شود.` });
    }
    if (keyword && desc.toLowerCase().includes(keyword.toLowerCase())) {
      issues.push({ type: 'success', title: 'کلمه کلیدی در توضیحات', description: 'کلمه کلیدی در متا دیسکریپشن وجود دارد.' });
    } else if (keyword) {
      issues.push({ type: 'warning', title: 'کلمه کلیدی در توضیحات نیست', description: 'بهتر است کلمه کلیدی اصلی در توضیحات متا هم قرار بگیرد.' });
    }
  }
  return issues;
}

function analyzeContent(content: string, keyword: string): SEOIssue[] {
  const issues: SEOIssue[] = [];
  const words = content.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const charCount = content.length;
  const sentenceCount = content.split(/[.!?؟。]+/).filter(s => s.trim()).length;
  const paragraphCount = content.split(/\n\s*\n/).filter(p => p.trim()).length || (content.trim() ? 1 : 0);

  if (!content.trim()) {
    issues.push({ type: 'error', title: 'محتوا خالی است', description: 'محتوای صفحه را وارد کنید تا آنالیز شود.' });
    return issues;
  }

  if (wordCount < 300) {
    issues.push({ type: 'warning', title: 'محتوا کوتاه است', description: `محتوا ${wordCount} کلمه دارد. برای رتبه‌گیری بهتر، حداقل ۳۰۰ کلمه بنویسید.` });
  } else if (wordCount >= 300 && wordCount < 1000) {
    issues.push({ type: 'success', title: 'طول محتوا قابل قبول', description: `محتوا ${wordCount} کلمه دارد.` });
  } else {
    issues.push({ type: 'success', title: 'محتوای غنی', description: `محتوا ${wordCount} کلمه دارد که عالی است.` });
  }

  if (keyword) {
    const keywordLower = keyword.toLowerCase();
    const keywordCount = (content.toLowerCase().match(new RegExp(keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    const density = wordCount > 0 ? ((keywordCount / wordCount) * 100) : 0;

    if (keywordCount === 0) {
      issues.push({ type: 'error', title: 'کلمه کلیدی یافت نشد', description: 'کلمه کلیدی در محتوا وجود ندارد. حتما آن را اضافه کنید.' });
    } else {
      if (density >= 1 && density <= 3) {
        issues.push({ type: 'success', title: 'تراکم کلمه کلیدی مناسب', description: `تراکم ${density.toFixed(1)}٪ است که در محدوده ایده‌آل ۱-۳٪ قرار دارد.` });
      } else if (density < 1) {
        issues.push({ type: 'warning', title: 'تراکم کلمه کلیدی کم', description: `تراکم ${density.toFixed(1)}٪ است. بهتر است بین ۱-۳٪ باشد.` });
      } else {
        issues.push({ type: 'warning', title: 'استفاده بیش از حد از کلمه کلیدی', description: `تراکم ${density.toFixed(1)}٪ است. ممکن است گوگل آن را اسپم تشخیص دهد. کمتر استفاده کنید.` });
      }

      const firstParagraph = content.split(/\n\s*\n/)[0] || content.substring(0, 300);
      if (firstParagraph.toLowerCase().includes(keywordLower)) {
        issues.push({ type: 'success', title: 'کلمه کلیدی در پاراگراف اول', description: 'کلمه کلیدی در ۱۰۰ کلمه اول محتوا وجود دارد.' });
      } else {
        issues.push({ type: 'warning', title: 'کلمه کلیدی در پاراگراف اول نیست', description: 'بهتر است کلمه کلیدی در ۱۰۰ کلمه اول ظاهر شود.' });
      }

      if (content.substring(0, 100).toLowerCase().includes(keywordLower)) {
        issues.push({ type: 'success', title: 'کلمه کلیدی در ابتدای محتوا', description: 'کلمه کلیدی در ابتدای محتوا وجود دارد.' });
      }
    }
  }

  const headingMatches = content.match(/^#{1,6}\s+.+$/gm);
  const h2Count = headingMatches ? headingMatches.filter(h => /^##\s+/.test(h)).length : 0;
  const h3Count = headingMatches ? headingMatches.filter(h => /^###\s+/.test(h)).length : 0;

  if (wordCount >= 300 && h2Count === 0) {
    issues.push({ type: 'warning', title: 'بدون زیرعنوان', description: 'از تگ‌های H2 برای ساختاردهی محتوا استفاده کنید.' });
  } else if (h2Count > 0) {
    issues.push({ type: 'success', title: 'زیرعنوان‌ها وجود دارد', description: `${h2Count} عنوان H2 و ${h3Count} عنوان H3 یافت شد.` });
  }

  const links = content.match(/https?:\/\/[\S]+/g);
  const linkCount = links ? links.length : 0;
  if (linkCount > 0) {
    issues.push({ type: 'success', title: 'لینک در محتوا', description: `${linkCount} لینک در محتوا یافت شد.` });
  }

  const imageAltMatches = content.match(/!\[([^\]]*)\]\([^)]+\)/g);
  const imagesWithAlt = imageAltMatches ? imageAltMatches.filter(m => !/^!\[\s*\]/.test(m)).length : 0;
  const imagesWithoutAlt = imageAltMatches ? imageAltMatches.length - imagesWithAlt : 0;
  if (imageAltMatches && imageAltMatches.length > 0) {
    if (imagesWithoutAlt > 0) {
      issues.push({ type: 'warning', title: 'تصاویر بدون alt', description: `${imagesWithoutAlt} تصویر بدون مشخصه alt یافت شد.` });
    } else {
      issues.push({ type: 'success', title: 'تمام تصاویر alt دارند', description: 'تمام تصاویر دارای مشخصه alt هستند.' });
    }
  }

  if (sentenceCount > 0) {
    const avgWordsPerSentence = wordCount / sentenceCount;
    if (avgWordsPerSentence > 25) {
      issues.push({ type: 'warning', title: 'جملات طولانی', description: 'میانگین طول جمله بیشتر از ۲۵ کلمه است. جملات کوتاه‌تر خوانایی بهتری دارند.' });
    } else {
      issues.push({ type: 'success', title: 'خوانایی جملات مناسب', description: `میانگین ${avgWordsPerSentence.toFixed(0)} کلمه در هر جمله.` });
    }
  }

  return issues;
}

function analyzeUrl(url: string, keyword: string): SEOIssue[] {
  const issues: SEOIssue[] = [];
  if (!url.trim()) {
    issues.push({ type: 'warning', title: 'URL وارد نشده', description: 'بررسی URL اختیاری است اما برای تحلیل بهتر وارد کنید.' });
    return issues;
  }

  try {
    const urlObj = new URL(url.startsWith('http') ? url : 'https://' + url);
    const pathname = urlObj.pathname;

    if (pathname.length > 75) {
      issues.push({ type: 'warning', title: 'URL بلند است', description: 'URL کوتاه‌تر بهتر است. حداکثر ۷۵ کاراکتر.' });
    } else {
      issues.push({ type: 'success', title: 'طول URL مناسب', description: `URL ${pathname.length} کاراکتر دارد.` });
    }

    const hasSpecialChars = /[^a-zA-Z0-9\-\/_.?=&]/.test(pathname);
    if (hasSpecialChars) {
      issues.push({ type: 'warning', title: 'کاراکترهای خاص در URL', description: 'از کاراکترهای فارسی یا خاص در URL استفاده نکنید.' });
    } else {
      issues.push({ type: 'success', title: 'URL تمیز', description: 'URL فقط شامل کاراکترهای مجاز است.' });
    }

    if (keyword && pathname.toLowerCase().includes(keyword.toLowerCase().replace(/\s+/g, '-'))) {
      issues.push({ type: 'success', title: 'کلمه کلیدی در URL', description: 'کلمه کلیدی در URL وجود دارد.' });
    } else if (keyword) {
      issues.push({ type: 'warning', title: 'کلمه کلیدی در URL نیست', description: 'بهتر است کلمه کلیدی در URL هم قرار بگیرد.' });
    }
  } catch {
    issues.push({ type: 'error', title: 'URL نامعتبر', description: 'لطفا یک URL معتبر وارد کنید.' });
  }

  return issues;
}

export default function SEOAnalyzer() {
  const [title, setTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [content, setContent] = useState('');
  const [keyword, setKeyword] = useState('');
  const [url, setUrl] = useState('');
  const [analyzed, setAnalyzed] = useState(false);
  const [copied, setCopied] = useState(false);

  const allIssues = useMemo(() => {
    if (!analyzed) return [];
    return [
      ...analyzeTitle(title),
      ...analyzeMetaDesc(metaDesc, keyword),
      ...analyzeContent(content, keyword),
      ...analyzeUrl(url, keyword),
    ];
  }, [analyzed, title, metaDesc, content, keyword, url]);

  const score = useMemo(() => {
    if (allIssues.length === 0) return 0;
    let s = 100;
    allIssues.forEach(issue => {
      if (issue.type === 'error') s -= 15;
      else if (issue.type === 'warning') s -= 5;
    });
    return Math.max(0, Math.min(100, s));
  }, [allIssues]);

  const scoreColor = score >= 80 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-red-500';
  const scoreBg = score >= 80 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
  const scoreLabel = score >= 80 ? 'عالی' : score >= 50 ? 'متوسط' : 'نیاز به بهبود';

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleCopy = async () => {
    const report = allIssues.map(i => {
      const icon = i.type === 'success' ? '✅' : i.type === 'error' ? '❌' : '⚠️';
      return `${icon} ${i.title}: ${i.description}`;
    }).join('\n');
    await navigator.clipboard.writeText(`امتیاز سئو: ${score}/100\n\n${report}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">کلمه کلیدی هدف</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setAnalyzed(false); }}
            placeholder="کلمه کلیدی اصلی صفحه را وارد کنید..."
            dir="auto"
          />
          <p className="text-xs text-muted-foreground mt-2">
            کلمه کلیدی برای تحلیل تراکم و محل قرارگیری استفاده می‌شود
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">URL صفحه</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={url}
            onChange={(e) => { setUrl(e.target.value); setAnalyzed(false); }}
            placeholder="https://example.com/page"
            dir="ltr"
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">عنوان صفحه (Title Tag)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              value={title}
              onChange={(e) => { setTitle(e.target.value); setAnalyzed(false); }}
              placeholder="عنوان سئو صفحه..."
              dir="auto"
              maxLength={70}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>بهینه: ۳۰-۶۰ کاراکتر</span>
              <span className={title.length > 60 ? 'text-red-500' : ''}>{toPersianDigits(title.length)}/60</span>
            </div>
            {title && (
              <div className="mt-2 p-3 bg-white dark:bg-zinc-900 rounded-lg border">
                <p className="text-blue-700 dark:text-blue-400 text-base font-medium truncate" dir="auto">
                  {title}
                </p>
                <p className="text-green-700 dark:text-green-500 text-xs mt-1 truncate" dir="ltr">
                  {url || 'https://example.com'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2" dir="auto">
                  {metaDesc || 'توضیحات متا صفحه اینجا نمایش داده می‌شود...'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">توضیحات متا (Meta Description)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea
              value={metaDesc}
              onChange={(e) => { setMetaDesc(e.target.value); setAnalyzed(false); }}
              placeholder="توضیحات متا صفحه..."
              dir="auto"
              className="min-h-[100px] resize-y"
              maxLength={170}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>بهینه: ۱۲۰-۱۶۰ کاراکتر</span>
              <span className={metaDesc.length > 160 ? 'text-red-500' : ''}>{toPersianDigits(metaDesc.length)}/160</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">محتوای صفحه</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setAnalyzed(false); }}
            placeholder="محتوای صفحه را اینجا وارد کنید... (پشتیبانی از Markdown)"
            dir="auto"
            className="min-h-[200px] resize-y text-base"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {toPersianDigits(wordCount)} کلمه | {toPersianDigits(content.length)} کاراکتر
          </p>
        </CardContent>
      </Card>

      <Button onClick={() => setAnalyzed(true)} className="w-full lg:w-auto" disabled={!content.trim() && !title.trim()}>
        <Search className="h-4 w-4 ml-2" />
        آنالیز سئو
      </Button>

      {analyzed && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6 pb-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="relative w-28 h-28">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
                    <circle
                      cx="50" cy="50" r="42" fill="none"
                      stroke="currentColor" strokeWidth="8"
                      strokeDasharray={`${score * 2.64} ${264 - score * 2.64}`}
                      strokeLinecap="round"
                      className={scoreBg}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-3xl font-bold ${scoreColor}`}>{toPersianDigits(score)}</span>
                    <span className="text-[10px] text-muted-foreground">از ۱۰۰</span>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <h3 className={`text-2xl font-bold ${scoreColor}`}>{scoreLabel}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {toPersianDigits(allIssues.length)} بررسی انجام شد
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {toPersianDigits(allIssues.filter(i => i.type === 'success').length)} موفق |{' '}
                    {toPersianDigits(allIssues.filter(i => i.type === 'warning').length)} هشدار |{' '}
                    {toPersianDigits(allIssues.filter(i => i.type === 'error').length)} خطا
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">جزئیات آنالیز</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 ml-1" /> : <Copy className="h-4 w-4 ml-1" />}
                  کپی گزارش
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {allIssues.map((issue, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-lg bg-muted/50">
                    {issue.type === 'success' ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    ) : issue.type === 'error' ? (
                      <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{issue.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{issue.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}