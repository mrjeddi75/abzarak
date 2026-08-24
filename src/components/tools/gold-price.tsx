"use client";

import { useState } from "react";
import { Coins, RefreshCw, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const toPersianDigits = (n: number): string => n.toLocaleString("fa-IR");

const formatPrice = (n: number): string => {
 const whole = Math.floor(n);
 const decimal = Math.round((n - whole) * 100);
 return `${toPersianDigits(whole)}` + (decimal > 0 ? ` و ${toPersianDigits(decimal)} دهم‌گرم` : "");
};

interface GoldItem {
 name: string;
 gram: number;
 icon: string;
}

const goldItems: GoldItem[] = [
 { name: "طلای ۱۸ عیار (هر گرم)", gram: 1, icon: "🥇" },
 { name: "سکه بهار آزادی", gram: 8.133, icon: "🪙" },
 { name: "نیم سکه", gram: 4.065, icon: "🪙" },
 { name: "ربع سکه", gram: 2.033, icon: "🪙" },
 { name: "سکه یک گرمی", gram: 1.005, icon: "🪙" },
 { name: "طلای ۲۴ عیار (هر گرم)", gram: 1, icon: "✨" },
];

const karatPurity: Record<string, number> = {
 "18": 0.75,
 "24": 1.0,
 "21": 0.875,
 "14": 0.583,
};

export default function GoldPrice() {
 const [pricePerGram18, setPricePerGram18] = useState<string>("");
 const [selectedKarat, setSelectedKarat] = useState<string>("18");
 const [customGram, setCustomGram] = useState<string>("");
 const [wage, setWage] = useState<string>("0");

 const price = parseFloat(pricePerGram18) || 0;
 const wageVal = parseFloat(wage) || 0;
 const customG = parseFloat(customGram) || 0;

 const getItemPrice = (item: GoldItem) => {
 if (item.name.includes("24 عیار")) {
 return (price / 0.75) * item.gram;
 }
 return price * item.gram;
 };

 const getCustomPrice = () => {
 const purity = karatPurity[selectedKarat] || 0.75;
 const pricePerGram24 = price / 0.75;
 const pricePerGramKarat = pricePerGram24 * purity;
 return pricePerGramKarat * customG;
 };

 const calcPurity = () => {
 const purity = karatPurity[selectedKarat] || 0.75;
 return (purity * 100).toFixed(1);
 };

 return (
   <div className="space-y-6">
     <div className="flex items-center gap-3">
       <Coins className="h-6 w-6 text-primary" />
       <h2 className="text-xl font-bold text-foreground">قیمت طلا و سکه</h2>
     </div>

     {/* Input Section */}
     <div className="glass-card glow-effect p-5 sm:p-6 space-y-5">
       <div className="grid gap-4 sm:grid-cols-2">
         <div>
           <label className="block text-sm font-medium text-foreground mb-1.5">
             قیمت هر گرم طلای ۱۸ عیار (تومان)
           </label>
           <input
             type="number"
             value={pricePerGram18}
             onChange={(e) => setPricePerGram18(e.target.value)}
             placeholder="مثلاً ۳۵۰۰۰۰۰"
             dir="ltr"
             className="w-full h-10 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
           />
         </div>
         <div>
           <label className="block text-sm font-medium text-foreground mb-1.5">
             اجرت ساخت (تومان)
           </label>
           <input
             type="number"
             value={wage}
             onChange={(e) => setWage(e.target.value)}
             placeholder="مثلاً ۵۰۰۰۰"
             dir="ltr"
             className="w-full h-10 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
           />
         </div>
       </div>

       {/* Info */}
       <div className="flex items-start gap-2 rounded-lg border border-border/50 bg-card/50 p-3 text-xs text-muted-foreground leading-relaxed">
         <Info className="h-4 w-4 shrink-0 mt-0.5 text-primary/60" />
         <span>قیمت‌ها بر اساس ورودی شما محاسبه می‌شوند. برای اطلاع از قیمت لحظه‌ای طلا، قیمت هر گرم طلای ۱۸ عیار را از سایت‌های مرجع وارد کنید.</span>
       </div>
     </div>

     {/* Results */}
     {price > 0 && (
       <div className="space-y-4 animate-fade-in-up">
         <p className="text-sm font-medium text-foreground">محاسبه قیمت آیتم‌ها</p>
         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
           {goldItems.map((item) => {
             const itemPrice = getItemPrice(item);
             const withWage = itemPrice + wageVal;
             return (
               <div key={item.name} className="glass-card hover-glow p-4 space-y-2">
                 <div className="flex items-center gap-2">
                   <span className="text-xl">{item.icon}</span>
                   <div className="flex-1 min-w-0">
                     <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                     <p className="text-[10px] text-muted-foreground" dir="ltr">
                       {toPersianDigits(item.gram)} گرم
                     </p>
                   </div>
                 </div>
                 <div className="border-t border-border/40 pt-2 space-y-1">
                   <p className="text-sm font-bold text-primary">
                     {toPersianDigits(Math.round(withWage))} تومان
                   </p>
                   {wageVal > 0 && (
                     <p className="text-[10px] text-muted-foreground">
                       بدون اجرت: {toPersianDigits(Math.round(itemPrice))} تومان
                     </p>
                   )}
                 </div>
               </div>
             );
           })}
         </div>
       </div>
     )}

     {/* Custom Calculator */}
     {price > 0 && (
       <div className="glass-card p-5 sm:p-6 space-y-4 animate-fade-in-up">
         <p className="text-sm font-medium text-foreground">محاسبه قیمت سفارشی</p>
         <div className="grid gap-4 sm:grid-cols-3">
           <div>
             <label className="block text-sm font-medium text-foreground mb-1.5">
               عیار
             </label>
             <select
               value={selectedKarat}
               onChange={(e) => setSelectedKarat(e.target.value)}
               className="w-full h-10 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
             >
               <option value="18">۱۸ عیار (۷۵٪)</option>
               <option value="21">۲۱ عیار (۸۷.۵٪)</option>
               <option value="24">۲۴ عیار (۱۰۰٪)</option>
               <option value="14">۱۴ عیار (۵۸.۳٪)</option>
             </select>
           </div>
           <div>
             <label className="block text-sm font-medium text-foreground mb-1.5">
               وزن (گرم)
             </label>
             <input
               type="number"
               value={customGram}
               onChange={(e) => setCustomGram(e.target.value)}
               placeholder="مثلاً ۵.۵"
               dir="ltr"
               className="w-full h-10 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
             />
           </div>
           <div className="flex items-end">
             <div className="glass-card glow-effect p-4 w-full text-center">
               <p className="text-[10px] text-muted-foreground mb-1">قیمت نهایی</p>
               <p className="text-lg font-bold text-primary">
                 {customG > 0
                   ? `${toPersianDigits(Math.round(getCustomPrice() + wageVal))} تومان`
                   : "—"}
               </p>
             </div>
           </div>
         </div>
         {customG > 0 && (
           <p className="text-xs text-muted-foreground">
             خلوص: {calcPurity()}٪ — وزن: {toPersianDigits(customG)} گرم — عیار: {toPersianDigits(parseInt(selectedKarat))}
           </p>
         )}
       </div>
     )}
   </div>
 );
}
