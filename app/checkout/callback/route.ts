import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const paymentId = searchParams.get("id")
    const status = searchParams.get("status")

    if (!paymentId) {
      return NextResponse.redirect(new URL("/checkout?error=missing_payment_id", req.url))
    }

    // Verify payment with Moyasar
    const moyasarApiKey = process.env.MOYASAR_SECRET_KEY
    if (!moyasarApiKey) {
      return NextResponse.redirect(new URL("/checkout?error=missing_api_key", req.url))
    }

    const moyasarResponse = await fetch(`https://api.moyasar.com/v1/payments/${paymentId}`, {
      headers: {
        "Authorization": `Bearer ${moyasarApiKey}`,
      },
    })

    const paymentData = await moyasarResponse.json()

    if (paymentData.status === "paid") {
      // Create order in Supabase
      const supabase = createClient()
      const { error } = await supabase
        .from("orders")
        .insert({
          buyer_name: paymentData.metadata.buyer_name,
          buyer_email: paymentData.metadata.buyer_email,
          buyer_phone: paymentData.metadata.buyer_phone,
          items: JSON.parse(paymentData.metadata.items || "[]"),
          total: paymentData.amount / 100, // Convert from halalas to SAR
          status: "completed",
          payment_id: paymentId,
          created_at: new Date().toISOString(),
        })

      if (error) {
        console.error("Error creating order:", error)
        return NextResponse.redirect(new URL("/checkout?error=order_creation_failed", req.url))
      }

      // Send notification to creator(s)
      if (paymentData.metadata.items) {
        const items = JSON.parse(paymentData.metadata.items)
        for (const item of items) {
          const creatorId = item.creator || item.seller_id
          if (creatorId) {
            await supabase.from("notifications").insert({
              user_id: creatorId,
              title: "تم بيع منتجك بنجاح!",
              message: `تم بيع ${item.title.ar || item.title.en} بمبلغ ${item.price * item.quantity} ر.س`,
              is_read: false,
            })
          }
        }
      }

      // Redirect to success page
      return NextResponse.redirect(new URL("/checkout/success", req.url))
    } else {
      // Payment failed or pending
      return NextResponse.redirect(new URL(`/checkout?error=payment_${paymentData.status}`, req.url))
    }
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.redirect(new URL("/checkout?error=callback_failed", req.url))
  }
}
