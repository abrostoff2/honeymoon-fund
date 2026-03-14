const statusStyles: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  confirmed: "border-green-200 bg-green-50 text-green-700",
  not_received: "border-red-200 bg-red-50 text-red-700",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  not_received: "Not Received",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${
        statusStyles[status] ?? "border-gray-200 bg-gray-50 text-gray-700"
      }`}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
