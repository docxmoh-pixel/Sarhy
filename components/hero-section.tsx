"use client"
import Link from "next/link"
import { Search } from "lucide-react"

export function HeroSection() {
  return (
    <section className="w-full pt-24 pb-12" dir="rtl">
      <div className="text-center px-4 mb-16">
        <h1 className="text-6xl font-bold text-[#1e3a8a] mb-6 leading-tight">
          صرحي.. وجهتك الأولى للأعمال الرقمية والخدمات.. بلا حدود
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          منصة عالمية تجمع بين السوق الرقمي وأدوات الذكاء الاصطناعي واقتصاد المبدعين والتعليم في مكان واحد
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 max-w-6xl mx-auto">
        {[
          { title: "الحلول الرقمية", color: "bg-blue-600", icon: "🎨" },
          { title: "الخدمات والأعمال", color: "bg-emerald-600", icon: "💼" },
          { title: "المعرفة والتطوير", color: "bg-purple-600", icon: "📚" },
          { title: "المجتمع", color: "bg-orange-600", icon: "🤝" }
        ].map((item, idx) => (
          <div key={idx} className={`${item.color} rounded-3xl p-8 text-white h-64 flex flex-col justify-between hover:scale-105 transition-transform cursor-pointer shadow-xl`}>
            <span className="text-4xl">{item.icon}</span>
            <h3 className="text-2xl font-bold">{item.title}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}
