"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useLanguage, LanguageProvider } from "@/lib/language"
import { ArrowLeft, Wallet, Clock, DollarSign, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function WalletPageContent() {
  const { language, direction } = useLanguage()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [availableBalance, setAvailableBalance] = useState(0)
  const [pendingEarnings, setPendingEarnings] = useState(0)
  const [totalWithdrawn, setTotalWithdrawn] = useState(0)
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        // Fetch all orders for this seller
        const { data: ordersData } = await supabase
          .from("orders")
          .select("id, total, status, delivery_date, product_id")
          .eq("seller_id", user.id)

        // Fetch pending reports to exclude disputed orders
        const { data: reportsData } = await supabase
          .from("reports")
          .select("product_id")
          .eq("status", "pending")

        const disputedProductIds = reportsData?.map(r => r.product_id) || []

        // Calculate available balance (paid orders without disputes)
        const availableBalance = (ordersData || []).reduce((sum: number, order: any) => {
          if (order.status === "paid" && !disputedProductIds.includes(order.product_id)) {
            return sum + order.total
          }
          return sum
        }, 0)

        setAvailableBalance(availableBalance)

        // Calculate pending earnings (completed orders within 24 hours or under review)
        const now = new Date()
        const pendingEarnings = (ordersData || []).reduce((sum: number, order: any) => {
          if (order.status === "completed" && order.delivery_date) {
            const deliveryDate = new Date(order.delivery_date)
            const hoursSinceDelivery = (now.getTime() - deliveryDate.getTime()) / (1000 * 60 * 60)
            if (hoursSinceDelivery < 24) {
              return sum + order.total
            }
          }
          return sum
        }, 0)

        setPendingEarnings(pendingEarnings)

        // Fetch withdrawal requests
        const { data: withdrawalData } = await supabase
          .from("withdrawal_requests")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        setWithdrawalHistory(withdrawalData || [])

        // Calculate total withdrawn (completed withdrawals)
        const totalWithdrawn = (withdrawalData || [])
          .filter((w: any) => w.status === "completed")
          .reduce((sum: number, w: any) => sum + w.amount, 0)

        setTotalWithdrawn(totalWithdrawn)
      } catch (error) {
        console.error("Error fetching wallet data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
            {language === "ar" ? "قيد الانتظار" : "Pending"}
          </span>
        )
      case "completed":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
            {language === "ar" ? "مكتمل" : "Completed"}
          </span>
        )
      case "rejected":
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {language === "ar" ? "مرفوض" : "Rejected"}
          </span>
        )
      default:
        return null
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="pt-24 pb-16" dir={direction}>
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/creator/dashboard")}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === "ar" ? "رجوع" : "Back"}
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {language === "ar" ? "المحفظة المالية" : "Financial Wallet"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "إدارة أرباحك وسجل العمليات" : "Manage your earnings and transaction history"}
                </p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid gap-6 mb-8 md:grid-cols-3">
            {/* Available Balance */}
            <Card className="shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/30 border-green-200 dark:border-green-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-100">
                  <DollarSign className="w-5 h-5" />
                  {language === "ar" ? "الرصيد المتاح للسحب" : "Available Balance"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">
                  {availableBalance.toFixed(2)} {language === "ar" ? "ر.س" : "SAR"}
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {language === "ar" ? "جاهز للسحب" : "Ready for withdrawal"}
                </p>
              </CardContent>
            </Card>

            {/* Pending Earnings */}
            <Card className="shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950/20 dark:to-yellow-900/30 border-yellow-200 dark:border-yellow-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-100">
                  <Clock className="w-5 h-5" />
                  {language === "ar" ? "الأرباح المعلقة" : "Pending Earnings"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mb-2">
                  {pendingEarnings.toFixed(2)} {language === "ar" ? "ر.س" : "SAR"}
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  {language === "ar" ? "تحت الفحص القانوني" : "Under legal review"}
                </p>
              </CardContent>
            </Card>

            {/* Total Withdrawn */}
            <Card className="shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/30 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-100">
                  <DollarSign className="w-5 h-5" />
                  {language === "ar" ? "إجمالي المبالغ المسحوبة" : "Total Withdrawn"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                  {totalWithdrawn.toFixed(2)} {language === "ar" ? "ر.س" : "SAR"}
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {language === "ar" ? "تم تحويلها بنجاح" : "Successfully transferred"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                {language === "ar" ? "سجل العمليات المالية" : "Transaction History"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {withdrawalHistory.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                    <History className="w-8 h-8 text-primary/50" />
                  </div>
                  <p className="text-lg mb-2">
                    {language === "ar" ? "لا توجد عمليات سحب" : "No withdrawal transactions"}
                  </p>
                  <p className="text-sm">
                    {language === "ar" ? "ستظهر عمليات السحب هنا" : "Withdrawal transactions will appear here"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                          {language === "ar" ? "رقم العملية" : "Transaction ID"}
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                          {language === "ar" ? "التاريخ" : "Date"}
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                          {language === "ar" ? "المبلغ" : "Amount"}
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                          {language === "ar" ? "الحالة" : "Status"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawalHistory.map((withdrawal) => (
                        <tr key={withdrawal.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4 text-sm font-mono">
                            #{withdrawal.id.slice(0, 8)}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {new Date(withdrawal.created_at).toLocaleDateString('ar-SA')}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium">
                            {withdrawal.amount.toFixed(2)} {language === "ar" ? "ر.س" : "SAR"}
                          </td>
                          <td className="py-3 px-4 text-sm">
                            {getStatusBadge(withdrawal.status)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default function WalletPage() {
  return (
    <LanguageProvider>
      <WalletPageContent />
    </LanguageProvider>
  )
}
