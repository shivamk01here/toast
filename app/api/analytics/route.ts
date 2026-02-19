import { NextRequest, NextResponse } from "next/server";
import { saveAnalyticsEvent, getAnalyticsData, getWaitlist, getFeedback } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (!type) {
      return NextResponse.json({ error: "Missing event type" }, { status: 400 });
    }

    saveAnalyticsEvent(type, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const analytics = getAnalyticsData();
    const waitlist = getWaitlist();
    const feedback = getFeedback();

    return NextResponse.json({
      analytics,
      waitlist,
      feedback
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
