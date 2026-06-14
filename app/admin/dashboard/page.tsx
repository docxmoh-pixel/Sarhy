"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useLanguage } from "@/lib/language"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Package, Users, DollarSign, Check, X, AlertTriangle, TrendingUp } from "lucide-react"
import { NotificationBell } from "@/components/notification-bell"

function AdminDashboardContent() {
  const { language, direction } = useLanguage()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalCreators: 0,
    totalProducts: 0,
    pendingProducts: 0,
    totalRevenue: 0,
  })
  const [pendingProducts, setPendingProducts] = useState<any[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        // Check if user is admin
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single()

        if (userData?.role !== "admin") {
          router.push("/")
          return
        }

        setIsAdmin(true)

        // Fetch platform stats
        const [
          { data: ordersData },
          { data: creatorsData },
          { data: productsData },
          { data: pendingData },
        ] = await Promise.all([
          supabase.from("orders").select("total").eq("status", "completed"),
          supabase.from("seller_profiles").select("id"),
          supabase.from("products").select("id"),
          supabase.from("products").select("*").eq("status", "pending"),
        ])

        const totalRevenue = ordersData?.reduce((sum: number, order: any) => sum + order.total, 0) || 0

        setStats({
          totalSales: ordersData?.length || 0,
          totalCreators: creatorsData?.length || 0,
          totalProducts: productsData?.length || 0,
          pendingProducts: pendingData?.length || 0,
          totalRevenue,
        })

        setPendingProducts(pendingData || [])

        // Fetch reports
        const { data: reportsData } = await supabase
          .from("reports")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false })

        setReports(reportsData || [])

        // Fetch orders
        const { data: completedOrders } = await supabase
          .from("orders")
          .select("*")
          .eq("status", "completed")
          .order("created_at", { ascending: false })

        setOrders(completedOrders || [])
      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleApproveProduct = async (productId: string) => {
    try {
      const supabase = createClient()
      const { data: productData } = await supabase
        .from("products")
        .select("seller_id")
        .eq("id", productId)
        .single()

      const { error } = await supabase
        .from("products")
        .update({ status: "active" })
        .eq("id", productId)

      if (error) throw error

      // Send notification to creator
      if (productData?.seller_id) {
        await supabase.from("notifications").insert({
          user_id: productData.seller_id,
          title: "تمت الموافقة على منتجك",
          message: "تمت الموافقة على منتجك وظهر الآن في المتجر",
          is_read: false,
        })
      }

      // Refresh pending products
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("status", "pending")

      setPendingProducts(data || [])
      setStats(prev => ({ ...prev, pendingProducts: data?.length || 0 }))
    } catch (error) {
      console.error("Error approving product:", error)
      alert(language === "ar" ? "فشلت الموافقة على المنتج" : "Failed to approve product")
    }
  }

  const handleRejectProduct = async (productId: string) => {
    try {
      const supabase = createClient()
      const { data: productData } = await supabase
        .from("products")
        .select("seller_id")
        .eq("id", productId)
        .single()

      const { error } = await supabase
        .from("products")
        .update({ status: "rejected" })
        .eq("id", productId)

      if (error) throw error

      // Send notification to creator
      if (productData?.seller_id) {
        await supabase.from("notifications").insert({
          user_id: productData.seller_id,
          title: "تم رفض منتجك",
          message: "تم رفض منتجك من قبل الإدارة",
          is_read: false,
        })
      }

      // Refresh pending products
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("status", "pending")

      setPendingProducts(data || [])
      setStats(prev => ({ ...prev, pendingProducts: data?.length || 0 }))
    } catch (error) {
      console.error("Error rejecting product:", error)
      alert(language === "ar" ? "فشل رفض المنتج" : "Failed to reject product")
    }
  }

  // Helper function to determine fund status
  const getFundStatus = (order: any) => {
    const deliveryDate = order.delivery_date ? new Date(order.delivery_date) : null
    const now = new Date()
    const hoursSinceDelivery = deliveryDate ? (now.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60) : null

    // Check if there's a report for this order's product
    const hasReport = reports.some(report => report.product_id === order.product_id)

    if (hasReport) {
      return {
        status: "frozen",
        label: language === "ar" ? "مجمدة - يوجد بلاغ" : "Frozen - Report Filed",
        color: "red",
      }
    }

    if (!hoursSinceDelivery || hoursSinceDelivery < 24) {
      return {
        status: "pending",
        label: language === "ar" ? "معلقة - تحت الفحص" : "Pending - Under Review",
        color: "yellow",
      }
    }

    return {
      status: "ready",
      label: language === "ar" ? "جاهزة للصرف" : "Ready for Payout",
      color: "green",
    }
  }

  const handleRefund = async (orderId: string) => {
    try {
      const supabase = createClient()
      await supabase
        .from("orders")
        .update({ status: "refunded" })
        .eq("id", orderId)

      alert(language === "ar" ? "تم إعادة الأموال للمشتري" : "Refund processed successfully")

      // Refresh orders
      const { data: completedOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "completed")
        .order("created_at", { ascending: false })

      setOrders(completedOrders || [])
    } catch (error) {
      console.error("Error processing refund:", error)
      alert(language === "ar" ? "فشلت إعادة الأموال" : "Failed to process refund")
    }
  }

  const handleReleaseFunds = async (orderId: string) => {
    try {
      const supabase = createClient()
      await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId)

      alert(language === "ar" ? "تم إطلاق الأموال للمبدع" : "Funds released to creator successfully")

      // Refresh orders
      const { data: completedOrders } = await supabase
        .from("orders")
        .select("*")
        .eq("status", "completed")
        .order("created_at", { ascending: false })

      setOrders(completedOrders || [])
    } catch (error) {
      console.error("Error releasing funds:", error)
      alert(language === "ar" ? "فشل إطلاق الأموال" : "Failed to release funds")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <div className="text-foreground">
            {language === "ar" ? "جاري التحميل..." : "Loading..."}
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="pt-24 pb-16" dir={direction}>
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {language === "ar" ? "لوحة تحكم الإدارة" : "Admin Dashboard"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "إدارة المنصة" : "Platform Management"}
                </p>
              </div>
            </div>
            <NotificationBell />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === "ar" ? "إجمالي المبيعات" : "Total Sales"}
                </CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalSales}</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === "ar" ? "عدد المبدعين" : "Total Creators"}
                </CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalCreators}</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === "ar" ? "إجمالي المنتجات" : "Total Products"}
                </CardTitle>
                <Package className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalProducts}</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {language === "ar" ? "إجمالي الإيرادات" : "Total Revenue"}
                </CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {stats.totalRevenue} {language === "ar" ? "ر.س" : "SAR"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Products */}
          <Card className="mb-8 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                {language === "ar" ? "منتجات قيد المراجعة" : "Pending Products"}
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {stats.pendingProducts}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingProducts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {language === "ar" ? "لا توجد منتجات قيد المراجعة" : "No pending products"}
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div className="flex-1">
                        <div className="font-medium text-foreground mb-1">
                          {language === "ar" ? product.name_ar : product.name_en}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {language === "ar" ? "السعر:" : "Price:"} {product.price} {language === "ar" ? "ر.س" : "SAR"}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveProduct(product.id)}
                          className="gap-2 bg-green-500 hover:bg-green-600"
                        >
                          <Check className="w-4 h-4" />
                          {language === "ar" ? "موافقة" : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRejectProduct(product.id)}
                          className="gap-2"
                        >
                          <X className="w-4 h-4" />
                          {language === "ar" ? "رفض" : "Reject"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Orders Section */}
          <Card className="mb-8 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                {language === "ar" ? "الطلبات الحالية" : "Current Orders"}
                <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  {orders.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {language === "ar" ? "لا توجد طلبات حالياً" : "No orders currently"}
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const fundStatus = getFundStatus(order)
                    return (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="font-medium text-foreground">
                              {language === "ar" ? "طلب #" : "Order #"}{order.id}
                            </div>
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                fundStatus.color === "red"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                  : fundStatus.color === "yellow"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              }`}
                            >
                              {fundStatus.label}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {language === "ar" ? "القيمة:" : "Value:"} {order.total} {language === "ar" ? "ر.س" : "SAR"}
                          </div>
                          {order.delivery_date && (
                            <div className="text-sm text-muted-foreground">
                              {language === "ar" ? "تاريخ الاستلام:" : "Delivery Date:"}{" "}
                              {new Date(order.delivery_date).toLocaleDateString('ar-SA', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          )}
                        </div>
                        {fundStatus.status === "frozen" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleRefund(order.id)}
                              className="gap-2 bg-destructive hover:bg-destructive/90"
                            >
                              {language === "ar" ? "إعادة الأموال" : "Refund"}
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleReleaseFunds(order.id)}
                              className="gap-2 bg-green-500 hover:bg-green-600"
                            >
                              {language === "ar" ? "إطلاق الأموال" : "Release Funds"}
                            </Button>
                          </div>
                        )}
                        {fundStatus.status === "ready" && (
                          <Button
                            size="sm"
                            onClick={() => handleReleaseFunds(order.id)}
                            className="gap-2 bg-green-500 hover:bg-green-600"
                          >
                            {language === "ar" ? "إطلاق الأموال" : "Release Funds"}
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reports Section */}
          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                {language === "ar" ? "بلاغات الشكاوى" : "Reports"}
                <span className="px-2 py-1 bg-destructive/10 text-destructive rounded-full text-xs">
                  {reports.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {language === "ar" ? "لا توجد بلاغات حالياً" : "No reports currently"}
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-destructive/10 rounded-xl">
                      <div className="flex-1">
                        <div className="font-medium text-foreground mb-1">
                          {language === "ar" ? "منتج #" : "Product #"}{report.product_id}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {language === "ar" ? "السبب:" : "Reason:"} {report.reason}
                        </div>
                        {report.description && (
                          <div className="text-sm text-muted-foreground mt-1">
                            {language === "ar" ? "الوصف:" : "Description:"} {report.description}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={async () => {
                            try {
                              const supabase = createClient()
                              await supabase
                                .from("products")
                                .update({ status: "rejected" })
                                .eq("id", report.product_id)
                              await supabase
                                .from("reports")
                                .update({ status: "resolved" })
                                .eq("id", report.id)
                              // Refresh reports
                              const { data } = await supabase
                                .from("reports")
                                .select("*")
                                .eq("status", "pending")
                                .order("created_at", { ascending: false })
                              setReports(data || [])
                            } catch (error) {
                              console.error("Error handling report:", error)
                            }
                          }}
                          className="gap-2 bg-destructive hover:bg-destructive/90"
                        >
                          <X className="w-4 h-4" />
                          {language === "ar" ? "حظر المنتج" : "Block Product"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            try {
                              const supabase = createClient()
                              await supabase
                                .from("reports")
                                .update({ status: "resolved" })
                                .eq("id", report.id)
                              // Refresh reports
                              const { data } = await supabase
                                .from("reports")
                                .select("*")
                                .eq("status", "pending")
                                .order("created_at", { ascending: false })
                              setReports(data || [])
                            } catch (error) {
                              console.error("Error handling report:", error)
                            }
                          }}
                          className="gap-2"
                        >
                          <Check className="w-4 h-4" />
                          {language === "ar" ? "تجاهل" : "Dismiss"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function AdminDashboardPage() {
  return <AdminDashboardContent />
}
