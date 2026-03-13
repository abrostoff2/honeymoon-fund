"use client";

import { useState } from "react";
import { config } from "@/config";
import ProgressBar from "./ProgressBar";
import PaymentOptions from "./PaymentOptions";

export default function FundCard() {
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"amount" | "payment">("amount");

  const presetAmounts = [50, 100, 150, 250];

  function handleContinue() {
    if (amount && Number(amount) > 0) {
      setStep("payment");
    }
  }

  function handleBack() {
    setStep("amount");
  }

  return (
    <section className="animate-fade-in-delay mx-auto max-w-md px-4 pb-12">
      <div className="rounded-2xl border border-[#2C2C2C]/5 bg-white p-8 shadow-sm">
        <h2
          className="mb-2 text-center font-serif text-2xl"
          style={{ color: config.theme.primaryColor }}
        >
          {config.fund.title}
        </h2>
        <p className="mb-6 text-center text-sm text-[#2C2C2C]/60">
          {config.fund.description}
        </p>

        <ProgressBar />

        {step === "amount" ? (
          <div className="space-y-4">
            {/* Preset amounts */}
            <div className="grid grid-cols-4 gap-2">
              {presetAmounts.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(String(preset))}
                  className={`cursor-pointer rounded-lg border py-2 text-sm font-medium transition-colors ${
                    amount === String(preset)
                      ? "border-[#2D8B6E] bg-[#2D8B6E]/10 text-[#2D8B6E]"
                      : "border-[#2C2C2C]/10 text-[#2C2C2C]/70 hover:border-[#2C2C2C]/30"
                  }`}
                >
                  ${preset}
                </button>
              ))}
            </div>

            {/* Custom amount input */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[#2C2C2C]/40">
                $
              </span>
              <input
                type="number"
                inputMode="numeric"
                placeholder="Other amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleContinue()}
                className="w-full rounded-lg border border-[#2C2C2C]/10 py-3 pl-9 pr-4 text-lg text-[#2C2C2C] placeholder-[#2C2C2C]/30 outline-none focus:border-[#2D8B6E] focus:ring-1 focus:ring-[#2D8B6E]"
                min="1"
              />
            </div>

            {/* Continue button */}
            <button
              onClick={handleContinue}
              disabled={!amount || Number(amount) <= 0}
              className="w-full cursor-pointer rounded-lg px-6 py-4 text-center font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Amount summary with back button */}
            <div className="flex items-center justify-between rounded-lg bg-[#2C2C2C]/5 px-4 py-3">
              <div>
                <div className="text-xs text-[#2C2C2C]/50">Gift amount</div>
                <div className="text-lg font-semibold text-[#2C2C2C]">
                  ${Number(amount).toLocaleString()}
                </div>
              </div>
              <button
                onClick={handleBack}
                className="cursor-pointer text-sm font-medium hover:underline"
                style={{ color: config.theme.primaryColor }}
              >
                Change
              </button>
            </div>

            <p className="text-center text-sm text-[#2C2C2C]/60">
              Choose how you&apos;d like to pay
            </p>

            <PaymentOptions amount={Number(amount)} />
          </div>
        )}
      </div>
    </section>
  );
}
