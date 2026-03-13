import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/auth";
import { getAllSettings, setSettings } from "@/lib/settings";

export async function GET() {
  const isAdmin = await verifyAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const settings = await getAllSettings();
  return NextResponse.json(settings);
}

export async function PATCH(request: NextRequest) {
  const isAdmin = await verifyAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  await setSettings(body);
  const settings = await getAllSettings();
  return NextResponse.json(settings);
}
