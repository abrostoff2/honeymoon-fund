"use client";

import { config } from "@/config";

function buildVenmoAppUrl(): string {
  const { handle, note } = config.payments.venmo;
  const cleanHandle = handle?.replace("@", "") ?? "";
  const encodedNote = encodeURIComponent(note ?? "Honeymoon Fund");
  return `venmo://paycharge?txn=pay&recipients=${cleanHandle}&note=${encodedNote}`;
}

function buildVenmoWebUrl(): string {
  const { handle, note } = config.payments.venmo;
  const cleanHandle = handle?.replace("@", "") ?? "";
  const encodedNote = encodeURIComponent(note ?? "Honeymoon Fund");
  return `https://account.venmo.com/${cleanHandle}?txn=pay&note=${encodedNote}`;
}

function buildCashAppUrl(): string {
  const { handle } = config.payments.cashapp;
  const cleanHandle = handle?.replace("$", "") ?? "";
  return `https://cash.app/$${cleanHandle}`;
}

function handleVenmoClick() {
  const appUrl = buildVenmoAppUrl();
  const webUrl = buildVenmoWebUrl();

  // Try to open the app; fall back to web after a short timeout
  const start = Date.now();
  window.location.href = appUrl;
  setTimeout(() => {
    // If we're still here after 1.5s, the app didn't open — go to web
    if (Date.now() - start < 2000) {
      window.open(webUrl, "_blank");
    }
  }, 1500);
}

export default function PaymentOptions() {
  const venmoEnabled = config.payments.venmo.enabled;
  const cashappEnabled = config.payments.cashapp.enabled;
  const zelleEnabled = config.payments.zelle.enabled;
  const stripeEnabled = config.payments.stripe.enabled;
  const hasAnyPayment = venmoEnabled || cashappEnabled || zelleEnabled || stripeEnabled;

  if (!hasAnyPayment) return null;

  return (
    <div className="space-y-3">
      {/* Venmo */}
      {venmoEnabled && (
        <button
          onClick={handleVenmoClick}
          className="flex w-full cursor-pointer items-center justify-center rounded-lg px-6 py-4 text-center text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#2D8B6E" }}
        >
          <div>
            <div className="font-medium">Gift via Venmo</div>
            <div className="text-xs text-white/70">No fees</div>
          </div>
        </button>
      )}

      {/* Cash App */}
      {cashappEnabled && (
        <a
          href={buildCashAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-lg px-6 py-4 text-center text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#2D8B6E" }}
        >
          <div>
            <div className="font-medium">Gift via Cash App</div>
            <div className="text-xs text-white/70">No fees</div>
          </div>
        </a>
      )}

      {/* Zelle */}
      {zelleEnabled && (
        <div className="rounded-lg border border-[#2D8B6E]/20 bg-[#2D8B6E]/5 px-6 py-4 text-center">
          <div className="text-sm font-medium" style={{ color: "#2D8B6E" }}>
            Gift via Zelle
          </div>
          <div className="mt-1 font-mono text-lg text-[#2C2C2C]">
            {config.payments.zelle.email}
          </div>
          <div className="mt-1 text-xs text-[#2C2C2C]/50">No fees</div>
        </div>
      )}

      {/* Stripe button */}
      {stripeEnabled && (
        <a
          href={config.payments.stripe.paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center rounded-lg px-6 py-4 text-center text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#3C3C3C" }}
        >
          <div>
            <div className="font-medium">
              Gift with Card / Apple Pay
            </div>
            <div className="text-xs text-white/70">~3% processing fee</div>
          </div>
        </a>
      )}

      {/* Verification note */}
      <p className="pt-2 text-center text-xs text-[#2C2C2C]/40">
        When you complete your gift, confirm you see{" "}
        <strong className="text-[#2C2C2C]/60">{config.coupleName}</strong> on
        the payment screen.
      </p>
    </div>
  );
}
