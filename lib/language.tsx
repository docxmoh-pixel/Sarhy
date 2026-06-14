"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

type Language = "ar" | "en"
type Direction = "rtl" | "ltr"

interface Translations {
  [key: string]: {
    ar: string
    en: string
  }
}

const translations: Translations = {
  // Navigation
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.marketplace": { ar: "السوق", en: "Marketplace" },
  "nav.creators": { ar: "المبدعون", en: "Creators" },
  "nav.enterprise": { ar: "للشركات", en: "Enterprise" },
  "nav.pricing": { ar: "الأسعار", en: "Pricing" },
  "nav.signin": { ar: "تسجيل الدخول", en: "Sign In" },
  "nav.getstarted": { ar: "ابدأ الآن", en: "Get Started" },
  
  // Sections
  "sections.resha": { ar: "ريشة", en: "Resha" },
  "sections.resha.desc": { ar: "موارد التصميم والإبداع البصري", en: "Design resources & visual creativity" },
  "sections.atheer": { ar: "الأثير", en: "Atheer" },
  "sections.atheer.desc": { ar: "إنتاج الفيديو والصوت", en: "Video & audio production" },
  "sections.midad": { ar: "مداد", en: "Midad" },
  "sections.midad.desc": { ar: "منظومة الكتابة والنشر", en: "Writing & publishing ecosystem" },
  "sections.holool": { ar: "حلول", en: "Holool" },
  "sections.holool.desc": { ar: "سوق البرمجيات والأتمتة", en: "Software & automation marketplace" },
  "sections.mahara": { ar: "مهارة", en: "Mahara" },
  "sections.mahara.desc": { ar: "دورات وتدريب واستشارات", en: "Courses, training & consulting" },
  "sections.erth": { ar: "إرث", en: "Erth" },
  "sections.erth.desc": { ar: "التصوير والأصول الرقمية", en: "Photography & digital assets" },
  "sections.aoun": { ar: "عون", en: "Aoun" },
  "sections.aoun.desc": { ar: "دعم المبدعين والمبادرات", en: "Creator & initiative support" },
  
  // Hero
  "hero.badge": { ar: "منصة الإنتاج الرقمي الأولى", en: "The #1 Digital Production Platform" },
  "hero.title.line1": { ar: "صرحي.. وجهتك الأولى", en: "Sarhy.. Your First Destination" },
  "hero.title.line2": { ar: "للأعمال الرقمية والخدمات.. بلا حدود", en: "for Digital Business & Services.. Without Limits" },
  "hero.subtitle": { ar: "منصة عالمية تجمع بين السوق الرقمي وأدوات الذكاء الاصطناعي واقتصاد المبدعين والتعليم في مكان واحد", en: "A global platform combining digital marketplace, AI tools, creator economy, and education in one place" },
  "hero.cta.explore": { ar: "استكشف السوق", en: "Explore Marketplace" },
  "hero.cta.creators": { ar: "انضم كمبدع", en: "Join as Creator" },
  "hero.stats.creators": { ar: "مبدع نشط", en: "Active Creators" },
  "hero.stats.products": { ar: "منتج رقمي", en: "Digital Products" },
  "hero.stats.downloads": { ar: "عملية تحميل", en: "Downloads" },
  
  // Search
  "search.placeholder": { ar: "ابحث عن قوالب، صور، فيديو، موسيقى...", en: "Search templates, images, videos, music..." },
  "search.ai": { ar: "بحث ذكي", en: "AI Search" },
  
  // Categories
  "categories.title": { ar: "استكشف المنصة", en: "Explore the Platform" },
  "categories.subtitle": { ar: "سبعة عوالم من الإبداع الرقمي", en: "Seven worlds of digital creativity" },
  
  // Trending
  "trending.title": { ar: "الأكثر رواجاً", en: "Trending Now" },
  "trending.subtitle": { ar: "اكتشف ما يبحث عنه المبدعون", en: "Discover what creators are looking for" },
  
  // Featured
  "featured.title": { ar: "مبدعون مميزون", en: "Featured Creators" },
  "featured.subtitle": { ar: "تعرف على نخبة المبدعين في صرحي", en: "Meet the elite creators on Sarhy" },
  
  // Stats
  "stats.title": { ar: "أرقام تتحدث", en: "Numbers Speak" },
  "stats.subtitle": { ar: "منصة بحجم طموحاتك", en: "A platform as big as your ambitions" },
  
  // Footer
  "footer.tagline": { ar: "مستقبل الإنتاج الرقمي", en: "The Future of Digital Production" },
  "footer.company": { ar: "الشركة", en: "Company" },
  "footer.about": { ar: "من نحن", en: "About Us" },
  "footer.careers": { ar: "الوظائف", en: "Careers" },
  "footer.press": { ar: "الإعلام", en: "Press" },
  "footer.resources": { ar: "الموارد", en: "Resources" },
  "footer.help": { ar: "مركز المساعدة", en: "Help Center" },
  "footer.docs": { ar: "التوثيق", en: "Documentation" },
  "footer.api": { ar: "واجهة البرمجة", en: "API" },
  "footer.legal": { ar: "قانوني", en: "Legal" },
  "footer.privacy": { ar: "الخصوصية", en: "Privacy" },
  "footer.terms": { ar: "الشروط", en: "Terms" },
  "footer.copyright": { ar: "جميع الحقوق محفوظة", en: "All rights reserved" },
  
  // Common
  "common.viewall": { ar: "عرض الكل", en: "View All" },
  "common.learnmore": { ar: "اعرف المزيد", en: "Learn More" },
  "common.follow": { ar: "متابعة", en: "Follow" },

  // Vendor Registration
  "vendor.title": { ar: "تسجيل بائع جديد", en: "Register as Seller" },
  "vendor.storename": { ar: "اسم المتجر", en: "Store Name" },
  "vendor.storename.placeholder": { ar: "مثال: متجر الإلكترونيات المتميز", en: "Example: Premium Electronics Store" },
  "vendor.slug": { ar: "رابط المتجر (Slug)", en: "Store URL (Slug)" },
  "vendor.slug.prefix": { ar: "sarhy.com/store/", en: "sarhy.com/store/" },
  "vendor.bio": { ar: "وصف المتجر", en: "Store Description" },
  "vendor.bio.placeholder": { ar: "اكتب نبذة قصيرة عن المنتجات التي ستقدمها...", en: "Write a brief description of the products you'll offer..." },
  "vendor.submit": { ar: "تفعيل حساب البائع", en: "Activate Seller Account" },
  "vendor.submitting": { ar: "جاري إنشاء الحساب...", en: "Creating account..." },
  "vendor.error.login": { ar: "يجب تسجيل الدخول أولاً", en: "You must log in first" },
  "vendor.error.general": { ar: "حدث خطأ أثناء إنشاء حساب البائع", en: "An error occurred while creating seller account" },
  "vendor.checking": { ar: "جاري التحقق من الحساب...", en: "Verifying account..." },

  // Creator Dashboard
  "dashboard.title": { ar: "لوحة التحكم", en: "Dashboard" },
  "dashboard.welcome": { ar: "مرحباً", en: "Welcome" },
  "dashboard.store": { ar: "متجرك", en: "Your Store" },
  "dashboard.stats.sales": { ar: "إجمالي المبيعات", en: "Total Sales" },
  "dashboard.stats.products": { ar: "المنتجات النشطة", en: "Active Products" },
  "dashboard.stats.orders": { ar: "الطلبات", en: "Orders" },
  "dashboard.stats.revenue": { ar: "الإيرادات", en: "Revenue" },
  "dashboard.actions.addproduct": { ar: "إضافة منتج جديد", en: "Add New Product" },
  "dashboard.actions.viewproducts": { ar: "عرض المنتجات", en: "View Products" },
  "dashboard.actions.vieworders": { ar: "عرض الطلبات", en: "View Orders" },
  "dashboard.actions.settings": { ar: "الإعدادات", en: "Settings" },
  "dashboard.loading": { ar: "جاري التحميل...", en: "Loading..." },
  "dashboard.error.load": { ar: "حدث خطأ أثناء تحميل البيانات", en: "Error loading data" },
  "dashboard.noprofile": { ar: "لم يتم العثور على ملف المتجر", en: "Store profile not found" },
  "dashboard.createprofile": { ar: "إنشاء ملف المتجر", en: "Create Store Profile" },

  // Store Page
  "store.loading": { ar: "جاري تحميل المتجر...", en: "Loading store..." },
  "store.notfound": { ar: "المتجر غير موجود", en: "Store not found" },
  "store.notfound.desc": { ar: "عذراً، لم نتمكن من العثور على المتجر الذي تبحث عنه", en: "Sorry, we couldn't find the store you're looking for" },
  "store.backhome": { ar: "العودة للرئيسية", en: "Back to Home" },
  "store.products": { ar: "منتجات المتجر", en: "Store Products" },
  "store.noproducts": { ar: "لا توجد منتجات حالياً", en: "No products yet" },
  "store.noproducts.desc": { ar: "هذا المتجر لم يضف أي منتجات بعد", en: "This store hasn't added any products yet" },
  "store.verified": { ar: "حساب موثق", en: "Verified Account" },
  "store.error.load": { ar: "حدث خطأ أثناء تحميل المتجر", en: "Error loading store" },
}

interface LanguageContextType {
  language: Language
  direction: Direction
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('language')
      return (saved === 'ar' || saved === 'en') ? saved : 'ar'
    }
    return 'ar'
  })

  const direction: Direction = language === "ar" ? "rtl" : "ltr"

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
      document.documentElement.lang = lang
      document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    }
  }, [])

  const t = useCallback((key: string): string => {
    const translation = translations[key]
    if (!translation) return key
    return translation[language]
  }, [language])

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

export { translations }
export type { Language, Direction }
