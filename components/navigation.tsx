"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  Globe,
  Search,
  ChevronDown,
  Sparkles,
  Palette,
  Film,
  BookOpen,
  Code,
  GraduationCap,
  Camera,
  Heart,
  LogOut,
  LayoutDashboard,
  Sun,
  Moon,
  ShoppingCart
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language"
import { useCart } from "@/lib/cart"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase"
import { NotificationBell } from "@/components/notification-bell"
import type { User } from "@supabase/supabase-js"

const sections = [
  { key: "resha", icon: Palette, color: "from-pink-500 to-rose-500" },
  { key: "atheer", icon: Film, color: "from-blue-500 to-cyan-500" },
  { key: "mdad", icon: BookOpen, color: "from-amber-500 to-orange-500" },
  { key: "holool", icon: Code, color: "from-emerald-500 to-green-500" },
  { key: "mahara", icon: GraduationCap, color: "from-violet-500 to-purple-500" },
  { key: "erth", icon: Camera, color: "from-sky-500 to-blue-500" },
  { key: "aoun", icon: Heart, color: "from-red-500 to-pink-500" },
]

export function Navigation() {
  const { language, setLanguage, t } = useLanguage()
  const { count } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    let mounted = true

    const supabase = createClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setUser(session?.user ?? null)
        setAuthReady(true)
      }
    })

    // Listen for all auth changes (login, logout, token refresh, OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setUser(session?.user ?? null)
          setAuthReady(true)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setIsDark(savedTheme === 'dark' || (!savedTheme && systemPrefersDark))
  }, [])

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newTheme = !prev
      localStorage.setItem('theme', newTheme ? 'dark' : 'light')
      if (newTheme) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return newTheme
    })
  }, [])

  const handleSignOut = useCallback(async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = "/"
  }, [])
  
  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled 
            ? "bg-[#122560] py-3" 
            : "bg-[#122560] py-5"
        )}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#122560]" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-white to-white/80 opacity-30 blur-lg -z-10" />
              </div>
              <span className="text-xl font-bold text-white">
                {language === "ar" ? "صرحي" : "Sarhy"}
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              <Link href="/" className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors">
                {t("nav.home")}
              </Link>
              
              {/* Marketplace Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsMarketplaceOpen(true)}
                onMouseLeave={() => setIsMarketplaceOpen(false)}
              >
                <button className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors flex items-center gap-1">
                  {t("nav.marketplace")}
                  <ChevronDown className={cn(
                    "w-4 h-4 transition-transform text-white",
                    isMarketplaceOpen && "rotate-180"
                  )} />
                </button>
                
                <AnimatePresence>
                  {isMarketplaceOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full start-0 pt-2 w-[400px]"
                    >
                      <div className="glass-strong rounded-2xl p-4 shadow-2xl">
                        <div className="grid grid-cols-2 gap-2">
                          {sections.map((section) => (
                            <Link
                              key={section.key}
                              href={`/marketplace/${section.key}`}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary transition-colors group"
                            >
                              <div className={cn(
                                "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                                section.color
                              )}>
                                <section.icon className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">
                                  {t(`sections.${section.key}`)}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {t(`sections.${section.key}.desc`)}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Link href="/creators" className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors">
                {t("nav.creators")}
              </Link>
              
              <Link href="/enterprise" className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors">
                {t("nav.enterprise")}
              </Link>
              
              <Link href="#enterprise" className="px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors">
                {t("nav.pricing")}
              </Link>
            </div>
            
            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <Button variant="ghost" size="icon" className="hidden sm:flex text-white hover:text-white/80" asChild>
                <Link href="/search">
                  <Search className="w-5 h-5" />
                </Link>
              </Button>
              
              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="hidden sm:flex text-white hover:text-white/80"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              
              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                className="gap-2 text-white hover:text-white/80"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm">{language === "ar" ? "EN" : "عربي"}</span>
              </Button>
              
              {/* Auth Buttons */}
              <div className="flex items-center gap-2">
                {!authReady ? (
                  // Skeleton placeholder — prevents layout flash
                  <div className="hidden md:flex items-center gap-2">
                    <div className="h-8 w-20 rounded-xl bg-white/20 animate-pulse" />
                    <div className="h-8 w-24 rounded-xl bg-white/20 animate-pulse" />
                  </div>
                ) : user ? (
                  <div className="flex items-center gap-2">
                    <NotificationBell />
                    <Link href="/cart" className="relative p-2 rounded-xl hover:bg-muted transition-colors">
                      <ShoppingCart className="w-5 h-5 text-white" />
                      {count > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                          {count}
                        </span>
                      )}
                    </Link>
                    <Button variant="ghost" size="sm" asChild className="hidden sm:flex rounded-xl gap-2 text-white hover:text-white/80">
                      <Link href="/dashboard">
                        <LayoutDashboard className="w-4 h-4" />
                        {language === "ar" ? "لوحتي" : "Dashboard"}
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleSignOut}
                      className="hidden sm:flex rounded-xl text-white/80 hover:text-white transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild className="rounded-xl text-white hover:text-white/80">
                      <Link href="/auth/login">
                        {language === "ar" ? "تسجيل الدخول" : "Sign in"}
                      </Link>
                    </Button>
                    <Button size="sm" asChild className="rounded-xl bg-white text-[#122560] hover:bg-white/90">
                      <Link href="/auth/register">
                        {language === "ar" ? "إنشاء حساب" : "Get started"}
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:text-white/80"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </nav>
        </div>
      </motion.header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: language === "ar" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: language === "ar" ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 bottom-0 end-0 w-[300px] bg-card z-50 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-bold">
                  {language === "ar" ? "صرحي" : "Sarhy"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Link 
                  href="/" 
                  className="block px-4 py-3 rounded-xl hover:bg-secondary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.home")}
                </Link>
                
                <div className="px-4 py-2 text-sm font-medium text-muted-foreground">
                  {t("nav.marketplace")}
                </div>
                
                {sections.map((section) => (
                  <Link
                    key={section.key}
                    href={`/marketplace/${section.key}`}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-secondary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center",
                      section.color
                    )}>
                      <section.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm">{t(`sections.${section.key}`)}</span>
                  </Link>
                ))}
                
                <Link 
                  href="/creators" 
                  className="block px-4 py-3 rounded-xl hover:bg-secondary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.creators")}
                </Link>
                
                <Link 
                  href="/enterprise" 
                  className="block px-4 py-3 rounded-xl hover:bg-secondary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t("nav.enterprise")}
                </Link>
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 space-y-3">
                {user ? (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                        <LayoutDashboard className="w-4 h-4 me-2" />
                        {language === "ar" ? "لوحتي" : "Dashboard"}
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}>
                      <LogOut className="w-4 h-4 me-2" />
                      {language === "ar" ? "تسجيل الخروج" : "Sign Out"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                        {t("nav.signin")}
                      </Link>
                    </Button>
                    <Button className="w-full bg-gradient-to-r from-primary to-accent" asChild>
                      <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}>
                        {t("nav.getstarted")}
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
