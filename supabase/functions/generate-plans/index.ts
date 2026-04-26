// ============================================================
// Supabase Edge Function: generate-plans
// Entry point — handles HTTP, auth guard, and orchestration.
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createLLMProvider } from './llm/factory.ts';
import { generatePlansForDueLocations } from './use-cases/generate-plans.ts';

const ALLOWED_ORIGINS = [
  'https://lovixa.com',
  'https://www.lovixa.com',
  'http://localhost:3000',
  'http://localhost:3001',
];

Deno.serve(async (req: Request) => {
  // ── CORS ──────────────────────────────────────────────────
  const origin = req.headers.get('origin');
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, apikey, x-client-info',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // ── AUTH GUARD ────────────────────────────────────────────
  // Only allow calls from the cron job (service_role key) or admins
  const authHeader = req.headers.get('Authorization');
  const serviceRoleKey = Deno.env.get('APP_SERVICE_ROLE_KEY');

  if (!authHeader || !serviceRoleKey || authHeader !== `Bearer ${serviceRoleKey}`) {
    console.warn('[generate-plans] Unauthorized access attempt');
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  console.log('[generate-plans] ⚡ Function triggered');

  try {
    // ── SUPABASE CLIENT (service_role bypasses RLS) ────────
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('APP_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // ── LLM PROVIDER (factory reads LLM_PROVIDER env var) ──
    const provider = createLLMProvider();
    console.log(`[generate-plans] Using provider: ${provider.name} (${provider.model})`);

    // ── RUN USE CASE ───────────────────────────────────────
    const result = await generatePlansForDueLocations(supabase, provider);

    console.log('[generate-plans] ✅ Run complete:', JSON.stringify(result));

    const statusCode = 200;

    return new Response(JSON.stringify({ success: true, result }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = (err as Error).message;
    console.error('[generate-plans] Fatal error:', message);

    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
