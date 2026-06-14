import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { buyer_name, buyer_email, buyer_phone, items, total } = body

    // Validate Moyasar API key
    const moyasarApiKey = process.env.MOYASAR_SECRET_KEY
    if (!moyasarApiKey) {
      return NextResponse.json(
        { error: "Moyasar API key not configured" },
        { status: 500 }
      )
    }

    // Create payment with Moyasar
    const moyasarResponse = await fetch("https://api.moyasar.com/v1/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${moyasarApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(total * 100), // Convert to halalas (cents)
        currency: "SAR",
        description: "Order payment",
        metadata: {
          buyer_name,
          buyer_email,
          buyer_phone,
          order_id: Date.now().toString(),
        },
        callback_url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://www.sarhy.com"}/checkout/callback`,
        source: {
          type: "creditcard",
        },
      }),
    })

    const moyasarData = await moyasarResponse.json()

    if (!moyasarResponse.ok) {
      console.error("Moyasar error:", moyasarData)
      return NextResponse.json(
        { error: "Failed to create Moyasar payment" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      paymentId: moyasarData.id,
      url: moyasarData.url,
    })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    )
  }
}
