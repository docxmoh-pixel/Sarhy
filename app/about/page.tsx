"use client"

import { motion } from "framer-motion"
import { Target, Users, Sparkles, Globe, Award, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useLanguage, LanguageProvider } from "@/lib/language"

const values = [
  { icon: Target, title: { ar: "الابتكار", en: "Innovation" }, desc: { ar: "نسعى دائماً لتقديم حلول مبتكرة", en: "We constantly strive to deliver innovative solutions" } },
  { icon: Users, title: { ar: "المجتمع", en: "Community" }, desc: { ar: "نبني مجتمعاً داعماً للمبدعين", en: "We build a supportive community for creators" } },
  { icon: Award, title: { ar: "الجودة", en: "Quality" }, desc: { ar: "نلتزم بأعلى معايير الجودة", en: "We commit to the highest quality standards" } },
  { icon: Heart, title: { ar: "الشغف", en: "Passion" }, desc: { ar: "نعمل بشغف لتمكين المبدعين", en: "We work passionately to empower creators" } },
]

const stats = [
  { value: "50K+", label: { ar: "مبدع نشط", en: "Active Creators" } },
  { value: "2M+", label: { ar: "منتج رقمي", en: "Digital Products" } },
  { value: "150+", label: { ar: "دولة", en: "Countries" } },
  { value: "$10M+", label: { ar: "مدفوعات للمبدعين", en: "Paid to Creators" } },
]

const team = [
  { name: { ar: "أحمد الفهد", en: "Ahmed Al-Fahd" }, role: { ar: "المؤسس والرئيس التنفيذي", en: "Founder & CEO" } },
  { name: { ar: "سارة العتيبي", en: "Sara Al-Otaibi" }, role: { ar: "المدير التقني", en: "CTO" } },
  { name: { ar: "محمد النجار", en: "Mohammed Al-Najjar" }, role: { ar: "مدير المنتج", en: "Product Lead" } },
  { name: { ar: "نورة الحربي", en: "Noura Al-Harbi" }, role: { ar: "مديرة التصميم", en: "Design Lead" } },
]

function AboutContent() {
  const { language } = useLanguage()
  
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
              {language === "ar" ? "من نحن" : "About Us"}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              {language === "ar" 
                ? "نبني مستقبل الإبداع الرقمي"
                : "Building the Future of Digital Creativity"
              }
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === "ar" 
                ? "صرحي هي منصة عالمية تجمع بين المبدعين والمستهلكين في نظام بيئي متكامل للمحتوى الرقمي"
                : "Sarhy is a global platform connecting creators and consumers in a comprehensive digital content ecosystem"
              }
            </p>
          </motion.div>
        </section>
        
        {/* Mission */}
        <section className="container mx-auto px-4 lg:px-8 mb-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {language === "ar" ? "رسالتنا" : "Our Mission"}
              </h2>
              <p className="text-muted-foreground mb-4">
                {language === "ar" 
                  ? "نسعى لتمكين المبدعين حول العالم من تحويل مواهبهم إلى مصدر دخل مستدام، وتوفير أفضل الأدوات والموارد الرقمية للمستخدمين."
                  : "We strive to empower creators worldwide to turn their talents into sustainable income, providing the best digital tools and resources for users."
                }
              </p>
              <p className="text-muted-foreground">
                {language === "ar" 
                  ? "نؤمن بأن الإبداع يجب أن يكون متاحاً للجميع، وأن كل مبدع يستحق فرصة للنجاح."
                  : "We believe creativity should be accessible to everyone, and every creator deserves a chance to succeed."
                }
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
            >
              <Sparkles className="w-24 h-24 text-primary/40" />
            </motion.div>
          </div>
        </section>
        
        {/* Stats */}
        <section className="container mx-auto px-4 lg:px-8 mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label[language]}</div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Values */}
        <section className="container mx-auto px-4 lg:px-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {language === "ar" ? "قيمنا" : "Our Values"}
            </h2>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title[language]}</h3>
                <p className="text-sm text-muted-foreground">{value.desc[language]}</p>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Team */}
        <section className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              {language === "ar" ? "فريق القيادة" : "Leadership Team"}
            </h2>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {member.name[language].charAt(0)}
                </div>
                <h3 className="font-semibold text-foreground mb-1">{member.name[language]}</h3>
                <p className="text-sm text-muted-foreground">{member.role[language]}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

export default function AboutPage() {
  return (
    <LanguageProvider>
      <AboutContent />
    </LanguageProvider>
  )
}
