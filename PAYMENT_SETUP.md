# إعداد بوابة الدفع Paylink

## المتغيرات البيئية المطلوبة

أضف المتغيرات التالية إلى ملف `.env`:

```env
PAYLINK_SECRET_KEY=your_paylink_secret_key_here
PAYLINK_APP_ID=your_paylink_app_id_here
NEXT_PUBLIC_BASE_URL=https://www.sarhy.com
```

## كيفية الحصول على مفاتيح Paylink

1. سجل في [Paylink](https://paylink.sa/)
2. انتقل إلى Settings > API Keys
3. انسخ المفتاح السري (Secret Key) ومعرف التطبيق (App ID)
4. أضفهما إلى `.env`

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
