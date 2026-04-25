# Configuration

[← Back to Index](../README.md)

## System Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Session TTL | 24 hours | Prevents stale data buildup; sessions auto-expire |
| Max cards per session | 3 | MVP simplicity; reduces decision fatigue (core product value) |
| Consensus threshold | >50% | Mathematical majority; strict greater-than prevents 50/50 deadlocks |
| Max participants | 20 | Supabase Realtime performance ceiling per channel |
| Guest voter_id | `crypto.randomUUID()` | Ephemeral, no auth needed; stored in `sessionStorage` |
| Realtime events/sec | 10 | Supabase client config; sufficient for voting cadence |
| Vote constraint | 1 per card per voter | `UNIQUE(session_id, card_id, voter_id)` enforces this |

## Environment Variables

### Shared (Both Apps)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Mobile Only

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Supabase Project Setup

### Required Features

| Feature | Status | Notes |
|---------|--------|-------|
| Authentication | ✅ Enabled | Email + social providers for hosts |
| Database | ✅ Enabled | PostgreSQL with the Ghost Vote schema |
| Realtime | ✅ Enabled | Postgres Changes on `votes` table |
| Row Level Security | ✅ Enabled | Policies on all 3 tables |

### Realtime Configuration

Ensure the `votes` table is added to the Realtime publication:

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
```

This can be verified in the Supabase Dashboard under **Database → Replication**.

## Threshold Configuration

The consensus threshold is configurable per the `calculateConsensus()` function:

```typescript
// Default: strict majority (>50%)
calculateConsensus({ ...input, threshold: 50 });

// Supermajority (>66%)
calculateConsensus({ ...input, threshold: 66 });

// Unanimous (>99%)
calculateConsensus({ ...input, threshold: 99 });
```

For Phase 1 MVP, the threshold is hardcoded at 50%. Future phases may allow hosts to configure this per session.
