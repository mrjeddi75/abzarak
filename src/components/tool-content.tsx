"use client";

import { toolCategories } from "@/lib/tools-config";
import { useAppStore } from "@/lib/store";
import { Construction, ArrowRight } from "lucide-react";
import HomeDashboard from "@/components/tools/home-dashboard";
import IranClock from "@/components/tools/iran-clock";
import ShamsiCalendar from "@/components/tools/shamsi-calendar";
import Calculator from "@/components/tools/calculator";
import UnitConverter from "@/components/tools/unit-converter";
import WordCounter from "@/components/tools/word-counter";
import LetterConverter from "@/components/tools/letter-converter";
import PasswordGenerator from "@/components/tools/password-generator";
import TextEncryptor from "@/components/tools/text-encryptor";
import DateConverter from "@/components/tools/date-converter";
import SubnetCalculator from "@/components/tools/subnet-calculator";
import IPLookup from "@/components/tools/ip-lookup";
import DNSLookup from "@/components/tools/dns-lookup";
import BMI from "@/components/tools/bmi";
import Interest from "@/components/tools/interest";
import Percent from "@/components/tools/percent";
import Area from "@/components/tools/area";
import Age from "@/components/tools/age";
import Salary from "@/components/tools/salary";
import ColorConverter from "@/components/tools/color-converter";
import Base64 from "@/components/tools/base64";
import NumberToWords from "@/components/tools/number-to-words";
import TimezoneConverter from "@/components/tools/timezone-converter";
import TextTools from "@/components/tools/text-tools";
import FindReplace from "@/components/tools/find-replace";
import RemoveDuplicates from "@/components/tools/remove-duplicates";
import SortLines from "@/components/tools/sort-lines";
import ReverseText from "@/components/tools/reverse-text";
import LineNumbers from "@/components/tools/line-numbers";
import LoremIpsum from "@/components/tools/lorem-ipsum";
import JsonFormatter from "@/components/tools/json-formatter";
import HashGenerator from "@/components/tools/hash-generator";
import CssMinifier from "@/components/tools/css-minifier";
import MetaTagGenerator from "@/components/tools/meta-tag-generator";
import ShadowGenerator from "@/components/tools/shadow-generator";
import GradientGenerator from "@/components/tools/gradient-generator";
import BorderRadiusGenerator from "@/components/tools/border-radius-generator";
import ColorPalette from "@/components/tools/color-palette";
import BillSplitter from "@/components/tools/bill-splitter";
import FuelCalculator from "@/components/tools/fuel-calculator";
import TimerComponent from "@/components/tools/timer";
import RandomPicker from "@/components/tools/random-picker";
import QRCodeGenerator from "@/components/tools/qrcode";
import ImageToBase64 from "@/components/tools/image-to-base64";
import Discount from "@/components/tools/discount";
import SalaryTax from "@/components/tools/salary-tax";
import EidiSanavat from "@/components/tools/eidi-sanavat";
import Insurance from "@/components/tools/insurance";
import HousingAllowance from "@/components/tools/housing-allowance";
import BaseConverter from "@/components/tools/base-converter";
import RegexTester from "@/components/tools/regex-tester";
import UrlEncoder from "@/components/tools/url-encoder";
import HtmlMinifier from "@/components/tools/html-minifier";
import SqlFormatter from "@/components/tools/sql-formatter";
import CrontabGenerator from "@/components/tools/crontab-generator";
import JwtDecoder from "@/components/tools/jwt-decoder";
import ChecksumGenerator from "@/components/tools/checksum";
import UnixTimestamp from "@/components/tools/unix-timestamp";
import DataUnitConverter from "@/components/tools/data-unit-converter";
import PingTool from "@/components/tools/ping-tool";
import TracerouteTool from "@/components/tools/traceroute-tool";
import Weather from "@/components/tools/weather";
import ImageCompressor from "@/components/tools/image-compressor";
import ImageToPdf from "@/components/tools/image-to-pdf";
import SpeechToText from "@/components/tools/speech-to-text";

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
  BMI,
  Interest,
  Percent,
  Area,
  Age,
  Salary,
  ColorConverter,
  Base64,
  NumberToWords,
  TimezoneConverter,
  TextTools,
  FindReplace,
  RemoveDuplicates,
  SortLines,
  ReverseText,
  LineNumbers,
  LoremIpsum,
  JsonFormatter,
  HashGenerator,
  CssMinifier,
  MetaTagGenerator,
  ShadowGenerator,
  GradientGenerator,
  BorderRadiusGenerator,
  ColorPalette,
  BillSplitter,
  FuelCalculator,
  TimerComponent,
  RandomPicker,
  QRCodeGenerator,
  ImageToBase64,
  Discount,
  SalaryTax,
  EidiSanavat,
  Insurance,
  HousingAllowance,
  BaseConverter,
  RegexTester,
  UrlEncoder,
  HtmlMinifier,
  SqlFormatter,
  CrontabGenerator,
  JwtDecoder,
  ChecksumGenerator,
  UnixTimestamp,
  DataUnitConverter,
  PingTool,
  TracerouteTool,
  Weather,
  ImageCompressor,
  ImageToPdf,
  SpeechToText,
};

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
      <Component />
    </div>
  );
}
