"use client";

import { useEffect, useState, useCallback } from "react";

interface Settings {
  couple_name: string;
  wedding_date: string;
  message: string;
  fund_title: string;
  fund_description: string;
  fund_goal_amount: string;
  venmo_enabled: string;
  venmo_handle: string;
  zelle_enabled: string;
  zelle_email: string;
  cashapp_enabled: string;
  cashapp_handle: string;
  stripe_enabled: string;
  stripe_payment_link: string;
  fund_items_enabled: string;
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 cursor-pointer rounded-full transition-colors ${
          checked ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
      />
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/settings");
    if (res.ok) setSettings(await res.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function update(key: keyof Settings, value: string) {
    setSettings((s) => (s ? { ...s, [key]: value } : s));
    setSaved(false);
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  if (!settings) {
    return <div className="text-sm text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-sm text-green-600">Saved!</span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Couple Info */}
      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-gray-900">Couple Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Names"
            value={settings.couple_name}
            onChange={(v) => update("couple_name", v)}
            placeholder="Alex & Jack"
          />
          <Field
            label="Wedding Date"
            value={settings.wedding_date}
            onChange={(v) => update("wedding_date", v)}
            placeholder="June 21, 2026"
          />
        </div>
        <TextArea
          label="Welcome Message"
          value={settings.message}
          onChange={(v) => update("message", v)}
        />
      </section>

      {/* Fund */}
      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-gray-900">Fund</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Fund Title"
            value={settings.fund_title}
            onChange={(v) => update("fund_title", v)}
          />
          <Field
            label="Goal Amount ($)"
            value={settings.fund_goal_amount}
            onChange={(v) => update("fund_goal_amount", v)}
            type="number"
          />
        </div>
        <Field
          label="Fund Description"
          value={settings.fund_description}
          onChange={(v) => update("fund_description", v)}
        />
        <Toggle
          label="Fund items enabled (guests can contribute to specific experiences)"
          checked={settings.fund_items_enabled === "true"}
          onChange={(v) => update("fund_items_enabled", String(v))}
        />
      </section>

      {/* Payment Methods */}
      <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>

        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
          <Toggle
            label="Venmo"
            checked={settings.venmo_enabled === "true"}
            onChange={(v) => update("venmo_enabled", String(v))}
          />
          {settings.venmo_enabled === "true" && (
            <Field
              label="Venmo Handle"
              value={settings.venmo_handle}
              onChange={(v) => update("venmo_handle", v)}
              placeholder="Alex-Brostoff-1"
            />
          )}
        </div>

        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
          <Toggle
            label="Zelle"
            checked={settings.zelle_enabled === "true"}
            onChange={(v) => update("zelle_enabled", String(v))}
          />
          {settings.zelle_enabled === "true" && (
            <Field
              label="Zelle Email"
              value={settings.zelle_email}
              onChange={(v) => update("zelle_email", v)}
              placeholder="you@email.com"
            />
          )}
        </div>

        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
          <Toggle
            label="Cash App"
            checked={settings.cashapp_enabled === "true"}
            onChange={(v) => update("cashapp_enabled", String(v))}
          />
          {settings.cashapp_enabled === "true" && (
            <Field
              label="Cash App Handle"
              value={settings.cashapp_handle}
              onChange={(v) => update("cashapp_handle", v)}
              placeholder="$YourHandle"
            />
          )}
        </div>

        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
          <Toggle
            label="Card / Apple Pay (Stripe)"
            checked={settings.stripe_enabled === "true"}
            onChange={(v) => update("stripe_enabled", String(v))}
          />
          {settings.stripe_enabled === "true" && (
            <Field
              label="Stripe Payment Link"
              value={settings.stripe_payment_link}
              onChange={(v) => update("stripe_payment_link", v)}
              placeholder="https://buy.stripe.com/..."
            />
          )}
        </div>
      </section>

      <p className="text-sm text-gray-400">
        API keys and passwords must still be configured in <code>.env.local</code>.
      </p>
    </div>
  );
}
