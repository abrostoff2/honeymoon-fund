import type { EcardProps } from "./index";

export default function AdventureMap({ guestName, coupleName, message }: EcardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-teal-100 p-6">
      <div className="absolute right-2 top-2 text-4xl opacity-20">🧭</div>
      <div className="absolute bottom-1 left-2 text-3xl opacity-20">✈️</div>
      <div className="relative space-y-3 text-center">
        <p className="text-xs uppercase tracking-widest text-emerald-500">
          Bon Voyage, {coupleName}!
        </p>
        <p className="font-serif text-lg text-emerald-900">
          {message || "The greatest adventure is the one you take together."}
        </p>
        <p className="text-sm text-emerald-600">— {guestName}</p>
      </div>
    </div>
  );
}
