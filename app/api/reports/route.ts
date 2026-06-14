import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { product_id, reason, description } = body

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { error } = await supabase
      .from("reports")
      .insert({
        product_id,
        reporter_id: user.id,
        reason,
        description,
        status: "pending",
        created_at: new Date().toISOString(),
      })

    if (error) throw error

    // Send notification to admin
    const { data: adminUsers } = await supabase
      .from("users")
      .select("id")
      .eq("role", "admin")

    if (adminUsers) {
      for (const admin of adminUsers) {
        await supabase.from("notifications").insert({
          user_id: admin.id,
          title: "بلاغ جديد عن منتج مخالف",
          message: `تم تقديم بلاغ جديد عن المنتج #${product_id}`,
          is_read: false,
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error creating report:", error)
    return NextResponse.json(
      { error: "Failed to create report" },
      { status: 500 }
    )
  }
}
