# Consensus Algorithm

[← Back to Index](../README.md)

## Formula

$$C = \frac{\sum V_{\text{active}}}{N_{\text{original}}} \times 100$$

Where:

| Symbol | Meaning |
|--------|---------|
| **C** | Consensus percentage for a specific card |
| **V_active** | Number of "yes" votes (swipe right) for that card |
| **N_original** | Total number of participants in the session (including host) |

A **match** is found when `C > threshold` (default: 50%, i.e., mathematical majority).

## Rules & Edge Cases

| Scenario | Calculation | Result |
|----------|-------------|--------|
| 3 participants, 2 vote "yes" on Card A | `C = (2/3) × 100 = 66.7%` | ✅ Match |
| 4 participants, 2 vote "yes" on Card A | `C = (2/4) × 100 = 50%` | ❌ No match (need >50%) |
| 2 participants, 1 votes "yes", 1 hasn't voted | `C = (1/2) × 100 = 50%` | ❌ Wait for more votes |
| 5 participants, 3 vote "yes" on Card A | `C = (3/5) × 100 = 60%` | ✅ Match |
| 3 participants, all vote "no" on all cards | No card exceeds 0% | ❌ No match (session may expire) |
| 0 participants (edge case) | Division by zero guard | ❌ Returns `is_match: false` |
| Multiple cards exceed threshold | Highest consensus wins | ✅ Winner = max C |

## Implementation

```typescript
import type { ConsensusInput, ConsensusResult, CardTally } from '@lovixa/types';

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
```

## Types

### Input

```typescript
interface ConsensusInput {
  votes: { card_id: string; voter_id: string; vote: boolean }[];
  card_ids: string[];
  participant_count: number;
  threshold?: number; // default: 50
}
```

### Output

```typescript
interface ConsensusResult {
  is_match: boolean;           // Whether a match has been found
  winning_card_id: string | null;  // The winning card ID, if any
  winning_percentage: number;      // Consensus % of the winning card
  tallies: CardTally[];            // Breakdown per card
}

interface CardTally {
  card_id: string;
  yes_count: number;
  no_count: number;
  consensus_percentage: number;
}
```

## Properties

- **Pure function** — No side effects, no network calls, no state mutation
- **Deterministic** — Same inputs always produce the same output
- **Platform-agnostic** — Runs identically on React Native and Next.js
- **Threshold-configurable** — Default is 50% (strict majority), but can be adjusted

## When It Runs

The consensus function is called:

1. **On hydration** — When a client first loads existing votes from the DB
2. **On every Realtime vote event** — When any participant casts or changes a vote
3. **Result** — If `is_match === true`, the client triggers Victory State

## Implementation Location

`packages/consensus/src/calculator.ts`
