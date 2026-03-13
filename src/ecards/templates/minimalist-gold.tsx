import type { EcardProps } from "./index";

export default function MinimalistGold({ guestName, coupleName, message }: EcardProps) {
  return (
    <div className="rounded-xl border border-amber-200 bg-white p-6">
      <div className="space-y-3 text-center">
        <div className="mx-auto h-px w-12 bg-amber-300" />
        <p className="text-xs uppercase tracking-widest text-amber-400">
          {coupleName}
        </p>
        <p className="text-lg text-gray-800">
          {message || "Cheers to your next adventure together."}
        </p>
        <div className="mx-auto h-px w-12 bg-amber-300" />
        <p className="text-sm text-amber-500">{guestName}</p>
      </div>
    </div>
  );
}
