"use client";

import { useEffect, useState } from "react";
import { config } from "@/config";

interface FundItemWithTotals {
  id: string;
  title: string;
  description: string | null;
  goalAmount: number | null;
  imageUrl: string | null;
  raised: number;
  pending: number;
}

interface FundItemGridProps {
  onSelect: (item: FundItemWithTotals) => void;
  onSkip: () => void;
}

export default function FundItemGrid({ onSelect, onSkip }: FundItemGridProps) {
  const [items, setItems] = useState<FundItemWithTotals[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fund-summary")
      .then((res) => res.json())
      .then((data) => {
        if (data.items?.length > 0) {
          setItems(data.items);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && items.length === 0) {
      onSkip();
    }
  }, [loading, items.length, onSkip]);

  if (loading) {
    return <div className="py-4 text-center text-sm text-[#2C2C2C]/40">Loading...</div>;
  }

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <p className="text-center text-sm text-[#2C2C2C]/60">
        Choose an experience to fund, or contribute to the general fund
      </p>

      <div className="space-y-3">
        {items.map((item) => {
          const progress =
            item.goalAmount && item.goalAmount > 0
              ? Math.min((item.raised / item.goalAmount) * 100, 100)
              : null;

          return (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className="w-full cursor-pointer rounded-lg border border-[#2C2C2C]/10 p-4 text-left transition-colors hover:border-[#2C2C2C]/30"
            >
              <div className="flex items-start gap-3">
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium text-[#2C2C2C]">{item.title}</div>
                  {item.description && (
                    <div className="mt-0.5 text-xs text-[#2C2C2C]/50">
                      {item.description}
                    </div>
                  )}
                  {item.goalAmount && item.goalAmount > 0 && (
                    <div className="mt-2">
                      <div className="mb-1 flex justify-between text-xs text-[#2C2C2C]/50">
                        <span>${item.raised.toLocaleString()} raised</span>
                        <span>${item.goalAmount.toLocaleString()} goal</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#2C2C2C]/10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: config.theme.primaryColor,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onSkip}
        className="w-full cursor-pointer rounded-lg border border-dashed border-[#2C2C2C]/15 py-3 text-center text-sm text-[#2C2C2C]/50 transition-colors hover:border-[#2C2C2C]/30 hover:text-[#2C2C2C]/70"
      >
        Contribute to the general fund instead
      </button>
    </div>
  );
}
