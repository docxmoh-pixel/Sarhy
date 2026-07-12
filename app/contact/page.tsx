"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage, LanguageProvider } from "@/lib/language"

function ContactContent() {
  const { language } = useLanguage()
  const isAr = language === "ar"

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError(isAr ? "يرجى تعبئة الحقول المطلوبة" : "Please fill in required fields")
      return
    }
    setSubmitting(true)
    setError(null)
    // Simulate send — replace with real API when ready
    await new Promise((r) => setTimeout(r, 1200))
    setSent(true)
    setSubmitting(false)
  }

  const info = [
    {
      icon: Mail,
      labelAr: "البريد الإلكتروني",
      labelEn: "Email",
      valueAr: "support@sarhy.com",
      valueEn: "support@sarhy.com",
      href: "mailto:support@sarhy.com",
    },
    {
      icon: Phone,
      labelAr: "الهاتف",
      labelEn: "Phone",
      valueAr: "+966 11 000 0000",
      valueEn: "+966 11 000 0000",
      href: "tel:+966110000000",
    },
    {
      icon: MapPin,
      labelAr: "الموقع",
      labelEn: "Location",
      valueAr: "الرياض، المملكة العربية السعودية",
      valueEn: "Riyadh, Saudi Arabia",
      href: null,
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-28 pb-16" dir={isAr ? "rtl" : "ltr"}>
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            {isAr ? "تواصل معنا" : "Contact Us"}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {isAr
              ? "يسعدنا الرد عليك في أقرب وقت ممكن. فريقنا متاح لمساعدتك."
              : "We're happy to hear from you. Our team will get back to you as soon as possible."}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            {info.map((item) => (
              <div key={item.labelEn} className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">{isAr ? item.labelAr : item.labelEn}</p>
                  {item.href ? (
                    <a href={item.href} className="font-medium hover:text-primary transition-colors">
                      {isAr ? item.valueAr : item.valueEn}
                    </a>
                  ) : (
                    <p className="font-medium">{isAr ? item.valueAr : item.valueEn}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: isAr ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="p-7 rounded-2xl border border-border bg-card">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold">
                    {isAr ? "تم الإرسال بنجاح ✓" : "Message Sent ✓"}
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    {isAr
                      ? "شكراً لتواصلك معنا، سنرد عليك قريباً."
                      : "Thanks for reaching out. We'll get back to you soon."}
                  </p>
                  <Button variant="outline" onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }) }}>
                    {isAr ? "إرسال رسالة أخرى" : "Send Another"}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>{isAr ? "الاسم *" : "Name *"}</Label>
                      <Input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder={isAr ? "اسمك الكامل" : "Your full name"}
                        className="h-11 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>{isAr ? "البريد الإلكتروني *" : "Email *"}</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder={isAr ? "بريدك الإلكتروني" : "your@email.com"}
                        className="h-11 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>{isAr ? "الموضوع" : "Subject"}</Label>
                    <Input
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder={isAr ? "موضوع رسالتك" : "What's this about?"}
                      className="h-11 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>{isAr ? "الرسالة *" : "Message *"}</Label>
                    <Textarea
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder={isAr ? "اكتب رسالتك هنا..." : "Write your message here..."}
                      className="min-h-[130px] rounded-xl resize-none"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}

                  <Button type="submit" className="w-full h-12 rounded-xl gap-2" disabled={submitting}>
                    {submitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" />{isAr ? "جاري الإرسال..." : "Sending..."}</>
                    ) : (
                      <><Send className="w-4 h-4" />{isAr ? "إرسال الرسالة" : "Send Message"}</>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default function ContactPage() {
  return (
    <LanguageProvider>
      <ContactContent />
    </LanguageProvider>
  )
}
