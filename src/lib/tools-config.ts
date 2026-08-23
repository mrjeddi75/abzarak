export interface ToolConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  component: string;
  comingSoon?: boolean;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  tools: ToolConfig[];
}

export const toolCategories: ToolCategory[] = [
  {
    id: 'home',
    name: 'خانه',
    icon: 'LayoutDashboard',
    tools: [],
  },
  {
    id: 'time-calendar',
    name: 'زمان و تقویم',
    icon: 'Clock',
    tools: [
      {
        id: 'iran-clock',
        name: 'ساعت زنده ایران',
        description: 'ساعت لحظه‌ای ایران به وقت تهران',
        icon: 'Clock',
        category: 'time-calendar',
        component: 'IranClock',
      },
      {
        id: 'shamsi-calendar',
        name: 'تقویم شمسی',
        description: 'تقویم کامل شمسی با مناسبت‌ها',
        icon: 'CalendarDays',
        category: 'time-calendar',
        component: 'ShamsiCalendar',
      },
      {
        id: 'date-converter',
        name: 'تبدیل تاریخ',
        description: 'تبدیل بین تاریخ شمسی، میلادی و قمری',
        icon: 'ArrowLeftRight',
        category: 'time-calendar',
        component: 'DateConverter',
      },
    ],
  },
  {
    id: 'text-tools',
    name: 'ابزارهای متنی',
    icon: 'Wrench',
    tools: [
      {
        id: 'calculator',
        name: 'ماشین حساب',
        description: 'ماشین حساب با تاریخچه محاسبات',
        icon: 'Calculator',
        category: 'text-tools',
        component: 'Calculator',
      },
      {
        id: 'unit-converter',
        name: 'تبدیل واحد',
        description: 'تبدیل واحدهای طول، وزن، دما و...',
        icon: 'Ruler',
        category: 'text-tools',
        component: 'UnitConverter',
      },
      {
        id: 'word-counter',
        name: 'شمارنده کلمات',
        description: 'شمارش کاراکترها، کلمات و جملات',
        icon: 'TextCursorInput',
        category: 'text-tools',
        component: 'WordCounter',
      },
      {
        id: 'letter-converter',
        name: 'مبدل حروف',
        description: 'تبدیل بین حروف فارسی، عربی و انگلیسی',
        icon: 'Languages',
        category: 'text-tools',
        component: 'LetterConverter',
      },
    ],
  },
  {
    id: 'network-tools',
    name: 'ابزارهای شبکه',
    icon: 'Globe',
    tools: [
      {
        id: 'ip-lookup',
        name: 'اطلاعات IP',
        description: 'اطلاعات کامل آی‌پی با موقعیت مکانی',
        icon: 'MapPin',
        category: 'network-tools',
        component: 'IPLookup',
      },
      {
        id: 'dns-lookup',
        name: 'بررسی DNS',
        description: 'بررسی رکوردهای DNS دامنه',
        icon: 'Search',
        category: 'network-tools',
        component: 'DNSLookup',
      },
      {
        id: 'subnet-calculator',
        name: 'محاسبه زیرشبکه',
        description: 'محاسبه جزئیات زیرشبکه و CIDR',
        icon: 'Network',
        category: 'network-tools',
        component: 'SubnetCalculator',
      },
      {
        id: 'http-header-checker',
        name: 'بررسی هدرهای HTTP',
        description: 'بررسی هدرهای امنیتی و فنی سایت',
        icon: 'FileCode',
        category: 'network-tools',
        component: 'HttpHeaderChecker',
        comingSoon: true,
      },
      {
        id: 'ssl-checker',
        name: 'بررسی گواهی SSL',
        description: 'بررسی وضعیت گواهی SSL/HTTPS',
        icon: 'ShieldCheck',
        category: 'network-tools',
        component: 'SSLChecker',
        comingSoon: true,
      },
      {
        id: 'port-scanner',
        name: 'اسکنر پورت',
        description: 'بررسی پورت‌های رایج سرور',
        icon: 'Radio',
        category: 'network-tools',
        component: 'PortScanner',
      },
    ],
  },
  {
    id: 'security-tools',
    name: 'ابزارهای امنیتی',
    icon: 'Shield',
    tools: [
      {
        id: 'password-generator',
        name: 'تولید رمز عبور',
        description: 'تولید رمز عبور قوی و امن',
        icon: 'KeyRound',
        category: 'security-tools',
        component: 'PasswordGenerator',
      },
      {
        id: 'text-encryptor',
        name: 'رمزنگاری متن',
        description: 'رمزنگاری و رمزگشایی متن',
        icon: 'Lock',
        category: 'security-tools',
        component: 'TextEncryptor',
      },
    ],
  },
  {
    id: 'media',
    name: 'ابزارهای رسانه‌ای',
    icon: 'Image',
    tools: [
      {
        id: 'image-compressor',
        name: 'فشرده‌ساز تصویر',
        description: 'فشرده‌سازی تصاویر بدون افت کیفیت',
        icon: 'FileImage',
        category: 'media',
        component: 'ImageCompressor',
      },
      {
        id: 'image-to-pdf',
        name: 'تبدیل عکس به PDF',
        description: 'تبدیل چندین تصویر به یک فایل PDF',
        icon: 'FileText',
        category: 'media',
        component: 'ImageToPdf',
      },
      {
        id: 'speech-to-text',
        name: 'تبدیل گفتار به متن',
        description: 'تبدیل صدای فارسی و انگلیسی به متن',
        icon: 'Mic',
        category: 'media',
        component: 'SpeechToText',
      },
    ],
  },
  {
    id: 'social',
    name: 'ابزارهای سوشال مدیا',
    icon: 'Share2',
    tools: [
      {
        id: 'instagram-bio',
        name: 'بیو ژنراتور اینستاگرام',
        description: 'تولید بیو حرفه‌ای برای اینستاگرام',
        icon: 'UserCircle',
        category: 'social',
        component: 'InstagramBio',
      },
      {
        id: 'instagram-post-time',
        name: 'بهترین زمان پست',
        description: 'پیدا کردن بهترین زمان انتشار پست',
        icon: 'CalendarClock',
        category: 'social',
        component: 'InstagramPostTime',
      },
      {
        id: 'social-media-preview',
        name: 'پیش‌نمایش پست سوشال مدیا',
        description: 'پیش‌نمایش پست در پلتفرم‌های مختلف',
        icon: 'Eye',
        category: 'social',
        component: 'SocialMediaPreview',
      },
      {
        id: 'youtube-earnings',
        name: 'محاسبه درآمد یوتیوب',
        description: 'برآورد درآمد از یوتیوب بر اساس بازدید',
        icon: 'DollarSign',
        category: 'social',
        component: 'YoutubeEarnings',
      },
      {
        id: 'engagement-calculator',
        name: 'محاسبه نرخ تعامل',
        description: 'محاسبه نرخ تعامل شبکه‌های اجتماعی',
        icon: 'TrendingUp',
        category: 'social',
        component: 'EngagementCalculator',
      },
    ],
  },
  {
    id: 'webmaster',
    name: 'ابزارهای وبمستر',
    icon: 'Code',
    tools: [
      {
        id: 'diff-checker',
        name: 'بررسی تفاوت متن',
        description: 'مقایسه دو متن و نمایش تفاوت‌ها',
        icon: 'ArrowLeftRight',
        category: 'webmaster',
        component: 'DiffChecker',
      },
      {
        id: 'seo-analyzer',
        name: 'آنالیز سئو',
        description: 'تحلیل محتوا و متا تگ‌ها برای بهینه‌سازی سئو',
        icon: 'Search',
        category: 'webmaster',
        component: 'SeoAnalyzer',
      },
      {
        id: 'pdf-invoice',
        name: 'فاکتور PDF',
        description: 'ساخت و چاپ فاکتور حرفه‌ای با خروجی PDF',
        icon: 'FileText',
        category: 'webmaster',
        component: 'PdfInvoice',
      },
      {
        id: 'json-schema-generator',
        name: 'تولید JSON Schema',
        description: 'تولید JSON Schema از JSON یا دستی',
        icon: 'Braces',
        category: 'webmaster',
        component: 'JsonSchemaGenerator',
      },
    ],
  },
];

export function getAllTools(): ToolConfig[] {
  return toolCategories.flatMap((cat) => cat.tools);
}

export function getToolById(id: string): ToolConfig | undefined {
  return getAllTools().find((t) => t.id === id);
}