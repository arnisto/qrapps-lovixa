/**
 * Lovixa — Realtime Sync Engine
 *
 * This is the core of Ghost Vote. It handles:
 * 1. Subscribing to vote changes via Supabase Realtime (Postgres Changes)
 * 2. Tracking participant presence
 * 3. Running consensus checks on every vote event
 * 4. Triggering Victory State when a match is found
 *
 * No custom WebSocket server needed — uses Supabase Realtime channels.
 */

import type { RealtimeChannel } from '@supabase/supabase-js';
import type { LovixaSupabaseClient } from '../client';
import type { Vote, ConsensusResult } from '@lovixa/types';
import { calculateConsensus } from '@lovixa/consensus';

export interface SyncEngineConfig {
  sessionId: string;
  cardIds: string[];
  participantCount: number;
  voterId: string;
  onVoteReceived: (vote: Vote) => void;
  onConsensusReached: (result: ConsensusResult) => void;
  onParticipantJoined: (count: number) => void;
  onError?: (error: Error) => void;
}

export interface SyncEngine {
  /** Start listening for realtime events */
  subscribe: () => Promise<void>;
  /** Stop listening and clean up */
  unsubscribe: () => void;
  /** Cast a vote and broadcast it */
  castVote: (cardId: string, vote: boolean) => Promise<void>;
  /** Get current channel reference */
  channel: RealtimeChannel | null;
}

/**
 * Create a Realtime Sync Engine for a Ghost Vote session.
 *
 * @example
 * ```ts
 * const engine = createSyncEngine(supabase, {
 *   sessionId: 'abc-123',
 *   cardIds: ['card-1', 'card-2', 'card-3'],
 *   participantCount: 4,
 *   voterId: crypto.randomUUID(),
 *   onVoteReceived: (vote) => updateUI(vote),
 *   onConsensusReached: (result) => navigateToVictory(result),
 *   onParticipantJoined: (count) => updateParticipantBadge(count),
 * });
 *
 * await engine.subscribe();
 * ```
 */
export function createSyncEngine(
  client: LovixaSupabaseClient,
  config: SyncEngineConfig
): SyncEngine {
  let channel: RealtimeChannel | null = null;
  let localVotes: Vote[] = [];

  const {
    sessionId,
    cardIds,
    participantCount,
    voterId,
    onVoteReceived,
    onConsensusReached,
    onParticipantJoined,
    onError,
  } = config;

  // ------------------------------------------------
  // Check consensus after every vote change
  // ------------------------------------------------
  function checkConsensus(): void {
    const result = calculateConsensus({
      votes: localVotes.map((v) => ({
        card_id: v.card_id,
        voter_id: v.voter_id,
        vote: v.vote,
      })),
      card_ids: cardIds,
      participant_count: participantCount,
    });

    if (result.is_match) {
      // Update session status in DB (fire-and-forget, best effort)
      client
        .from('sessions')
        .update({
          status: 'matched',
          winning_card_id: result.winning_card_id,
        })
        .eq('id', sessionId)
        .eq('status', 'active') // only update if still active (idempotent)
        .then(() => {});

      onConsensusReached(result);
    }
  }

  // ------------------------------------------------
  // Subscribe to Realtime
  // ------------------------------------------------
  async function subscribe(): Promise<void> {
    // 1. Load existing votes first (hydrate local state)
    const { data: existingVotes, error } = await client
      .from('votes')
      .select('*')
      .eq('session_id', sessionId);

    if (error) {
      onError?.(new Error(`Failed to load votes: ${error.message}`));
      return;
    }

    localVotes = existingVotes ?? [];

    // Check if consensus was already reached before we joined
    checkConsensus();

    // 2. Create Realtime channel for this session
    channel = client.channel(`session:${sessionId}`, {
      config: { presence: { key: voterId } },
    });

    // 3. Listen for new votes via Postgres Changes
    channel.on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'votes',
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        const newVote = payload.new as Vote;

        // Deduplicate (in case we receive our own vote back)
        const exists = localVotes.some(
          (v) => v.card_id === newVote.card_id && v.voter_id === newVote.voter_id
        );

        if (!exists) {
          localVotes.push(newVote);
        }

        onVoteReceived(newVote);
        checkConsensus();
      }
    );

    // 4. Track presence (participant count)
    channel.on('presence', { event: 'sync' }, () => {
      const presenceState = channel!.presenceState();
      const activeCount = Object.keys(presenceState).length;
      onParticipantJoined(activeCount);
    });

    // 5. Subscribe and announce presence
    await channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel!.track({ voter_id: voterId, joined_at: new Date().toISOString() });
      }
    });
  }

  // ------------------------------------------------
  // Cast a vote
  // ------------------------------------------------
  async function castVote(cardId: string, vote: boolean): Promise<void> {
    const voteRecord = {
      session_id: sessionId,
      card_id: cardId,
      voter_id: voterId,
      vote,
    };

    const { error } = await client.from('votes').upsert(voteRecord, {
      onConflict: 'session_id,card_id,voter_id',
    });

    if (error) {
      onError?.(new Error(`Failed to cast vote: ${error.message}`));
      return;
    }

    // Optimistically update local state
    const existingIndex = localVotes.findIndex(
      (v) => v.card_id === cardId && v.voter_id === voterId
    );

    if (existingIndex >= 0) {
      localVotes[existingIndex] = { ...localVotes[existingIndex], vote };
    } else {
      localVotes.push({
        id: crypto.randomUUID(),
        ...voteRecord,
        created_at: new Date().toISOString(),
      });
    }

    checkConsensus();
  }

  // ------------------------------------------------
  // Cleanup
  // ------------------------------------------------
  function unsubscribe(): void {
    if (channel) {
      client.removeChannel(channel);
      channel = null;
    }
    localVotes = [];
  }

  return {
    subscribe,
    unsubscribe,
    castVote,
    get channel() {
      return channel;
    },
  };
}
