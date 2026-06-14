"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Package, Plus, Edit, Trash2 } from "lucide-react";

export default function ProductsPage() {
  const { language, direction } = useLanguage();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "expired" | "disputes">("all");
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push("/auth/login");
          return;
        }

        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from("products")
          .select("*")
          .eq("seller_id", user.id)
          .order("created_at", { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);

        // Fetch pending reports
        const { data: reportsData } = await supabase
          .from("reports")
          .select("*")
          .eq("status", "pending");

        setReports(reportsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleDelete = async (productId: string) => {
    if (!confirm(language === "ar" ? "هل أنت متأكد من حذف هذا المنتج؟" : "Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert(language === "ar" ? "حدث خطأ أثناء حذف المنتج" : "Error deleting product");
    }
  };

  // Helper function to determine product status
  const getProductStatus = (product: any) => {
    const now = new Date()

    // Check if expired
    if (product.has_expiry && product.expiry_date) {
      const expiryDate = new Date(product.expiry_date)
      if (expiryDate < now) {
        return {
          status: "expired",
          label: language === "ar" ? "منتهي الصلاحية" : "Expired",
          color: "red",
        }
      }
    }

    // Check if has pending disputes
    const hasDispute = reports.some(report => report.product_id === product.id)
    if (hasDispute) {
      return {
        status: "disputes",
        label: language === "ar" ? "قيد المراجعة المالية" : "Pending Disputes",
        color: "yellow",
      }
    }

    // Active
    return {
      status: "active",
      label: language === "ar" ? "نشط" : "Active",
      color: "green",
    }
  }

  // Filter products based on selected filter
  const filteredProducts = products.filter(product => {
    const status = getProductStatus(product).status
    if (filter === "all") return true
    return status === filter
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="pt-24 pb-16" dir={direction}>
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {language === "ar" ? "رجوع" : "Back"}
              </Button>
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {language === "ar" ? "منتجاتي" : "My Products"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "إدارة منتجاتك" : "Manage your products"}
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/creator/dashboard/products/new")}
              className="gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              {language === "ar" ? "إضافة منتج" : "Add Product"}
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 flex gap-2 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="rounded-xl"
            >
              {language === "ar" ? "الكل" : "All"}
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              onClick={() => setFilter("active")}
              className="rounded-xl"
            >
              {language === "ar" ? "نشط" : "Active"}
            </Button>
            <Button
              variant={filter === "expired" ? "default" : "outline"}
              onClick={() => setFilter("expired")}
              className="rounded-xl"
            >
              {language === "ar" ? "منتهي الصلاحية" : "Expired"}
            </Button>
            <Button
              variant={filter === "disputes" ? "default" : "outline"}
              onClick={() => setFilter("disputes")}
              className="rounded-xl"
            >
              {language === "ar" ? "قيد المراجعة المالية" : "Pending Disputes"}
            </Button>
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">
              {language === "ar" ? "جاري التحميل..." : "Loading..."}
            </div>
          ) : filteredProducts.length === 0 ? (
            <Card className="shadow-md rounded-3xl">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
                  <Package className="w-10 h-10 text-primary/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {language === "ar" ? "لا توجد منتجات" : "No products"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === "ar" ? "لا توجد منتجات في هذا الفلتر" : "No products in this filter"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredProducts.map((product) => {
                const status = getProductStatus(product)
                return (
                  <Card key={product.id} className="shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-xl">{product.name}</CardTitle>
                            <div
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                status.color === "red"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                                  : status.color === "yellow"
                                  ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                              }`}
                            >
                              {status.label}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">{product.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {product.price} {language === "ar" ? "ر.س" : "SAR"}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/creator/dashboard/products/${product.id}/edit`)}
                          className="gap-2 rounded-xl"
                        >
                          <Edit className="w-4 h-4" />
                          {language === "ar" ? "تعديل" : "Edit"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="gap-2 rounded-xl text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                          {language === "ar" ? "حذف" : "Delete"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
