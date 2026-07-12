"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useLanguage, LanguageProvider } from "@/lib/language"
import { ArrowLeft, Shield, DollarSign, CheckCircle2, XCircle, User, Wallet, Clock, TrendingUp, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function AdminPayoutsPageContent() {
  const { language, direction } = useLanguage()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeTab, setActiveTab] = useState<"verification" | "withdrawal" | "payouts">("verification")
  const [verificationRequests, setVerificationRequests] = useState<any[]>([])
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([])
  const [sellerBalances, setSellerBalances] = useState<any[]>([])
  const [payoutFilter, setPayoutFilter] = useState<"pending" | "paid" | "all">("pending")

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

        // Fetch verification requests
        const { data: verificationData } = await supabase
          .from("verification_requests")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false })

        setVerificationRequests(verificationData || [])

        // Fetch withdrawal requests
        const { data: withdrawalData } = await supabase
          .from("withdrawal_requests")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false })

        setWithdrawalRequests(withdrawalData || [])

        // Fetch seller balances with seller profiles
        const { data: balancesData } = await supabase
          .from("seller_balances")
          .select("*, seller_profiles(store_name)")
          .order("pending_halalas", { ascending: false })

        setSellerBalances(balancesData || [])
      } catch (error) {
        console.error("Error fetching admin payouts data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleApproveVerification = async (requestId: string, userId: string) => {
    try {
      const supabase = createClient()

      // Update verification request status
      await supabase
        .from("verification_requests")
        .update({ status: "approved" })
        .eq("id", requestId)

      // Update seller verification status
      await supabase
        .from("seller_profiles")
        .update({ verification_status: "verified" })
        .eq("id", userId)

      alert(language === "ar" ? "تم اعتماد التوثيق بنجاح" : "Verification approved successfully")

      // Refresh verification requests
      const { data } = await supabase
        .from("verification_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      setVerificationRequests(data || [])
    } catch (error) {
      console.error("Error approving verification:", error)
      alert(language === "ar" ? "فشل اعتماد التوثيق" : "Failed to approve verification")
    }
  }

  const handleRejectVerification = async (requestId: string, userId: string) => {
    try {
      const supabase = createClient()

      // Update verification request status
      await supabase
        .from("verification_requests")
        .update({ status: "rejected" })
        .eq("id", requestId)

      // Update seller verification status
      await supabase
        .from("seller_profiles")
        .update({ verification_status: "unverified" })
        .eq("id", userId)

      alert(language === "ar" ? "تم رفض طلب التوثيق" : "Verification request rejected")

      // Refresh verification requests
      const { data } = await supabase
        .from("verification_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      setVerificationRequests(data || [])
    } catch (error) {
      console.error("Error rejecting verification:", error)
      alert(language === "ar" ? "فشل رفض طلب التوثيق" : "Failed to reject verification request")
    }
  }

  const handleApproveWithdrawal = async (requestId: string) => {
    try {
      const supabase = createClient()

      // Update withdrawal request status
      await supabase
        .from("withdrawal_requests")
        .update({ status: "completed" })
        .eq("id", requestId)

      alert(language === "ar" ? "تم تأكيد التحويل البنكي بنجاح" : "Bank transfer confirmed successfully")

      // Refresh withdrawal requests
      const { data } = await supabase
        .from("withdrawal_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      setWithdrawalRequests(data || [])
    } catch (error) {
      console.error("Error approving withdrawal:", error)
      alert(language === "ar" ? "فشل تأكيد التحويل البنكي" : "Failed to confirm bank transfer")
    }
  }

  const handleTransferPayout = async (sellerId: string, pendingHalalas: number) => {
    if (pendingHalalas <= 0) return
    try {
      const supabase = createClient()

      // Mark all pending orders for this seller as payout paid
      await supabase
        .from("orders")
        .update({ payout_status: "paid" })
        .eq("seller_id", sellerId)
        .eq("payout_status", "pending")

      // Update seller balance: pending → 0, paid += amount
      await supabase
        .from("seller_balances")
        .update({
          total_paid_halalas: supabase.rpc ? undefined : undefined, // handled below
          pending_halalas: 0,
        })
        .eq("seller_id", sellerId)

      // Use rpc or manual update for total_paid_halalas increment
      await supabase.rpc("increment_seller_paid", {
        p_seller_id: sellerId,
        p_amount: pendingHalalas,
      }).then(() => null).catch(() => {
        // Fallback: fetch current and update manually
        return supabase
          .from("seller_balances")
          .select("total_paid_halalas")
          .eq("seller_id", sellerId)
          .single()
          .then(({ data: cur }) => {
            if (cur) {
              return supabase
                .from("seller_balances")
                .update({ total_paid_halalas: (cur.total_paid_halalas || 0) + pendingHalalas })
                .eq("seller_id", sellerId)
            }
          })
      })

      // Refresh balances
      const { data: balancesData } = await supabase
        .from("seller_balances")
        .select("*, seller_profiles(store_name)")
        .order("pending_halalas", { ascending: false })
      setSellerBalances(balancesData || [])

      alert(language === "ar" ? "تم تسجيل التحويل بنجاح" : "Transfer recorded successfully")
    } catch (err) {
      console.error(err)
      alert(language === "ar" ? "فشل تسجيل التحويل" : "Transfer failed")
    }
  }

  const handleRejectWithdrawal = async (requestId: string) => {
    try {
      const supabase = createClient()

      // Update withdrawal request status
      await supabase
        .from("withdrawal_requests")
        .update({ status: "rejected" })
        .eq("id", requestId)

      alert(language === "ar" ? "تم رفض طلب السحب" : "Withdrawal request rejected")

      // Refresh withdrawal requests
      const { data } = await supabase
        .from("withdrawal_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false })

      setWithdrawalRequests(data || [])
    } catch (error) {
      console.error("Error rejecting withdrawal:", error)
      alert(language === "ar" ? "فشل رفض طلب السحب" : "Failed to reject withdrawal request")
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
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {language === "ar" ? "إدارة المدفوعات" : "Payouts Management"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "مراجعة طلبات التوثيق والسحب المالي" : "Review verification and withdrawal requests"}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex gap-2 flex-wrap">
            <Button
              variant={activeTab === "verification" ? "default" : "outline"}
              onClick={() => setActiveTab("verification")}
              className="gap-2 rounded-xl"
            >
              <User className="w-4 h-4" />
              {language === "ar" ? "طلبات التوثيق" : "Verification Requests"}
            </Button>
            <Button
              variant={activeTab === "withdrawal" ? "default" : "outline"}
              onClick={() => setActiveTab("withdrawal")}
              className="gap-2 rounded-xl"
            >
              <Wallet className="w-4 h-4" />
              {language === "ar" ? "طلبات السحب" : "Withdrawal Requests"}
            </Button>
            <Button
              variant={activeTab === "payouts" ? "default" : "outline"}
              onClick={() => setActiveTab("payouts")}
              className="gap-2 rounded-xl"
            >
              <TrendingUp className="w-4 h-4" />
              {language === "ar" ? "التسويات المالية" : "Seller Payouts"}
            </Button>
          </div>

          {/* Verification Requests Tab */}
          {activeTab === "verification" && (
            <div className="space-y-6">
              {verificationRequests.length === 0 ? (
                <Card className="shadow-md rounded-3xl">
                  <CardContent className="py-16 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                      <User className="w-10 h-10 text-primary/50" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {language === "ar" ? "لا توجد طلبات توثيق معلقة" : "No pending verification requests"}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === "ar" ? "جميع طلبات التوثيق تمت معالجتها" : "All verification requests have been processed"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                verificationRequests.map((request) => (
                  <Card key={request.id} className="shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        {language === "ar" ? "طلب توثيق #" : "Verification Request #"}{request.id.slice(0, 8)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {language === "ar" ? "الاسم الرباعي" : "Full Name"}
                            </label>
                            <div className="text-foreground mt-1">{request.full_name}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">
                              {language === "ar" ? "رقم الهوية" : "National ID"}
                            </label>
                            <div className="text-foreground mt-1">{request.national_id}</div>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">
                            {language === "ar" ? "رقم الآيبان (IBAN)" : "IBAN"}
                          </label>
                          <div className="text-foreground mt-1 font-mono">{request.iban}</div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleApproveVerification(request.id, request.user_id)}
                            className="flex-1 gap-2 bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {language === "ar" ? "اعتماد التوثيق" : "Approve Verification"}
                          </Button>
                          <Button
                            onClick={() => handleRejectVerification(request.id, request.user_id)}
                            variant="destructive"
                            className="flex-1 gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            {language === "ar" ? "رفض الطلب" : "Reject Request"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* Withdrawal Requests Tab */}
          {activeTab === "withdrawal" && (
            <div className="space-y-6">
              {withdrawalRequests.length === 0 ? (
                <Card className="shadow-md rounded-3xl">
                  <CardContent className="py-16 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                      <Wallet className="w-10 h-10 text-primary/50" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {language === "ar" ? "لا توجد طلبات سحب معلقة" : "No pending withdrawal requests"}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === "ar" ? "جميع طلبات السحب تمت معالجتها" : "All withdrawal requests have been processed"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                withdrawalRequests.map((request) => (
                  <Card key={request.id} className="shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" />
                        {language === "ar" ? "طلب سحب #" : "Withdrawal Request #"}{request.id.slice(0, 8)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-primary/10 rounded-xl">
                          <div className="text-3xl font-bold text-primary">
                            {request.amount.toFixed(2)} {language === "ar" ? "ر.س" : "SAR"}
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => handleApproveWithdrawal(request.id)}
                            className="flex-1 gap-2 bg-green-500 hover:bg-green-600"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            {language === "ar" ? "تأكيد التحويل البنكي" : "Confirm Bank Transfer"}
                          </Button>
                          <Button
                            onClick={() => handleRejectWithdrawal(request.id)}
                            variant="destructive"
                            className="flex-1 gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            {language === "ar" ? "رفض السحب" : "Reject Withdrawal"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
          {/* Payouts Tab */}
          {activeTab === "payouts" && (
            <div className="space-y-6">
              {/* Filter Buttons */}
              <div className="flex gap-2 mb-4">
                {(["all", "pending", "paid"] as const).map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={payoutFilter === f ? "default" : "outline"}
                    onClick={() => setPayoutFilter(f)}
                    className="rounded-xl"
                  >
                    {f === "all"
                      ? language === "ar" ? "الكل" : "All"
                      : f === "pending"
                      ? language === "ar" ? "معلّق" : "Pending"
                      : language === "ar" ? "محوّل" : "Paid"}
                  </Button>
                ))}
              </div>

              {sellerBalances
                .filter((b) => {
                  if (payoutFilter === "pending") return b.pending_halalas > 0
                  if (payoutFilter === "paid") return b.pending_halalas === 0 && b.total_paid_halalas > 0
                  return true
                })
                .length === 0 ? (
                <Card className="shadow-md rounded-3xl">
                  <CardContent className="py-16 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                      <TrendingUp className="w-10 h-10 text-primary/50" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {language === "ar" ? "لا توجد تسويات" : "No payouts found"}
                    </h3>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-md rounded-2xl overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      {language === "ar" ? "أرصدة البائعين" : "Seller Balances"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border bg-muted/40">
                            <th className="p-4 text-start font-semibold text-muted-foreground">
                              {language === "ar" ? "البائع" : "Seller"}
                            </th>
                            <th className="p-4 text-start font-semibold text-muted-foreground">
                              {language === "ar" ? "إجمالي المكتسب" : "Total Earned"}
                            </th>
                            <th className="p-4 text-start font-semibold text-[#c9a227]">
                              {language === "ar" ? "معلّق (ر.س)" : "Pending (SAR)"}
                            </th>
                            <th className="p-4 text-start font-semibold text-[#16a34a]">
                              {language === "ar" ? "محوّل (ر.س)" : "Paid (SAR)"}
                            </th>
                            <th className="p-4 text-start font-semibold text-muted-foreground">
                              {language === "ar" ? "إجراء" : "Action"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {sellerBalances
                            .filter((b) => {
                              if (payoutFilter === "pending") return b.pending_halalas > 0
                              if (payoutFilter === "paid") return b.pending_halalas === 0 && b.total_paid_halalas > 0
                              return true
                            })
                            .map((balance) => (
                              <tr key={balance.seller_id} className="border-b border-border hover:bg-muted/30 transition-colors">
                                <td className="p-4">
                                  <div className="font-medium text-foreground">
                                    {balance.seller_profiles?.store_name || balance.seller_id?.slice(0, 8) + "..."}
                                  </div>
                                  <div className="text-xs text-muted-foreground">{balance.seller_id?.slice(0, 12)}...</div>
                                </td>
                                <td className="p-4 font-semibold text-foreground">
                                  {((balance.total_earned_halalas || 0) / 100).toFixed(2)}
                                </td>
                                <td className="p-4 font-bold text-[#c9a227]">
                                  {((balance.pending_halalas || 0) / 100).toFixed(2)}
                                </td>
                                <td className="p-4 font-bold text-[#16a34a]">
                                  {((balance.total_paid_halalas || 0) / 100).toFixed(2)}
                                </td>
                                <td className="p-4">
                                  {balance.pending_halalas > 0 ? (
                                    <Button
                                      size="sm"
                                      onClick={() => handleTransferPayout(balance.seller_id, balance.pending_halalas)}
                                      className="gap-1.5 rounded-xl bg-[#16a34a] hover:bg-[#15803d] text-white"
                                    >
                                      <BadgeCheck className="w-4 h-4" />
                                      {language === "ar" ? "تحويل" : "Transfer"}
                                    </Button>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-xs text-[#16a34a]">
                                      <CheckCircle2 className="w-4 h-4" />
                                      {language === "ar" ? "مكتمل" : "Done"}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default function AdminPayoutsPage() {
  return (
    <LanguageProvider>
      <AdminPayoutsPageContent />
    </LanguageProvider>
  )
}
