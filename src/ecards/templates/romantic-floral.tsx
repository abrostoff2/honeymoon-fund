import type { EcardProps } from "./index";

export default function RomanticFloral({ guestName, coupleName, message }: EcardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-pink-50 to-rose-100 p-6">
      <div className="absolute -right-4 -top-4 text-6xl opacity-20">🌸</div>
      <div className="absolute -bottom-2 -left-2 text-4xl opacity-20">🌺</div>
      <div className="relative space-y-3 text-center">
        <p className="text-xs uppercase tracking-widest text-rose-400">
          For {coupleName}
        </p>
        <p className="font-serif text-lg text-rose-800">
          {message || "Wishing you a lifetime of love and adventure!"}
        </p>
        <p className="text-sm text-rose-500">With love, {guestName}</p>
      </div>
    </div>
  );
}
