"use client"

import { useLanguage } from "@/lib/language"
import Link from "next/link"
import { Search } from "lucide-react"

export function HeroSection() {
  const { language } = useLanguage()

  return (
    <section className="w-full" dir="rtl">

      {/* Hero */}
      <div className="flex flex-col items-center justify-center pt-24 px-4">
        <h1 className="text-7xl font-bold text-[#0a192f] text-center mb-8">
          صرحي.. وجهتك الأولى للأعمال الرقمية والخدمات.. بلا حدود
        </h1>
        <p className="text-2xl text-gray-500 text-center max-w-4xl">
          منصة عالمية تجمع بين السوق الرقمي وأدوات الذكاء الاصطناعي واقتصاد المبدعين والتعليم في مكان واحد
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-6 mb-6">

        {/* Card 1 */}
        <Link href="/marketplace/resha" className="relative rounded-[18px] p-5 overflow-hidden min-h-[150px] flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:brightness-105"
          style={{background:"linear-gradient(135deg,#0f172a 0%,#1e3a8a 100%)"}}>
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/4 pointer-events-none" />
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">🎨</span>
            <span className="text-[10px] px-3 py-1 rounded-full bg-white/15 text-white/90">250K+ منتج</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-2">الحلول الرقمية</h3>
            <div className="flex flex-wrap gap-1">
              {["ريشة","الأثير","إرث","حلول"].map(t => (
                <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-white/18 text-white/95">{t}</span>
              ))}
            </div>
          </div>
        </Link>

        {/* Card 2 */}
        <Link href="/marketplace/services" className="relative rounded-[18px] p-5 overflow-hidden min-h-[150px] flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:brightness-105"
          style={{background:"linear-gradient(135deg,#064e3b 0%,#059669 100%)"}}>
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/4 pointer-events-none" />
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">💼</span>
            <span className="text-[10px] px-3 py-1 rounded-full bg-white/15 text-white/90">80K+ خدمة</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-2">الخدمات والأعمال</h3>
            <div className="flex flex-wrap gap-1">
              {["سند","صنعة","ميدان"].map(t => (
                <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-white/18 text-white/95">{t}</span>
              ))}
            </div>
          </div>
        </Link>

        {/* Card 3 */}
        <Link href="/marketplace/knowledge" className="relative rounded-[18px] p-5 overflow-hidden min-h-[150px] flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:brightness-105"
          style={{background:"linear-gradient(135deg,#4c1d95 0%,#7c3aed 100%)"}}>
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/4 pointer-events-none" />
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">📚</span>
            <span className="text-[10px] px-3 py-1 rounded-full bg-white/15 text-white/90">45K+ دورة</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-2">المعرفة والتطوير</h3>
            <div className="flex flex-wrap gap-1">
              {["مداد","مهارة"].map(t => (
                <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-white/18 text-white/95">{t}</span>
              ))}
            </div>
          </div>
        </Link>

        {/* Card 4 */}
        <Link href="/marketplace/community" className="relative rounded-[18px] p-5 overflow-hidden min-h-[150px] flex flex-col justify-between cursor-pointer transition-all duration-200 hover:scale-[1.03] hover:brightness-105"
          style={{background:"linear-gradient(135deg,#7c2d12 0%,#ea580c 100%)"}}>
          <div className="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-white/4 pointer-events-none" />
          <div className="flex items-start justify-between mb-4">
            <span className="text-3xl">🤝</span>
            <span className="text-[10px] px-3 py-1 rounded-full bg-white/15 text-white/90">50K+ عضو</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white mb-2">المجتمع</h3>
            <div className="flex flex-wrap gap-1">
              {["عون"].map(t => (
                <span key={t} className="text-[10px] px-2 py-1 rounded-full bg-white/18 text-white/95">{t}</span>
              ))}
            </div>
          </div>
        </Link>

      </div>

      {/* Search */}
      <div className="px-8 pb-5 text-center">
        <div className="flex items-center gap-3 bg-background border-2 border-border rounded-2xl px-4 py-3 max-w-xl mx-auto mb-3">
          <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            placeholder="ابحث عن قوالب، خدمات، دورات..."
            className="flex-1 border-none outline-none text-sm bg-transparent text-foreground placeholder:text-muted-foreground text-right"
            dir="rtl"
          />
          <button className="bg-[#1e3a8a] text-white text-xs px-4 py-2 rounded-xl font-bold flex-shrink-0">
            بحث ذكي
          </button>
        </div>
        <div className="flex gap-2 justify-center flex-wrap">
          {["🔍 أبحث عن خدمة","💼 أريد بيع أعمالي","💡 أحتاج استشارة","✨ انضم كمبدع"].map(btn => (
            <button key={btn} className="text-xs px-4 py-2 rounded-full border border-border text-muted-foreground hover:border-[#1e3a8a] hover:text-[#1e3a8a] hover:bg-blue-50 transition-all">
              {btn}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center border-t border-border py-4 px-8">
        <div className="text-center px-6">
          <div className="text-base font-bold">+50K</div>
          <div className="text-xs text-muted-foreground">مبدع نشط</div>
        </div>
        <div className="w-px h-7 bg-border" />
        <div className="text-center px-6">
          <div className="text-base font-bold">+2M</div>
          <div className="text-xs text-muted-foreground">منتج رقمي</div>
        </div>
        <div className="w-px h-7 bg-border" />
        <div className="text-center px-6">
          <div className="text-base font-bold">+10M</div>
          <div className="text-xs text-muted-foreground">عملية تحميل</div>
        </div>
      </div>

    </section>
  )
}
