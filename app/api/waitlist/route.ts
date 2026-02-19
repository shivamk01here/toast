import { NextRequest, NextResponse } from "next/server";
import { saveWaitlistEmail } from "@/lib/storage";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    saveWaitlistEmail(email);

    // Send Telegram Notification (Fire & Forget)
    sendTelegramNotification(`🚀 <b>New Waitlist Signup</b>\n\n📧 ${email}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
