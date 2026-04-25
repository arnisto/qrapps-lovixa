/**
 * Lovixa — Consensus Calculator
 *
 * Pure function. No side effects. Shared between mobile & web.
 *
 * Formula: C = (Σ V_active / N_original) × 100
 *   - V_active  = number of "yes" votes for a specific card
 *   - N_original = total number of participants in the session
 *   - Match requires C > threshold (default 50%)
 */

import type {
  ConsensusInput,
  ConsensusResult,
  CardTally,
} from '@lovixa/types';

/**
 * Calculate consensus across all vibe cards for a session.
 *
 * @example
 * ```ts
 * const result = calculateConsensus({
 *   votes: [
 *     { card_id: 'a', voter_id: '1', vote: true },
 *     { card_id: 'a', voter_id: '2', vote: true },
 *     { card_id: 'a', voter_id: '3', vote: false },
 *   ],
 *   card_ids: ['a', 'b', 'c'],
 *   participant_count: 3,
 * });
 * // result.is_match === true
 * // result.winning_card_id === 'a'
 * // result.winning_percentage === 66.67
 * ```
 */
export function calculateConsensus(input: ConsensusInput): ConsensusResult {
  const { votes, card_ids, participant_count, threshold = 50 } = input;

  // Guard: no division by zero
  if (participant_count <= 0) {
    return {
      is_match: false,
      winning_card_id: null,
      winning_percentage: 0,
      tallies: [],
    };
  }

  // Build tally for each card
  const tallies: CardTally[] = card_ids.map((card_id) => {
    const cardVotes = votes.filter((v) => v.card_id === card_id);
    const yes_count = cardVotes.filter((v) => v.vote === true).length;
    const no_count = cardVotes.filter((v) => v.vote === false).length;

    // C = (Σ V_active / N_original) × 100
    const consensus_percentage = parseFloat(
      ((yes_count / participant_count) * 100).toFixed(2)
    );

    return { card_id, yes_count, no_count, consensus_percentage };
  });

  // Find the card with the highest consensus that exceeds threshold
  const sorted = [...tallies].sort(
    (a, b) => b.consensus_percentage - a.consensus_percentage
  );

  const winner = sorted[0];
  const is_match = winner != null && winner.consensus_percentage > threshold;

  return {
    is_match,
    winning_card_id: is_match ? winner.card_id : null,
    winning_percentage: winner?.consensus_percentage ?? 0,
    tallies,
  };
}
