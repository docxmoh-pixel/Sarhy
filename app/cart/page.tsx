"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ArrowRight, Tag, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/lib/language"
import Link from "next/link"

interface CartItem {
  id: string
  title: { ar: string; en: string }
  price: number
  quantity: number
  creator: string
}

function CartContent() {
  const { language } = useLanguage()
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight
  
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("sarhy_cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("sarhy_cart", JSON.stringify(cartItems))
  }, [cartItems])
  
  const subtotal = cartItems.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)
  const total = subtotal - discount
  
  const updateQuantity = (id: string, delta: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }
  
  const removeItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id))
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {language === "ar" ? "سلة التسوق" : "Shopping Cart"}
            </h1>
            <p className="text-muted-foreground">
              {cartItems.length} {language === "ar" ? "منتج في السلة" : "items in cart"}
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item: CartItem, index: number) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-4 flex gap-4 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Thumbnail */}
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 shrink-0" />
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground mb-1 truncate">
                      {language === "ar" ? item.title.ar : item.title.en}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {language === "ar" ? "بواسطة" : "by"} {item.creator}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-8 text-center text-foreground">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-foreground">${item.price * item.quantity}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {cartItems.length === 0 && (
                <div className="text-center py-16 bg-card rounded-2xl border border-border shadow-sm">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {language === "ar" ? "السلة فارغة" : "Cart is empty"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {language === "ar" ? "ابدأ بإضافة بعض المنتجات" : "Start adding some products"}
                  </p>
                  <Link href="/marketplace">
                    <Button className="rounded-full">
                      {language === "ar" ? "تصفح المنتجات" : "Browse Products"}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-2xl border border-border p-6 sticky top-24 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {language === "ar" ? "ملخص الطلب" : "Order Summary"}
                </h2>
                
                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <div className="relative flex-1">
                    <Tag className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder={language === "ar" ? "كود الخصم" : "Promo code"}
                      className="ps-9 rounded-xl"
                    />
                  </div>
                  <Button variant="outline" className="rounded-xl">
                    {language === "ar" ? "تطبيق" : "Apply"}
                  </Button>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{language === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                    <span className="text-foreground">${subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{language === "ar" ? "الخصم" : "Discount"}</span>
                      <span className="text-green-500">-${discount}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">{language === "ar" ? "الإجمالي" : "Total"}</span>
                    <span className="text-foreground">${total}</span>
                  </div>
                </div>
                
                <Link href="/checkout">
                  <Button className="w-full h-12 rounded-xl gap-2 shadow-md hover:shadow-lg transition-all duration-300">
                    <CreditCard className="w-4 h-4" />
                    {language === "ar" ? "إتمام الشراء" : "Checkout"}
                    <Arrow className="w-4 h-4" />
                  </Button>
                </Link>
                
                <p className="text-xs text-muted-foreground text-center mt-4">
                  {language === "ar" 
                    ? "بإتمام الشراء، أنت توافق على شروط الخدمة"
                    : "By completing purchase, you agree to our Terms of Service"
                  }
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function CartPage() {
  return <CartContent />
}
