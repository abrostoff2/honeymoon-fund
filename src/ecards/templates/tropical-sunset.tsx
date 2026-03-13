import type { EcardProps } from "./index";

export default function TropicalSunset({ guestName, coupleName, message }: EcardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-orange-100 via-amber-50 to-cyan-100 p-6">
      <div className="absolute right-3 top-2 text-4xl opacity-30">🌴</div>
      <div className="absolute bottom-2 left-3 text-3xl opacity-30">🌊</div>
      <div className="relative space-y-3 text-center">
        <p className="text-xs uppercase tracking-widest text-amber-500">
          For {coupleName}
        </p>
        <p className="font-serif text-lg text-amber-900">
          {message || "Here's to sunsets, adventures, and your new journey together!"}
        </p>
        <p className="text-sm text-amber-600">— {guestName}</p>
      </div>
    </div>
  );
}
