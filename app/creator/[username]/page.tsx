"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { 
  BadgeCheck, 
  Users, 
  Star, 
  MapPin,
  Calendar,
  Link as LinkIcon,
  Twitter,
  Instagram,
  Heart,
  Eye,
  Grid3X3,
  List
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { LanguageProvider, useLanguage } from "@/lib/language"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { AIAssistant } from "@/components/ai-assistant"
import { cn } from "@/lib/utils"
import { useState } from "react"

const creator = {
  id: "ahmed",
  name: "أحمد العلي",
  nameEn: "Ahmed Ali",
  username: "@ahmedali",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=400&fit=crop",
  bio: "مصمم واجهات مستخدم محترف مع خبرة أكثر من 10 سنوات. متخصص في تصميم الأيقونات وأنظمة التصميم.",
  bioEn: "Professional UI designer with over 10 years of experience. Specialized in icon design and design systems.",
  location: "الرياض، السعودية",
  locationEn: "Riyadh, Saudi Arabia",
  website: "ahmedali.design",
  twitter: "ahmedali",
  instagram: "ahmedali.design",
  verified: true,
  stats: {
    followers: 25600,
    following: 156,
    products: 67,
    sales: 12450,
    rating: 4.9,
    reviews: 890,
  },
  joinedDate: "2020",
}

const products = [
  {
    id: 1,
    title: "مجموعة أيقونات احترافية",
    titleEn: "Professional Icon Pack",
    price: 49,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
    likes: 1234,
    views: 5678,
    rating: 4.9,
  },
  {
    id: 2,
    title: "نظام تصميم متكامل",
    titleEn: "Complete Design System",
    price: 149,
    image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&h=300&fit=crop",
    likes: 567,
    views: 2345,
    rating: 4.7,
  },
  {
    id: 3,
    title: "أيقونات التواصل الاجتماعي",
    titleEn: "Social Media Icons",
    price: 29,
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400&h=300&fit=crop",
    likes: 890,
    views: 3456,
    rating: 4.8,
  },
  {
    id: 4,
    title: "أيقونات الأعمال",
    titleEn: "Business Icons",
    price: 39,
    image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
    likes: 456,
    views: 1890,
    rating: 4.6,
  },
  {
    id: 5,
    title: "قوالب عروض تقديمية",
    titleEn: "Presentation Templates",
    price: 45,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop",
    likes: 678,
    views: 2567,
    rating: 4.7,
  },
  {
    id: 6,
    title: "مجموعة الرسوم التوضيحية",
    titleEn: "Illustration Pack",
    price: 59,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
    likes: 1023,
    views: 4321,
    rating: 4.9,
  },
]

const tabs = [
  { id: "products", ar: "المنتجات", en: "Products" },
  { id: "collections", ar: "المجموعات", en: "Collections" },
  { id: "about", ar: "نبذة", en: "About" },
  { id: "reviews", ar: "التقييمات", en: "Reviews" },
]

function CreatorContent() {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState("products")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isFollowing, setIsFollowing] = useState(false)
  
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-20">
        {/* Cover Image */}
        <div className="relative h-48 sm:h-64 lg:h-80">
          <Image
            src={creator.cover}
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        
        {/* Profile Info */}
        <div className="container mx-auto px-4 lg:px-8 -mt-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row gap-6 lg:items-end mb-8"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl overflow-hidden border-4 border-background">
                <Image
                  src={creator.avatar}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-2xl lg:text-3xl font-bold">
                  {language === "ar" ? creator.name : creator.nameEn}
                </h1>
                {creator.verified && (
                  <BadgeCheck className="w-6 h-6 text-primary fill-primary/20" />
                )}
              </div>
              
              <p className="text-muted-foreground mb-3">{creator.username}</p>
              
              <p className="text-sm text-muted-foreground max-w-xl mb-4">
                {language === "ar" ? creator.bio : creator.bioEn}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {language === "ar" ? creator.location : creator.locationEn}
                </span>
                <a href={`https://${creator.website}`} className="flex items-center gap-1 hover:text-foreground transition-colors">
                  <LinkIcon className="w-4 h-4" />
                  {creator.website}
                </a>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {language === "ar" ? `انضم في ${creator.joinedDate}` : `Joined ${creator.joinedDate}`}
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setIsFollowing(!isFollowing)}
                className={cn(
                  "gap-2",
                  isFollowing 
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "bg-gradient-to-r from-primary to-accent"
                )}
              >
                {isFollowing 
                  ? (language === "ar" ? "متابَع" : "Following")
                  : (language === "ar" ? "متابعة" : "Follow")
                }
              </Button>
              
              <a href={`https://twitter.com/${creator.twitter}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon">
                  <Twitter className="w-4 h-4" />
                </Button>
              </a>
              
              <a href={`https://instagram.com/${creator.instagram}`} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon">
                  <Instagram className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-8"
          >
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-xl font-bold">{creator.stats.followers.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{language === "ar" ? "متابع" : "Followers"}</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-xl font-bold">{creator.stats.following}</div>
              <div className="text-xs text-muted-foreground">{language === "ar" ? "يتابع" : "Following"}</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-xl font-bold">{creator.stats.products}</div>
              <div className="text-xs text-muted-foreground">{language === "ar" ? "منتج" : "Products"}</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-xl font-bold">{creator.stats.sales.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">{language === "ar" ? "مبيعة" : "Sales"}</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-xl font-bold flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                {creator.stats.rating}
              </div>
              <div className="text-xs text-muted-foreground">{language === "ar" ? "تقييم" : "Rating"}</div>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <div className="text-xl font-bold">{creator.stats.reviews}</div>
              <div className="text-xs text-muted-foreground">{language === "ar" ? "مراجعة" : "Reviews"}</div>
            </div>
          </motion.div>
          
          {/* Tabs */}
          <div className="flex items-center justify-between border-b border-border mb-8">
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                    activeTab === tab.id
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  {language === "ar" ? tab.ar : tab.en}
                </button>
              ))}
            </div>
            
            <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-secondary">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Products Grid */}
          {activeTab === "products" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "grid gap-6 mb-16",
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              )}
            >
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/product/${product.id}`}>
                    <div className={cn(
                      "group glass rounded-2xl overflow-hidden card-hover",
                      viewMode === "list" && "flex"
                    )}>
                      <div className={cn(
                        "relative overflow-hidden",
                        viewMode === "grid" ? "aspect-[4/3]" : "w-48 aspect-[4/3]"
                      )}>
                        <Image
                          src={product.image}
                          alt=""
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-4 end-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                            <Heart className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      
                      <div className={cn(
                        "p-4",
                        viewMode === "list" && "flex-1 flex flex-col justify-center"
                      )}>
                        <h3 className="font-semibold mb-2 line-clamp-1">
                          {language === "ar" ? product.title : product.titleEn}
                        </h3>
                        
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Heart className="w-3.5 h-3.5" />
                            {product.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            {product.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                            {product.rating}
                          </span>
                        </div>
                        
                        <div className="font-bold text-lg">${product.price}</div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
          
          {/* About Tab */}
          {activeTab === "about" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mb-16"
            >
              <div className="glass rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">
                  {language === "ar" ? "نبذة عني" : "About Me"}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {language === "ar" ? creator.bio : creator.bioEn}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      
      <Footer />
      <AIAssistant />
    </div>
  )
}

export default function CreatorPage() {
  return (
    <LanguageProvider>
      <CreatorContent />
    </LanguageProvider>
  )
}
