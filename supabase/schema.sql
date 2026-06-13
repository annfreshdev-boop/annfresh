-- ============================================================
-- Annfresh Database Schema
-- Run this in: Supabase Dashboard > SQL Editor > New Query
-- ============================================================

-- Settings (WhatsApp number, store email, etc.)
CREATE TABLE IF NOT EXISTS settings (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key        TEXT UNIQUE NOT NULL,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Salads
CREATE TABLE IF NOT EXISTS salads (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  type        TEXT CHECK (type IN ('veg', 'non-veg')) NOT NULL DEFAULT 'veg',
  description TEXT NOT NULL DEFAULT '',
  ingredients TEXT[] NOT NULL DEFAULT '{}',
  calories    INTEGER NOT NULL DEFAULT 0,
  price       DECIMAL(10,2) NOT NULL DEFAULT 0,
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Plans
CREATE TABLE IF NOT EXISTS plans (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  duration    TEXT CHECK (duration IN ('daily', 'weekly', 'monthly')) NOT NULL,
  days_count  INTEGER,                -- e.g. 5 or 7 for weekly, 20 or 30 for monthly
  price       DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  features    TEXT[] NOT NULL DEFAULT '{}',
  is_custom   BOOLEAN NOT NULL DEFAULT FALSE,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  is_popular  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Ads / Offers
CREATE TABLE IF NOT EXISTS ads (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT NOT NULL,
  subtitle      TEXT,
  discount_text TEXT,
  bg_color      TEXT NOT NULL DEFAULT '#22c55e',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at    TIMESTAMPTZ,          -- NULL = never expires
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE salads   ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads      ENABLE ROW LEVEL SECURITY;

-- Public can read active salads
CREATE POLICY "public read salads" ON salads FOR SELECT TO anon USING (is_active = true);

-- Public can read active, non-expired ads
CREATE POLICY "public read ads" ON ads FOR SELECT TO anon
  USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Public can read active plans
CREATE POLICY "public read plans" ON plans FOR SELECT TO anon USING (is_active = true);

-- Public can read settings
CREATE POLICY "public read settings" ON settings FOR SELECT TO anon USING (true);

-- Authenticated admin can do everything
CREATE POLICY "admin all salads"   ON salads   FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all ads"      ON ads      FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all plans"    ON plans    FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "admin all settings" ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- Seed Data
-- ============================================================

-- Default settings
INSERT INTO settings (key, value) VALUES
  ('whatsapp_number', '8939760408'),
  ('store_email',     'hello@annfresh.com')
ON CONFLICT (key) DO NOTHING;

-- Default plans
INSERT INTO plans (name, duration, days_count, price, description, features, is_custom, is_active, is_popular) VALUES
  (
    'Daily Fresh',
    'daily',
    1,
    149,
    'A fresh salad every single day',
    ARRAY['1 salad per day', 'Seasonal ingredients', 'Delivery included', 'Calorie info'],
    false, true, false
  ),
  (
    'Weekly Wellness',
    'weekly',
    7,
    799,
    '7 days of curated, healthy salads',
    ARRAY['7 salads per week', 'Variety guaranteed', 'Free delivery', 'Nutrition tracking', 'Mix of veg & non-veg'],
    false, true, true
  ),
  (
    'Monthly Mastery',
    'monthly',
    30,
    2499,
    '30 days — your healthiest month ever',
    ARRAY['30 salads per month', 'Weekly menu preview', 'Priority delivery', 'Dedicated support', 'Best value'],
    false, true, false
  )
ON CONFLICT DO NOTHING;

-- Sample salads
INSERT INTO salads (name, type, description, ingredients, calories, price) VALUES
  (
    'Classic Caesar',
    'veg',
    'Crispy romaine, house-made croutons, shaved parmesan, and our bold Caesar dressing.',
    ARRAY['Romaine Lettuce', 'Croutons', 'Parmesan', 'Caesar Dressing', 'Lemon'],
    320, 179
  ),
  (
    'Spicy Grilled Chicken',
    'non-veg',
    'Juicy grilled chicken strips on a bed of mixed greens with chipotle vinaigrette.',
    ARRAY['Grilled Chicken', 'Mixed Greens', 'Cherry Tomatoes', 'Chipotle Dressing', 'Red Onion'],
    420, 249
  ),
  (
    'Garden Power Bowl',
    'veg',
    'A powerhouse of fresh vegetables, chickpeas, and tahini dressing packed with nutrients.',
    ARRAY['Chickpeas', 'Cucumber', 'Bell Peppers', 'Spinach', 'Tahini Dressing', 'Olives'],
    280, 199
  )
ON CONFLICT DO NOTHING;

-- Sample ad (active for 30 days from now)
INSERT INTO ads (title, subtitle, discount_text, bg_color, is_active, expires_at) VALUES
  (
    'Launch Offer — First Order 20% Off!',
    'Use code ANNFRESH20 at checkout',
    '20% OFF',
    '#22c55e',
    true,
    NOW() + INTERVAL '30 days'
  )
ON CONFLICT DO NOTHING;
