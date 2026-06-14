"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useLanguage, LanguageProvider } from "@/lib/language"
import { ArrowLeft, AlertTriangle, User, Package, Check, X, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function ReportsPageContent() {
  const { language, direction } = useLanguage()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [reports, setReports] = useState<any[]>([])

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

        // Fetch pending reports with related data
        const { data: reportsData } = await supabase
          .from("reports")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false })

        // Fetch additional data for each report
        const enrichedReports = await Promise.all(
          (reportsData || []).map(async (report) => {
            // Fetch product info
            const { data: productData } = await supabase
              .from("products")
              .select("seller_id, title")
              .eq("id", report.product_id)
              .single()

            // Fetch seller info
            let sellerName = "Unknown"
            if (productData?.seller_id) {
              const { data: sellerData } = await supabase
                .from("users")
                .select("full_name, email")
                .eq("id", productData.seller_id)
                .single()
              sellerName = sellerData?.full_name || sellerData?.email || "Unknown"
            }

            // Fetch order info
            const { data: orderData } = await supabase
              .from("orders")
              .select("id, buyer_id, total")
              .eq("product_id", report.product_id)
              .eq("status", "completed")
              .order("created_at", { ascending: false })
              .limit(1)
              .single()

            // Fetch buyer info
            let buyerName = "Unknown"
            let orderId = null
            if (orderData?.buyer_id) {
              const { data: buyerData } = await supabase
                .from("users")
                .select("full_name, email")
                .eq("id", orderData.buyer_id)
                .single()
              buyerName = buyerData?.full_name || buyerData?.email || "Unknown"
              orderId = orderData.id
            }

            return {
              ...report,
              sellerName,
              buyerName,
              orderId,
              orderTotal: orderData?.total || 0,
              productTitle: productData?.title || "Unknown",
            }
          })
        )

        setReports(enrichedReports)
      } catch (error) {
        console.error("Error fetching reports:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleRefund = async (reportId: string, orderId: string) => {
    try {
      const supabase = createClient()
      await supabase
        .from("orders")
        .update({ status: "refunded" })
        .eq("id", orderId)

      await supabase
        .from("reports")
        .update({ status: "resolved" })
        .eq("id", reportId)

      alert(language === "ar" ? "تم إعادة الأموال للمشتري" : "Refund processed successfully")

      // Refresh reports
      const { data: reportsData } = await supabase
        .from("reports")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      setReports(reportsData || [])
    } catch (error) {
      console.error("Error processing refund:", error)
      alert(language === "ar" ? "فشلت إعادة الأموال" : "Failed to process refund")
    }
  }

  const handleReleaseFunds = async (reportId: string, orderId: string) => {
    try {
      const supabase = createClient()
      await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId)

      await supabase
        .from("reports")
        .update({ status: "resolved" })
        .eq("id", reportId)

      alert(language === "ar" ? "تم إطلاق الأموال للمبدع" : "Funds released to creator successfully")

      // Refresh reports
      const { data: reportsData } = await supabase
        .from("reports")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      setReports(reportsData || [])
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

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="pt-24 pb-16" dir={direction}>
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/dashboard")}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === "ar" ? "رجوع" : "Back"}
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-destructive/10 rounded-2xl">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {language === "ar" ? "إدارة البلاغات" : "Reports Management"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "مراجعة والفصل في شكاوى المشترين" : "Review and resolve buyer complaints"}
                </p>
              </div>
            </div>
          </div>

          {/* Reports Grid */}
          {reports.length === 0 ? (
            <Card className="shadow-md rounded-3xl">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-destructive/10 to-destructive/20 rounded-2xl flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-destructive/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {language === "ar" ? "لا توجد بلاغات معلقة" : "No pending reports"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar" ? "جميع البلاغات تم الفصل فيها" : "All reports have been resolved"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {reports.map((report) => (
                <Card key={report.id} className="shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {language === "ar" ? "بلاغ #" : "Report #"}{report.id.slice(0, 8)}
                        </CardTitle>
                        {report.orderId && (
                          <div className="text-sm text-muted-foreground mb-2">
                            {language === "ar" ? "طلب مرتبط:" : "Related Order:"} #{report.orderId.slice(0, 8)}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-destructive">
                          {report.orderTotal} {language === "ar" ? "ر.س" : "SAR"}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Parties Involved */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                              {language === "ar" ? "المشتري (الشاكي)" : "Buyer (Complainant)"}
                            </span>
                          </div>
                          <div className="text-sm text-blue-800 dark:text-blue-200">
                            {report.buyerName}
                          </div>
                        </div>
                        <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                            <span className="text-sm font-medium text-purple-900 dark:text-purple-100">
                              {language === "ar" ? "المبدع (المشكو في حقه)" : "Creator (Accused)"}
                            </span>
                          </div>
                          <div className="text-sm text-purple-800 dark:text-purple-200">
                            {report.sellerName}
                          </div>
                        </div>
                      </div>

                      {/* Issue Details */}
                      <div className="p-4 bg-muted/50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <Package className="w-4 h-4 text-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {language === "ar" ? "نوع المشكلة:" : "Issue Type:"}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mb-2">
                          {report.reason === "damaged" && (language === "ar" ? "منتج تالف/منتهي" : "Damaged/Expired Product")}
                          {report.reason === "wrong" && (language === "ar" ? "منتج خاطئ" : "Wrong Product")}
                          {report.reason === "missing" && (language === "ar" ? "منتج ناقص" : "Missing Product")}
                          {report.reason === "other" && (language === "ar" ? "أخرى" : "Other")}
                        </div>
                        {report.description && (
                          <div className="text-sm text-muted-foreground">
                            <span className="font-medium">{language === "ar" ? "الوصف:" : "Description:"} </span>
                            {report.description}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {report.orderId && (
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleRefund(report.id, report.orderId)}
                            className="flex-1 gap-2 bg-destructive hover:bg-destructive/90"
                          >
                            <X className="w-4 h-4" />
                            {language === "ar" ? "إعادة الأموال للمشتري" : "Refund to Buyer"}
                          </Button>
                          <Button
                            onClick={() => handleReleaseFunds(report.id, report.orderId)}
                            className="flex-1 gap-2 bg-green-500 hover:bg-green-600"
                          >
                            <DollarSign className="w-4 h-4" />
                            {language === "ar" ? "إطلاق الأموال للمبدع" : "Release Funds to Creator"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function ReportsPage() {
  return (
    <LanguageProvider>
      <ReportsPageContent />
    </LanguageProvider>
  )
}
