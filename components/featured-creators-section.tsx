"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { BadgeCheck, Users, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

export function FeaturedCreatorsSection() {
  const { language, t } = useLanguage()
  const [creators, setCreators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("role", "seller")
          .limit(4)

        setCreators(data || [])
      } catch (error) {
        console.error("Error fetching creators:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCreators()
  }, [])
  
  return (
    <section className="py-24 lg:py-32 relative bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 text-balance text-[#122560]">
            {t("featured.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("featured.subtitle")}
          </p>
        </motion.div>
        
        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Skeleton Screens
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="relative h-32 bg-muted/50 animate-pulse" />
                  <div className="relative -mt-12 px-5">
                    <div className="w-24 h-24 rounded-2xl bg-muted/50 border-4 border-card animate-pulse" />
                  </div>
                  <div className="p-5 pt-3 space-y-3">
                    <div className="h-6 bg-muted/50 rounded animate-pulse" />
                    <div className="h-4 bg-muted/50 rounded w-2/3 animate-pulse" />
                    <div className="flex gap-4">
                      <div className="h-4 w-8 bg-muted/50 rounded animate-pulse" />
                      <div className="h-4 w-8 bg-muted/50 rounded animate-pulse" />
                    </div>
                    <div className="h-10 bg-muted/50 rounded animate-pulse" />
                  </div>
                </div>
              </motion.div>
            ))
          ) : creators.length === 0 ? (
            // Empty State
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="glass rounded-2xl overflow-hidden card-hover">
                  <div className="relative h-32 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm text-center px-4">
                      {language === "ar" ? "قريباً.. أولى المبدعين الإبداعيين" : "Coming soon... First creative creators"}
                    </p>
                  </div>
                  <div className="relative -mt-12 px-5">
                    <div className="w-24 h-24 rounded-2xl bg-muted/30 border-4 border-card flex items-center justify-center">
                      <Users className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                  </div>
                  <div className="p-5 pt-3 space-y-3">
                    <div className="h-6 bg-muted/30 rounded" />
                    <div className="h-4 bg-muted/30 rounded w-2/3" />
                    <div className="flex gap-4">
                      <div className="h-4 w-8 bg-muted/30 rounded" />
                      <div className="h-4 w-8 bg-muted/30 rounded" />
                    </div>
                    <div className="h-10 bg-muted/30 rounded" />
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            // Dynamic Creators
            creators.map((creator: any, index: number) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="group glass rounded-2xl overflow-hidden card-hover">
                  {/* Cover Image */}
                  <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                    {creator.user_metadata?.cover_url ? (
                      <Image
                        src={creator.user_metadata.cover_url}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  </div>
                  
                  {/* Avatar */}
                  <div className="relative -mt-12 px-5">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-card bg-muted/30">
                      {creator.user_metadata?.avatar_url ? (
                        <Image
                          src={creator.user_metadata.avatar_url}
                          alt={creator.user_metadata?.full_name || creator.email}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Users className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 pt-3 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">
                        {creator.user_metadata?.full_name || creator.email?.split("@")[0] || "مبدع"}
                      </h3>
                      {creator.verified && (
                        <BadgeCheck className="w-5 h-5 text-primary fill-primary/20" />
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 flex-grow">
                      {language === "ar" ? "مبدع رقمي" : "Digital Creator"}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span className="font-semibold text-foreground">0</span>
                      </span>
                      <span className="font-semibold text-foreground">0</span> {language === "ar" ? "منتج" : "products"}
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                        <span className="font-semibold text-foreground">0</span>
                      </span>
                    </div>

                    {/* Follow Button */}
                    <Button variant="outline" className="w-full">
                      {t("common.follow")}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
