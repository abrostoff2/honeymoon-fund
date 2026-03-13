"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ssoEnabled = process.env.NEXT_PUBLIC_ADMIN_SSO_ENABLED === "true";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/contributions", label: "Contributions" },
  { href: "/admin/fund-items", label: "Fund Items" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav() {
  const pathname = usePathname();

  async function handleLogout() {
    if (ssoEnabled) {
      window.location.href = "/api/auth/signout";
    } else {
      await fetch("/api/admin/auth", { method: "DELETE" });
      window.location.href = "/admin";
    }
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-sm font-semibold text-gray-900">
            Honeymoon Fund
          </span>
          <div className="flex gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  pathname === link.href
                    ? "font-medium text-gray-900"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="cursor-pointer text-sm text-gray-500 hover:text-gray-900"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}
