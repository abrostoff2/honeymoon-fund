"use client";

import { config } from "@/config";
import { useSiteSettings } from "./SiteSettingsProvider";

export default function Hero() {
  const settings = useSiteSettings();

  return (
    <section className="animate-fade-in px-4 pb-8 pt-12 text-center sm:pt-16">
      {/* Couple photo */}
      <div className="mx-auto mb-8 h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-lg sm:h-56 sm:w-56">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={config.heroImage}
          alt={settings.coupleName}
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            target.parentElement!.style.background =
              `linear-gradient(135deg, ${config.theme.primaryColor}40, ${config.theme.primaryColor}80)`;
          }}
        />
      </div>

      <h1
        className="mb-2 font-serif text-4xl tracking-tight sm:text-5xl"
        style={{ color: config.theme.primaryColor }}
      >
        {settings.coupleName}
      </h1>

      <p className="mb-6 text-sm uppercase tracking-[0.2em] text-[#2C2C2C]/50">
        {settings.weddingDate}
      </p>

      <p className="mx-auto max-w-md text-lg leading-relaxed text-[#2C2C2C]/80">
        {settings.message}
      </p>
    </section>
  );
}
