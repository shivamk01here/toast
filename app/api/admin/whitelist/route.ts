export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getWhitelistedIPs, saveWhitelistedIPs } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const { password, ip } = await req.json();

    if (!password || !ip) {
      return NextResponse.json({ error: "Missing password or IP" }, { status: 400 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "Server missing ADMIN_PASSWORD config." }, { status: 500 });
    }

    if (password !== adminPassword) {
      return NextResponse.json({ error: "Unauthorized. Incorrect password." }, { status: 401 });
    }

    const currentIPs = await getWhitelistedIPs();

    if (currentIPs.includes(ip)) {
      return NextResponse.json({ message: "IP is already whitelisted." });
    }

    currentIPs.push(ip);
    await saveWhitelistedIPs(currentIPs);

    return NextResponse.json({ success: true, message: `IP ${ip} successfully whitelisted.` });

  } catch (error) {
    console.error("Admin Whitelist API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
