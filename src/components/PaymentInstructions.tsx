"use client";

import { config } from "@/config";
import { useSiteSettings } from "./SiteSettingsProvider";

function buildVenmoAppUrl(amount: number, handle: string): string {
  const note = config.payments.venmo.note ?? "Honeymoon Fund";
  const cleanHandle = handle.replace("@", "");
  const encodedNote = encodeURIComponent(note);
  return `venmo://paycharge?txn=pay&recipients=${cleanHandle}&amount=${amount}&note=${encodedNote}`;
}

function buildVenmoWebUrl(amount: number, handle: string): string {
  const note = config.payments.venmo.note ?? "Honeymoon Fund";
  const cleanHandle = handle.replace("@", "");
  const encodedNote = encodeURIComponent(note);
  return `https://account.venmo.com/${cleanHandle}?txn=pay&amount=${amount}&note=${encodedNote}`;
}

function buildCashAppUrl(amount: number, handle: string): string {
  const cleanHandle = handle.replace("$", "");
  return `https://cash.app/$${cleanHandle}/${amount}`;
}

function handleVenmoClick(amount: number, handle: string) {
  const appUrl = buildVenmoAppUrl(amount, handle);
  const webUrl = buildVenmoWebUrl(amount, handle);
  const start = Date.now();
  window.location.href = appUrl;
  setTimeout(() => {
    if (Date.now() - start < 2000) {
      window.open(webUrl, "_blank");
    }
  }, 1500);
}

interface PaymentInstructionsProps {
  amount: number;
  paymentMethod: string;
  guestName: string;
  fundItemTitle?: string | null;
}

export default function PaymentInstructions({
  amount,
  paymentMethod,
  guestName,
  fundItemTitle,
}: PaymentInstructionsProps) {
  const settings = useSiteSettings();

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="mb-1 text-sm text-[#2C2C2C]/50">
          Thank you, {guestName}!
          {fundItemTitle && (
            <span className="block text-xs text-[#2C2C2C]/40">
              Contributing to: {fundItemTitle}
            </span>
          )}
        </div>
        <div className="text-lg font-semibold text-[#2C2C2C]">
          Send ${amount.toLocaleString()} via{" "}
          {paymentMethod === "venmo"
            ? "Venmo"
            : paymentMethod === "zelle"
              ? "Zelle"
              : "Cash App"}
        </div>
      </div>

      <div className="rounded-lg border border-[#2D8B6E]/20 bg-[#2D8B6E]/5 p-4">
        {paymentMethod === "venmo" && (
          <div className="space-y-3 text-center">
            <p className="text-sm font-medium" style={{ color: "#2D8B6E" }}>
              Send to @{settings.payments.venmo.handle}
            </p>
            <button
              onClick={() => handleVenmoClick(amount, settings.payments.venmo.handle)}
              className="w-full cursor-pointer rounded-lg bg-[#2D8B6E] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Open Venmo
            </button>
          </div>
        )}

        {paymentMethod === "zelle" && (
          <div className="text-center">
            <p className="text-sm font-medium" style={{ color: "#2D8B6E" }}>
              Send to this email via Zelle
            </p>
            <div className="mt-2 font-mono text-lg text-[#2C2C2C]">
              {settings.payments.zelle.email}
            </div>
          </div>
        )}

        {paymentMethod === "cashapp" && (
          <div className="space-y-3 text-center">
            <p className="text-sm font-medium" style={{ color: "#2D8B6E" }}>
              Send to ${settings.payments.cashapp.handle}
            </p>
            <a
              href={buildCashAppUrl(amount, settings.payments.cashapp.handle)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full rounded-lg bg-[#2D8B6E] px-6 py-3 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Open Cash App
            </a>
          </div>
        )}

      </div>

      <p className="text-center text-xs text-[#2C2C2C]/40">
        When you complete your gift, confirm you see{" "}
        <strong className="text-[#2C2C2C]/60">{settings.coupleName}</strong> on
        the payment screen.
      </p>

      <p className="text-center text-xs text-[#2C2C2C]/40">
        Your contribution has been recorded. {settings.coupleName.split(" & ")[0]}{" "}
        &amp; {settings.coupleName.split(" & ")[1]} will be notified!
      </p>
    </div>
  );
}
