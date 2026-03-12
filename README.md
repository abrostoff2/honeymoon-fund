# Honeymoon Fund

An open-source honeymoon fund website that couples can deploy in minutes — zero platform fees.

Instead of paying Zola, Honeyfund, or Hitchd 2.5–5% in fees, this is a config-driven Next.js template where payments go directly to you via Venmo/Zelle/CashApp (free) or Stripe Payment Links (~3% processing).

**Total cost: $0** (or ~$12/year for a custom domain).

## Quick Start

1. **Fork this repo**

2. **Edit `src/config.ts`** with your details:
   - Couple names, wedding date, personal message
   - Payment handles (Venmo, Zelle, CashApp, Stripe)
   - Fund goal amount
   - Site password (share on your invitation)

3. **Add your photo** to `public/images/couple.jpg`

4. **Deploy to Vercel** — click the button below or connect your fork:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/honeymoon-fund)

5. **(Optional)** Connect a custom domain (~$12/year)

6. **Print a QR code** on your wedding invitations with the URL and password

## Payment Methods

| Method | Fees | How it works |
|--------|------|-------------|
| Venmo | **$0** | Deep link opens app with note pre-filled |
| CashApp | **$0** | Deep link opens app |
| Zelle | **$0** | Displays your registered email/phone |
| Card / Apple Pay | **~3%** | Stripe Payment Link — money goes to your bank |

## Customization

Everything is configured in `src/config.ts`:

- **Theme colors** — primary accent, background color
- **Font style** — serif (elegant) or sans-serif (modern)
- **Fund goal** — set to 0 to hide the progress bar
- **Payment methods** — enable/disable any combination

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The default password is `06-14-2026`.

## Build

```bash
npm run build
```

Generates a fully static site in `out/` — no server needed.

## Tech Stack

- Next.js 16 (App Router, static export)
- TypeScript
- Tailwind CSS v4
- Zero backend, zero database

## License

MIT
