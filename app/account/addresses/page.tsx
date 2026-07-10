"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useLanguage } from "@/lib/language"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Star, Trash2, Plus, X, Loader2 } from "lucide-react"

const MAX_ADDRESSES = 5

export default function AddressesPage() {
  const router = useRouter()
  const { language } = useLanguage()
  const isAr = language === "ar"
  const supabase = createClient()

  const [userId, setUserId] = useState<string | null>(null)
  const [addresses, setAddresses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    label: "",
    full_name: "",
    phone: "",
    city: "",
    address_line1: "",
    address_line2: "",
  })

  const fetchAddresses = async (uid: string) => {
    const { data } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", uid)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })
    setAddresses(data || [])
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUserId(user.id)
      fetchAddresses(user.id).finally(() => setLoading(false))
    })
  }, [])

  const resetForm = () => {
    setForm({ label: "", full_name: "", phone: "", city: "", address_line1: "", address_line2: "" })
    setShowForm(false)
    setError(null)
  }

  const handleAddClick = () => {
    if (addresses.length >= MAX_ADDRESSES) {
      setError(
        isAr
          ? `لقد وصلت إلى الحد الأقصى (${MAX_ADDRESSES} عناوين). يرجى حذف عنوان لإضافة عنوان جديد.` 
          : `You've reached the maximum of ${MAX_ADDRESSES} addresses. Please delete one to add a new address.` 
      )
      return
    }
    setError(null)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!userId) return
    if (!form.label || !form.full_name || !form.phone || !form.city || !form.address_line1) {
      setError(isAr ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill in all required fields")
      return
    }

    setSaving(true)
    setError(null)

    const { error: insertError } = await supabase.from("user_addresses").insert({
      user_id: userId,
      label: form.label,
      full_name: form.full_name,
      phone: form.phone,
      city: form.city,
      address_line1: form.address_line1,
      address_line2: form.address_line2,
      is_default: addresses.length === 0,
    })

    if (insertError) {
      setError(insertError.message)
      setSaving(false)
      return
    }

    await fetchAddresses(userId)
    resetForm()
    setSaving(false)
  }

  const handleSetDefault = async (addressId: string) => {
    if (!userId) return
    await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", userId)
    await supabase.from("user_addresses").update({ is_default: true }).eq("id", addressId)
    await fetchAddresses(userId)
  }

  const handleDelete = async (addressId: string) => {
    if (!userId) return
    await supabase.from("user_addresses").delete().eq("id", addressId)
    await fetchAddresses(userId)
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
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            {isAr ? "عناويني" : "My Addresses"}
          </h1>
          <span className="text-sm text-muted-foreground">
            {addresses.length} / {MAX_ADDRESSES}
          </span>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="space-y-3 mb-6">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-4 rounded-2xl border border-border bg-card flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{addr.label}</p>
                    {addr.is_default && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        {isAr ? "مفضل" : "Default"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{addr.full_name} — {addr.phone}</p>
                  <p className="text-sm text-muted-foreground">{addr.address_line1}, {addr.city}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 shrink-0">
                {!addr.is_default && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs text-primary hover:underline whitespace-nowrap"
                  >
                    {isAr ? "جعله مفضل" : "Set default"}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors self-end"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {addresses.length === 0 && !showForm && (
            <p className="text-center text-muted-foreground py-8">
              {isAr ? "لا توجد عناوين محفوظة بعد" : "No saved addresses yet"}
            </p>
          )}
        </div>

        {showForm ? (
          <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{isAr ? "إضافة عنوان جديد" : "Add New Address"}</h2>
              <button onClick={resetForm}>
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>{isAr ? "اسم العنوان (مثل: المنزل، العمل)" : "Label (e.g. Home, Work)"}</Label>
                <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
              </div>
              <div>
                <Label>{isAr ? "الاسم الكامل" : "Full Name"}</Label>
                <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
              </div>
              <div>
                <Label>{isAr ? "رقم الجوال" : "Phone Number"}</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <Label>{isAr ? "المدينة" : "City"}</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <Label>{isAr ? "العنوان التفصيلي" : "Address Line"}</Label>
                <Input value={form.address_line1} onChange={(e) => setForm({ ...form, address_line1: e.target.value })} />
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isAr ? "حفظ العنوان" : "Save Address"}
            </Button>
          </div>
        ) : (
          <Button onClick={handleAddClick} variant="outline" className="w-full gap-2">
            <Plus className="w-4 h-4" />
            {isAr ? "إضافة عنوان جديد" : "Add New Address"}
          </Button>
        )}
      </div>
    </div>
  )
}
