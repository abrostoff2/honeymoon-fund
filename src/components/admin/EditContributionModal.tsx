"use client";

import { useState } from "react";

interface Contribution {
  id: string;
  guestName: string;
  guestEmail: string;
  amount: number;
  message: string | null;
  paymentMethod: string;
  status: string;
  notes: string | null;
}

interface EditContributionModalProps {
  contribution: Contribution;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditContributionModal({
  contribution,
  onClose,
  onSaved,
}: EditContributionModalProps) {
  const [guestName, setGuestName] = useState(contribution.guestName);
  const [guestEmail, setGuestEmail] = useState(contribution.guestEmail);
  const [amount, setAmount] = useState(contribution.amount.toString());
  const [paymentMethod, setPaymentMethod] = useState(contribution.paymentMethod);
  const [status, setStatus] = useState(contribution.status);
  const [message, setMessage] = useState(contribution.message || "");
  const [notes, setNotes] = useState(contribution.notes || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const parsedAmount = parseFloat(amount);
    if (!guestName.trim()) {
      setError("Guest name is required");
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/contributions/${contribution.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          amount: parsedAmount,
          paymentMethod: paymentMethod.trim(),
          status,
          message: message.trim() || null,
          notes: notes.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to save");
        return;
      }

      onSaved();
      onClose();
    } catch {
      setError("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleNudge() {
    setSaving(true);
    await fetch(`/api/contributions/${contribution.id}/nudge`, {
      method: "POST",
    });
    setSaving(false);
    alert("Reminder sent!");
  }

  async function handleDelete() {
    if (!confirm(`Delete contribution from ${contribution.guestName} ($${contribution.amount})?`)) return;
    setSaving(true);
    await fetch(`/api/contributions/${contribution.id}`, {
      method: "DELETE",
    });
    onSaved();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Contribution
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer text-gray-400 hover:text-gray-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Guest Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Guest Email
              </label>
              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Amount <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 py-2 pl-7 pr-3 text-sm outline-none focus:border-gray-400"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Payment Method
              </label>
              <input
                type="text"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="not_received">Not Received</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Notes <span className="text-xs text-gray-400">(private)</span>
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              placeholder="Private admin notes"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div className="flex gap-2">
              {contribution.guestEmail && contribution.status === "pending" && (
                <button
                  type="button"
                  onClick={handleNudge}
                  disabled={saving}
                  className="cursor-pointer rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                >
                  Nudge
                </button>
              )}
              <button
                type="button"
                onClick={handleDelete}
                disabled={saving}
                className="cursor-pointer rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
