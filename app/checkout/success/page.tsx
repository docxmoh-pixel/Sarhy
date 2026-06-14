"use client"

import { motion } from "framer-motion"
import { CheckCircle, ArrowLeft, ArrowRight, Home, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language"
import Link from "next/link"

function SuccessContent() {
  const { language } = useLanguage()
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 mx-auto mb-8 bg-green-500/10 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
            
            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {language === "ar" ? "تم الدفع بنجاح!" : "Payment Successful!"}
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                {language === "ar" 
                  ? "شكراً لك! تم استلام طلبك بنجاح. تم إرسال المنتجات والإيصال إلى بريدك الإلكتروني."
                  : "Thank you! Your order has been successfully received. Products and receipt have been sent to your email."
                }
              </p>
            </motion.div>
            
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/marketplace" className="flex-1">
                <Button className="w-full h-12 rounded-xl gap-2 shadow-md hover:shadow-lg transition-all duration-300">
                  <Home className="w-4 h-4" />
                  {language === "ar" ? "العودة إلى الرئيسية" : "Back to Home"}
                </Button>
              </Link>
              <Link href="/cart" className="flex-1">
                <Button variant="outline" className="w-full h-12 rounded-xl gap-2">
                  <Download className="w-4 h-4" />
                  {language === "ar" ? "تحميل المنتجات" : "Download Products"}
                </Button>
              </Link>
            </motion.div>
            
            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 p-6 bg-card rounded-2xl border border-border shadow-sm"
            >
              <h3 className="font-semibold text-foreground mb-4">
                {language === "ar" ? "ماذا بعد؟" : "What's Next?"}
              </h3>
              <ul className="text-left space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary font-semibold text-xs">1</span>
                  </div>
                  <span>
                    {language === "ar" 
                      ? "تحقق من بريدك الإلكتروني للحصول على رابط التحميل"
                      : "Check your email for the download link"
                    }
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary font-semibold text-xs">2</span>
                  </div>
                  <span>
                    {language === "ar" 
                      ? "قم بتحميل المنتجات واستمتع بها"
                      : "Download and enjoy your products"
                    }
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-primary font-semibold text-xs">3</span>
                  </div>
                  <span>
                    {language === "ar" 
                      ? "إذا واجهت أي مشكلة، تواصل معنا عبر الدعم الفني"
                      : "If you face any issues, contact our support team"
                    }
                  </span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

export default function SuccessPage() {
  return <SuccessContent />
}
