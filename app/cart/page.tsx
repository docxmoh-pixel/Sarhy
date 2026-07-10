"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, ArrowRight } from "lucide-react"
import { useCart } from "@/lib/cart"
import { useLanguage } from "@/lib/language"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  const { items, isLoading, removeFromCart, updateQuantity, total } = useCart()
  const { language } = useLanguage()
  const isAr = language === "ar"

  const formatSAR = (halalas: number) => (halalas / 100).toFixed(2)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-16">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <ShoppingBag className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {isAr ? "سلتك فارغة" : "Your cart is empty"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isAr ? "لم تقم بإضافة أي منتجات إلى السلة بعد" : "You haven't added any products to your cart yet"}
          </p>
          <Link href="/marketplace">
            <Button className="gap-2">
              {isAr ? "تصفح المنتجات" : "Browse Products"}
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-16">
      <div className="container mx-auto px-4 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">
          {isAr ? "سلة التسوق" : "Shopping Cart"}
          <span className="text-muted-foreground text-lg font-normal mr-2 ml-2">
            ({items.length})
          </span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const product = item.products
              const images = product?.images
                ? (typeof product.images === "string" ? JSON.parse(product.images) : product.images)
                : []
              const lineTotal = (product?.price_halalas || 0) * item.quantity

              return (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-2xl border border-border bg-card"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${item.product_id}`}
                    className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0"
                  >
                    {images.length > 0 && images[0] ? (
                      <Image src={images[0]} alt="" fill className="object-cover" />
                    ) : (
                      <span className="text-3xl">📦</span>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <Link
                        href={`/product/${item.product_id}`}
                        className="font-semibold hover:text-primary transition-colors line-clamp-1"
                      >
                        {product?.title || (isAr ? "منتج" : "Product")}
                      </Link>
                      {product?.subcategory && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground">
                          {product.subcategory}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 border border-border rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={isLoading}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={isLoading}
                          className="p-2 hover:bg-secondary rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold text-primary">
                          {formatSAR(lineTotal)} {isAr ? "ر.س" : "SAR"}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={isLoading}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
                          aria-label={isAr ? "حذف" : "Remove"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 p-6 rounded-2xl border border-border bg-card space-y-4">
              <h2 className="font-bold text-lg">
                {isAr ? "ملخص الطلب" : "Order Summary"}
              </h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{isAr ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span>{formatSAR(total)} {isAr ? "ر.س" : "SAR"}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{isAr ? "الشحن" : "Shipping"}</span>
                  <span>{isAr ? "يُحدد لاحقاً" : "Calculated next"}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex justify-between font-bold text-lg">
                <span>{isAr ? "الإجمالي" : "Total"}</span>
                <span className="text-primary">{formatSAR(total)} {isAr ? "ر.س" : "SAR"}</span>
              </div>

              <Link href="/checkout" className="block">
                <Button className="w-full gap-2" size="lg">
                  {isAr ? "إتمام الشراء" : "Proceed to Checkout"}
                  {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </Button>
              </Link>

              <Link href="/marketplace" className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                {isAr ? "الاستمرار في التسوق" : "Continue Shopping"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
