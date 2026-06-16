"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase"
import { useLanguage } from "@/lib/language"
import { Product, CartItem } from "../types/product"

interface CartContextType {
  items: CartItem[]
  count: number
  isLoading: boolean
  addToCart: (productId: string, product?: Product) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  isInCart: (productId: string) => boolean
  total: number
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  isLoading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  isInCart: () => false,
  total: 0,
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const fetchCart = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from("cart_items")
      .select('id, product_id, user_id, quantity, products(id, title, price_halalas)')
      .eq("user_id", user.id)

    console.log('Cart Items:', data)
    setItems(data || [])
  }, [])

  useEffect(() => {
    const supabase = createClient()

    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user)
      if (user) fetchCart()
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setCurrentUser(session?.user ?? null)
      if (session?.user) {
        fetchCart()
      } else {
        setItems([])
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchCart])

  const addToCart = async (productId: string, product?: Product) => {
    let user = currentUser
    if (!user) {
      const { data } = await createClient().auth.getUser()
      user = data.user
    }
    if (!user) { window.location.href = "/auth/login"; return }

    setIsLoading(true)
    const supabase = createClient()

    // Always insert a new item to allow duplicates
    await supabase.from("cart_items").insert({ user_id: user.id, product_id: productId, quantity: 1 })

    // تحديث الحالة المحلية فوراً باستخدام بيانات المنتج الممررة
    if (product) {
      setItems(prev => [...prev, {
        id: crypto.randomUUID(),
        product_id: productId,
        user_id: user.id,
        quantity: 1,
        products: [product]
      }])
    } else {
      // Fallback to fetchCart if product data not available
      await fetchCart()
    }

    setIsLoading(false)
  }

  const removeFromCart = async (productId: string) => {
    if (!currentUser) return
    try {
      setIsLoading(true)
      const supabase = createClient()
      await supabase.from("cart_items").delete().eq("user_id", currentUser.id).eq("product_id", productId)
      await fetchCart()
    } finally {
      setIsLoading(false)
    }
  }

  const isInCart = (productId: string) => items.some(item => item.product_id === productId)
  const total = items.reduce((sum, item) => sum + (item.products?.[0]?.price_halalas || 0) * item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, count: items.length, isLoading, addToCart, removeFromCart, isInCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
