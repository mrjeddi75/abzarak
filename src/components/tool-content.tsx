"use client";

import React, { Suspense } from "react";
import { toolCategories } from "@/lib/tools-config";
import { useAppStore } from "@/lib/store";
import { Construction, ArrowRight, Loader2 } from "lucide-react";

import HomeDashboard from "@/components/tools/home-dashboard";

const componentMap: Record<string, React.LazyExoticComponent<React.ComponentType>> = {
  BMI: React.lazy(() => import("@/components/tools/bmi")),
  Interest: React.lazy(() => import("@/components/tools/interest")),
  Percent: React.lazy(() => import("@/components/tools/percent")),
  Area: React.lazy(() => import("@/components/tools/area")),
  Age: React.lazy(() => import("@/components/tools/age")),
  UnitConverter: React.lazy(() => import("@/components/tools/unit-converter")),
  DateConverter: React.lazy(() => import("@/components/tools/date-converter")),
  ColorConverter: React.lazy(() => import("@/components/tools/color-converter")),
  NumberToWords: React.lazy(() => import("@/components/tools/number-to-words")),
  BaseConverter: React.lazy(() => import("@/components/tools/base-converter")),
  DataUnitConverter: React.lazy(() => import("@/components/tools/data-unit-converter")),
  CryptoConverter: React.lazy(() => import("@/components/tools/crypto-converter")),
  WordCounter: React.lazy(() => import("@/components/tools/word-counter")),
  TextTools: React.lazy(() => import("@/components/tools/text-tools")),
  FindReplace: React.lazy(() => import("@/components/tools/find-replace")),
  RemoveDuplicates: React.lazy(() => import("@/components/tools/remove-duplicates")),
  SortLines: React.lazy(() => import("@/components/tools/sort-lines")),
  LineNumbers: React.lazy(() => import("@/components/tools/line-numbers")),
  HashGenerator: React.lazy(() => import("@/components/tools/hash-generator")),
  MetaTagGenerator: React.lazy(() => import("@/components/tools/meta-tag-generator")),
  RegexTester: React.lazy(() => import("@/components/tools/regex-tester")),
  SqlFormatter: React.lazy(() => import("@/components/tools/sql-formatter")),
  JwtDecoder: React.lazy(() => import("@/components/tools/jwt-decoder")),
  ChecksumGenerator: React.lazy(() => import("@/components/tools/checksum")),
  ShadowGenerator: React.lazy(() => import("@/components/tools/shadow-generator")),
  GradientGenerator: React.lazy(() => import("@/components/tools/gradient-generator")),
  BorderRadiusGenerator: React.lazy(() => import("@/components/tools/border-radius-generator")),
  ColorPalette: React.lazy(() => import("@/components/tools/color-palette")),
  BillSplitter: React.lazy(() => import("@/components/tools/bill-splitter")),
  FuelCalculator: React.lazy(() => import("@/components/tools/fuel-calculator")),
  Discount: React.lazy(() => import("@/components/tools/discount")),
  PasswordGenerator: React.lazy(() => import("@/components/tools/password-generator")),
  TimerComponent: React.lazy(() => import("@/components/tools/timer")),
  RandomPicker: React.lazy(() => import("@/components/tools/random-picker")),
  QRCodeGenerator: React.lazy(() => import("@/components/tools/qrcode")),
  ImageToBase64: React.lazy(() => import("@/components/tools/image-to-base64")),
  IPLookup: React.lazy(() => import("@/components/tools/ip-lookup")),
  DNSLookup: React.lazy(() => import("@/components/tools/dns-lookup")),
  SubnetCalculator: React.lazy(() => import("@/components/tools/subnet-calculator")),
  PingTool: React.lazy(() => import("@/components/tools/ping-tool")),
  TracerouteTool: React.lazy(() => import("@/components/tools/traceroute-tool")),
  SpeedTest: React.lazy(() => import("@/components/tools/speed-test")),
  Weather: React.lazy(() => import("@/components/tools/weather")),
  ShamsiCalendar: React.lazy(() => import("@/components/tools/shamsi-calendar")),
  TextEncryptor: React.lazy(() => import("@/components/tools/text-encryptor")),
};

function ToolLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
      <p className="text-sm text-muted-foreground">در حال بارگذاری...</p>
    </div>
  );
}

export default function ToolContent({ toolId }: { toolId: string }) {
  const setActiveTool = useAppStore((state) => state.setActiveTool);

  if (toolId === "home") return <HomeDashboard />;

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
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => setActiveTool("home")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowRight className="h-4 w-4" />
          <span>خانه</span>
        </button>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm text-foreground/60">{tool.name}</span>
      </div>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-foreground">{tool.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
      </div>
      {tool.seoTip && (
        <p className="text-xs text-muted-foreground/70 mb-4 border border-border/40 rounded-lg p-3 bg-card/50">
          💡 {tool.seoTip}
        </p>
      )}
      <Suspense fallback={<ToolLoader />}>
        <Component />
      </Suspense>
    </div>
  );
}
