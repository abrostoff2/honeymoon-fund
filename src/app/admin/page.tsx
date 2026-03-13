import FundOverview from "@/components/admin/FundOverview";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
      <FundOverview />
    </div>
  );
}
