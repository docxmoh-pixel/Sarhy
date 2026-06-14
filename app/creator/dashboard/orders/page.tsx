"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShoppingCart, Package, User, Calendar } from "lucide-react";

export default function OrdersPage() {
  const { language, direction } = useLanguage();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push("/auth/login");
          return;
        }

        // Fetch all completed orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("status", "completed")
          .order("created_at", { ascending: false });

        if (ordersError) throw ordersError;

        // Filter orders that contain products from this seller
        const sellerOrders = ordersData?.filter((order: any) => {
          if (!order.items || !Array.isArray(order.items)) return false;
          return order.items.some((item: any) => item.creator === user.id || item.seller_id === user.id);
        }) || [];

        setOrders(sellerOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="pt-24 pb-16" dir={direction}>
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {language === "ar" ? "رجوع" : "Back"}
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <ShoppingCart className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {language === "ar" ? "طلباتي" : "My Orders"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "إدارة طلباتك" : "Manage your orders"}
                </p>
              </div>
            </div>
          </div>

          {/* Orders Grid */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              {language === "ar" ? "جاري التحميل..." : "Loading..."}
            </div>
          ) : orders.length === 0 ? (
            <Card className="shadow-md rounded-3xl">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                  <ShoppingCart className="w-10 h-10 text-primary/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {language === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
                </h3>
                <p className="text-muted-foreground">
                  {language === "ar" ? "ستظهر طلباتك هنا" : "Your orders will appear here"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {orders.map((order) => (
                <Card key={order.id} className="shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {language === "ar" ? "طلب #" : "Order #"}{order.id.slice(0, 8)}
                        </CardTitle>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {order.buyer_name}
                          </div>
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            {order.buyer_email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.created_at).toLocaleDateString('ar-SA')}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {order.total} {language === "ar" ? "ر.س" : "SAR"}
                        </div>
                        <div className={`text-sm font-medium ${
                          order.status === "completed" ? "text-green-500" :
                          order.status === "pending" ? "text-yellow-500" :
                          "text-red-500"
                        }`}>
                          {order.status === "completed" ? (language === "ar" ? "مكتمل" : "Completed") :
                           order.status === "pending" ? (language === "ar" ? "قيد الانتظار" : "Pending") :
                           (language === "ar" ? "ملغي" : "Cancelled")}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm font-medium text-foreground">
                        {language === "ar" ? "المنتجات:" : "Products:"}
                      </div>
                      {order.items && Array.isArray(order.items) && order.items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{language === "ar" ? item.title.ar : item.title.en} x{item.quantity}</span>
                          <span>{item.price * item.quantity} {language === "ar" ? "ر.س" : "SAR"}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
