import type { EcardProps } from "./index";

export default function WatercolorBlue({ guestName, coupleName, message }: EcardProps) {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 p-6">
      <div className="absolute -right-2 top-0 h-24 w-24 rounded-full bg-blue-200/30 blur-xl" />
      <div className="absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-sky-200/40 blur-lg" />
      <div className="relative space-y-3 text-center">
        <p className="text-xs uppercase tracking-widest text-blue-400">
          For {coupleName}
        </p>
        <p className="font-serif text-lg text-blue-900">
          {message || "May your journey together be as beautiful as you both are."}
        </p>
        <p className="text-sm text-blue-500">Love, {guestName}</p>
      </div>
    </div>
  );
}
