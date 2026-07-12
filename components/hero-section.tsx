"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search } from "lucide-react"
import { useLanguage } from "@/lib/language"

export function HeroSection() {
  const { language } = useLanguage()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = () => {
    const q = searchQuery.trim()
    router.push(q ? `/marketplace?q=${encodeURIComponent(q)}` : "/marketplace")
  }

  const cards = [
    {
      emoji: "🎨",
      title: "الحلول الرقمية",
      titleHref: "/marketplace/digital",
      badge: "250K+ منتج",
      gradient: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
      subs: [
        { emoji: "🖌️", name: "ريشة", desc: "موارد التصميم والإبداع البصري", href: "/marketplace/resha" },
        { emoji: "🎬", name: "الأثير", desc: "إنتاج الفيديو والصوت الاحترافي", href: "/marketplace/atheer" },
        { emoji: "�", name: "إرث", desc: "التصوير والأصول الرقمية", href: "/marketplace/erth" },
        { emoji: "💻", name: "حلول", desc: "برمجة وتطوير تطبيقات وأنظمة", href: "/marketplace/holool" },
      ],
    },
    {
      emoji: "💼",
      title: "الخدمات والأعمال",
      titleHref: "/marketplace/services",
      badge: "80K+ خدمة",
      gradient: "linear-gradient(135deg, #064e3b 0%, #059669 100%)",
      subs: [
        { emoji: "🤝", name: "سند", desc: "خدمات دعم الأعمال والمشاريع", href: "/marketplace/sanad" },
        { emoji: "🛠️", name: "صنعة", desc: "حرف وخدمات يدوية ومهنية", href: "/marketplace/sena3a" },
        { emoji: "🏆", name: "ميدان", desc: "مشاريع تنافسية وعطاءات", href: "/marketplace/maydan" },
      ],
    },
    {
      emoji: "📚",
      title: "المعرفة والتطوير",
      titleHref: "/marketplace/knowledge",
      badge: "45K+ دورة",
      gradient: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)",
      subs: [
        { emoji: "✍️", name: "مداد", desc: "كتابة محتوى ونشر رقمي احترافي", href: "/marketplace/mdad" },
        { emoji: "🎓", name: "مهارة", desc: "دورات تدريبية واستشارات تطويرية", href: "/marketplace/mahara" },
      ],
    },
    {
      emoji: "🤝",
      title: "المجتمع",
      titleHref: "/marketplace/community",
      badge: "50K+ عضو",
      gradient: "linear-gradient(135deg, #7c2d12 0%, #ea580c 100%)",
      subs: [
        { emoji: "💬", name: "عون", desc: "تواصل وتعاون ودعم متبادل", href: "/marketplace/awn" },
      ],
    },
  ]

  return (
    <section className="w-full overflow-hidden" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>

      {/* HERO TEXT */}
      <div className="text-center px-6 pt-10 pb-7">
        <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 text-xs font-semibold px-4 py-2 rounded-full mb-5 border border-purple-200">
          <span>✨</span>
          <span>منصة الإنتاج الرقمي الأولى</span>
        </div>
        <h1
          className="font-black mb-3 leading-snug max-w-2xl mx-auto"
          style={{ fontSize: "clamp(18px, 2.5vw, 26px)" }}
        >
          صرحي.. وجهتك الأولى{" "}
          <span style={{ color: "#1e3a8a" }}>للأعمال الرقمية والخدمات.. بلا حدود</span>
        </h1>
        <p
          className="text-muted-foreground leading-relaxed max-w-xl mx-auto"
          style={{ fontSize: "clamp(11px, 1.4vw, 14px)" }}
        >
          منصة عالمية تجمع بين السوق الرقمي وأدوات الذكاء الاصطناعي واقتصاد المبدعين والتعليم في مكان واحد
        </p>
      </div>

      {/* CATEGORY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-6 mb-7">
        {cards.map((card) => (
          <div
            key={card.title}
            className="relative rounded-2xl p-6 overflow-hidden flex flex-col gap-3 transition-all duration-200 hover:scale-[1.02] hover:brightness-110"
            style={{ background: card.gradient, minHeight: "300px" }}
          >
            {/* deco circles */}
            <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.06)" }} />
            <div className="absolute -bottom-5 -right-5 w-20 h-20 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.04)" }} />

            {/* CARD HEADER */}
            <div className="flex items-center justify-between relative z-10">
              <Link
                href={card.titleHref}
                className="flex items-center gap-2 group"
                onClick={(e) => e.stopPropagation()}
              >
                <span style={{ fontSize: "26px", lineHeight: 1 }}>{card.emoji}</span>
                <span
                  className="font-bold text-white group-hover:underline underline-offset-2"
                  style={{ fontSize: "17px" }}
                >
                  {card.title}
                </span>
              </Link>
              <span
                className="text-white/90 font-semibold rounded-full px-3 py-1"
                style={{ fontSize: "11px", background: "rgba(255,255,255,0.15)" }}
              >
                {card.badge}
              </span>
            </div>

            {/* DIVIDER */}
            <div className="relative z-10" style={{ height: "0.5px", background: "rgba(255,255,255,0.2)" }} />

            {/* SUBCATEGORIES */}
            <div className="flex flex-col gap-4 relative z-10">
              {card.subs.map((sub) => (
                <Link
                  key={sub.name}
                  href={sub.href}
                  className="flex items-start gap-2 group"
                >
                  <span style={{ fontSize: "18px", marginTop: "1px", flexShrink: 0 }}>{sub.emoji}</span>
                  <div>
                    <div
                      className="font-bold text-white group-hover:underline underline-offset-1 leading-tight"
                      style={{ fontSize: "14px" }}
                    >
                      {sub.name}
                    </div>
                    <div
                      className="leading-snug mt-0.5"
                      style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)" }}
                    >
                      {sub.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SEARCH */}
      <div className="px-6 pb-6 text-center">
        <div
          className="flex items-center gap-3 mx-auto mb-3 rounded-2xl px-4 py-3 border-2"
          style={{ maxWidth: "580px", background: "var(--color-background-primary)", borderColor: "var(--color-border-secondary)" }}
        >
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: "var(--color-text-secondary)" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="ابحث عن قوالب، خدمات، دورات..."
            dir="rtl"
            className="flex-1 border-none outline-none bg-transparent text-right"
            style={{ fontSize: "13px", fontFamily: "'Cairo', sans-serif", color: "var(--color-text-primary)" }}
          />
          <button
            onClick={handleSearch}
            className="flex-shrink-0 text-white font-bold rounded-xl px-4 py-2"
            style={{ background: "#1e3a8a", fontSize: "12px", fontFamily: "'Cairo', sans-serif" }}
          >
            بحث ذكي
          </button>
        </div>
        <div className="flex gap-2 justify-center flex-wrap">
          {[
            { label: "🔍 أبحث عن خدمة",   href: "/marketplace?q=%D8%AE%D8%AF%D9%85%D8%A9" },
            { label: "💼 أريد بيع أعمالي", href: "/creator/dashboard/products/new" },
            { label: "💡 أحتاج استشارة",   href: "/marketplace?q=%D8%A7%D8%B3%D8%AA%D8%B4%D8%A7%D8%B1%D8%A9" },
            { label: "✨ انضم كمبدع",       href: "/auth/register" },
          ].map((btn) => (
            <Link
              key={btn.label}
              href={btn.href}
              className="rounded-full border transition-all"
              style={{
                fontSize: "11px",
                padding: "7px 16px",
                fontFamily: "'Cairo', sans-serif",
                borderColor: "var(--color-border-secondary)",
                background: "transparent",
                color: "var(--color-text-secondary)",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.borderColor = "#1e3a8a"
                el.style.color = "#1e3a8a"
                el.style.background = "#eff6ff"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.borderColor = "var(--color-border-secondary)"
                el.style.color = "var(--color-text-secondary)"
                el.style.background = "transparent"
              }}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </div>

    </section>
  )
}
