import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const [contributions, fundItems] = await Promise.all([
    prisma.contribution.findMany({
      select: { amount: true, status: true, fundItemId: true },
    }),
    prisma.fundItem.findMany({
      where: { visible: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const totalConfirmed = contributions
    .filter((c) => c.status === "confirmed")
    .reduce((sum, c) => sum + c.amount, 0);

  const totalPending = contributions
    .filter((c) => c.status === "pending")
    .reduce((sum, c) => sum + c.amount, 0);

  // Per-fund-item totals
  const itemTotals: Record<string, { confirmed: number; pending: number }> = {};
  for (const c of contributions) {
    if (!c.fundItemId) continue;
    if (!itemTotals[c.fundItemId]) {
      itemTotals[c.fundItemId] = { confirmed: 0, pending: 0 };
    }
    if (c.status === "confirmed") {
      itemTotals[c.fundItemId].confirmed += c.amount;
    } else if (c.status === "pending") {
      itemTotals[c.fundItemId].pending += c.amount;
    }
  }

  const items = fundItems.map((item) => ({
    ...item,
    raised: itemTotals[item.id]?.confirmed ?? 0,
    pending: itemTotals[item.id]?.pending ?? 0,
  }));

  return NextResponse.json({ totalConfirmed, totalPending, items });
}
