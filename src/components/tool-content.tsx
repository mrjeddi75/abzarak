'use client';

import { toolCategories } from '@/lib/tools-config';
import HomeDashboard from '@/components/tools/home-dashboard';
import IranClock from '@/components/tools/iran-clock';
import ShamsiCalendar from '@/components/tools/shamsi-calendar';
import Calculator from '@/components/tools/calculator';
import UnitConverter from '@/components/tools/unit-converter';
import WordCounter from '@/components/tools/word-counter';
import LetterConverter from '@/components/tools/letter-converter';
import PasswordGenerator from '@/components/tools/password-generator';
import TextEncryptor from '@/components/tools/text-encryptor';
import DateConverter from '@/components/tools/date-converter';
import SubnetCalculator from '@/components/tools/subnet-calculator';
import IPLookup from '@/components/tools/ip-lookup';
import DNSLookup from '@/components/tools/dns-lookup';
import ImageCompressor from '@/components/tools/image-compressor';
import ImageToPdf from '@/components/tools/image-to-pdf';
import SpeechToText from '@/components/tools/speech-to-text';
import InstagramBio from '@/components/tools/instagram-bio';
import InstagramPostTime from '@/components/tools/instagram-post-time';
import SocialMediaPreview from '@/components/tools/social-media-preview';
import YoutubeEarnings from '@/components/tools/youtube-earnings';
import EngagementCalculator from '@/components/tools/engagement-calculator';
import DiffChecker from '@/components/tools/diff-checker';
import SeoAnalyzer from '@/components/tools/seo-analyzer';
import PdfInvoice from '@/components/tools/pdf-invoice';
import JsonSchemaGenerator from '@/components/tools/json-schema-generator';
import { Construction } from 'lucide-react';

const componentMap: Record<string, React.ComponentType> = {
  IranClock,
  ShamsiCalendar,
  Calculator,
  UnitConverter,
  WordCounter,
  LetterConverter,
  PasswordGenerator,
  TextEncryptor,
  DateConverter,
  SubnetCalculator,
  IPLookup,
  DNSLookup,
  ImageCompressor,
  ImageToPdf,
  SpeechToText,
  InstagramBio,
  InstagramPostTime,
  SocialMediaPreview,
  YoutubeEarnings,
  EngagementCalculator,
  DiffChecker,
  SeoAnalyzer,
  PdfInvoice,
  JsonSchemaGenerator,
};

interface ToolContentProps {
  toolId: string;
}

export default function ToolContent({ toolId }: ToolContentProps) {
  if (toolId === 'home') return <HomeDashboard />;

  const allTools = toolCategories.flatMap((c) => c.tools);
  const tool = allTools.find((t) => t.id === toolId);

  if (!tool) return <HomeDashboard />;

  if (tool.comingSoon) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Construction className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">{tool.name}</h2>
        <p className="text-muted-foreground">این ابزار به زودی اضافه خواهد شد.</p>
      </div>
    );
  }

  const Component = componentMap[tool.component];
  if (!Component) return <HomeDashboard />;

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">{tool.name}</h1>
        <p className="text-muted-foreground mt-1">{tool.description}</p>
      </div>
      <Component />
    </div>
  );
}