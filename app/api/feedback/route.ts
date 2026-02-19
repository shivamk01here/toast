import { NextRequest, NextResponse } from "next/server";
import { saveFeedback } from "@/lib/storage";
import { sendTelegramNotification } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { vibe, characterRequest, feedbackText, email } = body;

    saveFeedback(body);

    // Send Telegram Notification (Fire & Forget)
    const message = `📝 <b>New Feedback Received</b>\n\n` +
      `🎭 <b>Vibe Check:</b> ${vibe || 'N/A'}\n` +
      `🦸 <b>Character Request:</b> ${characterRequest || 'N/A'}\n` +
      `💬 <b>Feedback:</b> ${feedbackText || 'N/A'}\n` +
      `📧 <b>Email:</b> ${email || 'Anonymous'}`;
      
    sendTelegramNotification(message);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
