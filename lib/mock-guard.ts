export type MockableProduct = {
  id: string | number
  is_mock?: boolean
  mock_sale_count?: number | null
  mock_rating?: number | null
  mock_reviews?: number | null
}

export type MockableProfile = {
  id: string
  is_mock?: boolean
}

export function isMockProduct(product: MockableProduct): boolean {
  return product.is_mock === true
}

export function isMockProfile(profile: MockableProfile): boolean {
  return profile.is_mock === true
}

export function getDisplayStats(product: MockableProduct & {
  sale_count?: number
  rating?: number
  review_count?: number
}) {
  if (product.is_mock) {
    return {
      sales: product.mock_sale_count ?? 0,
      rating: product.mock_rating ?? 0,
      reviews: product.mock_reviews ?? 0,
    }
  }
  return {
    sales: product.sale_count ?? 0,
    rating: product.rating ?? 0,
    reviews: product.review_count ?? 0,
  }
}

export type PurchaseStatus =
  | { canPurchase: true }
  | { canPurchase: false; reason: "mock" | "unpublished" | "unavailable" }

export function getPurchaseStatus(product: MockableProduct & {
  is_published?: boolean
}): PurchaseStatus {
  if (product.is_mock) {
    return { canPurchase: false, reason: "mock" }
  }
  if (!product.is_published) {
    return { canPurchase: false, reason: "unpublished" }
  }
  return { canPurchase: true }
}

export function getMockStatusLabel(
  reason: "mock" | "unpublished" | "unavailable",
  language: "ar" | "en"
): string {
  const labels = {
    mock: { ar: "عرض توضيحي فقط", en: "Demo only" },
    unpublished: { ar: "غير متاح حالياً", en: "Currently unavailable" },
    unavailable: { ar: "نفد المخزون", en: "Out of stock" },
  }
  return labels[reason][language]
}
