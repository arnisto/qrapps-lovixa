/**
 * Lovixa — useRealtimeVotes Hook (shared logic pattern)
 *
 * This file demonstrates the hook used by BOTH apps/web and apps/mobile.
 * Each platform imports createSyncEngine from @lovixa/database and
 * wraps it in their respective framework hook (React/React Native).
 *
 * Usage (Next.js):
 *   const { votes, consensus, castVote, participants } = useRealtimeVotes(config);
 *
 * Usage (React Native):
 *   Same API — React hooks are universal across RN and web React.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  createSyncEngine,
  createAnonymousClient,
  type SyncEngine,
} from '@lovixa/database';
import type { Vote, ConsensusResult, VibeCard } from '@lovixa/types';

interface UseRealtimeVotesConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  sessionId: string;
  cards: VibeCard[];
  participantCount: number;
  voterId: string;
  onVictory: (result: ConsensusResult) => void;
}

interface UseRealtimeVotesReturn {
  votes: Vote[];
  consensus: ConsensusResult | null;
  participants: number;
  castVote: (cardId: string, vote: boolean) => Promise<void>;
  isConnected: boolean;
}

export function useRealtimeVotes(
  config: UseRealtimeVotesConfig
): UseRealtimeVotesReturn {
  const [votes, setVotes] = useState<Vote[]>([]);
  const [consensus, setConsensus] = useState<ConsensusResult | null>(null);
  const [participants, setParticipants] = useState(config.participantCount);
  const [isConnected, setIsConnected] = useState(false);
  const engineRef = useRef<SyncEngine | null>(null);

  useEffect(() => {
    const client = createAnonymousClient(
      config.supabaseUrl,
      config.supabaseAnonKey
    );

    const engine = createSyncEngine(client, {
      sessionId: config.sessionId,
      cardIds: config.cards.map((c) => c.id),
      participantCount: config.participantCount,
      voterId: config.voterId,
      onVoteReceived: (vote) => {
        setVotes((prev) => {
          const exists = prev.some(
            (v) => v.card_id === vote.card_id && v.voter_id === vote.voter_id
          );
          return exists ? prev : [...prev, vote];
        });
      },
      onConsensusReached: (result) => {
        setConsensus(result);
        config.onVictory(result);
      },
      onParticipantJoined: (count) => {
        setParticipants(count);
      },
      onError: (error) => {
        console.error('[Lovixa Sync]', error.message);
      },
    });

    engineRef.current = engine;

    engine.subscribe().then(() => setIsConnected(true));

    return () => {
      engine.unsubscribe();
      setIsConnected(false);
    };
  }, [config.sessionId]);

  const handleCastVote = useCallback(
    async (cardId: string, vote: boolean) => {
      await engineRef.current?.castVote(cardId, vote);
    },
    []
  );

  return {
    votes,
    consensus,
    participants,
    castVote: handleCastVote,
    isConnected,
  };
}
