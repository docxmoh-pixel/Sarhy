"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { useLanguage, LanguageProvider } from "@/lib/language"
import { ArrowLeft, DollarSign, Wallet, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

function PayoutsPageContent() {
  const { language, direction } = useLanguage()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [availableBalance, setAvailableBalance] = useState(0)
  const [verificationStatus, setVerificationStatus] = useState<"unverified" | "pending" | "verified">("unverified")
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Verification form fields
  const [nationalId, setNationalId] = useState("")
  const [fullName, setFullName] = useState("")
  const [iban, setIban] = useState("")

  // Withdraw form fields
  const [withdrawAmount, setWithdrawAmount] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        // Fetch verification status
        const { data: sellerData } = await supabase
          .from("seller_profiles")
          .select("verification_status")
          .eq("id", user.id)
          .single()

        if (sellerData?.verification_status) {
          setVerificationStatus(sellerData.verification_status)
        }

        // Fetch paid orders for this seller
        const { data: ordersData } = await supabase
          .from("orders")
          .select("total, product_id")
          .eq("seller_id", user.id)
          .eq("status", "paid")

        // Fetch pending reports to exclude disputed orders
        const { data: reportsData } = await supabase
          .from("reports")
          .select("product_id")
          .eq("status", "pending")

        const disputedProductIds = reportsData?.map(r => r.product_id) || []

        // Calculate available balance (paid orders without disputes)
        const balance = (ordersData || []).reduce((sum: number, order: any) => {
          if (!disputedProductIds.includes(order.product_id)) {
            return sum + order.total
          }
          return sum
        }, 0)

        setAvailableBalance(balance)
      } catch (error) {
        console.error("Error fetching payout data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleVerificationSubmit = async () => {
    if (!nationalId || !fullName || !iban) {
      alert(language === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Please fill all required fields")
      return
    }

    try {
      const supabase = createClient()
      setSubmitting(true)

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert(language === "ar" ? "لم يتم العثور على المستخدم" : "User not found")
        return
      }

      // Insert verification request
      await supabase.from("verification_requests").insert({
        user_id: user.id,
        national_id: nationalId,
        full_name: fullName,
        iban: iban,
        status: "pending",
      })

      // Update seller verification status
      await supabase
        .from("seller_profiles")
        .update({ verification_status: "pending" })
        .eq("id", user.id)

      setVerificationStatus("pending")
      setShowVerificationModal(false)
      setNationalId("")
      setFullName("")
      setIban("")

      alert(language === "ar" ? "تم إرسال طلب التوثيق بنجاح" : "Verification request submitted successfully")
    } catch (error) {
      console.error("Error submitting verification:", error)
      alert(language === "ar" ? "فشل إرسال طلب التوثيق" : "Failed to submit verification request")
    } finally {
      setSubmitting(false)
    }
  }

  const handleWithdrawSubmit = async () => {
    const amount = parseFloat(withdrawAmount)

    if (!amount || amount <= 0) {
      alert(language === "ar" ? "يرجى إدخال مبلغ صحيح" : "Please enter a valid amount")
      return
    }

    if (amount > availableBalance) {
      alert(language === "ar" ? "المبلغ يتجاوز الرصيد المتاح" : "Amount exceeds available balance")
      return
    }

    try {
      const supabase = createClient()
      setSubmitting(true)

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        alert(language === "ar" ? "لم يتم العثور على المستخدم" : "User not found")
        return
      }

      // Insert withdrawal request
      await supabase.from("withdrawal_requests").insert({
        user_id: user.id,
        amount: amount,
        status: "pending",
      })

      setShowWithdrawModal(false)
      setWithdrawAmount("")

      alert(language === "ar" ? "تم إرسال طلب السحب بنجاح" : "Withdrawal request submitted successfully")
    } catch (error) {
      console.error("Error submitting withdrawal:", error)
      alert(language === "ar" ? "فشل إرسال طلب السحب" : "Failed to submit withdrawal request")
    } finally {
      setSubmitting(false)
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
                  {language === "ar" ? "السحب المالي" : "Payouts"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "إدارة أرباحك وطلبات السحب" : "Manage your earnings and withdrawal requests"}
                </p>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <Card className="shadow-lg rounded-3xl mb-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                {language === "ar" ? "الأرباح الجاهزة للصرف" : "Available Balance"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary mb-4">
                {availableBalance.toFixed(2)} {language === "ar" ? "ر.س" : "SAR"}
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                {language === "ar" 
                  ? "هذا المبلغ يمثل أرباحك من الطلبات المدفوعة التي لم يمر عليها بلاغ" 
                  : "This amount represents your earnings from paid orders without disputes"}
              </p>
              <Button
                onClick={() => {
                  if (verificationStatus === "unverified") {
                    setShowVerificationModal(true)
                  } else if (verificationStatus === "verified") {
                    setShowWithdrawModal(true)
                  } else {
                    alert(language === "ar" ? "طلب التوثيق قيد المراجعة" : "Verification request is under review")
                  }
                }}
                className="w-full gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                disabled={verificationStatus === "pending"}
              >
                {verificationStatus === "unverified" && (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    {language === "ar" ? "توثيق الحساب للسحب" : "Verify Account to Withdraw"}
                  </>
                )}
                {verificationStatus === "pending" && (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    {language === "ar" ? "قيد المراجعة" : "Under Review"}
                  </>
                )}
                {verificationStatus === "verified" && (
                  <>
                    <DollarSign className="w-4 h-4" />
                    {language === "ar" ? "طلب سحب الأرباح" : "Withdraw Earnings"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Verification Status Card */}
          <Card className="shadow-md rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {verificationStatus === "verified" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                {verificationStatus === "pending" && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                {verificationStatus === "unverified" && <XCircle className="w-5 h-5 text-red-500" />}
                {language === "ar" ? "حالة التوثيق" : "Verification Status"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-xl ${
                verificationStatus === "verified"
                  ? "bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-200"
                  : verificationStatus === "pending"
                  ? "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200"
                  : "bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200"
              }`}>
                {verificationStatus === "verified" && (
                  <p className="font-medium">
                    {language === "ar" ? "حسابك موثق ويمكنك طلب السحب" : "Your account is verified and you can request withdrawals"}
                  </p>
                )}
                {verificationStatus === "pending" && (
                  <p className="font-medium">
                    {language === "ar" ? "طلب التوثيق قيد المراجعة من قبل الإدارة" : "Verification request is under review by admin"}
                  </p>
                )}
                {verificationStatus === "unverified" && (
                  <p className="font-medium">
                    {language === "ar" ? "حسابك غير موثق، يرجى توثيقه لطلب السحب" : "Your account is not verified, please verify it to request withdrawals"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {language === "ar" ? "توثيق الحساب" : "Account Verification"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === "ar" ? "رقم الهوية الوطنية/الإقامة" : "National ID / Residence ID"}
                </label>
                <Input
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder={language === "ar" ? "أدخل رقم الهوية" : "Enter national ID"}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === "ar" ? "الاسم الرباعي" : "Full Name (as in bank account)"}
                </label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={language === "ar" ? "أدخل الاسم الكامل" : "Enter full name"}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === "ar" ? "رقم الآيبان السعودي (IBAN)" : "Saudi IBAN"}
                </label>
                <Input
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder={language === "ar" ? "SAxxxxxxxxxxxxxxxxxxxx" : "SAxxxxxxxxxxxxxxxxxxxx"}
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowVerificationModal(false)
                  setNationalId("")
                  setFullName("")
                  setIban("")
                }}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleVerificationSubmit}
                disabled={submitting}
                className="flex-1 rounded-xl"
              >
                {submitting
                  ? (language === "ar" ? "جاري الإرسال..." : "Submitting...")
                  : (language === "ar" ? "إرسال" : "Submit")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-2xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {language === "ar" ? "طلب سحب الأرباح" : "Withdraw Earnings"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === "ar" ? "المبلغ المطلوب (ر.س)" : "Amount (SAR)"}
                </label>
                <Input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder={language === "ar" ? "أدخل المبلغ" : "Enter amount"}
                  max={availableBalance}
                  className="rounded-xl"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {language === "ar" ? "الرصيد المتاح: " : "Available balance: "}{availableBalance.toFixed(2)} {language === "ar" ? "ر.س" : "SAR"}
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => {
                  setShowWithdrawModal(false)
                  setWithdrawAmount("")
                }}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                {language === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleWithdrawSubmit}
                disabled={submitting}
                className="flex-1 rounded-xl"
              >
                {submitting
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

export default function PayoutsPage() {
  return (
    <LanguageProvider>
      <PayoutsPageContent />
    </LanguageProvider>
  )
}
