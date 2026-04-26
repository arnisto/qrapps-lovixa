// ============================================================
// Plan Generator Use Case — Core Business Logic
// Clean Architecture: this layer knows nothing about HTTP or Deno.
// It only depends on the LLMProvider interface and Supabase.
// ============================================================

import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { LLMProvider } from '../llm/types.ts';

interface TargetLocation {
  id: string;
  country: string;
  city: string;
  region?: string;
}

interface GeneratePlansResult {
  locationsProcessed: number;
  plansCreated: number;
  activitiesCreated: number;
  errors: string[];
  rateLimitHits: number;
}

/**
 * Fetches all locations due for content generation.
 * A location is "due" if it has never run or its last run was
 * more than `frequency_hours` ago.
 */
async function fetchDueLocations(supabase: SupabaseClient): Promise<TargetLocation[]> {
  const { data, error } = await supabase
    .from('target_locations')
    .select('id, country, city, region')
    .eq('is_active', true)
    .or(
      `last_run_at.is.null,last_run_at.lt.${new Date(
        Date.now() - 6 * 60 * 60 * 1000 // 6 hours ago
      ).toISOString()}`
    )
    .limit(5); // Max 5 per cron run to respect free-tier limits

  if (error) throw new Error(`Failed to fetch locations: ${error.message}`);
  return data || [];
}

/**
 * Saves a generated plan + activities to Supabase using service_role.
 * Uses service_role client to bypass RLS for system-generated content.
 */
async function saveGeneratedPlan(
  supabase: SupabaseClient,
  location: TargetLocation,
  provider: LLMProvider,
  result: Awaited<ReturnType<LLMProvider['generatePlan']>>,
  logId: string
): Promise<{ planId: string; activitiesCount: number }> {
  const { plan } = result;

  // Create a system user ID for generated content
  // In production, use a dedicated service account UUID
  const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000';

  // 1. Insert the plan
  const { data: savedPlan, error: planError } = await supabase
    .from('plans')
    .insert({
      title: plan.title,
      description: plan.description,
      location: plan.location,
      category: plan.category,
      status: 'active',
      is_system_generated: true,
      source_location_id: location.id,
      created_by: SYSTEM_USER_ID,
      views: 0,
      likes: 0,
      metadata: {
        ...plan.metadata,
        generated_by: provider.name,
        model: provider.model,
        generation_log_id: logId,
      },
    })
    .select('id')
    .single();

  if (planError) throw new Error(`Failed to insert plan: ${planError.message}`);

  // 2. Insert all activities
  const activitiesToInsert = plan.activities.map((activity) => ({
    plan_id: savedPlan.id,
    title: activity.title,
    description: activity.description,
    location: activity.location,
    price: activity.price,
    instructions: activity.instructions,
    is_system_generated: true,
    votes: 0,
    likes: 0,
    views: 0,
    metadata: {
      cuisine_origin: activity.cuisine_origin,
      authenticity_score: activity.authenticity_score,
    },
  }));

  const { error: activitiesError } = await supabase
    .from('activities')
    .insert(activitiesToInsert);

  if (activitiesError) throw new Error(`Failed to insert activities: ${activitiesError.message}`);

  return { planId: savedPlan.id, activitiesCount: activitiesToInsert.length };
}

/**
 * Logs the generation attempt to generation_logs table.
 */
async function createGenerationLog(
  supabase: SupabaseClient,
  locationId: string,
  provider: LLMProvider
): Promise<string> {
  const { data, error } = await supabase
    .from('generation_logs')
    .insert({
      location_id: locationId,
      provider: provider.name,
      model: provider.model,
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) {
    console.warn('Failed to create generation log:', error.message);
    return 'unknown';
  }
  return data.id;
}

async function updateGenerationLog(
  supabase: SupabaseClient,
  logId: string,
  update: Record<string, unknown>
): Promise<void> {
  if (logId === 'unknown') return;
  await supabase.from('generation_logs').update(update).eq('id', logId);
}

async function updateLocationStatus(
  supabase: SupabaseClient,
  locationId: string,
  status: 'success' | 'error' | 'rate_limited',
  error?: string
): Promise<void> {
  await supabase
    .from('target_locations')
    .update({
      last_run_at: new Date().toISOString(),
      last_status: status,
      last_error: error || null,
      run_count: supabase.rpc('increment_location_run_count', { loc_id: locationId }),
      updated_at: new Date().toISOString(),
    })
    .eq('id', locationId);
}

/**
 * MAIN USE CASE: Generate AI plans for all due locations.
 * This is the entry point called by the Edge Function.
 */
export async function generatePlansForDueLocations(
  supabase: SupabaseClient,
  provider: LLMProvider
): Promise<GeneratePlansResult> {
  const result: GeneratePlansResult = {
    locationsProcessed: 0,
    plansCreated: 0,
    activitiesCreated: 0,
    errors: [],
    rateLimitHits: 0,
  };

  let locations: TargetLocation[];
  try {
    locations = await fetchDueLocations(supabase);
    console.log(`[PlanGenerator] Found ${locations.length} location(s) due for generation`);
  } catch (err) {
    result.errors.push(`Failed to fetch locations: ${(err as Error).message}`);
    return result;
  }

  for (const location of locations) {
    const logId = await createGenerationLog(supabase, location.id, provider);
    const startTime = Date.now();

    try {
      console.log(`[PlanGenerator] Generating plan for ${location.city}, ${location.country}...`);

      const generationResult = await provider.generatePlan({
        country: location.country,
        city: location.city,
        region: location.region,
      });

      const { planId, activitiesCount } = await saveGeneratedPlan(
        supabase, location, provider, generationResult, logId
      );

      const latencyMs = Date.now() - startTime;

      // Update log with success
      await updateGenerationLog(supabase, logId, {
        status: 'success',
        prompt_tokens: generationResult.usage.promptTokens,
        completion_tokens: generationResult.usage.completionTokens,
        plans_created: 1,
        activities_created: activitiesCount,
        latency_ms: latencyMs,
      });

      await updateLocationStatus(supabase, location.id, 'success');

      result.locationsProcessed++;
      result.plansCreated++;
      result.activitiesCreated += activitiesCount;

      console.log(`[PlanGenerator] ✅ Created plan ${planId} with ${activitiesCount} activities (${latencyMs}ms)`);

      // Rate limiting: wait 5s between requests on free tier (15 RPM max)
      if (locations.indexOf(location) < locations.length - 1) {
        console.log('[PlanGenerator] Waiting 5s to respect Gemini free tier rate limits...');
        await new Promise((r) => setTimeout(r, 5000));
      }
    } catch (err) {
      const errMsg = (err as Error).message;
      const isRateLimit = errMsg.includes('429') || errMsg.includes('rate limited');
      const status = isRateLimit ? 'rate_limited' : 'error';

      console.error(`[PlanGenerator] ❌ Failed for ${location.city}: ${errMsg}`);

      await updateGenerationLog(supabase, logId, {
        status,
        error_message: errMsg,
        latency_ms: Date.now() - startTime,
      });

      await updateLocationStatus(supabase, location.id, status, errMsg);

      result.errors.push(`${location.city}, ${location.country}: ${errMsg}`);
      if (isRateLimit) result.rateLimitHits++;
    }
  }

  return result;
}
