'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface PaymentButtonProps {
  orderId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export default function PaymentButton({ orderId, onSuccess, onError }: PaymentButtonProps) {
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    setProcessing(true);

    try {
      const supabase = createClient();

      // جلب بيانات الطلب من قاعدة البيانات
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select('id, total_halalas')
        .eq('id', orderId)
        .single();

      if (orderError || !order) {
        throw new Error(orderError?.message || 'Failed to fetch order');
      }

      // استدعاء API لإنشاء طلب دفع في Tap
      const response = await fetch('/api/payment/create-charge', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: order.total_halalas,
          order_id: order.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment');
      }

      const { url } = await response.json();

      // التوجيه لصفحة الدفع
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      if (onError) {
        onError(error as Error);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={processing}
      className="w-full h-12 rounded-xl gap-2"
    >
      {processing ? 'جاري المعالجة...' : 'إتمام الدفع'}
    </Button>
  );
}
