"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Settings, User, Store, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
  const { language, direction } = useLanguage();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [formData, setFormData] = useState({
    store_name: "",
    bio: "",
    website: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push("/auth/login");
          return;
        }

        const { data, error } = await supabase
          .from("seller_profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        setProfile(data);
        setFormData({
          store_name: data.store_name || "",
          bio: data.bio || "",
          website: data.website || "",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { error } = await supabase
        .from("seller_profiles")
        .update({
          store_name: formData.store_name,
          bio: formData.bio,
          website: formData.website,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      alert(language === "ar" ? "تم حفظ الإعدادات بنجاح" : "Settings saved successfully");
    } catch (error) {
      console.error("Error saving settings:", error);
      alert(language === "ar" ? "حدث خطأ أثناء حفظ الإعدادات" : "Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <main className="pt-24 pb-16" dir={direction}>
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <div className="text-center py-12 text-muted-foreground">
              {language === "ar" ? "جاري التحميل..." : "Loading..."}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="pt-24 pb-16" dir={direction}>
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
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
                <Settings className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {language === "ar" ? "الإعدادات" : "Settings"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "إدارة إعدادات حسابك" : "Manage your account settings"}
                </p>
              </div>
            </div>
          </div>

          {/* Settings Cards */}
          <div className="space-y-6">
            {/* Store Settings */}
            <Card className="shadow-md hover:shadow-lg transition-all duration-300 rounded-3xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Store className="w-5 h-5 text-primary" />
                  <CardTitle className="text-2xl">
                    {language === "ar" ? "إعدادات المتجر" : "Store Settings"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Store Name */}
                  <div className="space-y-2">
                    <Label htmlFor="store_name">
                      {language === "ar" ? "اسم المتجر" : "Store Name"} *
                    </Label>
                    <Input
                      id="store_name"
                      type="text"
                      value={formData.store_name}
                      onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                      placeholder={language === "ar" ? "أدخل اسم متجرك" : "Enter your store name"}
                      className="rounded-xl"
                    />
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <Label htmlFor="bio">
                      {language === "ar" ? "الوصف" : "Bio"}
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder={language === "ar" ? "أدخل وصف متجرك" : "Enter your store description"}
                      rows={4}
                      className="rounded-xl"
                    />
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <Label htmlFor="website">
                      {language === "ar" ? "الموقع الإلكتروني" : "Website"}
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://example.com"
                      className="rounded-xl"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {saving
                      ? (language === "ar" ? "جاري الحفظ..." : "Saving...")
                      : (language === "ar" ? "حفظ التغييرات" : "Save Changes")}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card className="shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl">
                    {language === "ar" ? "إعدادات الحساب" : "Account Settings"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <div className="font-medium text-foreground">
                        {language === "ar" ? "تغيير البريد الإلكتروني" : "Change Email"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {profile?.email}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      {language === "ar" ? "تغيير" : "Change"}
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <div className="font-medium text-foreground">
                        {language === "ar" ? "تغيير كلمة المرور" : "Change Password"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === "ar" ? "آخر تغيير: لم يتم" : "Last changed: Never"}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      {language === "ar" ? "تغيير" : "Change"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl">
                    {language === "ar" ? "إعدادات الإشعارات" : "Notification Settings"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <div className="font-medium text-foreground">
                        {language === "ar" ? "إشعارات البريد الإلكتروني" : "Email Notifications"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === "ar" ? "تلقي إشعارات عبر البريد الإلكتروني" : "Receive email notifications"}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      {language === "ar" ? "تفعيل" : "Enable"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <CardTitle className="text-xl">
                    {language === "ar" ? "الأمان" : "Security"}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-xl">
                    <div>
                      <div className="font-medium text-foreground">
                        {language === "ar" ? "المصادقة الثنائية" : "Two-Factor Authentication"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {language === "ar" ? "إضافة طبقة أمان إضافية" : "Add an extra layer of security"}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-xl">
                      {language === "ar" ? "تفعيل" : "Enable"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
