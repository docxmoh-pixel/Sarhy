"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import { useLanguage } from "@/lib/language";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Package, Upload, Save, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";

export default function NewProductPage() {
  const { language, direction } = useLanguage();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    file: null as File | null,
    images: [] as File[],
    hasExpiry: false,
    expiryDate: "",
  });
  const [fileError, setFileError] = useState("");
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [legalAgreement, setLegalAgreement] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFormData({ ...formData, file: null });
      setFileError("");
      return;
    }

    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError(
        language === "ar"
          ? "حجم الملف يتجاوز الحد المسموح به (50 ميجابايت)"
          : "File size exceeds the maximum limit (50MB)"
      );
      setFormData({ ...formData, file: null });
      return;
    }

    setFileError("");
    setFormData({ ...formData, file });
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) {
      setFormData({ ...formData, images: [] });
      setImageErrors([]);
      return;
    }

    if (files.length > 5) {
      setImageErrors([
        language === "ar"
          ? "يمكنك رفع 5 صور كحد أقصى"
          : "You can upload a maximum of 5 images",
      ]);
      setFormData({ ...formData, images: [] });
      return;
    }

    const maxImageSize = 2 * 1024 * 1024;
    const maxTotalSize = 10 * 1024 * 1024;
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxImageSize) {
        errors.push(
          language === "ar"
            ? `الصورة ${i + 1} تتجاوز الحد المسموح به (2 ميجابايت)`
            : `Image ${i + 1} exceeds the maximum limit (2MB)`
        );
      }
    }

    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > maxTotalSize) {
      errors.push(
        language === "ar"
          ? "إجمالي حجم الصور يتجاوز الحد المسموح به (10 ميجابايت)"
          : "Total image size exceeds the maximum limit (10MB)"
      );
    }

    if (errors.length > 0) {
      setImageErrors(errors);
      setFormData({ ...formData, images: [] });
      return;
    }

    setImageErrors([]);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { error } = await supabase
        .from("products")
        .insert({
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          seller_id: user.id,
          status: "pending",
          has_expiry: formData.hasExpiry,
          expiry_date: formData.hasExpiry ? formData.expiryDate : null,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      router.push("/creator/dashboard/products");
    } catch (error) {
      console.error("Error creating product:", error);
      alert(language === "ar" ? "حدث خطأ أثناء إضافة المنتج" : "Error creating product");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: language === "ar" ? "البيانات" : "Data", icon: Package },
    { id: 2, title: language === "ar" ? "المعاينة" : "Preview", icon: CheckCircle2 },
    { id: 3, title: language === "ar" ? "التأكيد" : "Confirm", icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <main className="pt-24 pb-16" dir={direction}>
        <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
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
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {language === "ar" ? "إضافة منتج جديد" : "Add New Product"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "اتبع الخطوات لإضافة منتج جديد" : "Follow the steps to add a new product"}
                </p>
              </div>
            </div>
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        currentStep === step.id
                          ? "bg-primary text-primary-foreground"
                          : currentStep > step.id
                          ? "bg-green-500 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="mt-2 text-sm font-medium">{step.title}</div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 ${
                        currentStep > step.id ? "bg-green-500" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="shadow-md hover:shadow-lg transition-all duration-300 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-2xl">
                {language === "ar" ? `الخطوة ${currentStep}` : `Step ${currentStep}`}: {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {language === "ar" ? "اسم المنتج" : "Product Name"} *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder={language === "ar" ? "أدخل اسم المنتج" : "Enter product name"}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      {language === "ar" ? "الوصف" : "Description"} *
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      placeholder={language === "ar" ? "أدخل وصف المنتج" : "Enter product description"}
                      rows={5}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">
                      {language === "ar" ? "السعر (ر.س)" : "Price (SAR)"} *
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      placeholder={language === "ar" ? "أدخل السعر" : "Enter price"}
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file">
                      {language === "ar" ? "رفع ملف المنتج (الحد الأقصى 50 ميجابايت)" : "Upload Product File (Max 50MB)"}
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        className="rounded-xl"
                      />
                      <Upload className="w-5 h-5 text-muted-foreground" />
                    </div>
                    {fileError && (
                      <div className="text-sm text-destructive">{fileError}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="images">
                      {language === "ar" ? "رفع صور المنتج (حد أقصى 5 صور، 2 ميجابايت لكل صورة، 10 ميجابايت إجمالي)" : "Upload Product Images (Max 5 images, 2MB each, 10MB total)"}
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImagesChange}
                        className="rounded-xl"
                      />
                      <Upload className="w-5 h-5 text-muted-foreground" />
                    </div>
                    {imageErrors.length > 0 && (
                      <div className="space-y-1">
                        {imageErrors.map((error, index) => (
                          <div key={index} className="text-sm text-destructive">
                            {error}
                          </div>
                        ))}
                      </div>
                    )}
                    {formData.images.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {language === "ar" ? "تم اختيار" : "Selected"}: {formData.images.length} {language === "ar" ? "صور" : "images"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="hasExpiry"
                        checked={formData.hasExpiry}
                        onChange={(e) => setFormData({ ...formData, hasExpiry: e.target.checked })}
                        className="w-5 h-5 rounded"
                      />
                      <Label htmlFor="hasExpiry" className="cursor-pointer">
                        {language === "ar" ? "هل المنتج مؤقت أو يتطلب تاريخ انتهاء صلاحية؟" : "Is this product temporary or requires an expiry date?"}
                      </Label>
                    </div>
                  </div>

                  {formData.hasExpiry && (
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">
                        {language === "ar" ? "تاريخ انتهاء الصلاحية" : "Expiry Date"} *
                      </Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={formData.expiryDate}
                        onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                        required={formData.hasExpiry}
                        className="rounded-xl"
                      />
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="p-6 bg-muted/50 rounded-xl">
                    <h3 className="text-xl font-bold mb-4">{formData.name}</h3>
                    <p className="text-muted-foreground mb-4 whitespace-pre-wrap">{formData.description}</p>
                    <div className="text-2xl font-bold text-primary">
                      {formData.price} {language === "ar" ? "ر.س" : "SAR"}
                    </div>
                    {formData.hasExpiry && formData.expiryDate && (
                      <div className="mt-4 text-sm text-muted-foreground">
                        {language === "ar" ? "تاريخ انتهاء الصلاحية:" : "Expiry Date:"} {formData.expiryDate}
                      </div>
                    )}
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative aspect-square bg-muted rounded-xl overflow-hidden">
                          <img
                            src={URL.createObjectURL(image)}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.file && (
                    <div className="p-4 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">{formData.file.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({(formData.file.size / (1024 * 1024)).toFixed(2)} MB)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="p-6 bg-destructive/10 border border-destructive/20 rounded-xl">
                    <h3 className="text-lg font-bold text-destructive mb-2">
                      {language === "ar" ? "الإقرار القانوني" : "Legal Agreement"}
                    </h3>
                    <p className="text-sm text-destructive/80 mb-4">
                      {language === "ar"
                        ? "أقر وأتعهد بأن هذا المنتج متوافق مع الأنظمة واللوائح المعمول بها في المملكة العربية السعودية، وشروط السلامة وحقوق الملكية الفكرية، وأتحمل المسؤولية كاملة عن جودته وصلاحيته ومحتواه."
                        : "I acknowledge and undertake that this product complies with the regulations and laws in force in the Kingdom of Saudi Arabia, safety conditions and intellectual property rights, and I bear full responsibility for its quality, validity and content."}
                    </p>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="legalAgreement"
                        checked={legalAgreement}
                        onChange={(e) => setLegalAgreement(e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                      <Label htmlFor="legalAgreement" className="cursor-pointer font-medium">
                        {language === "ar" ? "أوافق على الإقرار القانوني" : "I agree to the legal agreement"}
                      </Label>
                    </div>
                  </div>

                  <div className="p-6 bg-muted/50 rounded-xl">
                    <h3 className="text-lg font-bold mb-4">
                      {language === "ar" ? "ملخص المنتج" : "Product Summary"}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{language === "ar" ? "الاسم:" : "Name:"}</span>
                        <span className="font-medium">{formData.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{language === "ar" ? "السعر:" : "Price:"}</span>
                        <span className="font-medium">{formData.price} {language === "ar" ? "ر.س" : "SAR"}</span>
                      </div>
                      {formData.hasExpiry && formData.expiryDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{language === "ar" ? "تاريخ انتهاء الصلاحية:" : "Expiry Date:"}</span>
                          <span className="font-medium">{formData.expiryDate}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{language === "ar" ? "الصور:" : "Images:"}</span>
                        <span className="font-medium">{formData.images.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{language === "ar" ? "الملف:" : "File:"}</span>
                        <span className="font-medium">{formData.file?.name || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="gap-2 rounded-xl"
                  >
                    <ChevronRight className="w-4 h-4" />
                    {language === "ar" ? "السابق" : "Previous"}
                  </Button>
                )}

                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    disabled={
                      currentStep === 1 &&
                      (!formData.name || !formData.description || !formData.price || (formData.hasExpiry && !formData.expiryDate))
                    }
                    className="flex-1 gap-2 rounded-xl"
                  >
                    {language === "ar" ? "التالي" : "Next"}
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!legalAgreement || loading}
                    className="flex-1 gap-2 rounded-xl"
                  >
                    <Save className="w-4 h-4" />
                    {loading
                      ? (language === "ar" ? "جاري الرفع..." : "Uploading...")
                      : (language === "ar" ? "التأكيد والرفع النهائي" : "Confirm and Upload")}
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="rounded-xl"
                >
                  {language === "ar" ? "إلغاء" : "Cancel"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
