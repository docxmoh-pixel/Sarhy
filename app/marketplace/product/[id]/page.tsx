'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useCart } from '@/lib/cart';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, ArrowLeft, Star, Download } from 'lucide-react';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      console.log('Product data:', { data, error });

      if (data) {
        setProduct(data);
      }
      setLoading(false);
    }

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">المنتج غير موجود</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          العودة للسوق
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="relative aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <span className="text-8xl">📦</span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {(product.price_halalas / 100).toFixed(2)} ر.س
                </span>
                {product.category && (
                  <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                    {product.category}
                  </span>
                )}
                {product.subcategory && (
                  <span className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm">
                    {product.subcategory}
                  </span>
                )}
              </div>
            </div>

            {product.description && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">الوصف</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {product.features && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-3">المميزات</h2>
                <ul className="space-y-2">
                  {product.features.split('|').map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary mt-1">✓</span>
                      {feature.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-4 pt-6 border-t border-border">
              <button
                onClick={() => addToCart(product.id, product)}
                className="flex-1 bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                إضافة للسلة
              </button>
              <button className="w-14 h-14 bg-secondary text-secondary-foreground rounded-xl hover:bg-secondary/90 transition-all duration-200 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border">
              <div className="text-center p-4 bg-card rounded-xl border border-border">
                <Download className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">تحميل فوري</p>
              </div>
              <div className="text-center p-4 bg-card rounded-xl border border-border">
                <Star className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">تقييم عالي</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
