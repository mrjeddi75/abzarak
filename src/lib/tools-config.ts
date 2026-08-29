export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  component: string;
  seoTip?: string;
  comingSoon?: boolean;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  tools: Tool[];
}

export const toolCategories: ToolCategory[] = [
  {
    id: "home",
    name: "خانه",
    icon: "Home",
    tools: [],
  },
  {
    id: "calc",
    name: "محاسباتی",
    icon: "Calculator",
    tools: [
      { id: "bmi", name: "شاخص توده بدنی", description: "محاسبه BMI و بررسی وضعیت وزن", icon: "Scale", component: "BMI" },
      { id: "interest", name: "سود بانکی", description: "محاسبه سود سپرده و وام بانکی", icon: "TrendingUp", component: "Interest" },
      { id: "percent", name: "محاسبه درصد", description: "انواع محاسبات درصدی", icon: "Percent", component: "Percent" },
      { id: "area", name: "مساحت و محیط", description: "مساحت و محیط اشکال هندسی", icon: "Square", component: "Area" },
      { id: "age", name: "محاسبه سن", description: "محاسبه دقیق سن شمسی", icon: "Cake", component: "Age" },
    ],
  },
  {
    id: "conv",
    name: "تبدیل‌ها",
    icon: "ArrowRightLeft",
    tools: [
      { id: "unit-converter", name: "تبدیل واحد", description: "تبدیل بین واحدهای مختلف اندازه‌گیری", icon: "Ruler", component: "UnitConverter" },
      { id: "date-converter", name: "تبدیل تاریخ", description: "تبدیل بین تاریخ شمسی، میلادی و قمری", icon: "CalendarDays", component: "DateConverter", seoTip: "تبدیل تاریخ شمسی به میلادی و قمری و بالعکس" },
      { id: "color-converter", name: "تبدیل رنگ", description: "تبدیل بین HEX، RGB و HSL", icon: "Palette", component: "ColorConverter" },
      { id: "number-to-words", name: "عدد به حروف", description: "تبدیل اعداد به حروف فارسی", icon: "Type", component: "NumberToWords" },
      { id: "base-converter", name: "تبدیل مبنای اعداد", description: "تبدیل بین ده‌دهی، دودویی، هشت‌هشتی و شانزده‌شانزدهی", icon: "Binary", component: "BaseConverter" },
      { id: "data-unit-converter", name: "تبدیل واحد داده", description: "تبدیل بین بایت، کیلوبایت، مگابایت و...", icon: "HardDrive", component: "DataUnitConverter" },
      { id: "crypto-converter", name: "تبدیل رمزارز", description: "تبدیل قیمت رمزارزها به ارزهای رایج", icon: "Bitcoin", component: "CryptoConverter", seoTip: "تبدیل آنلاین قیمت بیت‌کوین، اتریوم و سایر رمزارزها" },
    ],
  },
  {
    id: "text",
    name: "متنی",
    icon: "Type",
    tools: [
      { id: "word-counter", name: "شمارنده کلمات", description: "شمارش کلمات و کاراکترها", icon: "Hash", component: "WordCounter", seoTip: "شمارش آنلاین کلمات، کاراکترها و جملات متن فارسی" },
      { id: "text-tools", name: "ابزارهای متنی", description: "حذف فاصله‌های اضافی و سطرهای خالی", icon: "TextCursorInput", component: "TextTools" },
      { id: "find-replace", name: "جایگزینی متن", description: "جستجو و جایگزینی در متن", icon: "FindReplace", component: "FindReplace" },
      { id: "remove-duplicates", name: "حذف خطوط تکراری", description: "حذف خطوط و کلمات تکراری", icon: "ListFilter", component: "RemoveDuplicates" },
      { id: "sort-lines", name: "مرتب‌سازی خطوط", description: "مرتب‌سازی الفبایی خطوط", icon: "ArrowDownUp", component: "SortLines" },
      { id: "line-numbers", name: "شماره‌گذاری خطوط", description: "اضافه کردن شماره به خطوط", icon: "ListOrdered", component: "LineNumbers" },
    ],
  },
  {
    id: "dev",
    name: "توسعه‌دهندگان",
    icon: "Code",
    tools: [
      { id: "hash-generator", name: "هش مولد", description: "تولید هش SHA-1 و SHA-256", icon: "Fingerprint", component: "HashGenerator" },
      { id: "meta-tag-generator", name: "تولیدگر متاتگ", description: "تولید متاتگ‌های HTML و SEO", icon: "Search", component: "MetaTagGenerator" },
      { id: "regex-tester", name: "تستر Regex", description: "تست و عیب‌یابی عبارات باقاعده", icon: "Code2", component: "RegexTester" },
      { id: "sql-formatter", name: "فرمت‌کننده SQL", description: "فرمت و زیباسازی کدهای SQL", icon: "Table2", component: "SqlFormatter" },
      { id: "jwt-decoder", name: "دیکودر JWT", description: "رمزگشایی و بررسی توکن‌های JWT", icon: "FileCode", component: "JwtDecoder" },
      { id: "checksum", name: "چک‌سام مولد", description: "تولید هش SHA برای متن و فایل", icon: "Hash", component: "ChecksumGenerator" },
    ],
  },
  {
    id: "css",
    name: "CSS / طراحی",
    icon: "Paintbrush",
    tools: [
      { id: "shadow-generator", name: "تولیدگر سایه", description: "تولید کد box-shadow CSS", icon: "SquareDashedBottom", component: "ShadowGenerator" },
      { id: "gradient-generator", name: "تولیدگر گرادیان", description: "تولید کد gradient CSS", icon: "Blend", component: "GradientGenerator" },
      { id: "border-radius-generator", name: "تولیدگر border-radius", description: "تولید کد border-radius CSS", icon: "SquareDot", component: "BorderRadiusGenerator" },
      { id: "color-palette", name: "پالت رنگ‌ساز", description: "تولید پالت رنگ‌های هماهنگ", icon: "Pipette", component: "ColorPalette" },
    ],
  },
  {
    id: "util",
    name: "کاربردی",
    icon: "Wrench",
    tools: [
      { id: "deng-calculator", name: "دنگ‌محاس", description: "محاسبه سهم هر نفر — دنگ", icon: "Receipt", component: "BillSplitter" },
      { id: "fuel-calculator", name: "محاسبه مصرف بنزین", description: "محاسبه هزینه و مصرف سوخت", icon: "Fuel", component: "FuelCalculator" },
      { id: "discount", name: "ماشین‌حساب تخفیف", description: "محاسبه تخفیف چند مرحله‌ای", icon: "BadgePercent", component: "Discount" },
      { id: "password-generator", name: "تولید رمز عبور", description: "تولید رمز عبور تصادفی امن", icon: "KeyRound", component: "PasswordGenerator", seoTip: "تولید رمز عبور امن و تصادفی با طول و کاراکتر دلخواه" },
      { id: "timer", name: "کرنومتر و تایمر", description: "ساعت‌گذر و شمارش معکوس", icon: "Timer", component: "TimerComponent" },
      { id: "random-picker", name: "تصادفی و قرعه‌کشی", description: "عدد تصادفی و قرعه‌کشی", icon: "Shuffle", component: "RandomPicker" },
      { id: "qrcode", name: "تولید QR Code", description: "تولید کد QR از متن و لینک", icon: "QrCode", component: "QRCodeGenerator" },
      { id: "image-to-base64", name: "تصویر به Base64", description: "تبدیل تصویر به کد Base64", icon: "Image", component: "ImageToBase64" },
    ],
  },
  {
    id: "network",
    name: "ابزارهای شبکه",
    icon: "Globe",
    tools: [
      { id: "ip-lookup", name: "استعلام IP", description: "اطلاعات کامل آدرس IP", icon: "MapPin", component: "IPLookup" },
      { id: "dns-lookup", name: "استعلام DNS", description: "بررسی رکوردهای DNS دامنه", icon: "Search", component: "DNSLookup" },
      { id: "subnet-calculator", name: "محاسبه Subnet", description: "محاسبه شبکه و زیرشبکه IP", icon: "Network", component: "SubnetCalculator" },
      { id: "ping-tool", name: "پینگ", description: "پینگ سایت و سرور برای بررسی پاسخ‌دهی", icon: "Activity", component: "PingTool", seoTip: "بررسی سرعت پاسخ‌دهی سایت‌ها و سرورها با ابزار پینگ آنلاین" },
      { id: "traceroute-tool", name: "تریس‌روت", description: "مسیریابی مسیر شبکه تا مقصد", icon: "Route", component: "TracerouteTool", seoTip: "بررسی مسیر شبکه و تعداد هامپ‌ها تا سرور مقصد" },
      { id: "speed-test", name: "تست سرعت اینترنت", description: "تست سرعت دانلود، آپلود و پینگ", icon: "Gauge", component: "SpeedTest", seoTip: "تست سرعت اینترنت — دانلود، آپلود و پینگ" },
    ],
  },
  {
    id: "weather",
    name: "هواشناسی",
    icon: "CloudSun",
    tools: [
      { id: "weather", name: "هواشناسی ایران", description: "وضعیت هوا و پیش‌بینی شهرهای ایران", icon: "CloudSun", component: "Weather", seoTip: "بررسی وضعیت آب‌وهوا و پیش‌بینی بارش و دمای شهرهای ایران" },
    ],
  },
  {
    id: "datetime",
    name: "زمان و تاریخ",
    icon: "Clock",
    tools: [
      { id: "shamsi-calendar", name: "تقویم شمسی", description: "تقویم جلالی با مناسبت‌ها", icon: "Calendar", component: "ShamsiCalendar" },
    ],
  },
  {
    id: "encrypt",
    name: "امنیت و رمزگذاری",
    icon: "Shield",
    tools: [
      { id: "text-encryptor", name: "رمزگذاری متن", description: "رمزگذاری سزار و Base64", icon: "Lock", component: "TextEncryptor" },
    ],
  },
];
