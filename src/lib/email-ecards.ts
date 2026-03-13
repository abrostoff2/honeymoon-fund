// Inline-styled e-card HTML for emails (Tailwind doesn't work in email clients)

const ecardStyles: Record<string, { bg: string; accent: string; textColor: string; subtextColor: string }> = {
  "romantic-floral": { bg: "linear-gradient(135deg, #fdf2f8, #ffe4e6)", accent: "#be123c", textColor: "#881337", subtextColor: "#e11d48" },
  "tropical-sunset": { bg: "linear-gradient(180deg, #ffedd5, #fff7ed, #cffafe)", accent: "#b45309", textColor: "#78350f", subtextColor: "#d97706" },
  "minimalist-gold": { bg: "#ffffff", accent: "#d4a853", textColor: "#1f2937", subtextColor: "#d4a853" },
  "watercolor-blue": { bg: "linear-gradient(135deg, #eff6ff, #f0f9ff, #e0e7ff)", accent: "#3b82f6", textColor: "#1e3a5f", subtextColor: "#3b82f6" },
  "adventure-map": { bg: "linear-gradient(135deg, #ecfdf5, #ccfbf1)", accent: "#059669", textColor: "#064e3b", subtextColor: "#059669" },
};

const ecardNames: Record<string, string> = {
  "romantic-floral": "Romantic Floral",
  "tropical-sunset": "Tropical Sunset",
  "minimalist-gold": "Minimalist Gold",
  "watercolor-blue": "Watercolor Blue",
  "adventure-map": "Adventure Map",
};

const ecardGreetings: Record<string, (coupleName: string) => string> = {
  "romantic-floral": (name) => `For ${name}`,
  "tropical-sunset": (name) => `For ${name}`,
  "minimalist-gold": (name) => `${name}`,
  "watercolor-blue": (name) => `For ${name}`,
  "adventure-map": (name) => `Bon Voyage, ${name}!`,
};

const ecardDefaults: Record<string, string> = {
  "romantic-floral": "Wishing you a lifetime of love and adventure!",
  "tropical-sunset": "Here's to sunsets, adventures, and your new journey together!",
  "minimalist-gold": "Cheers to your next adventure together.",
  "watercolor-blue": "May your journey together be as beautiful as you both are.",
  "adventure-map": "The greatest adventure is the one you take together.",
};

const ecardSignoffs: Record<string, string> = {
  "romantic-floral": "With love,",
  "tropical-sunset": "—",
  "minimalist-gold": "",
  "watercolor-blue": "Love,",
  "adventure-map": "—",
};

export function getEcardName(templateId: string): string {
  return ecardNames[templateId] ?? templateId;
}

export function renderEcardHtml(
  templateId: string,
  guestName: string,
  coupleName: string,
  message: string
): string {
  const style = ecardStyles[templateId];
  if (!style) return "";

  const greeting = ecardGreetings[templateId]?.(coupleName) ?? coupleName;
  const displayMessage = message || ecardDefaults[templateId] || "";
  const signoff = ecardSignoffs[templateId] ?? "";

  const isGradient = style.bg.includes("gradient");
  const bgStyle = isGradient ? `background: ${style.bg};` : `background-color: ${style.bg};`;
  const borderStyle = templateId === "minimalist-gold" ? `border: 1px solid ${style.accent};` : "";

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 16px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="${bgStyle} ${borderStyle} border-radius: 12px; overflow: hidden;">
            <tr>
              <td style="padding: 32px; text-align: center;">
                ${templateId === "minimalist-gold" ? `<div style="width: 48px; height: 1px; background-color: ${style.accent}; margin: 0 auto 16px;"></div>` : ""}
                <p style="font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: ${style.subtextColor}; margin: 0 0 12px;">
                  ${greeting}
                </p>
                <p style="font-family: Georgia, serif; font-size: 18px; color: ${style.textColor}; margin: 0 0 16px; line-height: 1.5;">
                  ${displayMessage}
                </p>
                ${templateId === "minimalist-gold" ? `<div style="width: 48px; height: 1px; background-color: ${style.accent}; margin: 0 auto 12px;"></div>` : ""}
                <p style="font-size: 14px; color: ${style.subtextColor}; margin: 0;">
                  ${signoff} ${guestName}
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>`;
}
