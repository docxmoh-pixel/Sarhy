"use client"

import { motion } from "framer-motion"
import { Check, Sparkles, Zap, Crown, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLanguage, LanguageProvider } from "@/lib/language"
import Link from "next/link"

const plans = [
  {
    id: "free",
    icon: Sparkles,
    name: { ar: "مجاني", en: "Free" },
    price: { ar: "0", en: "0" },
    period: { ar: "شهرياً", en: "/month" },
    description: { ar: "للمستخدمين الجدد", en: "For new users" },
    features: {
      ar: ["5 تحميلات مجانية شهرياً", "الوصول للمنتجات المجانية", "دعم عبر البريد", "عرض المنتجات الأساسية"],
      en: ["5 free downloads/month", "Access to free products", "Email support", "Basic product preview"]
    },
    cta: { ar: "ابدأ مجاناً", en: "Start Free" },
    popular: false
  },
  {
    id: "pro",
    icon: Zap,
    name: { ar: "احترافي", en: "Pro" },
    price: { ar: "49", en: "49" },
    period: { ar: "شهرياً", en: "/month" },
    description: { ar: "للمبدعين النشطين", en: "For active creators" },
    features: {
      ar: ["50 تحميل شهرياً", "أدوات AI متقدمة", "دعم أولوية 24/7", "تحليلات متقدمة", "بدون علامة مائية", "الوصول المبكر للمنتجات"],
      en: ["50 downloads/month", "Advanced AI tools", "Priority 24/7 support", "Advanced analytics", "No watermarks", "Early access to products"]
    },
    cta: { ar: "اشترك الآن", en: "Subscribe Now" },
    popular: true
  },
  {
    id: "premium",
    icon: Crown,
    name: { ar: "متميز", en: "Premium" },
    price: { ar: "99", en: "99" },
    period: { ar: "شهرياً", en: "/month" },
    description: { ar: "للمحترفين والفرق", en: "For professionals & teams" },
    features: {
      ar: ["تحميلات غير محدودة", "جميع أدوات AI", "مدير حساب مخصص", "API كامل", "ترخيص تجاري موسع", "دعم فني مباشر", "تدريب شخصي"],
      en: ["Unlimited downloads", "All AI tools", "Dedicated account manager", "Full API access", "Extended commercial license", "Live technical support", "Personal training"]
    },
    cta: { ar: "اشترك الآن", en: "Subscribe Now" },
    popular: false
  },
  {
    id: "enterprise",
    icon: Building2,
    name: { ar: "المؤسسات", en: "Enterprise" },
    price: { ar: "مخصص", en: "Custom" },
    period: { ar: "", en: "" },
    description: { ar: "للشركات الكبرى", en: "For large organizations" },
    features: {
      ar: ["كل مميزات المتميز", "تكامل مخصص", "SLA مضمون", "فريق دعم مخصص", "تدريب للفريق", "أمان متقدم", "تخزين مخصص"],
      en: ["All Premium features", "Custom integrations", "Guaranteed SLA", "Dedicated support team", "Team training", "Advanced security", "Custom storage"]
    },
    cta: { ar: "تواصل معنا", en: "Contact Sales" },
    popular: false
  }
]

function PricingContent() {
  const { language } = useLanguage()
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <Badge variant="secondary" className="mb-4 rounded-full">
              {language === "ar" ? "الأسعار" : "Pricing"}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {language === "ar" ? "اختر خطتك المناسبة" : "Choose your plan"}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === "ar" 
                ? "أسعار شفافة ومرنة تناسب احتياجاتك. يمكنك الترقية أو الإلغاء في أي وقت."
                : "Transparent and flexible pricing to suit your needs. Upgrade or cancel anytime."
              }
            </p>
          </motion.div>
          
          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-card rounded-2xl border ${plan.popular ? 'border-primary shadow-lg' : 'border-border'} p-6 flex flex-col`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 start-1/2 -translate-x-1/2 bg-primary">
                    {language === "ar" ? "الأكثر شعبية" : "Most Popular"}
                  </Badge>
                )}
                
                <div className={`w-12 h-12 rounded-xl ${plan.popular ? 'bg-primary' : 'bg-secondary'} flex items-center justify-center mb-4`}>
                  <plan.icon className={`w-6 h-6 ${plan.popular ? 'text-primary-foreground' : 'text-foreground'}`} />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {plan.name[language]}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {plan.description[language]}
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    {plan.price[language] !== "Custom" && plan.price[language] !== "مخصص" && "$"}
                    {plan.price[language]}
                  </span>
                  <span className="text-muted-foreground">{plan.period[language]}</span>
                </div>
                
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features[language].map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link href={plan.id === "enterprise" ? "/enterprise" : "/auth/register"}>
                  <Button 
                    className={`w-full rounded-xl ${plan.popular ? '' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                    variant={plan.popular ? "default" : "secondary"}
                  >
                    {plan.cta[language]}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* FAQ Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-20 text-center"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {language === "ar" ? "أسئلة شائعة" : "Frequently Asked Questions"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === "ar" 
                ? "لديك أسئلة؟ تواصل مع فريق الدعم"
                : "Have questions? Contact our support team"
              }
            </p>
            <Link href="/help">
              <Button variant="outline" className="rounded-full">
                {language === "ar" ? "مركز المساعدة" : "Help Center"}
              </Button>
            </Link>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

export default function PricingPage() {
  return (
    <LanguageProvider>
      <PricingContent />
    </LanguageProvider>
  )
}
