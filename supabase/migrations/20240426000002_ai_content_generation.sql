-- ============================================================
-- Migration: AI Content Generation System
-- Description: Adds target_locations table and system-generated
--              flags for automated plan/activity creation.
-- When to run: After 20240426000001_views_and_likes.sql
-- ============================================================

-- 1. Target Locations — drives the cron job
CREATE TABLE IF NOT EXISTS public.target_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT,                              -- optional sub-region
  timezone TEXT DEFAULT 'UTC',
  frequency_hours INTEGER DEFAULT 24,       -- how often to generate
  is_active BOOLEAN DEFAULT true,
  last_run_at TIMESTAMP WITH TIME ZONE,
  last_status TEXT,                          -- 'success' | 'error' | 'rate_limited'
  last_error TEXT,
  run_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(country, city)
);

-- Seed with starter locations
INSERT INTO public.target_locations (country, city, region) VALUES
  ('Morocco',  'Marrakech', 'Marrakech-Safi'),
  ('Morocco',  'Fes',       'Fès-Meknès'),
  ('Italy',    'Rome',      'Lazio'),
  ('Italy',    'Naples',    'Campania'),
  ('Japan',    'Tokyo',     'Kantō'),
  ('Japan',    'Kyoto',     'Kansai'),
  ('Mexico',   'Oaxaca',    'Oaxaca'),
  ('Thailand', 'Bangkok',   'Central Thailand'),
  ('France',   'Lyon',      'Auvergne-Rhône-Alpes'),
  ('India',    'Jaipur',    'Rajasthan')
ON CONFLICT (country, city) DO NOTHING;

-- 2. Add system-generated columns to plans
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS is_system_generated BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS source_location_id UUID REFERENCES public.target_locations(id);

-- 3. Add system-generated columns to activities
ALTER TABLE public.activities
  ADD COLUMN IF NOT EXISTS is_system_generated BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- 4. Create a generation_logs table for observability
CREATE TABLE IF NOT EXISTS public.generation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID REFERENCES public.target_locations(id),
  provider TEXT NOT NULL,                    -- 'gemini' | 'claude' | 'openai'
  model TEXT NOT NULL,                       -- 'gemini-1.5-flash' etc.
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  latency_ms INTEGER,
  status TEXT NOT NULL,                      -- 'success' | 'error' | 'rate_limited'
  error_message TEXT,
  plans_created INTEGER DEFAULT 0,
  activities_created INTEGER DEFAULT 0,
  raw_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Index for the cron job query (find due locations)
CREATE INDEX IF NOT EXISTS idx_target_locations_due
  ON public.target_locations (is_active, last_run_at, frequency_hours);

-- 6. RLS — target_locations is admin-only, read by everyone
ALTER TABLE public.target_locations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Locations are viewable by everyone" ON public.target_locations;
CREATE POLICY "Locations are viewable by everyone"
  ON public.target_locations FOR SELECT USING (true);

ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Logs are viewable by authenticated users" ON public.generation_logs;
CREATE POLICY "Logs are viewable by authenticated users"
  ON public.generation_logs FOR SELECT USING (auth.role() = 'authenticated');

-- 7. RPC for incrementing run count
CREATE OR REPLACE FUNCTION public.increment_location_run_count(loc_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.target_locations
  SET run_count = run_count + 1
  WHERE id = loc_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. pg_cron schedule (run every 6 hours)
-- NOTE: Requires pg_cron extension enabled in Supabase Dashboard
--       (Database > Extensions > pg_cron > Enable)
-- 
-- SELECT cron.schedule(
--   'generate-ai-plans',
--   '0 */6 * * *',
--   $$
--   SELECT net.http_post(
--     url := 'https://mxpwbcvikhkqepjywqzt.supabase.co/functions/v1/generate-plans',
--     headers := jsonb_build_object(
--       'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
--       'Content-Type', 'application/json'
--     ),
--     body := '{}'::jsonb
--   );
--   $$
-- );
