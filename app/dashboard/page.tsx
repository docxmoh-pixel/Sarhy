"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useLanguage, LanguageProvider } from "@/lib/language"
import { LayoutDashboard, ShoppingBag, Store, Package, TrendingUp, Star, LogOut, User, Mail, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { User as SupabaseUser } from "@supabase/supabase-js"

function DashboardContent() {
  const { language } = useLanguage()
  const router = useRouter()
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [role, setRole] = useState<"buyer" | "seller">("buyer")
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<any[]>([])
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [reportReason, setReportReason] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [submittingReport, setSubmittingReport] = useState(false)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.replace("/auth/login")
        return
      }
      setUser(user)
      const accountType = user.user_metadata?.account_type
      setRole(accountType === "seller" || accountType === "creator" ? "seller" : "buyer")
      setIsLoading(false)

      // Fetch buyer orders
      if (accountType !== "seller" && accountType !== "creator") {
        supabase
          .from("orders")
          .select("*")
          .eq("buyer_id", user.id)
          .order("created_at", { ascending: false })
          .then(({ data }) => {
            setOrders(data || [])
          })
      }
    })
  }, [router])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace("/")
  }

  // Helper function to check if order is within 24-hour window
  const isWithin24Hours = (deliveryDate: string) => {
    const delivery = new Date(deliveryDate)
    const now = new Date()
    const hoursSinceDelivery = (now.getTime() - delivery.getTime()) / (1000 * 60 * 60)
    return hoursSinceDelivery < 24
  }

  const handleConfirmOrder = async (orderId: string) => {
    try {
      const supabase = createClient()

      // Update order status
      await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId)

      // Fetch seller_id from the order
      const { data: orderData } = await supabase
        .from("orders")
        .select("seller_id")
        .eq("id", orderId)
        .single()

      // Send notification to seller
      if (orderData?.seller_id) {
        await supabase.from("notifications").insert({
          user_id: orderData.seller_id,
          title: language === "ar" ? "تحرير أموال الطلب" : "Order Funds Released",
          message: language === "ar"
            ? `تهانينا! تم تحرير أموال الطلب رقم #${orderId.slice(0, 8)} وهي جاهزة للصرف الآن في حسابك`
            : `Congratulations! Funds for order #${orderId.slice(0, 8)} have been released and are ready for payout in your account`,
          is_read: false,
        })
      }

      alert(language === "ar" ? "تم تأكيد سلامة الطلب بنجاح" : "Order confirmed successfully")

      // Refresh orders
      if (user) {
        const { data } = await supabase
          .from("orders")
          .select("*")
          .eq("buyer_id", user.id)
          .order("created_at", { ascending: false })

        setOrders(data || [])
      }
    } catch (error) {
      console.error("Error confirming order:", error)
      alert(language === "ar" ? "فشل تأكيد الطلب" : "Failed to confirm order")
    }
  }

  const handleReportOrder = async () => {
    try {
      const supabase = createClient()
      setSubmittingReport(true)

      // Insert report
      await supabase.from("reports").insert({
        product_id: selectedOrder.product_id,
        reason: reportReason,
        description: reportDescription,
        status: "pending",
      })

      // Fetch seller_id from the order
      const { data: orderData } = await supabase
        .from("orders")
        .select("seller_id")
        .eq("id", selectedOrder.id)
        .single()

      // Fetch admin users
      const { data: adminData } = await supabase
        .from("users")
        .select("id")
        .eq("role", "admin")

      const adminIds = adminData?.map((admin: any) => admin.id) || []

      // Send notification to seller
      if (orderData?.seller_id) {
        await supabase.from("notifications").insert({
          user_id: orderData.seller_id,
          title: language === "ar" ? "تجميد أموال الطلب" : "Order Funds Frozen",
          message: language === "ar"
            ? `تم تجميد أموال الطلب رقم #${selectedOrder.id.slice(0, 8)} لوجود بلاغ من المشتري، وجاري التحقق من قبل الإدارة`
            : `Funds for order #${selectedOrder.id.slice(0, 8)} have been frozen due to a buyer report, admin review in progress`,
          is_read: false,
        })
      }

      // Send notification to all admins
      for (const adminId of adminIds) {
        await supabase.from("notifications").insert({
          user_id: adminId,
          title: language === "ar" ? "بلاغ جديد" : "New Report",
          message: language === "ar"
            ? `بلاغ جديد! قام المشتري بتقديم شكوى على الطلب رقم #${selectedOrder.id.slice(0, 8)}، يرجى مراجعة لوحة التحكم للفصل`
            : `New report! Buyer submitted a complaint for order #${selectedOrder.id.slice(0, 8)}, please review admin dashboard`,
          is_read: false,
        })
      }

      alert(language === "ar" ? "تم إرسال البلاغ بنجاح" : "Report submitted successfully")
      setShowReportModal(false)
      setReportReason("")
      setReportDescription("")
      setSelectedOrder(null)
    } catch (error) {
      console.error("Error submitting report:", error)
      alert(language === "ar" ? "فشل إرسال البلاغ" : "Failed to submit report")
    } finally {
      setSubmittingReport(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const avatarUrl = user.user_metadata?.avatar_url
  const fullName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User"
  const email = user.email || ""

  const buyerStats = [
    { icon: ShoppingBag, label: language === "ar" ? "مشترياتي" : "My Purchases", value: "0", color: "text-blue-500" },
    { icon: Package, label: language === "ar" ? "الطلبات النشطة" : "Active Orders", value: "0", color: "text-green-500" },
    { icon: Star, label: language === "ar" ? "المفضلة" : "Wishlist", value: "0", color: "text-yellow-500" },
  ]

  const sellerStats = [
    { icon: Package, label: language === "ar" ? "منتجاتي" : "My Products", value: "0", color: "text-blue-500" },
    { icon: TrendingUp, label: language === "ar" ? "إجمالي المبيعات" : "Total Sales", value: "0 ر.س", color: "text-green-500" },
    { icon: Star, label: language === "ar" ? "التقييم" : "Rating", value: "—", color: "text-yellow-500" },
    { icon: Store, label: language === "ar" ? "الطلبات الواردة" : "Incoming Orders", value: "0", color: "text-purple-500" },
  ]

  const stats = role === "seller" ? sellerStats : buyerStats

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {language === "ar" ? "لوحة التحكم" : "Dashboard"}
              </h1>
              <p className="text-sm text-muted-foreground">
                {language === "ar" ? "مرحباً بك مرة أخرى" : "Welcome back"}
              </p>
            </div>
          </div>
          <Button variant="ghost" onClick={handleSignOut} className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl">
            <LogOut className="w-4 h-4" />
            {language === "ar" ? "تسجيل الخروج" : "Sign out"}
          </Button>
        </div>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-3xl p-6 mb-6 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-muted flex-shrink-0 shadow-sm">
              {avatarUrl ? (
                <Image src={avatarUrl} alt={fullName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                  <User className="w-10 h-10 text-primary" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
                <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                  role === "seller"
                    ? "bg-gradient-to-r from-purple-500/10 to-purple-600/10 text-purple-700 dark:text-purple-400 border border-purple-500/20"
                    : "bg-gradient-to-r from-blue-500/10 to-blue-600/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                }`}>
                  {role === "seller"
                    ? (language === "ar" ? "بائع" : "Seller")
                    : (language === "ar" ? "مشتري" : "Buyer")}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span className="truncate">{email}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Shield className="w-3 h-3" />
                <span className="font-mono truncate">{user.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid gap-4 mb-6 ${role === "seller" ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-3"}`}>
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 card-hover">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${stat.color.replace('text-', '')}/10 to-${stat.color.replace('text-', '')}/20 flex items-center justify-center mb-4`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Role-specific content */}
        {role === "seller" ? (
          <div className="bg-card border border-border rounded-3xl p-8 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-xl">
                <Store className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {language === "ar" ? "متجري" : "My Store"}
              </h3>
            </div>
            <div className="text-center py-16 text-muted-foreground">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                <Store className="w-10 h-10 text-primary/50" />
              </div>
              <p className="text-lg mb-2">{language === "ar" ? "لم تضف أي منتجات بعد" : "No products yet"}</p>
              <p className="text-sm mb-6 opacity-70">
                {language === "ar" ? "ابدأ بإضافة منتجك الأول لبدء البيع" : "Start by adding your first product to begin selling"}
              </p>
              <Button className="rounded-xl gap-2 shadow-md hover:shadow-lg transition-all duration-300" onClick={() => router.push("/creator/dashboard")}>
                <Package className="w-4 h-4" />
                {language === "ar" ? "أضف منتجك الأول" : "Add your first product"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl p-8 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                {language === "ar" ? "مشترياتي الأخيرة" : "Recent Purchases"}
              </h3>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-primary/50" />
                </div>
                <p className="text-lg mb-2">{language === "ar" ? "لا توجد مشتريات بعد" : "No purchases yet"}</p>
                <p className="text-sm mb-6 opacity-70">
                  {language === "ar" ? "تصفح السوق للعثور على منتجات رائعة" : "Browse the marketplace to find great products"}
                </p>
                <Button variant="outline" className="rounded-xl gap-2 shadow-sm hover:shadow-md transition-all duration-300" onClick={() => router.push("/")}>
                  <Store className="w-4 h-4" />
                  {language === "ar" ? "تصفح المنتجات" : "Browse products"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="p-4 bg-muted/50 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium text-foreground">
                        {language === "ar" ? "طلب #" : "Order #"}{order.id.slice(0, 8)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString('ar-SA')}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      {language === "ar" ? "القيمة:" : "Value:"} {order.total} {language === "ar" ? "ر.س" : "SAR"}
                    </div>
                    {order.status === "completed" && order.delivery_date && isWithin24Hours(order.delivery_date) && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          onClick={() => handleConfirmOrder(order.id)}
                          className="flex-1 gap-2 bg-green-500 hover:bg-green-600"
                        >
                          {language === "ar" ? "تأكيد سلامة الطلب" : "Confirm Order Safety"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowReportModal(true)
                          }}
                          className="flex-1 gap-2"
                        >
                          {language === "ar" ? "الإبلاغ عن مشكلة" : "Report Issue"}
                        </Button>
                      </div>
                    )}
                    {order.status === "completed" && order.delivery_date && !isWithin24Hours(order.delivery_date) && (
                      <div className="mt-4 p-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg text-sm text-center">
                        {language === "ar" ? "سليم تلقائياً" : "Auto-confirmed"}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {language === "ar" ? "الإبلاغ عن مشكلة في الطلب" : "Report Order Issue"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === "ar" ? "سبب البلاغ" : "Report Reason"}
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-background"
                >
                  <option value="">
                    {language === "ar" ? "اختر السبب" : "Select Reason"}
                  </option>
                  <option value="damaged">
                    {language === "ar" ? "منتج تالف/منتهي" : "Damaged/Expired Product"}
                  </option>
                  <option value="wrong">
                    {language === "ar" ? "منتج خاطئ" : "Wrong Product"}
                  </option>
                  <option value="missing">
                    {language === "ar" ? "منتج ناقص" : "Missing Product"}
                  </option>
                  <option value="other">
                    {language === "ar" ? "أخرى" : "Other"}
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === "ar" ? "الوصف (اختياري)" : "Description (Optional)"}
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="w-full p-3 rounded-xl border border-border bg-background"
                  rows={3}
                  placeholder={language === "ar" ? "أضف تفاصيل إضافية..." : "Add additional details..."}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowReportModal(false)
                  setReportReason("")
                  setReportDescription("")
                  setSelectedOrder(null)
                }}
                variant="outline"
                className="flex-1"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleReportOrder}
                disabled={submittingReport || !reportReason}
                className="flex-1 bg-destructive hover:bg-destructive/90"
              >
                {submittingReport
                  ? (language === "ar" ? "جاري الإرسال..." : "Submitting...")
                  : (language === "ar" ? "إرسال" : "Submit")}
              </Button>
            </div>
          </div>
        </div>
      )}
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
