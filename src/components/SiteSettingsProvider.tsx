"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { config } from "@/config";

export interface SiteSettings {
  coupleName: string;
  weddingDate: string;
  message: string;
  fundTitle: string;
  fundDescription: string;
  fundGoalAmount: number;
  fundItemsEnabled: boolean;
  payments: {
    venmo: { enabled: boolean; handle: string };
    zelle: { enabled: boolean; email: string };
    cashapp: { enabled: boolean; handle: string };
  };
}

// Defaults from static config
const defaultSettings: SiteSettings = {
  coupleName: config.coupleName,
  weddingDate: config.weddingDate,
  message: config.message,
  fundTitle: config.fund.title,
  fundDescription: config.fund.description,
  fundGoalAmount: config.fund.goalAmount,
  fundItemsEnabled: process.env.NEXT_PUBLIC_FUND_ITEMS_ENABLED === "true",
  payments: {
    venmo: { enabled: config.payments.venmo.enabled, handle: config.payments.venmo.handle ?? "" },
    zelle: { enabled: config.payments.zelle.enabled, email: config.payments.zelle.email ?? "" },
    cashapp: { enabled: config.payments.cashapp.enabled, handle: config.payments.cashapp.handle ?? "" },
  },
};

const SiteSettingsContext = createContext<SiteSettings>(defaultSettings);

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

export default function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);

  useEffect(() => {
    fetch("/api/public-settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(() => {});
  }, []);

  return (
    <SiteSettingsContext.Provider value={settings}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
