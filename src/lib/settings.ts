import { prisma } from "@/lib/db";
import { config } from "@/config";

// Keys that can be edited from the admin UI
export const SETTING_KEYS = {
  coupleName: "couple_name",
  weddingDate: "wedding_date",
  message: "message",
  fundTitle: "fund_title",
  fundDescription: "fund_description",
  fundGoalAmount: "fund_goal_amount",
  venmoEnabled: "venmo_enabled",
  venmoHandle: "venmo_handle",
  zelleEnabled: "zelle_enabled",
  zelleEmail: "zelle_email",
  cashappEnabled: "cashapp_enabled",
  cashappHandle: "cashapp_handle",
  stripeEnabled: "stripe_enabled",
  stripePaymentLink: "stripe_payment_link",
  fundItemsEnabled: "fund_items_enabled",
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

// Defaults from config.ts / env vars
function getDefault(key: SettingKey): string {
  switch (key) {
    case "couple_name": return config.coupleName;
    case "wedding_date": return config.weddingDate;
    case "message": return config.message;
    case "fund_title": return config.fund.title;
    case "fund_description": return config.fund.description;
    case "fund_goal_amount": return String(config.fund.goalAmount);
    case "venmo_enabled": return String(config.payments.venmo.enabled);
    case "venmo_handle": return config.payments.venmo.handle ?? "";
    case "zelle_enabled": return String(config.payments.zelle.enabled);
    case "zelle_email": return config.payments.zelle.email ?? "";
    case "cashapp_enabled": return String(config.payments.cashapp.enabled);
    case "cashapp_handle": return config.payments.cashapp.handle ?? "";
    case "stripe_enabled": return String(config.payments.stripe.enabled);
    case "stripe_payment_link": return config.payments.stripe.paymentLink ?? "";
    case "fund_items_enabled": return process.env.NEXT_PUBLIC_FUND_ITEMS_ENABLED ?? "false";
    default: return "";
  }
}

export async function getSetting(key: SettingKey): Promise<string> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? getDefault(key);
}

export async function getAllSettings(): Promise<Record<SettingKey, string>> {
  const rows = await prisma.setting.findMany();
  const dbMap = new Map(rows.map((r) => [r.key, r.value]));

  const result: Record<string, string> = {};
  for (const [, key] of Object.entries(SETTING_KEYS)) {
    result[key] = dbMap.get(key) ?? getDefault(key);
  }
  return result as Record<SettingKey, string>;
}

export async function setSetting(key: SettingKey, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function setSettings(settings: Partial<Record<SettingKey, string>>): Promise<void> {
  const ops = Object.entries(settings).map(([key, value]) =>
    prisma.setting.upsert({
      where: { key },
      update: { value: value! },
      create: { key, value: value! },
    })
  );
  await Promise.all(ops);
}
