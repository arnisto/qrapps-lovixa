/**
 * Lovixa — Vote Queries
 */

import type { LovixaSupabaseClient } from '../client';
import type { Vote, CastVoteInput } from '@lovixa/types';

/** Cast or update a vote (upsert on unique constraint) */
export async function castVote(
  client: LovixaSupabaseClient,
  input: CastVoteInput
): Promise<Vote> {
  const { data, error } = await client
    .from('votes')
    .upsert(input, {
      onConflict: 'session_id,card_id,voter_id',
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to cast vote: ${error?.message}`);
  }

  return data as Vote;
}

/** Get all votes for a session */
export async function getSessionVotes(
  client: LovixaSupabaseClient,
  sessionId: string
): Promise<Vote[]> {
  const { data, error } = await client
    .from('votes')
    .select('*')
    .eq('session_id', sessionId);

  if (error) {
    throw new Error(`Failed to fetch votes: ${error.message}`);
  }

  return (data ?? []) as Vote[];
}
