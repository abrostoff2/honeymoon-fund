"use client";

import { config } from "@/config";

function buildVenmoUrl(): string {
  const { handle, note } = config.payments.venmo;
  const cleanHandle = handle?.replace("@", "") ?? "";
  const encodedNote = encodeURIComponent(note ?? "Honeymoon Fund");
  return `https://venmo.com/${cleanHandle}?txn=pay&note=${encodedNote}`;
}

function buildCashAppUrl(): string {
  const { handle } = config.payments.cashapp;
  const cleanHandle = handle?.replace("$", "") ?? "";
  return `https://cash.app/$${cleanHandle}`;
}

function getP2pMethods(): { name: string; url?: string; display?: string }[] {
  const methods: { name: string; url?: string; display?: string }[] = [];

  if (config.payments.venmo.enabled) {
    methods.push({ name: "Venmo", url: buildVenmoUrl() });
  }
  if (config.payments.cashapp.enabled) {
    methods.push({ name: "Cash App", url: buildCashAppUrl() });
  }
  if (config.payments.zelle.enabled) {
    methods.push({
      name: "Zelle",
      display: config.payments.zelle.email,
    });
  }

  return methods;
}

export default function PaymentOptions() {
  const p2pMethods = getP2pMethods();
  const stripeEnabled = config.payments.stripe.enabled;
  const hasAnyPayment = p2pMethods.length > 0 || stripeEnabled;

  if (!hasAnyPayment) return null;

  return (
    <div className="space-y-3">
      {/* P2P buttons */}
      {p2pMethods.map((method) =>
        method.url ? (
          <a
            key={method.name}
            href={method.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-lg px-6 py-4 text-center text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#2D8B6E" }}
          >
            <div>
              <div className="font-medium">
                Gift via {method.name}
              </div>
              <div className="text-xs text-white/70">No fees</div>
            </div>
          </a>
        ) : (
          <div
            key={method.name}
            className="rounded-lg border border-[#2D8B6E]/20 bg-[#2D8B6E]/5 px-6 py-4 text-center"
          >
            <div className="text-sm font-medium" style={{ color: "#2D8B6E" }}>
              Gift via {method.name}
            </div>
            <div className="mt-1 font-mono text-lg text-[#2C2C2C]">
              {method.display}
            </div>
            <div className="mt-1 text-xs text-[#2C2C2C]/50">No fees</div>
          </div>
        )
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
