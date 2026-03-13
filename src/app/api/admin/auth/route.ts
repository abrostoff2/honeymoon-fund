import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth, verifyPassword, getAdminCookieName, isSsoEnabled } from "@/lib/auth";

export async function GET() {
  const isAdmin = await verifyAdminAuth();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}

export async function POST(request: NextRequest) {
  if (isSsoEnabled()) {
    return NextResponse.json({ error: "Use SSO to sign in" }, { status: 400 });
  }

  const { password } = await request.json();
  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const valid = await verifyPassword(password);
  if (!valid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(getAdminCookieName(), process.env.ADMIN_PASSWORD_HASH!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(getAdminCookieName());
  return response;
}
