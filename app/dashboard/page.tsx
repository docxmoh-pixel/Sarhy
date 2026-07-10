"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useLanguage, LanguageProvider } from "@/lib/language"
import { LogOut, User, Mail, Shield, ShoppingBag, Store, Package, TrendingUp, Star, LayoutDashboard, Grid, MapPin, Pencil, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import type { User as SupabaseUser } from "@supabase/supabase-js"

const categories: Record<string, string[]> = {
  "الحلول الرقمية": ["ريشة", "الأثير", "إرث", "حلول"],
  "الخدمات والأعمال": ["سند", "صنعة", "ميدان"],
  "المعرفة والتطوير": ["مداد", "مهارة"],
  "المجتمع": ["عون"],
}

function DashboardContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [role, setRole] = useState<"buyer" | "seller">("buyer")
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { router.replace("/auth/login"); return }
      setUser(user)
      const isSeller = user.user_metadata?.account_type === "seller" || user.user_metadata?.account_type === "creator"
      setRole(isSeller ? "seller" : "buyer")
      setIsLoading(false)
      if (isSeller) {
        supabase.from("products").select("*").eq("seller_id", user.id).then(({ data }) => setProducts(data || []))
      } else {
        supabase.from("orders").select('*, order_items(*, products(*))').eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setOrders(data || []))
      }
    })
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace("/")
  }

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user) return null

  const avatarUrl = user.user_metadata?.avatar_url
  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  const email = user.email || ""

  const stats = role === "seller" ? [
    { icon: Package, label: language === "ar" ? "منتجاتي" : "My Products", value: String(products.length), color: "text-blue-500" },
    { icon: TrendingUp, label: language === "ar" ? "المبيعات" : "Sales", value: "0", color: "text-green-500" },
    { icon: Star, label: language === "ar" ? "التقييم" : "Rating", value: "—", color: "text-yellow-500" },
    { icon: Store, label: language === "ar" ? "الطلبات" : "Orders", value: "0", color: "text-purple-500" },
  ] : [
    { icon: ShoppingBag, label: language === "ar" ? "مشترياتي" : "Purchases", value: String(orders.length), color: "text-blue-500" },
    { icon: Package, label: language === "ar" ? "الطلبات النشطة" : "Active Orders", value: "0", color: "text-green-500" },
    { icon: Star, label: language === "ar" ? "المفضلة" : "Wishlist", value: "0", color: "text-yellow-500" },
  ]

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">{language === "ar" ? "لوحة التحكم" : "Dashboard"}</h1>
          </div>
          <Button variant="ghost" onClick={handleSignOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            {language === "ar" ? "خروج" : "Sign out"}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={fullName} width={64} height={64} className="object-cover" />
              ) : (
                <User className="w-8 h-8 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-xl font-bold">{fullName}</h2>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${role === "seller" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                  {role === "seller" ? (language === "ar" ? "بائع" : "Seller") : (language === "ar" ? "مشتري" : "Buyer")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Mail className="w-3.5 h-3.5" /><span>{email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3 h-3" /><span className="font-mono truncate">{user.id}</span>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/orders"
          className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-secondary/50 transition-colors mb-4"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {language === "ar" ? "طلباتي" : "My Orders"}
            </p>
            <p className="text-sm text-muted-foreground">
              {language === "ar" ? "تتبع طلباتك ومشترياتك السابقة" : "Track your orders and past purchases"}
            </p>
          </div>
        </Link>

        <Link
          href="/account/addresses"
          className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-secondary/50 transition-colors mb-6"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {language === "ar" ? "عناويني" : "My Addresses"}
            </p>
            <p className="text-sm text-muted-foreground">
              {language === "ar" ? "إدارة عناوين الشحن المحفوظة" : "Manage your saved shipping addresses"}
            </p>
          </div>
        </Link>

        <Link
          href="/account/profile"
          className="flex items-center gap-3 p-4 rounded-2xl border border-border bg-card hover:bg-secondary/50 transition-colors mb-6"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Pencil className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {language === "ar" ? "تعديل الملف الشخصي" : "Edit Profile"}
            </p>
            <p className="text-sm text-muted-foreground">
              {language === "ar" ? "تحديث الاسم، البريد، رقم الجوال" : "Update name, email, phone number"}
            </p>
          </div>
        </Link>

        <div className={`grid gap-4 mb-6 ${role === "seller" ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-3"}`}>
          {stats.map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
              <s.icon className={`w-6 h-6 mb-3 ${s.color}`} />
              <div className="text-2xl font-bold mb-1">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>

        {role === "seller" && (
          <div className="space-y-6">
            {products.length === 0 ? (
              <div className="bg-card border border-border rounded-2xl p-6 text-center py-12">
                <Store className="w-12 h-12 mx-auto mb-3 opacity-30 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">{language === "ar" ? "لم تضف أي منتجات بعد" : "No products yet"}</p>
                <Button onClick={() => router.push("/creator/dashboard/products/new")} className="rounded-xl gap-2">
                  <Package className="w-4 h-4" />{language === "ar" ? "أضف منتجك الأول" : "Add first product"}
                </Button>
              </div>
            ) : (
              Object.entries(categories).map(([mainCat]) => {
                const catProducts = products.filter((p) => p.category === mainCat)
                if (!catProducts.length) return null
                return (
                  <div key={mainCat} className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Grid className="w-5 h-5 text-primary" />{mainCat}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {catProducts.map((p) => (
                        <div key={p.id} className="p-4 border border-border rounded-xl bg-muted/30">
                          <h3 className="font-bold">{p.title || p.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{p.subcategory}</p>
                          <p className="text-sm font-semibold text-primary mt-2">
                            {p.price_halalas ? `${(p.price_halalas / 100).toFixed(2)} ر.س` : "—"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
            <Button onClick={() => router.push("/creator/dashboard/products/new")} variant="outline" className="w-full rounded-xl gap-2">
              <Package className="w-4 h-4" />{language === "ar" ? "إضافة منتج جديد" : "Add new product"}
            </Button>
          </div>
        )}

        {role === "buyer" && (
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">{language === "ar" ? "مشترياتي" : "My Purchases"}</h3>
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="mb-4">{language === "ar" ? "لا توجد مشتريات بعد" : "No purchases yet"}</p>
              <Button variant="outline" onClick={() => router.push("/")} className="rounded-xl gap-2">
                <Store className="w-4 h-4" />{language === "ar" ? "تصفح المنتجات" : "Browse products"}
              </Button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <LanguageProvider>
      <DashboardContent />
    </LanguageProvider>
  )
}
