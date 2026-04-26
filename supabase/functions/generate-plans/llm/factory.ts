// ============================================================
// LLM Factory — Provider Switching via Environment Variable
// Add new providers here without changing any business logic.
// ============================================================

import { LLMProvider } from './types.ts';
import { GeminiProvider } from './gemini-provider.ts';

// Placeholder imports — add adapters as you need them:
// import { ClaudeProvider } from './claude-provider.ts';
// import { OpenAIProvider } from './openai-provider.ts';

export type SupportedProvider = 'gemini' | 'claude' | 'openai';

export function createLLMProvider(): LLMProvider {
  const providerName = (Deno.env.get('LLM_PROVIDER') || 'gemini') as SupportedProvider;

  switch (providerName) {
    case 'gemini': {
      const apiKey = Deno.env.get('GEMINI_API_KEY');
      if (!apiKey) throw new Error('GEMINI_API_KEY env var is not set');
      const model = Deno.env.get('GEMINI_MODEL') || 'gemini-1.5-flash';
      return new GeminiProvider(apiKey, model);
    }

    // case 'claude': {
    //   const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    //   if (!apiKey) throw new Error('ANTHROPIC_API_KEY env var is not set');
    //   return new ClaudeProvider(apiKey);
    // }

    // case 'openai': {
    //   const apiKey = Deno.env.get('OPENAI_API_KEY');
    //   if (!apiKey) throw new Error('OPENAI_API_KEY env var is not set');
    //   return new OpenAIProvider(apiKey);
    // }

    default:
      throw new Error(`Unsupported LLM provider: "${providerName}". Valid options: gemini, claude, openai`);
  }
}
