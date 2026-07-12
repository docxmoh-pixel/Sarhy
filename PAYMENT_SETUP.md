# إعداد بوابة الدفع Tap (goSell)

## المتغيرات البيئية المطلوبة

أضف المتغيرات التالية إلى ملف `.env`:

```env
TAP_SECRET_KEY=your_tap_secret_key_here
NEXT_PUBLIC_TAP_PUBLIC_KEY=your_tap_public_key_here
NEXT_PUBLIC_BASE_URL=https://www.sarhy.com
```

## كيفية الحصول على مفاتيح Tap

1. سجل في [Tap Payments](https://www.tap.company/sa/en/signup)
2. انتقل إلى Settings > API Keys
3. انسخ المفتاح السري (Secret Key) والمفتاح العام (Public Key)
4. أضفهما إلى `.env`

## العملة المدعومة

- ر.س (ريال سعودي) - مطابق لمعايير البنك المركزي السعودي
- المبلغ يُرسل بالهللة (1 ر.س = 100 هللة)

## طرق الدفع المدعومة

- مدى (Mada)
- Apple Pay
- بطاقات الائتمان (Visa, Mastercard)
- STC Pay
- KNET

## معايير البنك المركزي السعودي

- العملة: SAR (ريال سعودي)
- المبلغ يُرسل بالهللة (cents)
- التشفير: SSL/TLS
- التوافق: PCI DSS
