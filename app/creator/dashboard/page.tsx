"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Package, ShoppingCart, DollarSign, Plus, Settings, Share2, Copy, Check, User, Calendar, Wallet, TrendingUp, Clock } from "lucide-react";
import { NotificationBell } from "@/components/notification-bell";

function DashboardContent() {
  const { language, t, direction } = useLanguage();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [username, setUsername] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    activeProducts: 0,
    orders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [wallet, setWallet] = useState<{ total_earned_halalas: number; pending_halalas: number; total_paid_halalas: number } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/auth/login");
          return;
        }

        // Set username from user email or metadata
        const userUsername = user.user_metadata?.username || user.email?.split('@')[0] || "";
        setUsername(userUsername);

        // Fetch seller profile
        const { data: profileData, error: profileError } = await supabase
          .from("seller_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profileError) {
          if (profileError.code === "PGRST116") {
            // No profile found
            setError(t("dashboard.noprofile"));
          } else {
            throw profileError;
          }
        } else {
          setProfile(profileData);
        }

        // Fetch products count
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("id")
          .eq("seller_id", user.id);

        const activeProductsCount = productsData?.length || 0;

        // Fetch orders
        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("status", "completed")
          .order("created_at", { ascending: false });

        // Filter orders that contain products from this seller
        const sellerOrders = ordersData?.filter((order: any) => {
          if (!order.items || !Array.isArray(order.items)) return false;
          return order.items.some((item: any) => item.creator === user.id || item.seller_id === user.id);
        }) || [];

        // Calculate total revenue from seller's orders
        const totalRevenue = sellerOrders.reduce((sum: number, order: any) => {
          if (!order.items || !Array.isArray(order.items)) return sum;
          const sellerItems = order.items.filter((item: any) => item.creator === user.id || item.seller_id === user.id);
          const sellerTotal = sellerItems.reduce((itemSum: number, item: any) => itemSum + (item.price * item.quantity), 0);
          return sum + sellerTotal;
        }, 0);

        setStats({
          totalSales: sellerOrders.length,
          activeProducts: activeProductsCount,
          orders: sellerOrders.length,
          revenue: totalRevenue,
        });

        // Set recent orders (last 5)
        setRecentOrders(sellerOrders.slice(0, 5));

        // Fetch wallet balance
        const { data: walletData } = await supabase
          .from("seller_balances")
          .select("total_earned_halalas, pending_halalas, total_paid_halalas")
          .eq("seller_id", user.id)
          .single();
        setWallet(walletData || null);
      } catch (err: any) {
        setError(err.message || t("dashboard.error.load"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, t]);

  const copyToClipboard = () => {
    const storeUrl = `https://www.sarhy.com/creator/${username}`;
    navigator.clipboard.writeText(storeUrl).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <div className="text-foreground">{t("dashboard.loading")}</div>
        </div>
      </div>
    );
  }

  if (error && error === t("dashboard.noprofile")) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-md mx-auto text-center">
              <div className="p-6 bg-card rounded-2xl shadow-lg border border-border">
                <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold mb-2 text-foreground">{t("dashboard.noprofile")}</h2>
                <p className="text-muted-foreground mb-6">
                  {language === "ar" ? "أنشئ ملف متجرك للبدء" : "Create your store profile to get started"}
                </p>
                <Button asChild className="w-full">
                  <Link href="/vendor/register">{t("dashboard.createprofile")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16" dir={direction}>
        <div className="container mx-auto px-4 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t("dashboard.welcome")} {profile?.store_name || ""}
              </h1>
              <p className="text-muted-foreground">
                {t("dashboard.store")}
              </p>
            </div>
            <NotificationBell />
          </div>

          {/* Store Info Card */}
          {profile && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {profile.store_name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{profile.bio || t("dashboard.store")}</p>
                {profile.verified && (
                  <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                    <Sparkles className="w-4 h-4" />
                    {language === "ar" ? "حساب موثق" : "Verified Account"}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Store Link Card */}
          <Card className="mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary" />
                {language === "ar" ? "رابط متجرك المباشر" : "Your Store Link"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="flex-1 p-3 bg-background rounded-xl border border-border">
                  <code className="text-sm text-foreground break-all">
                    https://www.sarhy.com/creator/{username}
                  </code>
                </div>
                <Button
                  onClick={copyToClipboard}
                  className="gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      {language === "ar" ? "تم النسخ" : "Copied"}
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      {language === "ar" ? "نسخ الرابط" : "Copy Link"}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.stats.sales")}
                </CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.totalSales}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.stats.products")}
                </CardTitle>
                <Package className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.activeProducts}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.stats.orders")}
                </CardTitle>
                <ShoppingCart className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stats.orders}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t("dashboard.stats.revenue")}
                </CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">${stats.revenue}</div>
              </CardContent>
            </Card>
          </div>

          {/* Wallet Card */}
          <Card className="mb-8 bg-gradient-to-br from-[#0f2e2e]/5 to-[#c9a227]/5 border-[#c9a227]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-[#c9a227]" />
                {language === "ar" ? "محفظتي" : "My Wallet"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                {/* Total Earned */}
                <div className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      {language === "ar" ? "إجمالي المكتسب" : "Total Earned"}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {wallet ? (wallet.total_earned_halalas / 100).toFixed(2) : "0.00"}
                    <span className="text-sm font-normal text-muted-foreground mr-1">
                      {language === "ar" ? "ر.س" : "SAR"}
                    </span>
                  </div>
                </div>

                {/* Pending */}
                <div className="p-4 rounded-xl bg-background border border-[#c9a227]/40">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-[#ea580c]" />
                    <span className="text-sm text-muted-foreground">
                      {language === "ar" ? "قيد التحويل" : "Pending"}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-[#c9a227]">
                    {wallet ? (wallet.pending_halalas / 100).toFixed(2) : "0.00"}
                    <span className="text-sm font-normal text-muted-foreground mr-1">
                      {language === "ar" ? "ر.س" : "SAR"}
                    </span>
                  </div>
                </div>

                {/* Paid */}
                <div className="p-4 rounded-xl bg-background border border-[#16a34a]/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-[#16a34a]" />
                    <span className="text-sm text-muted-foreground">
                      {language === "ar" ? "محوّل سابقاً" : "Transferred"}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-[#16a34a]">
                    {wallet ? (wallet.total_paid_halalas / 100).toFixed(2) : "0.00"}
                    <span className="text-sm font-normal text-muted-foreground mr-1">
                      {language === "ar" ? "ر.س" : "SAR"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                {language === "ar"
                  ? "سيتم تحويل المبلغ المحجوز خلال 7 أيام عمل من تاريخ اكتمال الطلب"
                  : "Pending amount will be transferred within 7 business days from order completion"}
              </p>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {language === "ar" ? "آخر العمليات" : "Recent Orders"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {language === "ar" ? "لا توجد عمليات حديثة" : "No recent orders"}
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{order.buyer_name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                        <div className="font-bold text-primary">
                          {order.total} {language === "ar" ? "ر.س" : "SAR"}
                        </div>
                        <div className="text-xs text-green-500">
                          {language === "ar" ? "مكتمل" : "Completed"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-24 flex-col gap-2 bg-primary hover:bg-primary/90" asChild>
              <Link href="/creator/dashboard/products/new">
                <Plus className="w-6 h-6" />
                {language === "ar" ? "إضافة منتج" : "Add Product"}
              </Link>
            </Button>

            <Button variant="outline" className="h-24 flex-col gap-2" asChild>
              <Link href="/creator/dashboard/products">
                <Package className="w-6 h-6" />
                {language === "ar" ? "عرض المنتجات" : "View Products"}
              </Link>
            </Button>

            <Button variant="outline" className="h-24 flex-col gap-2" asChild>
              <Link href="/creator/dashboard/orders">
                <ShoppingCart className="w-6 h-6" />
                {language === "ar" ? "عرض الطلبات" : "View Orders"}
              </Link>
            </Button>

            <Button variant="outline" className="h-24 flex-col gap-2" asChild>
              <Link href="/creator/dashboard/settings">
                <Settings className="w-6 h-6" />
                {language === "ar" ? "الإعدادات" : "Settings"}
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}
