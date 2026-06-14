"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowUpRight, Building2, Shield, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language"

const partners = [
  { name: "Adobe", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Adobe_Corporate_Logo.png/200px-Adobe_Corporate_Logo.png" },
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/200px-Google_2015_logo.svg.png" },
  { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/200px-Microsoft_logo_%282012%29.svg.png" },
  { name: "AWS", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/200px-Amazon_Web_Services_Logo.svg.png" },
]

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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
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
          
          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="glass rounded-3xl p-8 lg:p-12">
              {/* Partner Logos */}
              <div className="mb-8">
                <p className="text-sm text-muted-foreground mb-4">
                  {language === "ar" ? "موثوق من قبل الشركات الرائدة" : "Trusted by leading companies"}
                </p>
                <div className="flex flex-wrap items-center gap-8 opacity-60">
                  {partners.map((partner) => (
                    <div key={partner.name} className="h-8 relative grayscale hover:grayscale-0 transition-all">
                      <span className="text-lg font-bold">{partner.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Stats Card */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/50 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-gradient mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">
                    {language === "ar" ? "شركة مؤسسية" : "Enterprise Clients"}
                  </div>
                </div>
                <div className="bg-secondary/50 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-gradient mb-2">$50M+</div>
                  <div className="text-sm text-muted-foreground">
                    {language === "ar" ? "صفقات مغلقة" : "Deals Closed"}
                  </div>
                </div>
                <div className="bg-secondary/50 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-gradient mb-2">99.9%</div>
                  <div className="text-sm text-muted-foreground">
                    {language === "ar" ? "وقت التشغيل" : "Uptime SLA"}
                  </div>
                </div>
                <div className="bg-secondary/50 rounded-2xl p-6">
                  <div className="text-3xl font-bold text-gradient mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">
                    {language === "ar" ? "دعم مخصص" : "Dedicated Support"}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative */}
            <div className="absolute -top-4 -end-4 w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full blur-2xl opacity-50" />
            <div className="absolute -bottom-4 -start-4 w-32 h-32 bg-gradient-to-br from-accent to-primary rounded-full blur-2xl opacity-30" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
