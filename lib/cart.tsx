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
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, newQuantity: number) => Promise<void>
  isInCart: (productId: string) => boolean
  total: number
  fetchCart: () => Promise<void>
}

const CartContext = createContext<CartContextType>({
  items: [],
  count: 0,
  isLoading: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  isInCart: () => false,
  total: 0,
  fetchCart: async () => {},
})

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const fetchCart = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: cartRows, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)

    if (error) {
      console.error("[Cart] cart_items error:", error.message, error.code)
      return
    }

    if (!cartRows || cartRows.length === 0) {
      setItems([])
      return
    }

    const productIds = [...new Set(cartRows.map((r) => r.product_id))]
    const { data: products, error: prodError } = await supabase
      .from("products")
      .select("*")
      .in("id", productIds)

    if (prodError) {
      console.error("[Cart] products error:", prodError.message)
    }

    setItems(
      cartRows.map((row) => ({
        ...row,
        products: products?.find((p) => p.id === row.product_id) ?? null,
      }))
    )
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

    // 1. نبحث أولاً عن المنتج في السلة
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .single();

    if (existingItem) {
      // 2. إذا وجدناه، نحدث الكمية
      await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + 1 })
        .eq("id", existingItem.id);

      // تحديث الحالة المحلية
      setItems(prev => prev.map(item =>
        item.id === existingItem.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      // 3. إذا لم نجده، نضيفه لأول مرة
      const { error } = await supabase
        .from("cart_items")
        .insert({ user_id: user.id, product_id: productId, quantity: 1 });

      // تحديث الحالة المحلية فوراً باستخدام بيانات المنتج الممررة
      if (product) {
        setItems(prev => [...prev, {
          id: crypto.randomUUID(),
          product_id: productId,
          user_id: user.id,
          quantity: 1,
          products: product
        }])
      } else {
        // Fallback to fetchCart if product data not available
        await fetchCart()
      }
    }

    setIsLoading(false)
  }

  const removeFromCart = async (itemId: string) => {
    if (!currentUser) return
    try {
      setIsLoading(true)
      const supabase = createClient()
      await supabase.from("cart_items").delete().eq("id", itemId)
      await fetchCart()
    } finally {
      setIsLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (!currentUser) return
    if (newQuantity < 1) {
      // If quantity is 0 or less, remove the item
      await removeFromCart(itemId)
      return
    }

    try {
      setIsLoading(true)
      const supabase = createClient()
      await supabase
        .from("cart_items")
        .update({ quantity: newQuantity })
        .eq("id", itemId)

      // تحديث الحالة المحلية
      setItems(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity }
          : item
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const isInCart = (productId: string) => items.some(item => item.product_id === productId)
  const total = items.reduce((sum, item) => sum + (item.products?.price_halalas || 0) * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, count, isLoading, addToCart, removeFromCart, updateQuantity, isInCart, total, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
