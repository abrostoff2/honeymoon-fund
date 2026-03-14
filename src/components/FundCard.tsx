"use client";

import { useState } from "react";
import { config } from "@/config";
import { useSiteSettings } from "./SiteSettingsProvider";
import ProgressBar from "./ProgressBar";
import FundItemGrid from "./FundItemGrid";
import GuestInfoForm from "./GuestInfoForm";
import EcardPicker from "./EcardPicker";
import PaymentInstructions from "./PaymentInstructions";

type Step = "items" | "amount" | "info" | "ecard" | "instructions";

interface SelectedFundItem {
  id: string;
  title: string;
  goalAmount: number | null;
  raised: number;
}

interface GuestData {
  name: string;
  email: string;
  amount: number;
  message: string;
  paymentMethod: string;
  ecardTemplate: string | null;
  ecardMessage: string;
  contributionId: string | null;
  fundItem: SelectedFundItem | null;
}

export default function FundCard() {
  const settings = useSiteSettings();
  const [step, setStep] = useState<Step>(settings.fundItemsEnabled ? "items" : "amount");
  const [amountInput, setAmountInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [guest, setGuest] = useState<GuestData>({
    name: "",
    email: "",
    amount: 0,
    message: "",
    paymentMethod: "",
    ecardTemplate: null,
    ecardMessage: "",
    contributionId: null,
    fundItem: null,
  });

  const presetAmounts = [50, 100, 150, 250];

  function handleFundItemSelect(item: { id: string; title: string; goalAmount: number | null; raised: number }) {
    setGuest((g) => ({
      ...g,
      fundItem: { id: item.id, title: item.title, goalAmount: item.goalAmount, raised: item.raised },
    }));
    setStep("amount");
  }

  function handleGeneralFund() {
    setGuest((g) => ({ ...g, fundItem: null }));
    setStep("amount");
  }

  function handleAmountContinue() {
    const amt = Number(amountInput);
    if (amt > 0) {
      setGuest((g) => ({ ...g, amount: amt }));
      setStep("info");
    }
  }

  function handleInfoSubmit() {
    setStep("ecard");
  }

  async function handleEcardContinue() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: guest.name,
          guestEmail: guest.email,
          amount: guest.amount,
          message: guest.message || null,
          paymentMethod: guest.paymentMethod,
          ecardTemplate: guest.ecardTemplate,
          ecardMessage: guest.ecardMessage || null,
          fundItemId: guest.fundItem?.id || null,
        }),
      });

      if (res.ok) {
        const contribution = await res.json();
        setGuest((g) => ({ ...g, contributionId: contribution.id }));
        setStep("instructions");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const fundItemLabel = guest.fundItem?.title ?? "General Fund";

  return (
    <section className="animate-fade-in-delay mx-auto max-w-md px-4 pb-12">
      <div className="rounded-2xl border border-[#2C2C2C]/5 bg-white p-8 shadow-sm">
        <h2
          className="mb-2 text-center font-serif text-2xl"
          style={{ color: config.theme.primaryColor }}
        >
          {settings.fundTitle}
        </h2>
        <p className="mb-6 text-center text-sm text-[#2C2C2C]/60">
          {settings.fundDescription}
        </p>

        <ProgressBar />

        {step === "items" && (
          <FundItemGrid
            onSelect={handleFundItemSelect}
            onSkip={handleGeneralFund}
          />
        )}

        {step === "amount" && (
          <div className="space-y-4">
            {guest.fundItem && (
              <div className="flex items-center justify-between rounded-lg bg-[#2C2C2C]/5 px-4 py-3">
                <div>
                  <div className="text-xs text-[#2C2C2C]/50">Contributing to</div>
                  <div className="text-sm font-medium text-[#2C2C2C]">
                    {guest.fundItem.title}
                  </div>
                </div>
                <button
                  onClick={() => setStep("items")}
                  className="cursor-pointer text-sm font-medium hover:underline"
                  style={{ color: config.theme.primaryColor }}
                >
                  Change
                </button>
              </div>
            )}

            <div className="grid grid-cols-4 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmountInput(String(preset))}
                  className={`cursor-pointer rounded-lg border py-2 text-sm font-medium transition-colors ${
                    amountInput === String(preset)
                      ? "border-[#2D8B6E] bg-[#2D8B6E]/10 text-[#2D8B6E]"
                      : "border-[#2C2C2C]/10 text-[#2C2C2C]/70 hover:border-[#2C2C2C]/30"
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#2C2C2C]/40">
                $
              </span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Other amount"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAmountContinue()}
                className="w-full rounded-lg border border-[#2C2C2C]/10 py-3 pl-9 pr-4 text-lg text-[#2C2C2C] placeholder-[#2C2C2C]/30 outline-none focus:border-[#2D8B6E] focus:ring-1 focus:ring-[#2D8B6E]"
                min="1"
              />
            </div>

            <button
              onClick={handleAmountContinue}
              disabled={!amountInput || Number(amountInput) <= 0}
              className="w-full cursor-pointer rounded-lg px-6 py-4 text-center font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              Continue
            </button>

            {!guest.fundItem && settings.fundItemsEnabled && (
              <button
                onClick={() => setStep("items")}
                className="w-full cursor-pointer text-center text-xs text-[#2C2C2C]/40 hover:text-[#2C2C2C]/60"
              >
                &larr; Back to experiences
              </button>
            )}
          </div>
        )}

        {step === "info" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-[#2C2C2C]/5 px-4 py-3">
              <div>
                <div className="text-xs text-[#2C2C2C]/50">
                  Gift amount{guest.fundItem ? ` — ${guest.fundItem.title}` : ""}
                </div>
                <div className="text-lg font-semibold text-[#2C2C2C]">
                  ${guest.amount.toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => setStep("amount")}
                className="cursor-pointer text-sm font-medium hover:underline"
                style={{ color: config.theme.primaryColor }}
              >
                Change
              </button>
            </div>

            <GuestInfoForm
              name={guest.name}
              email={guest.email}
              message={guest.message}
              paymentMethod={guest.paymentMethod}
              onNameChange={(v) => setGuest((g) => ({ ...g, name: v }))}
              onEmailChange={(v) => setGuest((g) => ({ ...g, email: v }))}
              onMessageChange={(v) => setGuest((g) => ({ ...g, message: v }))}
              onPaymentMethodChange={(v) =>
                setGuest((g) => ({ ...g, paymentMethod: v }))
              }
              onSubmit={handleInfoSubmit}
              onBack={() => setStep("amount")}
              submitting={false}
            />
          </div>
        )}

        {step === "ecard" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-[#2C2C2C]/5 px-4 py-3">
              <div>
                <div className="text-xs text-[#2C2C2C]/50">
                  ${guest.amount.toLocaleString()} from {guest.name}
                  {guest.fundItem ? ` — ${guest.fundItem.title}` : ""}
                </div>
                <div className="text-sm text-[#2C2C2C]/60">
                  via{" "}
                  {guest.paymentMethod === "venmo"
                    ? "Venmo"
                    : guest.paymentMethod === "zelle"
                      ? "Zelle"
                      : "Cash App"}
                </div>
              </div>
            </div>

            <EcardPicker
              selected={guest.ecardTemplate}
              ecardMessage={guest.ecardMessage}
              guestName={guest.name}
              onSelect={(id) =>
                setGuest((g) => ({ ...g, ecardTemplate: id }))
              }
              onMessageChange={(msg) =>
                setGuest((g) => ({ ...g, ecardMessage: msg }))
              }
              onContinue={handleEcardContinue}
              onBack={() => setStep("info")}
            />

            {submitting && (
              <div className="text-center text-sm text-[#2C2C2C]/50">
                Saving your contribution...
              </div>
            )}
          </div>
        )}

        {step === "instructions" && (
          <PaymentInstructions
            amount={guest.amount}
            paymentMethod={guest.paymentMethod}
            guestName={guest.name}
            fundItemTitle={guest.fundItem?.title ?? null}
          />
        )}
      </div>
    </section>
  );
}
