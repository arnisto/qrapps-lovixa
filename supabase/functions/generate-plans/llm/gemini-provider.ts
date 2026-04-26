// ============================================================
// Gemini Provider — Adapter for Google Gemini API (Free Tier)
// Handles 15 RPM limit with exponential backoff.
// ============================================================

import {
  LLMProvider,
  PlanGenerationRequest,
  GenerationResult,
  GeneratedPlan,
} from './types.ts';
import { buildSystemPrompt, buildUserPrompt } from './prompts.ts';

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000; // 2 seconds

export class GeminiProvider implements LLMProvider {
  readonly name = 'gemini';
  readonly model: string;
  private readonly apiKey: string;

  constructor(apiKey: string, model = 'gemini-1.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generatePlan(request: PlanGenerationRequest): Promise<GenerationResult> {
    const systemPrompt = buildSystemPrompt(request);
    const userPrompt = buildUserPrompt(request);
    const startTime = Date.now();

    const body = {
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + '\n\n' + userPrompt }] },
      ],
      generationConfig: {
        temperature: 0.85,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 4096,
      },
    };

    const response = await this.callWithRetry(body);
    const latencyMs = Date.now() - startTime;

    // Extract text from Gemini response
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Gemini returned empty response');
    }

    // Parse JSON — strip markdown fences if present
    const cleanJson = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const plan: GeneratedPlan = JSON.parse(cleanJson);

    // Extract usage metadata
    const usage = {
      promptTokens: response.usageMetadata?.promptTokenCount || 0,
      completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
      totalTokens: response.usageMetadata?.totalTokenCount || 0,
    };

    return { plan, usage, latencyMs };
  }

  /**
   * Calls the Gemini REST API with exponential backoff for 429 errors.
   * Free tier: 15 RPM, 1M TPM, 1500 RPD.
   */
  private async callWithRetry(body: unknown, attempt = 0): Promise<any> {
    const url = `https://generativelanguage.googleapis.com/v1/models/${this.model}:generateContent?key=${this.apiKey}`;
    console.log(`[GeminiProvider] Calling URL: ${url.replace(this.apiKey, '***')}`);

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.status === 429) {
      if (attempt >= MAX_RETRIES) {
        throw new Error(`Gemini rate limited after ${MAX_RETRIES} retries (429 Resource Exhausted)`);
      }

      const delay = BASE_DELAY_MS * Math.pow(2, attempt) + Math.random() * 1000;
      console.warn(`[GeminiProvider] Rate limited (429). Retry ${attempt + 1}/${MAX_RETRIES} in ${Math.round(delay)}ms`);
      await new Promise((r) => setTimeout(r, delay));
      return this.callWithRetry(body, attempt + 1);
    }

    if (!res.ok) {
      const errorBody = await res.text();
      throw new Error(`Gemini API error ${res.status}: ${errorBody}`);
    }

    return res.json();
  }
}
