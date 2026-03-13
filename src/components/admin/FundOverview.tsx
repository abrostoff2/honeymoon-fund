"use client";

import { useEffect, useState } from "react";
import { config } from "@/config";

interface Stats {
  totalConfirmed: number;
  totalPending: number;
  contributionCount: number;
}

export default function FundOverview() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      const [summaryRes, contribRes] = await Promise.all([
        fetch("/api/fund-summary"),
        fetch("/api/contributions"),
      ]);
      const summary = await summaryRes.json();
      const contributions = await contribRes.json();
      setStats({
        totalConfirmed: summary.totalConfirmed,
        totalPending: summary.totalPending,
        contributionCount: Array.isArray(contributions)
          ? contributions.length
          : 0,
      });
    }
    load();
  }, []);

  if (!stats) {
    return <div className="text-sm text-gray-400">Loading...</div>;
  }

  const goal = config.fund.goalAmount;
  const progress = goal > 0 ? Math.min((stats.totalConfirmed / goal) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Confirmed</div>
          <div className="text-2xl font-semibold text-green-600">
            ${stats.totalConfirmed.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Pending</div>
          <div className="text-2xl font-semibold text-amber-600">
            ${stats.totalPending.toLocaleString()}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="text-sm text-gray-500">Total Contributions</div>
          <div className="text-2xl font-semibold text-gray-900">
            {stats.contributionCount}
          </div>
        </div>
      </div>

      {goal > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-gray-500">Progress toward goal</span>
            <span className="font-medium text-gray-900">
              ${stats.totalConfirmed.toLocaleString()} / $
              {goal.toLocaleString()}
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
