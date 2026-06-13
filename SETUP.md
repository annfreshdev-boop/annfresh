# Annfresh — Setup & Deployment Guide

## What You Need (all free)
- [Supabase account](https://supabase.com) — database + admin auth
- [Vercel account](https://vercel.com) — hosting
- [Node.js 18+](https://nodejs.org) — local development
- [GitHub account](https://github.com) — to connect Vercel

---

## Step 1 — Install Node.js
Download and install from https://nodejs.org (choose the LTS version).

---

## Step 2 — Set Up Supabase

1. Go to https://supabase.com → **New Project**
2. Name it `annfresh`, set a strong DB password, choose nearest region
3. Once created, go to **SQL Editor → New Query**
4. Copy the entire contents of `supabase/schema.sql` and click **Run**
5. This creates all tables and adds sample data

### Create Your Admin Account
1. In Supabase, go to **Authentication → Users → Invite User**
2. Enter your email and click Invite
3. Check your email and set a password — this is your admin login

### Get Your API Keys
1. Go to **Settings → API Keys**
2. If you see a **"Create new API Keys"** button, click it to generate the new-format keys
3. Copy:
   - **Project URL** (shown at the top, looks like `https://xxxx.supabase.co`)
   - **Publishable key** (starts with `sb_publishable_...`) — this is the client-safe key that replaced the old "anon" key

---

## Step 3 — Run Locally

```bash
cd /Users/deepak/Documents/Projects/Annfresh

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Supabase values:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_your-key-here
```

```bash
# Start dev server
npm run dev
```

Open http://localhost:3000 — your website!
Open http://localhost:3000/admin — your admin panel!

---

## Step 4 — Update Contact Form Email

Open `src/components/home/ContactSection.tsx` and find this line:
```
action="https://formsubmit.co/your@email.com"
```
Replace `your@email.com` with your actual email address. FormSubmit will send
you a confirmation email the first time a form is submitted.

---

## Step 5 — Deploy to Vercel (Free)

### Option A — Via GitHub (recommended)
1. Push the project to a GitHub repository
2. Go to https://vercel.com → **Add New Project → Import Git Repository**
3. Select your repo
4. Under **Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase Publishable key (`sb_publishable_...`)
5. Click **Deploy** — done!

### Option B — Via Vercel CLI
```bash
npm install -g vercel
vercel
# Follow the prompts, add env vars when asked
```

---

## Step 6 — Custom Domain (optional, free on Vercel)
1. In your Vercel project → **Settings → Domains**
2. Add your domain (e.g., `annfresh.in`) 
3. Update DNS records as shown by Vercel

---

## Daily Usage

### Adding a Salad
Go to `yoursite.vercel.app/admin` → **Salads tab** → **Add Salad**

### Creating an Offer/Ad
Go to **Ads & Offers tab** → **Add Ad** → Set an expiry date and it will
auto-disappear from the homepage when expired.

### Changing WhatsApp Number
Go to **Settings tab** → Update number → Save

---

## Project File Overview

```
src/
├── app/
│   ├── page.tsx              ← Home page
│   └── admin/
│       ├── login/page.tsx    ← Admin login
│       └── page.tsx          ← Admin dashboard
├── components/
│   ├── home/
│   │   ├── Hero.tsx          ← Banner/hero section
│   │   ├── AdsBanner.tsx     ← Scrolling offers ticker
│   │   ├── SaladsSection.tsx ← Salad menu grid
│   │   ├── PlansSection.tsx  ← Plans cards
│   │   └── ContactSection.tsx← WhatsApp + form
│   └── admin/
│       ├── SaladsManager.tsx ← Add/edit/delete salads
│       ├── AdsManager.tsx    ← Manage ads & expiry
│       └── SettingsManager.tsx← WhatsApp number etc.
supabase/schema.sql           ← Run this in Supabase SQL Editor
```
