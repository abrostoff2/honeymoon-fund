import ContributionTable from "@/components/admin/ContributionTable";

export default function ContributionsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Contributions</h1>
      <ContributionTable />
    </div>
  );
}
