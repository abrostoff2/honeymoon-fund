"use client";

import { useEffect, useState, useCallback } from "react";
import FundItemEditor from "@/components/admin/FundItemEditor";

interface FundItem {
  id: string;
  title: string;
  description: string | null;
  goalAmount: number | null;
  imageUrl: string | null;
  sortOrder: number;
  visible: boolean;
}

interface ItemTotals {
  raised: number;
  pending: number;
}

export default function FundItemsPage() {
  const [items, setItems] = useState<FundItem[]>([]);
  const [totals, setTotals] = useState<Record<string, ItemTotals>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    const [itemsRes, summaryRes] = await Promise.all([
      fetch("/api/fund-items"),
      fetch("/api/fund-summary"),
    ]);
    if (itemsRes.ok) setItems(await itemsRes.json());
    if (summaryRes.ok) {
      const summary = await summaryRes.json();
      const map: Record<string, ItemTotals> = {};
      for (const item of summary.items ?? []) {
        map[item.id] = { raised: item.raised, pending: item.pending };
      }
      setTotals(map);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this fund item?")) return;
    await fetch(`/api/fund-items/${id}`, { method: "DELETE" });
    load();
  }

  async function handleMove(id: string, direction: "up" | "down") {
    const idx = items.findIndex((i) => i.id === id);
    if (
      (direction === "up" && idx === 0) ||
      (direction === "down" && idx === items.length - 1)
    )
      return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    await Promise.all([
      fetch(`/api/fund-items/${items[idx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: items[swapIdx].sortOrder }),
      }),
      fetch(`/api/fund-items/${items[swapIdx].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: items[idx].sortOrder }),
      }),
    ]);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Fund Items</h1>
        <button
          onClick={() => setAdding(true)}
          disabled={adding}
          className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          Add Item
        </button>
      </div>

      {adding && (
        <FundItemEditor
          onSave={() => {
            setAdding(false);
            load();
          }}
          onCancel={() => setAdding(false)}
        />
      )}

      <div className="space-y-3">
        {items.map((item) =>
          editing === item.id ? (
            <FundItemEditor
              key={item.id}
              item={item}
              onSave={() => {
                setEditing(null);
                load();
              }}
              onCancel={() => setEditing(null)}
            />
          ) : (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {item.title}
                  </span>
                  {!item.visible && (
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-500">
                      Hidden
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-sm text-gray-500">{item.description}</p>
                )}
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span className="text-green-600">
                    ${(totals[item.id]?.raised ?? 0).toLocaleString()} confirmed
                  </span>
                  <span className="text-amber-600">
                    ${(totals[item.id]?.pending ?? 0).toLocaleString()} pending
                  </span>
                  {item.goalAmount && item.goalAmount > 0 && (
                    <span className="text-gray-400">
                      of ${item.goalAmount.toLocaleString()} goal
                    </span>
                  )}
                </div>
                {item.goalAmount && item.goalAmount > 0 && (
                  <div className="mt-2 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-green-500 transition-all"
                      style={{
                        width: `${Math.min(((totals[item.id]?.raised ?? 0) / item.goalAmount) * 100, 100)}%`,
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleMove(item.id, "up")}
                  className="cursor-pointer rounded p-1 text-gray-400 hover:bg-gray-100"
                >
                  ↑
                </button>
                <button
                  onClick={() => handleMove(item.id, "down")}
                  className="cursor-pointer rounded p-1 text-gray-400 hover:bg-gray-100"
                >
                  ↓
                </button>
                <button
                  onClick={() => setEditing(item.id)}
                  className="cursor-pointer rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="cursor-pointer rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        )}
        {items.length === 0 && !adding && (
          <p className="text-center text-sm text-gray-400">
            No fund items yet. Add one to get started.
          </p>
        )}
      </div>
    </div>
  );
}
