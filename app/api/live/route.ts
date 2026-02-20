export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/storage";

export async function GET() {
  try {
    const analytics = await getAnalyticsData();
    
    // Safety check: Filter out sensitive information (like exact sessions or emails if they somehow ended up in events)
    // We only need country for active users, and type/country/time for recent events
    
    const activeCountries = analytics.activeUsersList.reduce((acc: any, user: any) => {
      const country = user.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    // Get last 20 events, strip PII (email, waitlist data etc if accidentally present)
    const recentActivities = analytics.events
      .slice(-20)
      .reverse()
      .map((event: any) => ({
        type: event.type,
        timestamp: event.timestamp,
        persona: event.data?.persona,
        mode: event.data?.mode,
        country: event.data?.country
      }));

    return NextResponse.json({
      activeUsers: analytics.activeUsers,
      activeCountries,
      recentActivities
    });

  } catch (error) {
    console.error("Live API Error:", error);
    return NextResponse.json({ error: "Failed to fetch live stats" }, { status: 500 });
  }
}
