// ============================================================
// LLM Provider Interface — Provider-Agnostic Contract
// Swap implementations without touching business logic.
// ============================================================

export interface PlanGenerationRequest {
  country: string;
  city: string;
  region?: string;
  /** Optional theme hint: 'cuisine', 'cultural_event', 'street_food', 'festival' */
  theme?: string;
}

export interface GeneratedActivity {
  title: string;
  description: string;
  location: string;
  price: string;
  instructions: string;
  cuisine_origin?: string;
  authenticity_score?: number; // 1-10
}

export interface GeneratedPlan {
  title: string;
  description: string;
  location: string;
  category: string;
  activities: GeneratedActivity[];
  metadata: {
    cuisine_origin: string;
    cultural_context: string;
    best_season: string;
    local_tip: string;
  };
}

export interface GenerationResult {
  plan: GeneratedPlan;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
}

export interface LLMProvider {
  /** Human-readable provider name */
  readonly name: string;
  /** Model identifier used for this generation */
  readonly model: string;
  /** Generate a culturally authentic plan for a given location */
  generatePlan(request: PlanGenerationRequest): Promise<GenerationResult>;
}
