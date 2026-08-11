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
      { id: "calculator", name: "ماشین‌حساب", description: "ماشین‌حساب پیشرفته", icon: "Calculator", component: "Calculator", seoTip: "ماشین‌حساب آنلاین رایگان با قابلیت محاسبات علمی و هیستوری" },
      { id: "bmi", name: "شاخص توده بدنی", description: "محاسبه BMI و بررسی وضعیت وزن", icon: "Scale", component: "BMI", seoTip: "محاسبه شاخص توده بدنی (BMI) و بررسی وضعیت وزن ایده‌آل" },
      { id: "interest", name: "سود بانکی", description: "محاسبه سود سپرده و وام بانکی", icon: "TrendingUp", component: "Interest" },
      { id: "percent", name: "محاسبه درصد", description: "انواع محاسبات درصدی", icon: "Percent", component: "Percent" },
      { id: "area", name: "مساحت و محیط", description: "مساحت و محیط اشکال هندسی", icon: "Square", component: "Area" },
      { id: "age", name: "محاسبه سن", description: "محاسبه دقیق سن شمسی", icon: "Cake", component: "Age" },
      { id: "salary", name: "محاسبه حقوق", description: "محاسبه حقوق خالص از ناخالص", icon: "Banknote", component: "Salary" },
      { id: "salary-tax", name: "مالیات حقوق", description: "محاسبه مالیات حقوق بر اساس جدول مالیاتی", icon: "FileText", component: "SalaryTax", seoTip: "محاسبه آنلاین مالیات حقوق بر اساس جدول مالیاتی سال ۱۴۰۵" },
      { id: "eidi-sanavat", name: "عیدی و سنوات", description: "محاسبه عیدی و حق سنوات کارگران", icon: "Gift", component: "EidiSanavat" },
      { id: "insurance", name: "بیمه تامین اجتماعی", description: "محاسبه حق بیمه سهم کارگر و کارفرما", icon: "Shield", component: "Insurance" },
      { id: "housing-allowance", name: "حق مسکن و مزایا", description: "محاسبه حق مسکن، بن خواربار و حق اولاد", icon: "Home", component: "HousingAllowance" },
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
      { id: "base64", name: "رمزگذاری Base64", description: "رمزگذاری و رمزگشایی Base64", icon: "Lock", component: "Base64" },
      { id: "number-to-words", name: "عدد به حروف", description: "تبدیل اعداد به حروف فارسی", icon: "Type", component: "NumberToWords" },
      { id: "timezone-converter", name: "تبدیل زمان", description: "ساعت شهرهای مختلف جهان", icon: "Clock", component: "TimezoneConverter" },
      { id: "base-converter", name: "تبدیل مبنای اعداد", description: "تبدیل بین ده‌دهی، دودویی، هشت‌هشتی و شانزده‌شانزدهی", icon: "Binary", component: "BaseConverter" },
      { id: "data-unit-converter", name: "تبدیل واحد داده", description: "تبدیل بین بایت، کیلوبایت، مگابایت و...", icon: "HardDrive", component: "DataUnitConverter" },
    ],
  },
  {
    id: "text",
    name: "متنی",
    icon: "Type",
    tools: [
      { id: "word-counter", name: "شمارنده کلمات", description: "شمارش کلمات و کاراکترها", icon: "Hash", component: "WordCounter", seoTip: "شمارش آنلاین کلمات، کاراکترها و جملات متن فارسی" },
      { id: "text-tools", name: "ابزارهای متنی", description: "حذف فاصله‌های اضافی و سطرهای خالی", icon: "TextCursorInput", component: "TextTools" },
      { id: "letter-converter", name: "تبدیل حروف", description: "تبدیل حروف فارسی و انگلیسی", icon: "Languages", component: "LetterConverter" },
      { id: "find-replace", name: "جایگزینی متن", description: "جستجو و جایگزینی در متن", icon: "FindReplace", component: "FindReplace" },
      { id: "remove-duplicates", name: "حذف خطوط تکراری", description: "حذف خطوط و کلمات تکراری", icon: "ListFilter", component: "RemoveDuplicates" },
      { id: "sort-lines", name: "مرتب‌سازی خطوط", description: "مرتب‌سازی الفبایی خطوط", icon: "ArrowDownUp", component: "SortLines" },
      { id: "reverse-text", name: "وارون‌ساز متن", description: "برعکس کردن متن و کلمات", icon: "RotateCcw", component: "ReverseText" },
      { id: "line-numbers", name: "شماره‌گذاری خطوط", description: "اضافه کردن شماره به خطوط", icon: "ListOrdered", component: "LineNumbers" },
      { id: "lorem-ipsum", name: "لورم ایپسوم فارسی", description: "متن ساختگی فارسی", icon: "FileText", component: "LoremIpsum" },
    ],
  },
  {
    id: "dev",
    name: "توسعه‌دهندگان",
    icon: "Code",
    tools: [
      { id: "json-formatter", name: "فرمت‌کننده JSON", description: "فرمت و اعتبارسنجی JSON", icon: "Braces", component: "JsonFormatter", seoTip: "فرمت‌کننده و اعتبارسنجی JSON آنلاین — کد خود را مرتب کنید" },
      { id: "hash-generator", name: "هش مولد", description: "تولید هش SHA-1 و SHA-256", icon: "Fingerprint", component: "HashGenerator" },
      { id: "css-minifier", name: "مینی‌فایر CSS/JS", description: "فشرده‌سازی کدهای CSS و JS", icon: "Minimize2", component: "CssMinifier" },
      { id: "meta-tag-generator", name: "تولیدگر متاتگ", description: "تولید متاتگ‌های HTML و SEO", icon: "Search", component: "MetaTagGenerator" },
      { id: "regex-tester", name: "تستر Regex", description: "تست و عیب‌یابی عبارات باقاعده", icon: "Code2", component: "RegexTester" },
      { id: "url-encoder", name: "رمزگذاری URL", description: "Encode و Decode عبارات URL", icon: "Link2", component: "UrlEncoder" },
      { id: "html-minifier", name: "مینی‌فایر HTML", description: "فشرده‌سازی و بهینه‌سازی کد HTML", icon: "FileCode2", component: "HtmlMinifier" },
      { id: "sql-formatter", name: "فرمت‌کننده SQL", description: "فرمت و زیباسازی کدهای SQL", icon: "Table2", component: "SqlFormatter" },
      { id: "crontab-generator", name: "تولیدگر Crontab", description: "ساخت عبارت زمان‌بندی لینوکس", icon: "Terminal", component: "CrontabGenerator" },
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
      { id: "unix-timestamp", name: "یونیکس تایم‌استمپ", description: "تبدیل تایم‌استمپ به تاریخ و بالعکس", icon: "Clock", component: "UnixTimestamp" },
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
