# Honeymoon Fund

An open-source honeymoon fund website that couples can deploy in minutes — zero platform fees.

Instead of paying Zola, Honeyfund, or Hitchd 2.5–5% in fees, this is a config-driven Next.js template where payments go directly to you via Venmo/Zelle/CashApp (free) or Stripe Payment Links (~3% processing).

**Total cost: $0** (or ~$12/year for a custom domain).

## Setup with Claude Code (Recommended)

The fastest way to set up your honeymoon fund:

1. Fork & clone this repo
2. Open it with [Claude Code](https://claude.com/claude-code)
3. Say **"help me set up"**

Claude walks you through everything — personalizing the site, configuring payments, setting passwords, and deploying to Vercel. No need to read docs or edit config files manually.

## Manual Setup

<details>
<summary>Click to expand manual setup steps</summary>

### 1. Fork & clone

```bash
git clone https://github.com/YOUR_USERNAME/honeymoon-fund.git
cd honeymoon-fund
npm install
```

### 2. Edit `src/config.ts`

Update with your couple names, wedding date, personal message, fund goal, and theme preferences.

### 3. Create `.env.local`

```bash
cp .env.example .env.local
```

Fill in your values. Generate password hashes with:

```bash
echo -n "your-password" | shasum -a 256 | awk '{print $1}'
```

### 4. Add your photo

Replace `public/images/couple.jpg` with your own photo.

### 5. Set up the database

```bash
npx prisma migrate dev
```

### 6. Run locally

```bash
npm run dev
```

### 7. Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/abrostoff2/honeymoon-fund)

Add your `.env.local` variables in **Vercel → Settings → Environment Variables**.

### 8. (Optional) Custom domain & QR code

Connect a custom domain (~$12/year) and print a QR code on your invitations.

</details>

## Admin Dashboard

After deploying, visit `/admin` to:

- Track contributions (who gave, how much, payment status)
- Confirm or nudge pending payments
- Manage fund items (specific honeymoon experiences guests can fund)
- Edit site settings (couple info, payment methods, fund details)

## Payment Methods

| Method | Fees | How it works |
|--------|------|-------------|
| Venmo | **$0** | Deep link opens app with note pre-filled |
| CashApp | **$0** | Deep link opens app |
| Zelle | **$0** | Displays your registered email/phone |
| Card / Apple Pay | **~3%** | Stripe Payment Link — money goes to your bank |

## Features

- Guest contribution flow with name, email, message, and optional e-card
- Email notifications to the couple when gifts come in
- Admin SSO via Google (optional, password auth by default)
- Mobile-friendly
- Config-driven theming (colors, fonts)

## Tech Stack

- Next.js 16 (App Router, Turbopack)
- SQLite + Prisma 7
- Tailwind CSS v4
- NextAuth v5 (optional Google SSO)
- Resend (optional email notifications)

## License

MIT
