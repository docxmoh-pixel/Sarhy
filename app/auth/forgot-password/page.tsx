"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, Sparkles, ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage, LanguageProvider } from "@/lib/language"
import { createClient } from "@/lib/supabase"

function ForgotPasswordContent() {
  const { language } = useLanguage()
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email.trim()) {
      setError(language === "ar" ? "الرجاء إدخال البريد الإلكتروني" : "Please enter your email")
      return
    }

    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (resetError) {
        setError(resetError.message)
        return
      }

      setSuccess(true)
    } catch {
      setError(
        language === "ar"
          ? "حدث خطأ غير متوقع. حاول مرة أخرى."
          : "An unexpected error occurred. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

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
              ? `أرسلنا رابط إعادة تعيين كلمة المرور إلى ${email}. افتح بريدك وانقر على الرابط.`
              : `We sent a password reset link to ${email}. Open your email and click the link.`}
          </p>
          <Button asChild className="w-full h-12 rounded-xl">
            <Link href="/auth/login">
              {language === "ar" ? "العودة لتسجيل الدخول" : "Back to sign in"}
            </Link>
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
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
            {language === "ar" ? "صرحي" : "Sarhy"}
          </span>
        </Link>
        
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {language === "ar" ? "استعادة كلمة المرور" : "Reset password"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {language === "ar"
            ? "أدخل بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور"
            : "Enter your email and we'll send you a link to reset your password"
          }
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
            <div className="relative">
              <Mail className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === "ar" ? "أدخل بريدك الإلكتروني" : "Enter your email"}
                className="h-12 ps-10 rounded-xl"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl gap-2" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                {language === "ar" ? "إرسال رابط الاستعادة" : "Send reset link"}
                <Arrow className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>
        
        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link href="/auth/login" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
            {language === "ar" ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            {language === "ar" ? "العودة لتسجيل الدخول" : "Back to sign in"}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <LanguageProvider>
      <ForgotPasswordContent />
    </LanguageProvider>
  )
}
