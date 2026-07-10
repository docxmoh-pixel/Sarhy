"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useLanguage } from "@/lib/language"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, User } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { language } = useLanguage()
  const isAr = language === "ar"
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUserId(user.id)
      setForm({
        full_name: user.user_metadata?.full_name || "",
        email: user.email || "",
        phone: user.user_metadata?.phone || "",
      })
      setLoading(false)
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    setSuccess(false)

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: form.full_name,
        phone: form.phone,
      },
    })

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    setSuccess(true)
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-16">
      <div className="container mx-auto px-4 lg:px-8 max-w-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {isAr ? "تعديل الملف الشخصي" : "Edit Profile"}
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-500/10 text-green-600 text-sm">
            {isAr ? "تم حفظ التغييرات بنجاح" : "Changes saved successfully"}
          </div>
        )}

        <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
          <div>
            <Label>{isAr ? "الاسم الكامل" : "Full Name"}</Label>
            <Input
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
          </div>

          <div>
            <Label>{isAr ? "البريد الإلكتروني" : "Email"}</Label>
            <Input value={form.email} disabled className="opacity-60" />
            <p className="text-xs text-muted-foreground mt-1">
              {isAr ? "لا يمكن تغيير البريد الإلكتروني حالياً" : "Email cannot be changed at this time"}
            </p>
          </div>

          <div>
            <Label>{isAr ? "رقم الجوال" : "Phone Number"}</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder={isAr ? "05XXXXXXXX" : "05XXXXXXXX"}
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isAr ? "حفظ التغييرات" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  )
}
