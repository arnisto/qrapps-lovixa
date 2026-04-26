# 🤖 AI Content Generation System — Deployment Guide

This guide covers the architecture and deployment steps for Lovixa's automated cultural content generation engine.

## Architecture Overview

The system follows **Clean Architecture** principles to ensure provider-agnosticity and long-term maintainability.

```
supabase/
├── migrations/
│   └── 20240426000002_ai_content_generation.sql  ← Run this first
└── functions/
    └── generate-plans/
        ├── index.ts                   ← Edge Function entry (HTTP layer)
        ├── .env.example               ← Env var template
        ├── llm/
        │   ├── types.ts               ← LLMProvider interface (the contract)
        │   ├── prompts.ts             ← Cultural prompt engineering
        │   ├── gemini-provider.ts     ← Gemini adapter (current)
        │   └── factory.ts            ← Switch providers via env var
        └── use-cases/
            └── generate-plans.ts     ← Business logic (provider-agnostic)
```

## Clean Architecture Layers

| Layer | Files | Depends On |
|---|---|---|
| **Entities** | `llm/types.ts` | Nothing |
| **Use Cases** | `use-cases/generate-plans.ts` | Entities only |
| **Adapters** | `llm/gemini-provider.ts` | Entities interface |
| **Infrastructure** | `index.ts`, `llm/factory.ts` | All layers |

---

## Deployment Steps

### 1. Run the SQL Migration
Go to your **[Supabase SQL Editor](https://supabase.com/dashboard/project/mxpwbcvikhkqepjywqzt/sql)** and run the content of `supabase/migrations/20240426000002_ai_content_generation.sql`.

### 2. Set Production Secrets
Run these commands in your terminal to configure the live Edge Function:
```bash
npx supabase secrets set LLM_PROVIDER=gemini --project-ref mxpwbcvikhkqepjywqzt
npx supabase secrets set GEMINI_API_KEY=AIzaSyCOSE3Sns2m5Park1CnWYSLadVO1eZrMI8 --project-ref mxpwbcvikhkqepjywqzt
npx supabase secrets set GEMINI_MODEL=gemini-1.5-flash --project-ref mxpwbcvikhkqepjywqzt
```

### 3. Deploy the Edge Function
```bash
npx supabase functions deploy generate-plans --project-ref mxpwbcvikhkqepjywqzt
```

### 4. Enable pg_cron (One-time setup)
1. Go to **Supabase Dashboard → Database → Extensions**.
2. Enable `pg_cron` and `pg_net`.
3. Run this SQL to schedule the generation every 6 hours:

```sql
SELECT cron.schedule(
  'generate-ai-plans',
  '0 */6 * * *',  -- every 6 hours
  $$
  SELECT net.http_post(
    url := 'https://mxpwbcvikhkqepjywqzt.supabase.co/functions/v1/generate-plans',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

---

## How to Swap Providers

The system is provider-agnostic. To switch from Gemini to Claude (Anthropic):

1. Create `supabase/functions/generate-plans/llm/claude-provider.ts` implementing the `LLMProvider` interface.
2. Uncomment the Claude case in `llm/factory.ts`.
3. Update the secret: `npx supabase secrets set LLM_PROVIDER=claude ANTHROPIC_API_KEY=your_key`
4. Redeploy. **Zero changes needed to the business logic.**

---

## Rate Limiting Strategy (Gemini Free Tier)

| Limit | Strategy |
|---|---|
| **15 RPM** | 5-second delay implemented between location processing. |
| **429 Errors** | Exponential backoff (2s → 4s → 8s) with 3 retries. |
| **Max Capacity** | Limit to 5 locations per cron run to stay within daily limits. |
| **Frequency** | Every 6 hours (4 times per day). |

---

## Testing Locally

### 1. Start the function locally
```bash
npx supabase functions serve generate-plans --env-file supabase/functions/generate-plans/.env.example
```

### 2. Trigger it (in a second terminal)
```bash
curl -X POST http://localhost:54321/functions/v1/generate-plans \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Monitoring & Observability

Check the `generation_logs` table for full visibility into AI performance:
```sql
SELECT 
  tl.city, tl.country,
  gl.provider, gl.model, gl.status,
  gl.plans_created, gl.activities_created,
  gl.latency_ms, gl.error_message,
  gl.created_at
FROM generation_logs gl
JOIN target_locations tl ON gl.location_id = tl.id
ORDER BY gl.created_at DESC
LIMIT 20;
```
