import { config } from "@/config";
import ProgressBar from "./ProgressBar";
import PaymentOptions from "./PaymentOptions";

export default function FundCard() {
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
        <PaymentOptions />
      </div>
    </section>
  );
}
