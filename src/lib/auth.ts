import { cookies } from "next/headers";
import { auth } from "../../auth";

const ADMIN_COOKIE = "honeymoon-admin-auth";

export function isSsoEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ADMIN_SSO_ENABLED === "true";
}

async function hashPassword(input: string): Promise<string> {
  const encoded = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyAdminAuth(): Promise<boolean> {
  if (isSsoEnabled()) {
    const session = await auth();
    if (!session?.user?.email) return false;
    const allowedEmails = (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    return allowedEmails.includes(session.user.email.toLowerCase());
  }

  // Password mode
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return token === process.env.ADMIN_PASSWORD_HASH;
}

export async function verifyPassword(password: string): Promise<boolean> {
  const hashed = await hashPassword(password);
  return hashed === process.env.ADMIN_PASSWORD_HASH;
}

export function getAdminCookieName(): string {
  return ADMIN_COOKIE;
}
