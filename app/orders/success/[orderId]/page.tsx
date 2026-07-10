'use client';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Download, ArrowLeft, Package, Truck } from 'lucide-react';

export default function OrderSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const router = useRouter();
  const { orderId } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (*)
          )
        `)
        .eq('id', orderId)
        .single();

      if (data) {
        setOrder(data);

        if (data.status !== 'paid') {
          setVerifyingPayment(true);
        } else {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) await supabase.from('cart_items').delete().eq('user_id', user.id);
        }
      }
      setLoading(false);
    }

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Polling for payment status
  useEffect(() => {
    if (!orderId || !verifyingPayment) return;

    const checkStatus = setInterval(async () => {
      const { data: order } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single();

      if (order?.status === 'paid') {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) await supabase.from('cart_items').delete().eq('user_id', user.id);
        clearInterval(checkStatus);
        setVerifyingPayment(false);

        // Refresh order data to show success message
        const { data: fullOrder } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (*)
            )
          `)
          .eq('id', orderId)
          .single();

        if (fullOrder) {
          setOrder(fullOrder);
        }
      }
    }, 3000);

    return () => clearInterval(checkStatus);
  }, [orderId, verifyingPayment]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">الطلب غير موجود</p>
    </div>
  );

  if (verifyingPayment) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-lg font-medium">جاري التحقق من الدفع...</p>
        <p className="text-sm text-muted-foreground mt-2">يرجى الانتظار، سيتم تحديث الصفحة تلقائياً</p>
      </div>
    </div>
  );

  const isPaid = order.status === 'paid';
  const isDigital = order.order_items?.some((item: any) => item.products?.category === 'الحلول الرقمية');

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          العودة للوحة التحكم
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              تم إتمام الطلب بنجاح!
            </h1>
            <p className="text-muted-foreground">
              رقم الطلب: {order.id.slice(0, 8)}
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">تفاصيل الطلب</h2>

            <div className="space-y-4">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                  <div className="w-20 h-20 bg-muted rounded-xl overflow-hidden flex-shrink-0">
                    {item.products?.images?.[0] ? (
                      <Image
                        src={item.products.images[0]}
                        alt={item.products.title}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{item.products?.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      الكمية: {item.quantity}
                    </p>
                    <p className="text-primary font-bold mt-1">
                      {item.products?.price_halalas ? (item.products.price_halalas / 100).toFixed(2) : "0"} ر.س
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border mt-6 pt-6">
              <div className="flex justify-between text-lg font-bold">
                <span>الإجمالي</span>
                <span className="text-primary">
                  {(order.total_halalas / 100).toFixed(2)} ر.س
                </span>
              </div>
            </div>
          </div>

          {/* Download / Delivery Info */}
          {isPaid && (
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {isDigital ? 'تحميل المنتجات' : 'معلومات التوصيل'}
              </h2>

              {isDigital ? (
                <div className="space-y-4">
                  {order.order_items?.map((item: any) => (
                    <button
                      key={item.id}
                      className="w-full flex items-center justify-between p-4 bg-primary/10 border border-primary/20 rounded-xl hover:bg-primary/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">
                          {item.products?.title}
                        </span>
                      </div>
                      <span className="text-primary font-medium">تحميل</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                  <Truck className="w-8 h-8 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">جاري تجهيز الطلب</p>
                    <p className="text-sm text-muted-foreground">
                      سيتم التواصل معك لتحديد موعد التسليم
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isPaid && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
              <p className="text-yellow-800">
                لم يتم إتمام الدفع بعد. يرجى إتمام الدفع لتفعيل التحميل.
              </p>
              <Link
                href={`/checkout?orderId=${order.id}`}
                className="inline-block mt-4 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors"
              >
                إتمام الدفع
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
