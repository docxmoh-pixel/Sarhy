'use client';
import { use, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useCart } from '@/lib/cart';
import Image from 'next/image';
import Link from 'next/link';

// Mapping between URL section (English) and database category (Arabic)
const sectionToCategory: Record<string, string> = {
  digital: "الحلول الرقمية",
  services: "الخدمات والأعمال",
  knowledge: "المعرفة والتطوير",
  community: "المجتمع",
  resha: "ريشة",
  atheer: "الأثير",
  erth: "إرث",
  holool: "حلول",
  sanad: "سند",
  sena3a: "صنعة",
  maydan: "ميدان",
  mdad: "مداد",
  mahara: "مهارة",
  aoun: "عون",
};

export default function CategoryPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = use(params);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);

      // Get the category name in Arabic from the section parameter
      const category = sectionToCategory[section] || section;

      // Fetch products by category or subcategory
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`category.eq.${category},subcategory.eq.${category}`);

      if (data) {
        setProducts(data);
      }
      setLoading(false);
    }

    fetchProducts();
  }, [section]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {sectionToCategory[section] || section}
          </h1>
          <p className="text-muted-foreground">
            {products.length} منتج متاح
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">لا توجد منتجات حالياً في هذا التصنيف.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-card border border-border rounded-2xl p-3 shadow-sm hover:shadow-md transition-all flex flex-col">
                {/* الصورة - أبرز عنصر */}
                <div className="relative h-56 w-full mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-primary/5">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <span className="text-4xl">📦</span>
                    </div>
                  )}
                </div>

                {/* تفاصيل المنتج */}
                <div className="px-1 mb-4 flex-grow">
                  <h2 className="font-semibold text-foreground text-sm truncate">{product.title}</h2>
                  {product.description && (
                    <p className="text-muted-foreground text-xs mt-1 truncate">{product.description}</p>
                  )}
                  <p className="text-primary font-bold mt-2 text-sm">{(product.price_halalas / 100).toFixed(2)} ر.س</p>
                </div>

                {/* الأزرار - حجم أصغر وتصميم أنيق */}
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href={`/marketplace/product/${product.id}`}
                    className="text-center py-1.5 text-xs font-medium text-foreground bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    التفاصيل
                  </Link>
                  <button
                    onClick={() => addToCart(product.id, product)}
                    className="py-1.5 text-xs font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    إضافة للسلة
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
