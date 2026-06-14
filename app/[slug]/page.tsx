"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Package, ArrowLeft, CheckCircle } from "lucide-react";

function StorePageContent() {
  const { language, t, direction } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const supabase = createClient()
        // Fetch seller profile by slug
        const { data: profileData, error: profileError } = await supabase
          .from("seller_profiles")
          .select("*")
          .eq("store_slug", slug)
          .single();

        if (profileError) {
          if (profileError.code === "PGRST116") {
            // No profile found
            setError("notfound");
          } else {
            throw profileError;
          }
        } else {
          setProfile(profileData);

          // Fetch products by seller ID
          const { data: productsData, error: productsError } = await supabase
            .from("products")
            .select("*")
            .eq("seller_id", profileData.id);

          if (productsError) {
            console.error("Error fetching products:", productsError);
          } else {
            setProducts(productsData || []);
          }
        }
      } catch (err: any) {
        console.error("Error loading store:", err);
        setError("error");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchStoreData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
          <div className="text-foreground">{t("store.loading")}</div>
        </div>
      </div>
    );
  }

  if (error === "notfound") {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-md mx-auto text-center">
              <div className="p-6 bg-card rounded-2xl shadow-lg border border-border">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2 text-foreground">{t("store.notfound")}</h2>
                <p className="text-muted-foreground mb-6">{t("store.notfound.desc")}</p>
                <Button asChild>
                  <Link href="/">{t("store.backhome")}</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error === "error") {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-md mx-auto text-center">
              <div className="p-6 bg-card rounded-2xl shadow-lg border border-border">
                <h2 className="text-2xl font-bold mb-2 text-foreground">{t("store.error.load")}</h2>
                <Button asChild className="mt-4">
                  <Link href="/">{t("store.backhome")}</Link>
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
          {/* Store Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/">
                <ArrowLeft className={direction === "rtl" ? "rotate-180" : ""} />
                {t("store.backhome")}
              </Link>
            </Button>

            <div className="bg-card rounded-2xl shadow-lg border border-border p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-foreground">{profile?.store_name}</h1>
                    {profile?.verified && (
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                        <CheckCircle className="w-4 h-4" />
                        {t("store.verified")}
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground text-lg">{profile?.bio}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">{t("store.products")}</h2>

            {products.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold text-foreground mb-2">{t("store.noproducts")}</h3>
                  <p className="text-muted-foreground">{t("store.noproducts.desc")}</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-muted relative">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-foreground">${product.price}</span>
                        <Button size="sm" asChild>
                          <Link href={`/product/${product.id}`}>
                            {language === "ar" ? "عرض" : "View"}
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function StorePage() {
  return <StorePageContent />;
}
