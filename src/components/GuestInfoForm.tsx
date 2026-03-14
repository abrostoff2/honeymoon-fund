"use client";

import { config } from "@/config";
import { useSiteSettings } from "./SiteSettingsProvider";

interface GuestInfoFormProps {
  name: string;
  email: string;
  message: string;
  paymentMethod: string;
  onNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onMessageChange: (v: string) => void;
  onPaymentMethodChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}

function usePaymentMethods() {
  const settings = useSiteSettings();
  return [
    { key: "venmo", label: "Venmo", enabled: settings.payments.venmo.enabled },
    { key: "zelle", label: "Zelle", enabled: settings.payments.zelle.enabled },
    { key: "cashapp", label: "Cash App", enabled: settings.payments.cashapp.enabled },
  ];
}

export default function GuestInfoForm({
  name,
  email,
  message,
  paymentMethod,
  onNameChange,
  onEmailChange,
  onMessageChange,
  onPaymentMethodChange,
  onSubmit,
  onBack,
  submitting,
}: GuestInfoFormProps) {
  const paymentMethods = usePaymentMethods();
  const enabledMethods = paymentMethods.filter((m) => m.enabled);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="cursor-pointer text-sm text-[#2C2C2C]/50 hover:text-[#2C2C2C]/80"
      >
        &larr; Back
      </button>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#2C2C2C]/70">
          Your name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          required
          className="w-full rounded-lg border border-[#2C2C2C]/10 px-4 py-3 text-[#2C2C2C] outline-none focus:border-[#2D8B6E] focus:ring-1 focus:ring-[#2D8B6E]"
          placeholder="Jane Smith"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#2C2C2C]/70">
          Your email *
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          className="w-full rounded-lg border border-[#2C2C2C]/10 px-4 py-3 text-[#2C2C2C] outline-none focus:border-[#2D8B6E] focus:ring-1 focus:ring-[#2D8B6E]"
          placeholder="jane@example.com"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#2C2C2C]/70">
          Personal message (optional)
        </label>
        <textarea
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-lg border border-[#2C2C2C]/10 px-4 py-3 text-[#2C2C2C] outline-none focus:border-[#2D8B6E] focus:ring-1 focus:ring-[#2D8B6E]"
          placeholder="Congratulations! Have an amazing trip..."
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#2C2C2C]/70">
          How will you pay? *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {enabledMethods.map((method) => (
            <button
              key={method.key}
              type="button"
              onClick={() => onPaymentMethodChange(method.key)}
              className={`cursor-pointer rounded-lg border py-2 text-sm font-medium transition-colors ${
                paymentMethod === method.key
                  ? "border-[#2D8B6E] bg-[#2D8B6E]/10 text-[#2D8B6E]"
                  : "border-[#2C2C2C]/10 text-[#2C2C2C]/70 hover:border-[#2C2C2C]/30"
              }`}
            >
              {method.label}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!name || !email || !paymentMethod || submitting}
        className="w-full cursor-pointer rounded-lg px-6 py-4 text-center font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ backgroundColor: config.theme.primaryColor }}
      >
        {submitting ? "Submitting..." : "Continue"}
      </button>
    </form>
  );
}
