# Honeymoon Fund

Product spec: `product-spec.md`. Update it when features or decisions change.

## Setup Flow

When a user says "set up", "help me get started", or similar — run this flow. Ask questions conversationally, make changes to files as you go. Skip steps they don't need.

**Goal: minimize back-and-forth.** Batch related questions together. Don't ask one thing at a time.

### Step 1: Personalization

Ask all at once:
- Both names (e.g. "Alex & Jack")
- Wedding date
- Honeymoon destination / one-line description
- A welcome message for guests (offer to write one if they want)
- Do they have a couple photo ready? (if yes, tell them to drop it at `public/images/couple.jpg`)

→ Update `src/config.ts`: coupleName, weddingDate, message, fund.description

### Step 2: Look & Feel

Show 3 quick options:
1. **Warm & elegant** — `#8B7355` brown, serif (current default)
2. **Fresh & modern** — `#2D8B6E` green, sans-serif
3. **Classic & minimal** — `#4A5568` slate, sans-serif

Or they can give a hex color / describe a vibe.

→ Update `src/config.ts`: theme.primaryColor, theme.backgroundColor, theme.fontFamily

### Step 3: Payment Methods

Ask: "Which payment methods do you want to accept?" Then for each enabled one, ask for the handle/email in the same message.

- **Venmo** → handle (without @)
- **Zelle** → registered email or phone
- **CashApp** → $cashtag (without $)

→ Update `.env.local` and set enabled flags in `src/config.ts`

### Step 4: Passwords

Generate both automatically unless they have a preference:
- **Site password** — suggest their wedding date (e.g. "06-21-2026") since it's on the invitation
- **Admin password** — suggest something stronger

Generate SHA-256 hashes with: `echo -n "password" | shasum -a 256 | awk '{print $1}'`

→ Write to `.env.local`: NEXT_PUBLIC_SITE_PASSWORD_HASH, ADMIN_PASSWORD_HASH

### Step 5: Optional — Email Notifications

Ask: "Want email notifications when someone contributes?" If yes:
1. Guide them to resend.com → create account → get API key
2. Ask for the email to receive notifications

→ Write to `.env.local`: RESEND_API_KEY, COUPLE_EMAIL

### Step 6: Optional — Admin SSO

Ask: "Want Google sign-in for the admin dashboard, or just a password?" If SSO:
1. Guide through Google Cloud Console → OAuth 2.0 Client ID
2. Authorized redirect: `http://localhost:3000/api/auth/callback/google` (+ production URL later)
3. Collect client ID and secret

→ Write to `.env.local`: AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, ADMIN_EMAILS, NEXT_PUBLIC_ADMIN_SSO_ENABLED=true

### Step 7: Initialize & Test

Run:
```
cp .env.example .env.local  # if not already created
npx prisma migrate dev
npm run dev
```

Tell them to open localhost:3000, enter the password, and check it looks right.

### Step 8: Deploy

Ask: "Ready to deploy?" Then:
1. Guide Vercel CLI (`npx vercel`) or dashboard deploy
2. Remind them to add all `.env.local` vars to Vercel → Settings → Environment Variables
3. If they have a custom domain, guide the DNS setup
4. If using SSO, remind them to add the production callback URL to Google OAuth

### Fund goal

Ask: "Do you want to show a progress bar with a fund goal? If so, what's the target amount?" Set to 0 to hide.

→ Update `src/config.ts`: fund.goalAmount

---

## Making Changes

When the user wants to change something after setup:

- **Content** (names, dates, messages, payment handles, fund details) → suggest the admin UI at `/admin/settings`, or edit directly if they prefer
- **Visual** (colors, fonts, hero image) → edit `src/config.ts` or swap the image file
- **Infrastructure** (passwords, API keys, new payment methods) → edit `.env.local` and remind them to update Vercel env vars
- **Adding SSO/Email after initial setup** → run the relevant optional step from the setup flow above
