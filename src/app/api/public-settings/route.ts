import { NextResponse } from "next/server";
import { getAllSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const s = await getAllSettings();
  return NextResponse.json({
    coupleName: s.couple_name,
    weddingDate: s.wedding_date,
    message: s.message,
    fundTitle: s.fund_title,
    fundDescription: s.fund_description,
    fundGoalAmount: Number(s.fund_goal_amount) || 0,
    fundItemsEnabled: s.fund_items_enabled === "true",
    payments: {
      venmo: { enabled: s.venmo_enabled === "true", handle: s.venmo_handle },
      zelle: { enabled: s.zelle_enabled === "true", email: s.zelle_email },
      cashapp: { enabled: s.cashapp_enabled === "true", handle: s.cashapp_handle },
    },
  });
}
