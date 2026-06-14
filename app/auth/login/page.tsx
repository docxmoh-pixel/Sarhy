"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, Sparkles, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/lib/language"
import { createClient } from "@/lib/supabase"

function LoginContent() {
  const { language, t } = useLanguage()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const Arrow = language === "ar" ? ArrowLeft : ArrowRight

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setErrorMessage(
          language === "ar"
            ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
            : error.message
        )
        return
      }

      // توجيه المستخدم إلى لوحة التحكم فور نجاح الدخول
      router.push("/dashboard")
      router.refresh()
    } catch (err) {
      setErrorMessage(
        language === "ar"
          ? "حدث خطأ غير متوقع. حاول مرة أخرى لاحقاً."
          : "An unexpected error occurred."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              {mounted ? (language === "ar" ? "صرحي" : "Sarhy") : "Sarhy"}
            </span>
          </Link>
          
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {language === "ar" ? "مرحباً بعودتك" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {language === "ar" ? "سجل دخولك للوصول إلى حسابك" : "Sign in to access your account"}
          </p>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900">
              {errorMessage}
            </div>
          )}
          
          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl gap-3"
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {language === "ar" ? "تسجيل الدخول بجوجل" : "Continue with Google"}
            </Button>
          </div>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {language === "ar" ? "أو" : "or"}
              </span>
            </div>
          </div>
          
          {/* Form */}
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                  className="h-12 ps-10 rounded-xl"
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">{language === "ar" ? "كلمة المرور" : "Password"}</Label>
                <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                  {language === "ar" ? "نسيت كلمة المرور؟" : "Forgot password?"}
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === "ar" ? "أدخل كلمة المرور" : "Enter your password"}
                  className="h-12 ps-10 pe-10 rounded-xl"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label htmlFor="remember" className="text-sm font-normal">
                {language === "ar" ? "تذكرني" : "Remember me"}
              </Label>
            </div>
            
            <Button type="submit" className="w-full h-12 rounded-xl gap-2" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {language === "ar" ? "جاري تسجيل الدخول..." : "Signing in..."}
                </>
              ) : (
                <>
                  {language === "ar" ? "تسجيل الدخول" : "Sign in"}
                  <Arrow className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>
          
          <p className="text-center text-sm text-muted-foreground mt-6">
            {language === "ar" ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
            <Link href="/auth/register" className="text-primary hover:underline font-medium">
              {language === "ar" ? "أنشئ حساباً" : "Sign up"}
            </Link>
          </p>
        </motion.div>
      </div>
      
      {/* Right Side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 items-center justify-center p-8">
        <div className="max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-64 h-64 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
          >
            <Sparkles className="w-24 h-24 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            {language === "ar" ? "انضم إلى مجتمع المبدعين" : "Join the Creator Community"}
          </h2>
          <p className="text-muted-foreground">
            {language === "ar" 
              ? "أكثر من 50,000 مبدع يستخدمون صرحي لبيع وشراء المحتوى الرقمي"
              : "Over 50,000 creators use Sarhy to buy and sell digital content"
            }
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <LoginContent />
}