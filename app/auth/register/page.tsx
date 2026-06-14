"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useLanguage } from "@/lib/language"
import { createClient } from "@/lib/supabase"

function RegisterContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight
  const [accountType, setAccountType] = useState<"buyer" | "creator">("buyer")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    agreedToTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.fullName.trim()) {
      setError(language === "ar" ? "الرجاء إدخال اسمك الكامل" : "Please enter your full name")
      return
    }
    if (!form.email.trim()) {
      setError(language === "ar" ? "الرجاء إدخال البريد الإلكتروني" : "Please enter your email")
      return
    }
    if (form.password.length < 8) {
      setError(language === "ar" ? "كلمة المرور يجب أن تكون 8 أحرف على الأقل" : "Password must be at least 8 characters")
      return
    }
    if (!form.agreedToTerms) {
      setError(language === "ar" ? "يجب الموافقة على الشروط والأحكام" : "You must agree to the terms")
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            full_name: form.fullName,
            account_type: accountType,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        },
      })

      if (signUpError) {
        if (signUpError.message.includes("already registered")) {
          setError(
            language === "ar"
              ? "هذا البريد الإلكتروني مسجل مسبقاً. هل تريد تسجيل الدخول؟"
              : "This email is already registered. Want to sign in instead?"
          )
        } else {
          setError(signUpError.message)
        }
        return
      }

      setSuccess(true)
    } catch {
      setError(language === "ar" ? "حدث خطأ غير متوقع. حاول مرة أخرى." : "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
    } catch (err) {
      setError(
        language === "ar"
          ? "حدث خطأ أثناء التسجيل بجوجل"
          : "An error occurred during Google sign up"
      )
    }
  }

  const benefits = language === "ar"
    ? ["وصول غير محدود للمنتجات", "أدوات ذكاء اصطناعي متقدمة", "دعم فني على مدار الساعة"]
    : ["Unlimited product access", "Advanced AI tools", "24/7 support"]

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3">
            {language === "ar" ? "تحقق من بريدك الإلكتروني" : "Check your email"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {language === "ar"
              ? `أرسلنا رابط تأكيد إلى ${form.email}. افتح بريدك وانقر على الرابط لتفعيل حسابك.`
              : `We sent a confirmation link to ${form.email}. Open your email and click the link to activate your account.`}
          </p>
          <Button asChild className="w-full h-12 rounded-xl">
            <Link href="/auth/login">
              {language === "ar" ? "الذهاب لتسجيل الدخول" : "Go to sign in"}
            </Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md py-8"
        >
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              {language === "ar" ? "صرحي" : "Sarhy"}
            </span>
          </Link>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {language === "ar" ? "أنشئ حسابك" : "Create your account"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {language === "ar" ? "انضم إلى مجتمع المبدعين اليوم" : "Join the creator community today"}
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {(["buyer", "creator"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setAccountType(type)}
                className={`p-4 rounded-xl border-2 transition-all text-start ${
                  accountType === type
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-medium text-foreground mb-1">
                  {type === "buyer"
                    ? language === "ar" ? "مشتري" : "Buyer"
                    : language === "ar" ? "بائع / مبدع" : "Seller / Creator"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {type === "buyer"
                    ? language === "ar" ? "اشتري المنتجات الرقمية" : "Purchase digital products"
                    : language === "ar" ? "بع منتجاتك الرقمية" : "Sell your digital products"}
                </div>
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            className="w-full h-12 rounded-xl gap-3 mb-6"
            onClick={handleGoogleSignUp}
            type="button"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {language === "ar" ? "التسجيل بجوجل" : "Sign up with Google"}
          </Button>

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

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
              {error.includes("already registered") || error.includes("مسجل مسبقاً") ? (
                <Link href="/auth/login" className="block mt-1 font-medium underline">
                  {language === "ar" ? "تسجيل الدخول" : "Sign in"}
                </Link>
              ) : null}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">{language === "ar" ? "الاسم الكامل" : "Full name"}</Label>
              <div className="relative">
                <User className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder={language === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"}
                  className="h-12 ps-10 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
              <div className="relative">
                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                  className="h-12 ps-10 rounded-xl"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{language === "ar" ? "كلمة المرور" : "Password"}</Label>
              <div className="relative">
                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder={language === "ar" ? "8 أحرف على الأقل" : "At least 8 characters"}
                  className="h-12 ps-10 pe-10 rounded-xl"
                  required
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

            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={form.agreedToTerms}
                onCheckedChange={(v) => setForm((p) => ({ ...p, agreedToTerms: Boolean(v) }))}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm font-normal leading-relaxed">
                {language === "ar"
                  ? "أوافق على شروط الخدمة وسياسة الخصوصية"
                  : "I agree to the Terms of Service and Privacy Policy"}
              </Label>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl gap-2" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {language === "ar" ? "إنشاء حساب" : "Create account"}
                  <Arrow className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {language === "ar" ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              {language === "ar" ? "سجل دخولك" : "Sign in"}
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5 items-center justify-center p-8">
        <div className="max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-48 h-48 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center"
          >
            <Sparkles className="w-20 h-20 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            {language === "ar" ? "ما ستحصل عليه" : "What you'll get"}
          </h2>
          <ul className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary" />
                </div>
                <span className="text-foreground">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return <RegisterContent />
}
