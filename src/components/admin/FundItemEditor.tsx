"use client";

import { useState } from "react";

interface FundItem {
  id: string;
  title: string;
  description: string | null;
  goalAmount: number | null;
  imageUrl: string | null;
  sortOrder: number;
  visible: boolean;
}

interface FundItemEditorProps {
  item?: FundItem;
  onSave: () => void;
  onCancel: () => void;
}

export default function FundItemEditor({
  item,
  onSave,
  onCancel,
}: FundItemEditorProps) {
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [goalAmount, setGoalAmount] = useState(
    item?.goalAmount?.toString() ?? ""
  );
  const [imageUrl, setImageUrl] = useState(item?.imageUrl ?? "");
  const [visible, setVisible] = useState(item?.visible ?? true);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!title) return;
    setSaving(true);

    const url = item ? `/api/fund-items/${item.id}` : "/api/fund-items";
    const method = item ? "PATCH" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description: description || null,
        goalAmount: goalAmount ? Number(goalAmount) : null,
        imageUrl: imageUrl || null,
        visible,
      }),
    });

    setSaving(false);
    onSave();
  }

  return (
    <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Title *
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
          placeholder="e.g., Scuba Diving in Galapagos"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Goal Amount ($)
          </label>
          <input
            type="number"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="https://..."
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
        />
        Visible to guests
      </label>
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={!title || saving}
          className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "Saving..." : item ? "Update" : "Add Item"}
        </button>
        <button
          onClick={onCancel}
          className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
