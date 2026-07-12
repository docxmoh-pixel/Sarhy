"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, HelpCircle, MessageCircle, Book, FileText, Mail, Phone, ChevronDown, ChevronRight, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLanguage, LanguageProvider } from "@/lib/language"
import Link from "next/link"

const categories = [
  { icon: Book, title: { ar: "البدء", en: "Getting Started" }, count: 12 },
  { icon: FileText, title: { ar: "الحساب والدفع", en: "Account & Billing" }, count: 18 },
  { icon: HelpCircle, title: { ar: "استخدام المنتجات", en: "Using Products" }, count: 24 },
  { icon: MessageCircle, title: { ar: "للمبدعين", en: "For Creators" }, count: 15 },
]

const faqs = [
  {
    q: { ar: "كيف أبدأ البيع على صرحي؟", en: "How do I start selling on Sarhy?" },
    a: { ar: "يمكنك التسجيل كمبدع وإعداد متجرك في دقائق. قم بتحميل منتجاتك وحدد أسعارها وابدأ البيع فوراً.", en: "You can register as a creator and set up your store in minutes. Upload your products, set prices, and start selling immediately." }
  },
  {
    q: { ar: "ما هي نسبة العمولة؟", en: "What is the commission rate?" },
    a: { ar: "نسبة العمولة 15% من كل عملية بيع. تحصل على 85% من إيراداتك مباشرة.", en: "The commission rate is 15% per sale. You receive 85% of your revenue directly." }
  },
  {
    q: { ar: "كيف يمكنني سحب أرباحي؟", en: "How can I withdraw my earnings?" },
    a: { ar: "يمكنك سحب أرباحك عبر التحويل البنكي أو PayPal عند الوصول للحد الأدنى (50 دولار).", en: "You can withdraw earnings via bank transfer or PayPal when you reach the minimum ($50)." }
  },
  {
    q: { ar: "هل يمكنني استرداد المبلغ؟", en: "Can I get a refund?" },
    a: { ar: "نعم، نقدم ضمان استرداد خلال 30 يوماً للمنتجات التي لا تعمل كما هو موصوف.", en: "Yes, we offer a 30-day refund guarantee for products that don't work as described." }
  },
]

function HelpContent() {
  const { language } = useLanguage()
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4 rounded-full">
              <HelpCircle className="w-4 h-4 me-1" />
              {language === "ar" ? "مركز المساعدة" : "Help Center"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {language === "ar" ? "كيف يمكننا مساعدتك؟" : "How can we help you?"}
            </h1>
            
            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute start-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={language === "ar" ? "ابحث عن إجابات..." : "Search for answers..."}
                className="h-14 ps-12 pe-4 rounded-2xl text-lg"
              />
            </div>
          </motion.div>
        </section>
        
        {/* Categories */}
        <section className="container mx-auto px-4 lg:px-8 mb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/help/${cat.title.en.toLowerCase().replace(/ /g, '-')}`}>
                  <div className="bg-card rounded-2xl border border-border p-6 card-hover">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <cat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {cat.title[language]}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {cat.count} {language === "ar" ? "مقال" : "articles"}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* FAQ */}
        <section className="container mx-auto px-4 lg:px-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              {language === "ar" ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
            </h2>
            
            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl border border-border overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between p-4 text-start"
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  >
                    <span className="font-medium text-foreground">{faq.q[language]}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-4 pb-4 text-muted-foreground">
                      {faq.a[language]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </section>
        
        {/* Contact */}
        <section className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl border border-border p-8 text-center max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {language === "ar" ? "لم تجد إجابتك؟" : "Didn't find your answer?"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === "ar" ? "تواصل مع فريق الدعم الفني" : "Contact our support team"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button className="rounded-full gap-2">
                  <MessageCircle className="w-4 h-4" />
                  {language === "ar" ? "محادثة مباشرة" : "Live Chat"}
                </Button>
              </Link>
              <a href="mailto:support@sarhy.com">
                <Button variant="outline" className="rounded-full gap-2">
                  <Mail className="w-4 h-4" />
                  {language === "ar" ? "راسلنا" : "Email Us"}
                </Button>
              </a>
            </div>
          </motion.div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default function HelpPage() {
  return (
    <LanguageProvider>
      <HelpContent />
    </LanguageProvider>
  )
}
