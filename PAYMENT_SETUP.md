# إعداد بوابة الدفع Moyasar (ميسر)

## المتغيرات البيئية المطلوبة

أضف المتغيرات التالية إلى ملف `.env.local`:

```env
MOYASAR_SECRET_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_BASE_URL=https://www.sarhy.com
```

## كيفية الحصول على مفاتيح Moyasar

1. سجل في [Moyasar](https://dashboard.moyasar.com/register)
2. انتقل إلى Settings > API Keys
3. انسخ المفتاح السري (Secret Key)
4. أضفه إلى `.env.local`

## مفاتيح الاختبار الرسمية (Test Keys)

للاختبار في بيئة التطوير، استخدم مفاتيح الاختبار من Moyasar:
- Secret Key: `pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- Publishable Key: `pk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## العملة المدعومة

- ر.س (ريال سعودي) - مطابق لمعايير البنك المركزي السعودي
- المبلغ يُرسل بالهللة (1 ر.س = 100 هللة)

## طرق الدفع المدعومة

- مدى (Mada)
- Apple Pay
- بطاقات الائتمان (Visa, Mastercard)
- STC Pay

## معايير البنك المركزي السعودي

- العملة: SAR (ريال سعودي)
- المبلغ يُرسل بالهللة (cents)
- التشفير: SSL/TLS
- التوافق: PCI DSS
