"use client";

import { useState, useEffect } from "react";
import { config } from "@/config";

const STORAGE_KEY = "honeymoon-fund-auth";

export default function PasswordGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setAuthenticated(true);
    }
  }, []);

  async function hashPassword(input: string): Promise<string> {
    const encoded = new TextEncoder().encode(input);
    const buffer = await crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const hashed = await hashPassword(password);
    if (hashed === process.env.NEXT_PUBLIC_SITE_PASSWORD_HASH) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setAuthenticated(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  }

  if (!mounted) {
    return null;
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: config.theme.backgroundColor }}
    >
      <div className="w-full max-w-sm animate-fade-in text-center">
        <h1
          className="mb-2 font-serif text-3xl tracking-tight"
          style={{ color: config.theme.primaryColor }}
        >
          {config.coupleName}
        </h1>
        <p className="mb-8 text-sm text-[#2C2C2C]/60">
          Enter the password from your invitation
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border border-[#2C2C2C]/10 bg-white px-4 py-3 text-center text-lg tracking-widest outline-none transition-colors focus:border-[#8B7355]/40 focus:ring-1 focus:ring-[#8B7355]/20"
            style={
              error ? { borderColor: "#c44", animation: "shake 0.3s ease" } : {}
            }
          />
          {error && (
            <p className="text-sm text-red-500">
              That doesn&apos;t match. Try again.
            </p>
          )}
          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: config.theme.primaryColor }}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  );
}
