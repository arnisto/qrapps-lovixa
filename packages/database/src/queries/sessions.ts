/**
 * Lovixa — Session Queries
 */

import type { LovixaSupabaseClient } from '../client';
import type { Session, CreateSessionInput } from '@lovixa/types';

/** Create a new Live Session with 3 vibe cards (transactional via Supabase) */
export async function createSession(
  client: LovixaSupabaseClient,
  input: CreateSessionInput
) {
  // 1. Create the session
  const { data: session, error: sessionError } = await client
    .from('sessions')
    .insert({ title: input.title })
    .select()
    .single();

  if (sessionError || !session) {
    throw new Error(`Failed to create session: ${sessionError?.message}`);
  }

  // 2. Insert vibe cards
  const cards = input.vibe_cards.map((card) => ({
    ...card,
    session_id: session.id,
  }));

  const { error: cardsError } = await client.from('vibe_cards').insert(cards);

  if (cardsError) {
    throw new Error(`Failed to create vibe cards: ${cardsError.message}`);
  }

  return session as Session;
}

/** Fetch a session by its share token (used by guests) */
export async function getSessionByToken(
  client: LovixaSupabaseClient,
  shareToken: string
) {
  const { data, error } = await client
    .from('sessions')
    .select(`
      *,
      vibe_cards (*)
    `)
    .eq('share_token', shareToken)
    .single();

  if (error) {
    throw new Error(`Session not found: ${error.message}`);
  }

  return data;
}

/** Update session participant count */
export async function updateParticipantCount(
  client: LovixaSupabaseClient,
  sessionId: string,
  count: number
) {
  const { error } = await client
    .from('sessions')
    .update({ participant_count: count })
    .eq('id', sessionId);

  if (error) {
    throw new Error(`Failed to update participant count: ${error.message}`);
  }
}
