"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { BadgeCheck, Users, Package } from "lucide-react"
import { useLanguage } from "@/lib/language"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"

export function FeaturedCreatorsSection() {
  const { language, t } = useLanguage()
  const [creators, setCreators] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("seller_profiles")
      .select("id, user_id, store_name, bio, avatar_url, cover_url, is_verified, product_count")
      .limit(4)
      .then(({ data }) => {
        setCreators(data || [])
        setLoading(false)
      })
  }, [])

  if (!loading && creators.length === 0) return null

  return (
    <section className="py-24 lg:py-32 relative bg-slate-50">
      <div className="container mx-auto px-4 lg:px-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl overflow-hidden">
                  <div className="h-32 bg-muted/50 animate-pulse" />
                  <div className="relative -mt-12 px-5">
                    <div className="w-24 h-24 rounded-2xl bg-muted/50 border-4 border-card animate-pulse" />
                  </div>
                  <div className="p-5 pt-3 space-y-3">
                    <div className="h-6 bg-muted/50 rounded animate-pulse" />
                    <div className="h-4 bg-muted/50 rounded w-2/3 animate-pulse" />
                    <div className="h-9 bg-muted/50 rounded animate-pulse" />
                  </div>
                </div>
              ))
            : creators.map((creator, index) => (
                <motion.div
                  key={creator.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="group glass rounded-2xl overflow-hidden card-hover">
                    <div className="relative h-32 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
                      {creator.cover_url && (
                        <Image src={creator.cover_url} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                    </div>

                    <div className="relative -mt-12 px-5">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-4 border-card bg-muted/30">
                        {creator.avatar_url ? (
                          <Image src={creator.avatar_url} alt={creator.store_name || ""} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Users className="w-8 h-8 text-muted-foreground/50" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-3">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {creator.store_name || (language === "ar" ? "مبدع" : "Creator")}
                        </h3>
                        {creator.is_verified && (
                          <BadgeCheck className="w-5 h-5 text-primary shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {creator.bio || (language === "ar" ? "مبدع رقمي" : "Digital Creator")}
                      </p>
                      {creator.product_count > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
                          <Package className="w-3.5 h-3.5" />
                          <span>{creator.product_count} {language === "ar" ? "منتج" : "products"}</span>
                        </div>
                      )}
                      <Link
                        href={`/creator/${creator.user_id}`}
                        className="block w-full text-center py-2 px-4 rounded-xl border border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors text-sm font-medium"
                      >
                        {language === "ar" ? "زيارة المتجر" : "Visit Store"}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  )
}
