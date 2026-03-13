# Honeymoon Fund

An open-source honeymoon fund website that couples can deploy in minutes — zero platform fees.

Instead of paying Zola, Honeyfund, or Hitchd 2.5–5% in fees, this is a config-driven Next.js template where payments go directly to you via Venmo/Zelle/CashApp (free) or Stripe Payment Links (~3% processing).

**Total cost: $0** (or ~$12/year for a custom domain).

## Quick Start

### 1. Fork & clone

```bash
git clone https://github.com/YOUR_USERNAME/honeymoon-fund.git
cd honeymoon-fund
npm install
```

### 2. Edit `src/config.ts`

Update with your couple names, wedding date, personal message, fund goal, and theme preferences. Payment handles are read from environment variables (next step).

### 3. Create `.env.local`

Copy the example below and fill in your values:

```bash
# Generate your password hash (replace "06-21-2026" with your chosen password):
echo -n "06-21-2026" | shasum -a 256 | awk '{print $1}'

# Then create .env.local with:
NEXT_PUBLIC_SITE_PASSWORD_HASH=<output from above>
NEXT_PUBLIC_VENMO_HANDLE=YourVenmoUsername
NEXT_PUBLIC_ZELLE_EMAIL=you@example.com
NEXT_PUBLIC_CASHAPP_HANDLE=$YourCashTag
NEXT_PUBLIC_STRIPE_PAYMENT_LINK=https://buy.stripe.com/your-link
```

| Variable | Required | How to get it |
|----------|----------|---------------|
| `NEXT_PUBLIC_SITE_PASSWORD_HASH` | Yes | SHA-256 hash of your site password (see command above) |
| `NEXT_PUBLIC_VENMO_HANDLE` | If using Venmo | Your Venmo username (without the @) |
| `NEXT_PUBLIC_ZELLE_EMAIL` | If using Zelle | Email or phone registered with Zelle |
| `NEXT_PUBLIC_CASHAPP_HANDLE` | If using CashApp | Your $cashtag (without the $) |
| `NEXT_PUBLIC_STRIPE_PAYMENT_LINK` | If using Stripe | Create a Payment Link at [dashboard.stripe.com/payment-links](https://dashboard.stripe.com/payment-links) |

### 4. Add your photo

Replace `public/images/couple.jpg` with your own photo.

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The default password is `06-21-2026`.

### 6. Deploy to Vercel

Click the button or connect your fork in the Vercel dashboard:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/abrostoff2/honeymoon-fund)

**Important:** After deploying, add your environment variables in **Vercel → Settings → Environment Variables**. The `.env.local` file is gitignored and won't be available on Vercel automatically.

### 7. (Optional) Custom domain & QR code

Connect a custom domain (~$12/year) and print a QR code on your invitations with the URL and password.

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

## Security

The password gate uses a client-side SHA-256 hash comparison — it's designed for light obscurity (shared via QR code on invitations), not bank-level security. Don't put anything truly sensitive behind it.

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
