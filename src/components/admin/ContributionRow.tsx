"use client";

import { useState } from "react";
import StatusBadge from "./StatusBadge";

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

export default function ContributionRow({
  contribution,
  onUpdate,
}: ContributionRowProps) {
  const [loading, setLoading] = useState("");

  async function updateStatus(status: string) {
    setLoading(status);
    await fetch(`/api/contributions/${contribution.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLoading("");
    onUpdate();
  }

  async function nudge() {
    setLoading("nudge");
    await fetch(`/api/contributions/${contribution.id}/nudge`, {
      method: "POST",
    });
    setLoading("");
    alert("Reminder sent!");
  }

  async function handleDelete() {
    if (!confirm(`Delete contribution from ${contribution.guestName} ($${contribution.amount})?`)) return;
    setLoading("delete");
    await fetch(`/api/contributions/${contribution.id}`, {
      method: "DELETE",
    });
    setLoading("");
    onUpdate();
  }

  const date = new Date(contribution.createdAt).toLocaleDateString();

  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="px-4 py-3">
        <div className="truncate font-medium text-gray-900">
          {contribution.guestName}
        </div>
        <div className="truncate text-xs text-gray-400">{contribution.guestEmail}</div>
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900">
          ${contribution.amount.toLocaleString()}
        </div>
        {contribution.fundItem && (
          <div className="truncate text-xs text-gray-400">
            {contribution.fundItem.title}
          </div>
        )}
      </td>
      <td className="px-4 py-3 capitalize text-gray-600">
        {contribution.paymentMethod}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={contribution.status} />
      </td>
      <td className="px-4 py-3 text-gray-500">{date}</td>
      <td className="px-4 py-3 text-gray-500">
        <div className="truncate">
          {contribution.message && (
            <span title={contribution.message}>
              {contribution.message.slice(0, 30)}
              {contribution.message.length > 30 ? "..." : ""}
            </span>
          )}
          {contribution.ecardTemplate && (
            <span className="ml-1" title={`E-card: ${contribution.ecardTemplate}`}>
              🎴
            </span>
          )}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1">
          {contribution.status === "pending" && (
            <>
              <button
                onClick={() => updateStatus("confirmed")}
                disabled={!!loading}
                className="cursor-pointer rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100 disabled:opacity-50"
              >
                {loading === "confirmed" ? "..." : "Confirm"}
              </button>
              <button
                onClick={() => updateStatus("not_received")}
                disabled={!!loading}
                className="cursor-pointer rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
              >
                {loading === "not_received" ? "..." : "Not Received"}
              </button>
              <button
                onClick={nudge}
                disabled={!!loading}
                className="cursor-pointer rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
              >
                {loading === "nudge" ? "..." : "Nudge"}
              </button>
            </>
          )}
          {contribution.status === "confirmed" && (
            <button
              onClick={() => updateStatus("pending")}
              disabled={!!loading}
              className="cursor-pointer rounded bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Undo
            </button>
          )}
          {contribution.status === "not_received" && (
            <button
              onClick={() => updateStatus("pending")}
              disabled={!!loading}
              className="cursor-pointer rounded bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              Back to Pending
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={!!loading}
            className="cursor-pointer rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
          >
            {loading === "delete" ? "..." : "Delete"}
          </button>
        </div>
      </td>
    </tr>
  );
}
