"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Building2, Shield, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language"

const features = [
  {
    icon: Shield,
    titleAr: "أمان على مستوى المؤسسات",
    titleEn: "Enterprise-Grade Security",
    descAr: "حماية بيانات مؤسستك بأعلى معايير الأمان",
    descEn: "Protect your organization's data with top security standards",
  },
  {
    icon: Zap,
    titleAr: "أداء فائق السرعة",
    titleEn: "Lightning Fast Performance",
    descAr: "بنية تحتية عالمية لأداء موثوق",
    descEn: "Global infrastructure for reliable performance",
  },
  {
    icon: Building2,
    titleAr: "حسابات مؤسسية",
    titleEn: "Team Accounts",
    descAr: "إدارة فريقك مع صلاحيات متقدمة",
    descEn: "Manage your team with advanced permissions",
  },
  {
    icon: Globe,
    titleAr: "وصول عالمي",
    titleEn: "Global Reach",
    descAr: "CDN عالمي مع أكثر من 100 موقع",
    descEn: "Global CDN with 100+ edge locations",
  },
]

export function EnterpriseSection() {
  const { language } = useLanguage()
  
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-slate-50">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 start-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] -translate-y-1/2" />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium mb-6">
              <Building2 className="w-4 h-4 text-primary" />
              {language === "ar" ? "للشركات والمؤسسات" : "For Enterprise"}
            </span>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 text-balance text-[#122560]">
              {language === "ar" 
                ? "حلول مصممة لنمو مؤسستك"
                : "Solutions Designed for Your Growth"
              }
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              {language === "ar"
                ? "انضم إلى آلاف الشركات التي تعتمد على صرحي لتلبية احتياجاتها من المحتوى الرقمي والإنتاج الإبداعي."
                : "Join thousands of companies that rely on Sarhy for their digital content and creative production needs."
              }
            </p>
            
            {/* Features */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.titleEn}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-sm mb-1">
                      {language === "ar" ? feature.titleAr : feature.titleEn}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {language === "ar" ? feature.descAr : feature.descEn}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:opacity-90 gap-2">
                {language === "ar" ? "تواصل مع المبيعات" : "Contact Sales"}
                <ArrowUpRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline">
                {language === "ar" ? "عرض الباقات" : "View Plans"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
