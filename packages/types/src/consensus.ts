/**
 * Lovixa — Consensus Algorithm Types
 */

export interface ConsensusInput {
  /** All votes for this session */
  votes: { card_id: string; voter_id: string; vote: boolean }[];
  /** All card IDs in the session */
  card_ids: string[];
  /** Total number of original participants (including host) */
  participant_count: number;
  /** Majority threshold percentage (default: 50). Match requires STRICTLY GREATER than this. */
  threshold?: number;
}

export interface CardTally {
  card_id: string;
  yes_count: number;
  no_count: number;
  consensus_percentage: number;
}

export interface ConsensusResult {
  /** Whether a match has been found */
  is_match: boolean;
  /** The winning card ID, if any */
  winning_card_id: string | null;
  /** Consensus percentage of the winning card */
  winning_percentage: number;
  /** Tally breakdown per card */
  tallies: CardTally[];
}
