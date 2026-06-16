"use client"

import { useCart } from "@/lib/cart"
import { useLanguage, LanguageProvider } from "@/lib/language"
import { CartProvider } from "@/lib/cart"
import { ShoppingCart, Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"

function CartContent() {
  const { items, removeFromCart, total, isLoading } = useCart()
  const { language } = useLanguage()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto max-w-4xl px-6 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">{language === "ar" ? "سلة التسوق" : "Shopping Cart"}</h1>
          {items.length > 0 && (
            <span className="text-sm text-muted-foreground">({items.length} {language === "ar" ? "منتج" : "items"})</span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
            <p className="text-muted-foreground mb-6">{language === "ar" ? "سلتك فارغة" : "Your cart is empty"}</p>
            <Button asChild className="rounded-xl">
              <Link href="/marketplace">{language === "ar" ? "تصفح المنتجات" : "Browse products"}</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-card border border-border rounded-2xl">
                  <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center">
                    {item.products?.[0]?.images?.[0] ? (
                      <img src={item.products[0].images[0]} alt={item.products[0].title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">📦</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-foreground truncate">{item.products?.[0]?.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.products?.[0]?.subcategory}</p>
                    <p className="text-primary font-bold mt-2">
                      {item.products?.[0]?.price_halalas ? (item.products[0].price_halalas / 100).toFixed(2) : "0"} {language === "ar" ? "ر.س" : "SAR"}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                <h3 className="font-bold text-lg mb-4">{language === "ar" ? "ملخص الطلب" : "Order Summary"}</h3>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">{language === "ar" ? "المجموع" : "Subtotal"}</span>
                  <span>{(total / 100).toFixed(2)} {language === "ar" ? "ر.س" : "SAR"}</span>
                </div>
                <div className="border-t border-border my-4" />
                <div className="flex justify-between font-bold mb-6">
                  <span>{language === "ar" ? "الإجمالي" : "Total"}</span>
                  <span>{(total / 100).toFixed(2)} {language === "ar" ? "ر.س" : "SAR"}</span>
                </div>
                <Button className="w-full rounded-xl h-12 font-bold" onClick={() => router.push("/checkout")}>
                  {language === "ar" ? "إتمام الشراء" : "Checkout"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CartPage() {
  return (
    <CartProvider>
      <LanguageProvider>
        <CartContent />
      </LanguageProvider>
    </CartProvider>
  )
}
