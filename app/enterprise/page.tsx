"use client"

import { motion } from "framer-motion"
import { Building2, Shield, Zap, Users, BarChart3, Lock, Headphones, Globe, ArrowLeft, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLanguage, LanguageProvider } from "@/lib/language"

const features = [
  { icon: Shield, title: { ar: "أمان على مستوى المؤسسات", en: "Enterprise-grade Security" }, desc: { ar: "تشفير متقدم وامتثال للمعايير العالمية", en: "Advanced encryption and global compliance" } },
  { icon: Users, title: { ar: "إدارة الفريق", en: "Team Management" }, desc: { ar: "أدوات تعاون متقدمة وإدارة الصلاحيات", en: "Advanced collaboration tools and permissions" } },
  { icon: BarChart3, title: { ar: "تحليلات متقدمة", en: "Advanced Analytics" }, desc: { ar: "رؤى تفصيلية وتقارير مخصصة", en: "Detailed insights and custom reports" } },
  { icon: Zap, title: { ar: "تكامل API", en: "API Integration" }, desc: { ar: "واجهة برمجية كاملة للتكامل مع أنظمتك", en: "Full API for integration with your systems" } },
  { icon: Headphones, title: { ar: "دعم مخصص", en: "Dedicated Support" }, desc: { ar: "فريق دعم مخصص على مدار الساعة", en: "24/7 dedicated support team" } },
  { icon: Globe, title: { ar: "توزيع عالمي", en: "Global Distribution" }, desc: { ar: "شبكة توزيع محتوى عالمية سريعة", en: "Fast global content delivery network" } },
]

const clients = [
  { name: "شركة التقنية", nameEn: "Tech Corp" },
  { name: "وكالة الإبداع", nameEn: "Creative Agency" },
  { name: "مجموعة الإعلام", nameEn: "Media Group" },
  { name: "شركة التصميم", nameEn: "Design Co" },
]

function EnterpriseContent() {
  const { language } = useLanguage()
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 lg:px-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4 rounded-full">
              <Building2 className="w-4 h-4 me-1" />
              {language === "ar" ? "للمؤسسات" : "Enterprise"}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {language === "ar" 
                ? "حلول مؤسسية لفرق الإبداع"
                : "Enterprise Solutions for Creative Teams"
              }
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              {language === "ar" 
                ? "منصة متكاملة لإدارة الأصول الرقمية وتمكين فرق الإبداع في مؤسستك"
                : "A comprehensive platform for digital asset management and empowering creative teams"
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full h-12 px-8 gap-2">
                {language === "ar" ? "احجز عرض توضيحي" : "Book a Demo"}
                <Arrow className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-12 px-8">
                {language === "ar" ? "تحدث مع المبيعات" : "Talk to Sales"}
              </Button>
            </div>
          </motion.div>
        </section>
        
        {/* Features */}
        <section className="container mx-auto px-4 lg:px-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {language === "ar" ? "مميزات للمؤسسات" : "Enterprise Features"}
            </h2>
            <p className="text-muted-foreground">
              {language === "ar" 
                ? "كل ما تحتاجه مؤسستك في منصة واحدة"
                : "Everything your organization needs in one platform"
              }
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="bg-card rounded-2xl border border-border p-6 card-hover"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title[language]}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.desc[language]}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Trusted By */}
        <section className="container mx-auto px-4 lg:px-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground mb-6">
              {language === "ar" ? "موثوق من قبل" : "Trusted by"}
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {clients.map((client, index) => (
                <div key={index} className="px-6 py-3 bg-secondary rounded-xl">
                  <span className="text-foreground font-medium">
                    {language === "ar" ? client.name : client.nameEn}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>
        
        {/* Contact Form */}
        <section className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto bg-card rounded-2xl border border-border p-8"
          >
            <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
              {language === "ar" ? "تواصل معنا" : "Get in Touch"}
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              {language === "ar" 
                ? "أخبرنا عن احتياجات مؤسستك"
                : "Tell us about your organization's needs"
              }
            </p>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{language === "ar" ? "الاسم" : "Name"}</Label>
                  <Input placeholder={language === "ar" ? "اسمك الكامل" : "Your full name"} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                  <Input type="email" placeholder={language === "ar" ? "بريدك الإلكتروني" : "Your email"} className="h-11 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{language === "ar" ? "الشركة" : "Company"}</Label>
                  <Input placeholder={language === "ar" ? "اسم الشركة" : "Company name"} className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>{language === "ar" ? "حجم الفريق" : "Team Size"}</Label>
                  <Input placeholder={language === "ar" ? "عدد الموظفين" : "Number of employees"} className="h-11 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{language === "ar" ? "الرسالة" : "Message"}</Label>
                <Textarea 
                  placeholder={language === "ar" ? "أخبرنا عن احتياجاتك..." : "Tell us about your needs..."} 
                  className="min-h-[120px] rounded-xl"
                />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl gap-2">
                {language === "ar" ? "إرسال" : "Submit"}
                <Arrow className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default function EnterprisePage() {
  return (
    <LanguageProvider>
      <EnterpriseContent />
    </LanguageProvider>
  )
}
