"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { 
  Palette, 
  Film, 
  BookOpen, 
  Code, 
  GraduationCap, 
  Camera, 
  Heart,
  ArrowUpRight
} from "lucide-react"
import { useLanguage } from "@/lib/language"
import { cn } from "@/lib/utils"

const sections = [
  { 
    key: "resha", 
    icon: Palette, 
    gradient: "from-[oklch(0.55_0.22_300)] to-[oklch(0.65_0.18_320)]",
    bgHover: "group-hover:bg-[oklch(0.55_0.22_300/0.08)]",
    stats: { products: "250K+", creators: "12K+" }
  },
  { 
    key: "atheer", 
    icon: Film, 
    gradient: "from-[oklch(0.55_0.18_230)] to-[oklch(0.65_0.16_250)]",
    bgHover: "group-hover:bg-[oklch(0.55_0.18_230/0.08)]",
    stats: { products: "180K+", creators: "8K+" }
  },
  { 
    key: "erth", 
    icon: Camera, 
    gradient: "from-[oklch(0.50_0.08_260)] to-[oklch(0.60_0.06_280)]",
    bgHover: "group-hover:bg-[oklch(0.50_0.08_260/0.08)]",
    stats: { products: "500K+", creators: "15K+" }
  },
  { 
    key: "holool", 
    icon: Code, 
    gradient: "from-[oklch(0.55_0.20_165)] to-[oklch(0.65_0.18_185)]",
    bgHover: "group-hover:bg-[oklch(0.55_0.20_165/0.08)]",
    stats: { products: "120K+", creators: "6K+" }
  },
  { 
    key: "midad", 
    icon: BookOpen, 
    gradient: "from-[oklch(0.55_0.18_55)] to-[oklch(0.65_0.16_75)]",
    bgHover: "group-hover:bg-[oklch(0.55_0.18_55/0.08)]",
    stats: { products: "95K+", creators: "5K+" }
  },
  { 
    key: "mahara", 
    icon: GraduationCap, 
    gradient: "from-[oklch(0.60_0.20_85)] to-[oklch(0.70_0.18_105)]",
    bgHover: "group-hover:bg-[oklch(0.60_0.20_85/0.08)]",
    stats: { products: "45K+", creators: "3K+" }
  },
  { 
    key: "aoun", 
    icon: Heart, 
    gradient: "from-[oklch(0.55_0.18_25)] to-[oklch(0.65_0.16_45)]",
    bgHover: "group-hover:bg-[oklch(0.55_0.18_25/0.08)]",
    stats: { products: "10K+", creators: "2K+" }
  },
]

const categoryGroups = [
  {
    title: { ar: "الحلول الرقمية", en: "Digital Solutions" },
    sections: ["resha", "atheer", "erth", "holool"]
  },
  {
    title: { ar: "المعرفة والتطوير", en: "Knowledge & Development" },
    sections: ["midad", "mahara"]
  },
  {
    title: { ar: "المجتمع", en: "Community" },
    sections: ["aoun"]
  }
]

export function CategoriesSection() {
  const { language, t } = useLanguage()
  
  return (
    <section className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance text-foreground">
            {t("categories.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("categories.subtitle")}
          </p>
        </motion.div>
        
        {/* Categories Grid */}
        {categoryGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-16 last:mb-0">
            {/* Group Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: groupIndex * 0.1 }}
              className="mb-8"
            >
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {language === "ar" ? group.title.ar : group.title.en}
              </h3>
              <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full" />
            </motion.div>

            {/* Group Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {group.sections.map((sectionKey, sectionIndex) => {
                const section = sections.find(s => s.key === sectionKey)
                if (!section) return null

                const globalIndex = sections.findIndex(s => s.key === sectionKey)

                return (
                  <motion.div
                    key={section.key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: (groupIndex * 0.3) + (sectionIndex * 0.1) }}
                  >
                    <Link href={`/marketplace/${section.key}`}>
                      <div className={cn(
                        "group relative overflow-hidden rounded-2xl p-6 h-full min-h-[220px] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                        "bg-card border border-border shadow-premium",
                        section.bgHover
                      )}>
                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col">
                          {/* Icon */}
                          <div className={cn(
                            "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4",
                            section.gradient
                          )}>
                            <section.icon className="w-7 h-7 text-white" />
                          </div>

                          {/* Title & Description */}
                          <h3 className="text-xl font-bold mb-2 text-foreground">
                            {t(`sections.${section.key}`)}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 flex-grow">
                            {t(`sections.${section.key}.desc`)}
                          </p>

                          {/* Stats */}
                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex gap-4 text-xs">
                              <span className="text-muted-foreground">
                                <span className="font-semibold text-foreground">{section.stats.products}</span> {language === "ar" ? "منتج" : "products"}
                              </span>
                              <span className="text-muted-foreground">
                                <span className="font-semibold text-foreground">{section.stats.creators}</span> {language === "ar" ? "مبدع" : "creators"}
                              </span>
                            </div>
                            <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
