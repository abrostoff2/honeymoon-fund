"use client";

import { useEffect, useState, useCallback } from "react";
import ContributionRow from "./ContributionRow";
import AddContributionModal from "./AddContributionModal";

interface Contribution {
  id: string;
  guestName: string;
  guestEmail: string;
  amount: number;
  message: string | null;
  paymentMethod: string;
  status: string;
  ecardTemplate: string | null;
  ecardMessage: string | null;
  createdAt: string;
  notes: string | null;
  fundItem: { id: string; title: string } | null;
}

export default function ContributionTable() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/contributions");
    if (res.ok) {
      setContributions(await res.json());
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = contributions.filter((c) => {
    if (filter !== "all" && c.status !== filter) return false;
    if (search && !c.guestName.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="not_received">Not Received</option>
        </select>
        <span className="text-sm text-gray-400">
          {filtered.length} contribution{filtered.length !== 1 ? "s" : ""}
        </span>
        <div className="ml-auto">
          <button
            onClick={() => setShowAddModal(true)}
            className="cursor-pointer rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Add Contribution
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-400">
              <th className="px-5 py-3 font-medium">Guest</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Method</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="w-14 px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <ContributionRow
                key={c.id}
                contribution={c}
                onUpdate={load}
              />
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-12 text-center text-gray-400"
                >
                  No contributions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AddContributionModal
          onClose={() => setShowAddModal(false)}
          onAdded={load}
        />
      )}
    </div>
  );
}
