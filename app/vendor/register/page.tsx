"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useLanguage } from "@/lib/language";

function VendorRegisterContent() {
  const { language, t, direction } = useLanguage();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  const [storeName, setStoreName] = useState("");
  const [slug, setSlug] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        router.push("/auth/login");
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setStoreName(name);
    const generatedSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!user) {
      setError(t("vendor.error.login"));
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient()
      const { error: insertError } = await supabase
        .from("seller_profiles")
        .insert([
          {
            id: user.id,
            store_name: storeName,
            store_slug: slug,
            bio: bio,
          },
        ]);

      if (insertError) throw insertError;

      router.push("/creator/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || t("vendor.error.general"));
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">{t("vendor.checking")}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-md mx-auto">
            <div className="p-6 bg-card rounded-2xl shadow-lg border border-border" dir={direction}>
              <h2 className="text-2xl font-bold mb-6 text-center text-foreground">
                {t("vendor.title")}
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t("vendor.storename")}
                  </label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t("vendor.storename.placeholder")}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t("vendor.slug")}
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 rounded-r-md border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                      {t("vendor.slug.prefix")}
                    </span>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary text-left"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    {t("vendor.bio")}
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder={t("vendor.bio.placeholder")}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:bg-muted disabled:text-muted-foreground transition-colors"
                >
                  {loading ? t("vendor.submitting") : t("vendor.submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function VendorRegisterPage() {
  return <VendorRegisterContent />;
}
