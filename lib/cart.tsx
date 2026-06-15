"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { createClient } from "@/lib/supabase"
import { useLanguage } from "@/lib/language"

interface CartItem {
  id: string
  product_id: string
  user_id: string
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  count: number
  isLoading: boolean
  addToCart: (productId: string) => Promise<void>
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
      .select('id, product_id, user_id, quantity')
      .eq("user_id", user.id)

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

  const addToCart = async (productId: string) => {
    let user = currentUser
    if (!user) {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()
      user = data.user
    }

    if (!user) {
      window.location.href = "/auth/login"
      return
    }

    try {
      setIsLoading(true)
      const supabase = createClient()

      // 1. جلب حالة المنتج في السلة حالياً
      const { data: existingItem } = await supabase
        .from("cart_items")
        .select("quantity")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single();

      // 2. حساب الكمية الجديدة
      const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

      // 3. تحديث السلة
      const { error } = await supabase
        .from("cart_items")
        .upsert(
          {
            user_id: user.id,
            product_id: productId,
            quantity: newQuantity
          },
          { onConflict: 'user_id, product_id' }
        );

      if (error) {
        console.error("[Cart] upsert error:", error);
      } else {
        await fetchCart();
      }
    } finally {
      setIsLoading(false)
    }
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
  const total = 0

  return (
    <CartContext.Provider value={{ items, count: items.length, isLoading, addToCart, removeFromCart, isInCart, total }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
