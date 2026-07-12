"use client"

import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useState } from "react"
import { 
  Package, 
  Download, 
  Globe,
  Zap
} from "lucide-react"
import { useLanguage } from "@/lib/language"
import { createClient } from "@/lib/supabase"

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + "M"
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K"
  }
  return num.toString()
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => {
    if (value >= 1000000) {
      return (latest / 1000000).toFixed(0) + "M"
    }
    if (value >= 1000) {
      return (latest / 1000).toFixed(0) + "K"
    }
    if (value < 100) {
      return latest.toFixed(1)
    }
    return Math.round(latest).toString()
  })
  
  useEffect(() => {
    const controls = animate(count, value, {
      duration: 2,
      ease: "easeOut",
    })
    return controls.stop
  }, [count, value])
  
  return (
    <motion.span>{rounded}</motion.span>
  )
}

export function StatsSection() {
  const { language, t } = useLanguage()
  const [stats, setStats] = useState([
    {
      icon: Package,
      value: 0,
      suffix: "+",
      labelAr: "منتج رقمي",
      labelEn: "Digital Products",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Download,
      value: 0,
      suffix: "+",
      labelAr: "عملية تحميل",
      labelEn: "Total Downloads",
      color: "from-emerald-500 to-green-500",
    },
    {
      icon: Globe,
      value: 1,
      suffix: "+",
      labelAr: "دولة",
      labelEn: "Countries",
      color: "from-violet-500 to-purple-500",
    },
    {
      icon: Zap,
      value: 99.9,
      suffix: "%",
      labelAr: "وقت التشغيل",
      labelEn: "Uptime",
      color: "from-sky-500 to-blue-500",
    },
  ])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = createClient()
        
        const [
          { count: productsCount },
          { count: ordersCount },
        ] = await Promise.all([
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("*", { count: "exact", head: true }),
        ])

        setStats([
          {
            icon: Package,
            value: productsCount || 0,
            suffix: "+",
            labelAr: "منتج رقمي",
            labelEn: "Digital Products",
            color: "from-blue-500 to-cyan-500",
          },
          {
            icon: Download,
            value: ordersCount || 0,
            suffix: "+",
            labelAr: "عملية تحميل",
            labelEn: "Total Downloads",
            color: "from-emerald-500 to-green-500",
          },
          {
            icon: Globe,
            value: 1,
            suffix: "+",
            labelAr: "دولة",
            labelEn: "Countries",
            color: "from-violet-500 to-purple-500",
          },
          {
            icon: Zap,
            value: 99.9,
            suffix: "%",
            labelAr: "وقت التشغيل",
            labelEn: "Uptime",
            color: "from-sky-500 to-blue-500",
          },
        ])
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    fetchStats()
  }, [])
  
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-slate-50">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px]" />
      </div>
      
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-balance text-[#122560]">
            {t("stats.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("stats.subtitle")}
          </p>
        </motion.div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.labelEn}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="glass rounded-2xl p-6 text-center h-full">
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="text-2xl lg:text-3xl font-bold mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  {stat.suffix}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {language === "ar" ? stat.labelAr : stat.labelEn}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
