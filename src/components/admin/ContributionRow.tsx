"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import StatusBadge from "./StatusBadge";
import EditContributionModal from "./EditContributionModal";

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

interface ContributionRowProps {
  contribution: Contribution;
  onUpdate: () => void;
}

const INITIALS_COLORS = [
  "bg-indigo-100 text-indigo-600",
  "bg-emerald-100 text-emerald-600",
  "bg-amber-100 text-amber-600",
  "bg-rose-100 text-rose-600",
  "bg-cyan-100 text-cyan-600",
  "bg-violet-100 text-violet-600",
  "bg-orange-100 text-orange-600",
  "bg-teal-100 text-teal-600",
];

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getInitialsColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return INITIALS_COLORS[Math.abs(hash) % INITIALS_COLORS.length];
}

export default function ContributionRow({
  contribution,
  onUpdate,
}: ContributionRowProps) {
  const [showEdit, setShowEdit] = useState(false);

  const initials = getInitials(contribution.guestName);
  const color = getInitialsColor(contribution.guestName);
  const date = new Date(contribution.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${color}`}
          >
            {initials}
          </div>
          <div className="min-w-0">
            <div className="truncate font-medium text-gray-900">
              {contribution.guestName}
            </div>
            {contribution.guestEmail && (
              <div className="truncate text-sm text-gray-400">
                {contribution.guestEmail}
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-5 py-4 font-medium text-gray-900">
        ${contribution.amount.toLocaleString()}
      </td>
      <td className="px-5 py-4 text-gray-500">{date}</td>
      <td className="px-5 py-4 capitalize text-gray-600">
        {contribution.paymentMethod.replace("_", " ")}
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={contribution.status} />
      </td>
      <td className="px-5 py-4 text-right">
        <button
          onClick={() => setShowEdit(true)}
          className="cursor-pointer rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zM16.862 4.487L19.5 7.125" />
          </svg>
        </button>
      </td>
      {showEdit &&
        createPortal(
          <EditContributionModal
            contribution={contribution}
            onClose={() => setShowEdit(false)}
            onSaved={onUpdate}
          />,
          document.body
        )}
    </tr>
  );
}
